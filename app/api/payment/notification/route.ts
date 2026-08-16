import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key if available or standard server client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vyjqubgkkpapsovnrnab.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, transaction_status, fraud_status, payment_type } = body;

    console.log(`[Midtrans Webhook] OrderID: ${order_id}, Status: ${transaction_status}`);

    let status = "pending";

    if (transaction_status === "capture") {
      status = fraud_status === "challenge" ? "pending" : "success";
    } else if (transaction_status === "settlement") {
      status = "success";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      status = "failed";
    }

    if (order_id) {
      // 1. Update subscription status in Supabase
      const { data: sub } = await supabase
        .from("subscriptions")
        .update({
          status,
          payment_method: payment_type,
          started_at: status === "success" ? new Date().toISOString() : null,
        })
        .eq("midtrans_order_id", order_id)
        .select()
        .single();

      // 2. If status is success, update user profile plan
      if (status === "success" && sub) {
        await supabase
          .from("profiles")
          .update({ plan: sub.plan })
          .eq("user_id", sub.user_id);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Midtrans Notification Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
