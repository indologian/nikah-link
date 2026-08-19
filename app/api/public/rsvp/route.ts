import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

const rsvpSchema = z.object({
    invitationId: z.string().uuid(),
    name: z.string().trim().min(1).max(100),
    status: z.enum(["hadir", "tidak_hadir"]),
    guestCount: z.coerce.number().int().min(1).max(20),
    notes: z.string().trim().max(500).optional().default(""),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const parsed = rsvpSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Data RSVP tidak valid",
                    details: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const {
            invitationId,
            name,
            status,
            guestCount,
            notes,
        } = parsed.data;

        // ------------------------------------------------------------
        // 1. Pastikan invitation valid dan memang sedang publik
        // ------------------------------------------------------------
        const { data: invitation, error: invitationError } =
            await supabaseAdmin
                .from("invitations")
                .select(`
          id,
          user_id,
          is_published,
          show_rsvp,
          expires_at
        `)
                .eq("id", invitationId)
                .maybeSingle();

        if (invitationError) {
            console.error("RSVP invitation lookup error:", invitationError);

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
        // 2. Pastikan RSVP memang diaktifkan
        // ------------------------------------------------------------
        if (!invitation.show_rsvp) {
            return NextResponse.json(
                { error: "RSVP tidak tersedia untuk undangan ini" },
                { status: 403 }
            );
        }

        // ------------------------------------------------------------
        // 3. Cek expiration invitation
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
        // 4. Ambil plan pemilik invitation
        // ------------------------------------------------------------
        const { data: profile, error: profileError } =
            await supabaseAdmin
                .from("profiles")
                .select("plan")
                .eq("user_id", invitation.user_id)
                .maybeSingle();

        if (profileError) {
            console.error("RSVP profile lookup error:", profileError);

            return NextResponse.json(
                { error: "Gagal memeriksa paket undangan" },
                { status: 500 }
            );
        }

        // ------------------------------------------------------------
        // 5. Pertahankan aturan Free Plan yang dipakai aplikasi sekarang
        //
        // Kode existing menghitung JUMLAH ROW guests, bukan total guest_count.
        // Kita pertahankan behavior tersebut agar tidak mengubah business rule.
        // ------------------------------------------------------------
        if (profile?.plan === "free") {
            const { count, error: countError } = await supabaseAdmin
                .from("guests")
                .select("id", {
                    count: "exact",
                    head: true,
                })
                .eq("invitation_id", invitation.id);

            if (countError) {
                console.error("RSVP guest count error:", countError);

                return NextResponse.json(
                    { error: "Gagal memeriksa kapasitas tamu" },
                    { status: 500 }
                );
            }

            if ((count ?? 0) >= 50) {
                return NextResponse.json(
                    {
                        error:
                            "Kuota tamu undangan telah mencapai batas maksimal (50 tamu).",
                    },
                    { status: 409 }
                );
            }
        }

        // ------------------------------------------------------------
        // 6. Simpan RSVP
        // ------------------------------------------------------------
        const { error: insertError } = await supabaseAdmin
            .from("guests")
            .insert({
                invitation_id: invitation.id,
                name,
                rsvp_status: status,
                guest_count: guestCount,
                notes: notes || null,
            });

        if (insertError) {
            console.error("RSVP insert error:", insertError);

            return NextResponse.json(
                { error: "Gagal menyimpan RSVP" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "RSVP berhasil dikirim",
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("RSVP API error:", error);

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