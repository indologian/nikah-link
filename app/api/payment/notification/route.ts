import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getMidtransTransactionStatus } from "@/lib/midtrans";

// Webhook Midtrans adalah server-to-server.
// Gunakan service role agar webhook dapat melakukan operasi privileged.
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase server environment variables for Midtrans webhook");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

function getMidtransServerKey() {
  return process.env.MIDTRANS_SERVER_KEY || "";
}

/**
 * Verifikasi signature_key Midtrans.
 *
 * signature_key =
 * SHA512(order_id + status_code + gross_amount + ServerKey)
 */
function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = getMidtransServerKey();

  if (!serverKey || !signatureKey) {
    return false;
  }

  const computed = createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest("hex");

  try {
    const a = Buffer.from(computed, "hex");
    const b = Buffer.from(signatureKey, "hex");

    if (a.length !== b.length) {
      return false;
    }

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
  const normalizedStatus = String(transactionStatus || "").toLowerCase();
  const normalizedFraud = String(fraudStatus || "").toLowerCase();

  const fraudOk =
    !fraudStatus ||
    normalizedFraud === "accept";

  const isConfirmedSuccess =
    String(statusCode ?? "") === "200" &&
    fraudOk &&
    (normalizedStatus === "settlement" ||
      normalizedStatus === "capture");

  if (isConfirmedSuccess) {
    return "success";
  }

  if (
    normalizedStatus === "cancel" ||
    normalizedStatus === "deny" ||
    normalizedStatus === "failure"
  ) {
    return "failed";
  }

  if (normalizedStatus === "expire") {
    return "expired";
  }

  return "pending";
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
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

    // ============================================================
    // 1. Validasi payload dasar
    // ============================================================

    if (
      !order_id ||
      !status_code ||
      !gross_amount ||
      !signature_key
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    console.log(
      `[Midtrans Webhook] OrderID: ${order_id}, Status: ${transaction_status}`
    );

    // ============================================================
    // 2. Verifikasi signature Midtrans
    // ============================================================

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

      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // ============================================================
    // 3. Ambil subscription lokal
    // ============================================================

    const { data: sub, error: subError } = await supabase
      .from("subscriptions")
      .select(
        "id, user_id, amount, status, plan, midtrans_order_id"
      )
      .eq("midtrans_order_id", String(order_id))
      .single();

    if (subError || !sub) {
      console.error(
        "[Midtrans Webhook] Order not found:",
        order_id,
        subError
      );

      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // ============================================================
    // 4. Validasi nominal dari webhook
    // ============================================================

    if (Number(sub.amount) !== Number(gross_amount)) {
      console.error(
        `[Midtrans Webhook] Amount mismatch for ${order_id}. ` +
        `Local: ${sub.amount}, Midtrans: ${gross_amount}`
      );

      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // ============================================================
    // 5. Ambil STATUS OTORITATIF dari Midtrans
    // ============================================================

    let verifiedStatus: string;
    let verifiedStatusCode: string;
    let verifiedFraud: string | undefined;
    let verifiedPaymentType: string | undefined;
    let verifiedTransactionId: string | undefined;
    let verifiedGrossAmount: number | undefined;

    try {
      const statusRes =
        await getMidtransTransactionStatus(String(order_id));

      verifiedStatus = String(
        statusRes.transaction_status || ""
      ).toLowerCase();

      verifiedStatusCode = String(
        statusRes.status_code || ""
      );

      verifiedFraud = statusRes.fraud_status;
      verifiedPaymentType = statusRes.payment_type;
      verifiedTransactionId = statusRes.transaction_id;

      if (statusRes.gross_amount !== undefined) {
        verifiedGrossAmount = Number(statusRes.gross_amount);
      }

      if (!verifiedStatus) {
        console.error(
          `[Midtrans Webhook] Status API tidak mengembalikan ` +
          `transaction_status untuk ${order_id}`
        );

        return NextResponse.json(
          { error: "Unable to verify transaction status" },
          { status: 503 }
        );
      }

      if (
        verifiedGrossAmount !== undefined &&
        verifiedGrossAmount !== Number(sub.amount)
      ) {
        console.error(
          `[Midtrans Webhook] Verified amount mismatch for ${order_id}. ` +
          `Local: ${sub.amount}, Midtrans API: ${verifiedGrossAmount}`
        );

        return NextResponse.json(
          { error: "Verified amount mismatch" },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error(
        `[Midtrans Webhook] Gagal memverifikasi status transaksi ` +
        `${order_id}:`,
        err
      );

      return NextResponse.json(
        { error: "Unable to verify transaction status" },
        { status: 503 }
      );
    }

    // ============================================================
    // 6. Tentukan status berdasarkan DATA YANG SUDAH DIVERIFIKASI
    // ============================================================

    const mappedStatus = mapStatus(
      verifiedStatus,
      verifiedFraud,
      verifiedStatusCode
    );

    // ============================================================
    // 7. Subscription terminal tidak boleh hidup kembali
    // ============================================================

    if (
      sub.status === "cancelled" ||
      sub.status === "failed" ||
      sub.status === "expired"
    ) {
      console.log(
        `[Midtrans Webhook] Order ${order_id} memiliki ` +
        `status terminal ${sub.status}. Abaikan webhook.`
      );

      return NextResponse.json({
        status: "ok",
        message: "Terminal subscription ignored",
      });
    }

    // ============================================================
    // 8. Duplicate webhook setelah success
    // ============================================================

    if (sub.status === "success") {
      console.log(
        `[Midtrans Webhook] Order ${order_id} sudah success. ` +
        `Abaikan duplicate webhook.`
      );

      return NextResponse.json({
        status: "ok",
        message: "Already success",
      });
    }

    // ============================================================
    // 9. Hanya subscription pending yang boleh diproses
    // ============================================================

    if (sub.status !== "pending") {
      console.log(
        `[Midtrans Webhook] Order ${order_id} memiliki ` +
        `status tidak dikenali: ${sub.status}.`
      );

      return NextResponse.json({
        status: "ok",
        message: "Subscription state ignored",
      });
    }

    // ============================================================
    // 10. PAYMENT SUCCESS
    // ============================================================

    if (mappedStatus === "success") {
      let planExpiresAt: string | null = null;

      if (sub.plan === "premium") {
        planExpiresAt = new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000
        ).toISOString();
      } else if (sub.plan === "pro") {
        planExpiresAt = null;
      }

      const { data: finalized, error: finalizeError } =
        await supabase.rpc(
          "finalize_subscription_payment",
          {
            p_subscription_id: sub.id,
            p_payment_method: verifiedPaymentType ?? null,
            p_transaction_id: verifiedTransactionId ?? null,
            p_expires_at: planExpiresAt,
          }
        );

      if (finalizeError) {
        console.error(
          `[Midtrans Webhook] Atomic payment finalization ` +
          `failed for ${order_id}:`,
          finalizeError
        );

        return NextResponse.json(
          { error: "Payment finalization failed" },
          { status: 503 }
        );
      }

      if (!finalized) {
        console.log(
          `[Midtrans Webhook] Order ${order_id} sudah ` +
          `diproses oleh request lain.`
        );

        return NextResponse.json({
          status: "ok",
          message: "Already processed",
        });
      }

      console.log(
        `[Midtrans Webhook] Payment finalized successfully: ${order_id}`
      );

      return NextResponse.json({
        status: "ok",
        message: "Payment processed",
      });
    }

    // ============================================================
    // 11. PAYMENT NON-SUCCESS
    // ============================================================

    const { error: updateSubError } = await supabase
      .from("subscriptions")
      .update({
        status: mappedStatus,
        payment_method:
          verifiedPaymentType ?? payment_type ?? null,
        midtrans_transaction_id:
          verifiedTransactionId ?? transaction_id ?? null,
      })
      .eq("id", sub.id)
      .eq("status", "pending");

    if (updateSubError) {
      console.error(
        "[Midtrans Webhook] Failed to update subscription:",
        updateSubError
      );

      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
    });
  } catch (err: unknown) {
    console.error(
      "[Midtrans Webhook] Unexpected error:",
      err
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 503 }
    );
  }
}