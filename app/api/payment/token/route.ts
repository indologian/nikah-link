import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createMidtransTransaction } from "@/lib/midtrans";
import { randomUUID } from "crypto";

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  premium: {
    amount: 99000,
    name: "NikahLink Paket Premium (90 Hari)",
  },
  pro: {
    amount: 299000,
    name: "NikahLink Paket Pro VIP (Lifetime)",
  },
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, invitationId } = await request.json();

    // ------------------------------------------------------------
    // 1. Validasi plan
    // ------------------------------------------------------------
    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Plan tidak valid" }, { status: 400 });
    }

    // ------------------------------------------------------------
    // 2. Cek profile / plan user (dengan pengecekan expiry)
    // ------------------------------------------------------------
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      return NextResponse.json(
        { error: "Gagal memeriksa paket akun" },
        { status: 500 }
      );
    }

    const PLAN_RANK: Record<string, number> = {
      free: 0,
      premium: 1,
      pro: 2,
    };

    // Cek apakah paket premium sudah expired
    let effectivePlan = profile?.plan || "free";
    if (effectivePlan === "premium" && profile?.plan_expires_at) {
      const isExpired = new Date(profile.plan_expires_at) < new Date();
      if (isExpired) {
        effectivePlan = "free"; // Premium yang sudah expired dianggap Free
      }
    }

    const currentRank = PLAN_RANK[effectivePlan] ?? 0;
    const targetRank = PLAN_RANK[plan] ?? 0;

    if (targetRank <= currentRank) {
      return NextResponse.json(
        {
          error: `Kamu sudah menggunakan paket ${effectivePlan.toUpperCase()}. Tidak bisa membeli paket yang sama atau lebih rendah.`,
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 3. Validasi invitationId
    //    Harus milik user yang sedang login.
    // ------------------------------------------------------------
    if (invitationId) {
      const { data: invitation, error: invitationError } = await supabase
        .from("invitations")
        .select("id")
        .eq("id", invitationId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (invitationError) {
        console.error("Invitation validation error:", invitationError);
        return NextResponse.json(
          { error: "Gagal memvalidasi undangan" },
          { status: 500 }
        );
      }

      if (!invitation) {
        return NextResponse.json(
          { error: "Undangan tidak valid atau bukan milik Anda" },
          { status: 403 }
        );
      }
    }

    // ------------------------------------------------------------
    // 4. Batalkan pending subscription sebelumnya
    // ------------------------------------------------------------
    const { data: pendingSub, error: pendingError } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();

    if (pendingError) {
      console.error("Pending subscription lookup error:", pendingError);
      return NextResponse.json(
        { error: "Gagal memeriksa transaksi sebelumnya" },
        { status: 500 }
      );
    }

    if (pendingSub) {
      const { error: cancelError } = await supabaseAdmin
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("id", pendingSub.id);

      if (cancelError) {
        console.error("Cancel pending subscription error:", cancelError);
        return NextResponse.json(
          { error: "Gagal membatalkan transaksi sebelumnya" },
          { status: 500 }
        );
      }
    }

    // ------------------------------------------------------------
    // 5. Buat order ID + subscription pending
    // ------------------------------------------------------------
    const planInfo = PLAN_PRICES[plan];

    // Generate aman Order ID menggunakan UUID cryptographically secure
    const orderId = `NL-${randomUUID()}`;

    const { error: dbError } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id: user.id,
        invitation_id: invitationId || null,
        plan,
        midtrans_order_id: orderId,
        amount: planInfo.amount,
        status: "pending",
      });

    if (dbError) {
      console.error("DB Insert Subscription Error:", dbError);
      return NextResponse.json(
        { error: "Gagal membuat transaksi pembayaran" },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 6. Buat transaksi Midtrans
    // ------------------------------------------------------------
    try {
      const midtransRes = await createMidtransTransaction({
        orderId,
        amount: planInfo.amount,
        customerDetails: {
          first_name:
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Customer",
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
    } catch (midtransError) {
      console.error("Midtrans Transaction Error:", midtransError);

      // Jika gagal membuat transaksi di Midtrans, update status subscription menjadi 'failed'
      await supabaseAdmin
        .from("subscriptions")
        .update({ status: "failed" })
        .eq("midtrans_order_id", orderId);

      return NextResponse.json(
        { error: "Gagal membuat transaksi di Midtrans" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Payment Token Error:", error);

    const message =
      error instanceof Error ? error.message : "Gagal membuat transaksi";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}