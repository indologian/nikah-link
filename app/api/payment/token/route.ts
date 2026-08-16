import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMidtransTransaction } from "@/lib/midtrans";

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  premium: { amount: 149000, name: "NikahLink Paket Premium (Aktif Selamanya)" },
  pro: { amount: 299000, name: "NikahLink Paket Pro VIP (Custom Domain)" },
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, invitationId } = await request.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Plan tidak valid" }, { status: 400 });
    }

    const planInfo = PLAN_PRICES[plan];
    const orderId = `NL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save pending subscription in DB
    const { error: dbError } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      invitation_id: invitationId || null,
      plan,
      midtrans_order_id: orderId,
      amount: planInfo.amount,
      status: "pending",
    });

    if (dbError) {
      console.error("DB Insert Subscription Error:", dbError);
    }

    // Get Snap Transaction Token from Midtrans
    const midtransRes = await createMidtransTransaction({
      orderId,
      amount: planInfo.amount,
      customerDetails: {
        first_name: user.user_metadata?.name || user.email?.split("@")[0] || "Customer",
        email: user.email || "",
      },
      itemDetails: [
        {
          id: plan,
          price: planInfo.amount,
          quantity: 1,
          name: planInfo.name,
        },
      ],
    });

    return NextResponse.json({
      token: midtransRes.token,
      redirect_url: midtransRes.redirect_url,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error("Payment Token Error:", error);
    return NextResponse.json({ error: error.message || "Gagal membuat transaksi" }, { status: 500 });
  }
}
