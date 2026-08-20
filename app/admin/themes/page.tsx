import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ThemesClient from "./ThemesClient";

export const dynamic = "force-dynamic";

export default async function AdminThemesPage() {
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

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Manajemen Tema</h1>
        <p className="text-slate-400 mt-1">Kelola tema yang tersedia untuk pengguna.</p>
      </div>
      <ThemesClient initialThemes={themes || []} />
    </div>
  );
}
