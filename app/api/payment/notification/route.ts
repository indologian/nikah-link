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

type SubStatus =
  | "pending"
  | "success"
  | "failed"
  | "cancelled"
  | "expired";

function mapStatus(
  transactionStatus: string,
  fraudStatus?: string,
  statusCode?: string
): SubStatus {
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
    transactionStatus === "failure"
  ) {
    return "failed";
  }

  if (transactionStatus === "expire") {
    return "expired";
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
      transaction_id,
    } = body;

    // 1. Validasi dasar payload webhook
    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    console.log(
      `[Midtrans Webhook] OrderID: ${order_id}, Status: ${transaction_status}`
    );

    // 2. Verifikasi signature_key
    const isSignatureValid = verifyMidtransSignature(
      String(order_id),
      String(status_code),
      String(gross_amount),
      String(signature_key)
    );
    if (!isSignatureValid) {
      console.error(
        "[Midtrans Webhook] Invalid signature_key for order:",
        order_id
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Ambil data subscription lokal
    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select("id, user_id, amount, status, plan")
      .eq("midtrans_order_id", order_id)
      .single();

    if (subError || !sub) {
      console.error("[Midtrans Webhook] Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Validasi nominal (Bug Fix #3)
    if (Number(sub.amount) !== Number(gross_amount)) {
      console.error(
        `[Midtrans Webhook] Amount mismatch for ${order_id}. Local: ${sub.amount}, Midtrans: ${gross_amount}`
      );
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // 5. Defense-in-depth: ambil status otoritatif dari Midtrans API
    let verifiedStatus = transaction_status;
    let verifiedFraud = fraud_status;
    let verifiedPaymentType = payment_type;
    let verifiedTransactionId = transaction_id;
    try {
      const statusRes = await getMidtransTransactionStatus(String(order_id));
      verifiedStatus = statusRes.transaction_status ?? transaction_status;
      verifiedFraud = statusRes.fraud_status ?? fraud_status;
      verifiedPaymentType = statusRes.payment_type ?? payment_type;
      verifiedTransactionId = statusRes.transaction_id ?? transaction_id;
    } catch (err) {
      console.warn(
        "[Midtrans Webhook] GET Status gagal, andalkan payload:",
        err
      );
    }

    const mappedStatus = mapStatus(
      String(verifiedStatus ?? ""),
      verifiedFraud,
      String(status_code)
    );


    // ------------------------------------------------------------
    // 6. Validasi state subscription
    // ------------------------------------------------------------

    // Subscription terminal tidak boleh hidup kembali.
    // Contoh:
    // cancelled -> success = DENIED
    // failed    -> success = DENIED
    // expired   -> success = DENIED
    if (
      sub.status === "cancelled" ||
      sub.status === "failed" ||
      sub.status === "expired"
    ) {
      console.log(
        `[Midtrans Webhook] Order ${order_id} memiliki status terminal ${sub.status}. Abaikan webhook.`
      );

      return NextResponse.json({
        status: "ok",
        message: "Terminal subscription ignored",
      });
    }

    // Subscription sudah berhasil sebelumnya.
    // Webhook duplicate dianggap sukses agar Midtrans tidak retry.
    if (sub.status === "success") {
      console.log(
        `[Midtrans Webhook] Order ${order_id} sudah success. Abaikan duplicate webhook.`
      );

      return NextResponse.json({
        status: "ok",
        message: "Already success",
      });
    }

    // ------------------------------------------------------------
    // 7. Hanya subscription pending yang boleh diproses
    // ------------------------------------------------------------

    if (sub.status !== "pending") {
      console.log(
        `[Midtrans Webhook] Order ${order_id} memiliki status tidak dikenali: ${sub.status}.`
      );

      return NextResponse.json({
        status: "ok",
        message: "Subscription state ignored",
      });
    }

    if (mappedStatus === "success") {
      // Hitung expiry date berdasarkan plan (Bug Fix #1)
      let planExpiresAt: string | null = null;
      if (sub.plan === "premium") {
        planExpiresAt = new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString();
      } else if (sub.plan === "pro") {
        planExpiresAt = null; // Lifetime
      }

      // Update subscription status menggunakan .neq() untuk mencegah race condition
      const { data: updatedSub, error: updateSubError } = await supabase
        .from("subscriptions")
        .update({
          status: "success",
          payment_method: verifiedPaymentType,
          midtrans_transaction_id: verifiedTransactionId,
          started_at: new Date().toISOString(),
          expires_at: planExpiresAt,
        })
        .eq("id", sub.id)
        .eq("status", "pending")
        .select()
        .maybeSingle();

      if (updateSubError) {
        console.error(
          "[Midtrans Webhook] Failed to update subscription:",
          updateSubError
        );
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }

      // Jika updatedSub ada, berarti ini transisi pertama menuju success.
      // Jika null, berarti webhook sudah diproses oleh request lain (race condition terhindarkan).
      if (updatedSub) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            plan: sub.plan,
            plan_expires_at: planExpiresAt,
          })
          .eq("user_id", sub.user_id);

        if (profileError) {
          // Recovery path: Jangan lempar error ke Midtrans agar tidak di-retry spam.
          // Cukup log agar bisa di-handle via cron/manual recovery.
          console.error(
            `[Midtrans Webhook] CRITICAL: Subscription ${order_id} success, but failed to update profile for user ${sub.user_id}`,
            profileError
          );
        }
      } else {
        console.log(
          `[Midtrans Webhook] Order ${order_id} sudah success sebelumnya (idempotent skip).`
        );
      }
    } else {
      // Update status menjadi failed/pending
      // Gunakan .neq("status", "success") agar tidak pernah menimpa status success
      const { error: updateSubError } = await supabase
        .from("subscriptions")
        .update({
          status: mappedStatus,
          payment_method: verifiedPaymentType,
          midtrans_transaction_id: verifiedTransactionId,
        })
        .eq("id", sub.id)
        .neq("status", "success");

      if (updateSubError) {
        console.error(
          "[Midtrans Webhook] Failed to update subscription:",
          updateSubError
        );
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: unknown) {
    console.error("Midtrans Notification Error:", err);
    // Jangan bocorkan error internal ke Midtrans (Bug Fix #2)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}