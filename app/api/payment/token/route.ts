import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createMidtransTransaction } from "@/lib/midtrans";

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  premium: {
    amount: 99000,
    name: "NikahLink Paket Premium (Aktif Selamanya)",
  },
  pro: {
    amount: 299000,
    name: "NikahLink Paket Pro VIP (Aktif Selamanya)",
  },
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { plan, invitationId } = await request.json();

    // ------------------------------------------------------------
    // 1. Validasi plan
    // ------------------------------------------------------------
    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json(
        { error: "Plan tidak valid" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 2. Cek profile / plan user
    // ------------------------------------------------------------
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
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

    const currentRank =
      PLAN_RANK[profile?.plan || "free"] ?? 0;

    const targetRank =
      PLAN_RANK[plan] ?? 0;

    if (targetRank <= currentRank) {
      return NextResponse.json(
        {
          error: `Kamu sudah menggunakan paket ${(profile?.plan || "free").toUpperCase()}. Tidak bisa membeli paket yang sama atau lebih rendah.`,
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 3. Validasi invitationId
    //    Harus milik user yang sedang login.
    // ------------------------------------------------------------
    if (invitationId) {
      const { data: invitation, error: invitationError } =
        await supabase
          .from("invitations")
          .select("id")
          .eq("id", invitationId)
          .eq("user_id", user.id)
          .maybeSingle();

      if (invitationError) {
        console.error(
          "Invitation validation error:",
          invitationError
        );

        return NextResponse.json(
          { error: "Gagal memvalidasi undangan" },
          { status: 500 }
        );
      }

      if (!invitation) {
        return NextResponse.json(
          {
            error:
              "Undangan tidak valid atau bukan milik Anda",
          },
          { status: 403 }
        );
      }
    }

    // ------------------------------------------------------------
    // 4. Batalkan pending subscription sebelumnya
    // ------------------------------------------------------------
    const { data: pendingSub, error: pendingError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .limit(1)
        .maybeSingle();

    if (pendingError) {
      console.error(
        "Pending subscription lookup error:",
        pendingError
      );

      return NextResponse.json(
        { error: "Gagal memeriksa transaksi sebelumnya" },
        { status: 500 }
      );
    }

    if (pendingSub) {
      const { error: cancelError } =
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("id", pendingSub.id);

      if (cancelError) {
        console.error(
          "Cancel pending subscription error:",
          cancelError
        );

        return NextResponse.json(
          {
            error:
              "Gagal membatalkan transaksi sebelumnya",
          },
          { status: 500 }
        );
      }
    }

    // ------------------------------------------------------------
    // 5. Buat order ID + subscription pending
    // ------------------------------------------------------------
    const planInfo = PLAN_PRICES[plan];

    const orderId =
      `NL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const { error: dbError } =
      await supabaseAdmin
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
      console.error(
        "DB Insert Subscription Error:",
        dbError
      );

      return NextResponse.json(
        {
          error:
            "Gagal membuat transaksi pembayaran",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 6. Buat transaksi Midtrans
    // ------------------------------------------------------------
    const midtransRes =
      await createMidtransTransaction({
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
  } catch (error: unknown) {
    console.error("Payment Token Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Gagal membuat transaksi";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}