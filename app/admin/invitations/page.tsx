import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import InvitationsClient from "./InvitationsClient";

export const dynamic = "force-dynamic";

export default async function AdminInvitationsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, username, bride_name, groom_name, status, is_published, created_at, profiles(name, plan)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Manajemen Undangan</h1>
        <p className="text-slate-400 mt-1">Pantau dan kelola seluruh link undangan yang aktif.</p>
      </div>
      <InvitationsClient initialInvitations={invitations || []} />
    </div>
  );
}
