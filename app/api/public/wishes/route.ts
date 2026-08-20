import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const wishSchema = z.object({
    invitationId: z.string().uuid(),
    guestName: z.string().trim().max(100).optional().default(""),
    message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
    try {
        const forwardedFor = request.headers.get("x-forwarded-for");
        const realIp = request.headers.get("x-real-ip");

        const clientIp =
            forwardedFor?.split(",")[0]?.trim() ||
            realIp?.trim() ||
            "unknown";

        const body = await request.json();

        const parsed = wishSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Data ucapan tidak valid",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const {
            invitationId,
            guestName,
            message,
        } = parsed.data;

        const { data: rateAllowed, error: rateLimitError } =
            await supabaseAdmin.rpc("consume_public_api_rate_limit", {
                p_key: `wishes:${clientIp}:${invitationId}`,
                p_limit: 30,
                p_window_seconds: 60,
            });

        if (rateLimitError) {
            console.error("Wish rate limit error:", rateLimitError);

            return NextResponse.json(
                {
                    error: "Tidak dapat memproses permintaan saat ini",
                },
                { status: 503 }
            );
        }

        if (!rateAllowed) {
            return NextResponse.json(
                {
                    error:
                        "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.",
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": "60",
                    },
                }
            );
        }

        // ------------------------------------------------------------
        // 1. Validasi invitation
        // ------------------------------------------------------------
        const { data: invitation, error: invitationError } =
            await supabaseAdmin
                .from("invitations")
                .select(`
          id,
          is_published,
          show_wishes,
          expires_at
        `)
                .eq("id", invitationId)
                .maybeSingle();

        if (invitationError) {
            console.error("Wish invitation lookup error:", invitationError);

            return NextResponse.json(
                { error: "Gagal memeriksa undangan" },
                { status: 500 }
            );
        }

        if (!invitation || !invitation.is_published) {
            return NextResponse.json(
                { error: "Undangan tidak tersedia" },
                { status: 404 }
            );
        }

        // ------------------------------------------------------------
        // 2. Pastikan wishes aktif
        // ------------------------------------------------------------
        if (!invitation.show_wishes) {
            return NextResponse.json(
                { error: "Kolom ucapan tidak tersedia" },
                { status: 403 }
            );
        }

        // ------------------------------------------------------------
        // 3. Validasi expiration
        // ------------------------------------------------------------
        if (
            invitation.expires_at &&
            new Date(invitation.expires_at).getTime() <= Date.now()
        ) {
            return NextResponse.json(
                { error: "Undangan telah kedaluwarsa" },
                { status: 403 }
            );
        }

        // ------------------------------------------------------------
        // 4. Insert wish
        //
        // is_approved selalu ditentukan server.
        // Client tidak boleh menentukan approval.
        // ------------------------------------------------------------
        const { data: wish, error: insertError } =
            await supabaseAdmin
                .from("wishes")
                .insert({
                    invitation_id: invitation.id,
                    guest_name: guestName || "Anonim",
                    message,
                    is_approved: true,
                })
                .select(`
          id,
          invitation_id,
          guest_name,
          message,
          is_approved,
          created_at
        `)
                .single();

        if (insertError) {
            console.error("Wish insert error:", insertError);

            return NextResponse.json(
                { error: "Gagal menyimpan ucapan" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: wish,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Wish API error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Terjadi kesalahan pada server",
            },
            { status: 500 }
        );
    }
}