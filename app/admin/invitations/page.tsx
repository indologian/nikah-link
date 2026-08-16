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

  const { data: invitations, error } = await supabase
    .from("invitations")
    .select("id, user_id, username, bride_name, groom_name, status, is_published, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error fetching invitations:", error);
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, name, plan");

  const profilesMap = (profiles || []).reduce((acc: any, p: any) => {
    acc[p.user_id] = p;
    return acc;
  }, {});

  const mappedInvitations = (invitations || []).map((inv: any) => ({
    ...inv,
    profiles: profilesMap[inv.user_id] || null
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Manajemen Undangan</h1>
        <p className="text-slate-400 mt-1">Pantau dan kelola seluruh link undangan yang aktif.</p>
      </div>
      <InvitationsClient initialInvitations={mappedInvitations} />
    </div>
  );
}
