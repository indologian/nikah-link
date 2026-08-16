import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
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

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Manajemen Pengguna</h1>
        <p className="text-slate-400 mt-1">Kelola akun, role, dan paket langganan pengguna.</p>
      </div>
      <UsersClient initialUsers={users || []} />
    </div>
  );
}
