import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createMidtransTransaction } from "@/lib/midtrans";
import { randomUUID } from "crypto";

const PLAN_PRICES = {
  premium: {
    amount: 99000,
    name: "NikahLink Paket Premium (90 Hari)",
  },
  pro: {
    amount: 299000,
    name: "NikahLink Paket Pro VIP (Lifetime)",
  },
} as const;

type Plan = keyof typeof PLAN_PRICES;

function isValidPlan(value: unknown): value is Plan {
  return value === "premium" || value === "pro";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // ------------------------------------------------------------
    // 1. Authentication
    // ------------------------------------------------------------
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ------------------------------------------------------------
    // 2. Parse request body
    // ------------------------------------------------------------
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload tidak valid" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Payload tidak valid" },
        { status: 400 }
      );
    }

    const payload = body as Record<string, unknown>;

    const plan = payload.plan;
    const invitationId = payload.invitationId;

    // ------------------------------------------------------------
    // 3. Validate plan
    // ------------------------------------------------------------
    if (!isValidPlan(plan)) {
      return NextResponse.json(
        { error: "Plan tidak valid" },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 4. Validate invitationId
    // ------------------------------------------------------------
    let validatedInvitationId: string | null = null;

    if (invitationId !== undefined && invitationId !== null) {
      if (
        typeof invitationId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          invitationId
        )
      ) {
        return NextResponse.json(
          { error: "Invitation ID tidak valid" },
          { status: 400 }
        );
      }

      validatedInvitationId = invitationId;
    }

    // ------------------------------------------------------------
    // 5. Load profile
    // ------------------------------------------------------------
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile lookup error:", profileError);

      return NextResponse.json(
        { error: "Gagal memeriksa paket akun" },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 6. Determine effective plan
    // ------------------------------------------------------------
    const PLAN_RANK: Record<string, number> = {
      free: 0,
      premium: 1,
      pro: 2,
    };

    let effectivePlan = profile.plan || "free";

    if (
      effectivePlan === "premium" &&
      profile.plan_expires_at
    ) {
      const expiresAt = new Date(profile.plan_expires_at);

      if (expiresAt.getTime() <= Date.now()) {
        effectivePlan = "free";
      }
    }

    const currentRank = PLAN_RANK[effectivePlan] ?? 0;
    const targetRank = PLAN_RANK[plan];

    if (targetRank <= currentRank) {
      return NextResponse.json(
        {
          error: `Kamu sudah menggunakan paket ${effectivePlan.toUpperCase()}. Tidak bisa membeli paket yang sama atau lebih rendah.`,
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 7. Validate invitation ownership
    // ------------------------------------------------------------
    if (validatedInvitationId) {
      const { data: invitation, error: invitationError } =
        await supabase
          .from("invitations")
          .select("id")
          .eq("id", validatedInvitationId)
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
    // 8. Cancel ALL existing pending subscriptions
    // ------------------------------------------------------------
    const { error: cancelPendingError } = await supabaseAdmin
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("status", "pending");

    if (cancelPendingError) {
      console.error(
        "Cancel pending subscriptions error:",
        cancelPendingError
      );

      return NextResponse.json(
        {
          error:
            "Gagal membatalkan transaksi pembayaran sebelumnya",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 9. Server-controlled price
    // ------------------------------------------------------------
    const planInfo = PLAN_PRICES[plan];

    // Client cannot control:
    // - amount
    // - product name
    // - order_id
    // - status
    // - expiry
    const orderId = `NL-${randomUUID()}`;

    // ------------------------------------------------------------
    // 10. Create local subscription FIRST
    // ------------------------------------------------------------
    const { error: dbError } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id: user.id,
        invitation_id: validatedInvitationId,
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

      // Unique partial index protection:
      // only one pending subscription per user.
      if (dbError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "Masih ada transaksi pembayaran yang sedang diproses. Silakan coba lagi.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Gagal membuat transaksi pembayaran" },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 11. Create Midtrans transaction
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
      console.error(
        "Midtrans Transaction Error:",
        midtransError
      );

      // Local subscription exists, but Midtrans order creation failed.
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "failed",
        })
        .eq("midtrans_order_id", orderId)
        .eq("status", "pending");

      return NextResponse.json(
        {
          error:
            "Gagal membuat transaksi di Midtrans",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Payment Token Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal membuat transaksi",
      },
      { status: 500 }
    );
  }
}