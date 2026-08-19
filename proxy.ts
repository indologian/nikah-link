import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Kecualikan webhook Midtrans (server-to-server, pakai SERVICE_ROLE_KEY,
    // tidak butuh session/cookie) agar getUser() tidak dipanggil sia-sia
    // dan Supabase Auth outage tidak menggagalkan konfirmasi pembayaran.
    "/((?!api/payment/notification|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};