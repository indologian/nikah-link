import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Users, Link as LinkIcon, Palette, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored on server component
          }
        },
      },
    }
  );

  // Fetch stats in parallel
  const [
    { count: totalUsers },
    { count: totalInvitations },
    { count: totalThemes },
    { data: transactions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("invitations").select("*", { count: "exact", head: true }),
    supabase.from("themes").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("amount"),
  ]);

  const totalRevenue = transactions?.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0) || 0;

  const stats = [
    {
      label: "Total Pengguna",
      value: totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Undangan Aktif",
      value: totalInvitations || 0,
      icon: LinkIcon,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Total Tema",
      value: totalThemes || 0,
      icon: Palette,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white">Overview</h1>
        <p className="text-slate-500 mt-2 text-sm">Ringkasan performa platform NikahLink.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-slate-200 dark:border-slate-800">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 border-b border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <h3 className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-4">{stat.label}</h3>
            <p className="text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Langkah Awal</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl leading-relaxed">
          Selamat datang di Super Admin Dashboard! Pastikan Anda telah menjalankan skrip SQL untuk membuat tabel transactions dan tabel themes di Supabase. Anda dapat menggunakan menu di sebelah kiri untuk mengelola Pengguna, Undangan, dan Tema.
        </p>
      </div>
    </div>
  );
}
