import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getMidtransTransactionStatus } from "@/lib/midtrans";

// Webhook is called by Midtrans server (no authenticated user),
// so we MUST use SERVICE_ROLE_KEY to bypass RLS policies.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Verifikasi signature_key Midtrans.
 * signature_key = SHA512(order_id + status_code + gross_amount + ServerKey)
 * Gunakan timingSafeEqual untuk hindari timing attack.
 */
function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  if (!MIDTRANS_SERVER_KEY || !signatureKey) return false;
  const computed = createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");
  try {
    const a = Buffer.from(computed, "hex");
    const b = Buffer.from(signatureKey, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

type SubStatus = "pending" | "success" | "failed";

function mapStatus(
  transactionStatus: string,
  fraudStatus?: string,
  statusCode?: string
): SubStatus {
  // Konfirmasi sukses: status_code 200 + (fraud ACCEPT jika ada) + settlement/capture
  const fraudOk =
    !fraudStatus || String(fraudStatus).toLowerCase() === "accept";
  const isConfirmedSuccess =
    String(statusCode ?? "") === "200" &&
    fraudOk &&
    (transactionStatus === "settlement" || transactionStatus === "capture");
  if (isConfirmedSuccess) return "success";

  if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire" ||
    transactionStatus === "failure"
  ) {
    return "failed";
  }
  return "pending";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
    } = body;

    console.log(
      `[Midtrans Webhook] OrderID: ${order_id}, Status: ${transaction_status}`
    );

    // 1. Verifikasi signature_key — pastikan request benar-benar dari Midtrans.
    const isSignatureValid = verifyMidtransSignature(
      String(order_id ?? ""),
      String(status_code ?? ""),
      String(gross_amount ?? ""),
      String(signature_key ?? "")
    );
    if (!isSignatureValid) {
      console.error(
        "[Midtrans Webhook] Invalid signature_key for order:",
        order_id
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 2. Defense-in-depth: ambil status otoritatif dari Midtrans.
    // Mencegah pemalsuan meski signature_key bocor.
    let verifiedStatus = transaction_status;
    let verifiedFraud = fraud_status;
    let verifiedPaymentType = payment_type;
    try {
      const statusRes = await getMidtransTransactionStatus(String(order_id));
      verifiedStatus = statusRes.transaction_status ?? transaction_status;
      verifiedFraud = statusRes.fraud_status ?? fraud_status;
      verifiedPaymentType = statusRes.payment_type ?? payment_type;
    } catch (err) {
      // Non-fatal: tetap andalkan payload yang sudah ter-verifikasi signature.
      console.warn(
        "[Midtrans Webhook] GET Status gagal, andalkan payload:",
        err
      );
    }

    const status = mapStatus(
      String(verifiedStatus ?? ""),
      verifiedFraud,
      String(status_code ?? "")
    );

    if (order_id) {
      // 1. Update subscription status in Supabase
      const { data: sub } = await supabase
        .from("subscriptions")
        .update({
          status,
          payment_method: verifiedPaymentType,
          started_at: status === "success" ? new Date().toISOString() : null,
        })
        .eq("midtrans_order_id", order_id)
        .select()
        .single();

      // 2. If status is success, update user profile plan and plan_expires_at
      if (status === "success" && sub) {
        let planExpiresAt: string | null = null;
        if (sub.plan === "premium") {
          // Add 3 months (90 days) from now
          planExpiresAt = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString();
        } else if (sub.plan === "pro") {
          planExpiresAt = null; // Lifetime
        }
        await supabase
          .from("profiles")
          .update({
            plan: sub.plan,
            plan_expires_at: planExpiresAt,
          })
          .eq("user_id", sub.user_id);
      }
    }
    return NextResponse.json({ status: "ok" });
  } catch (err: unknown) {
    console.error("Midtrans Notification Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}