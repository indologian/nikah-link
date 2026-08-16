import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings, Mail, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/masuk");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const name = user.user_metadata?.name || profile?.name || "Pengguna NikahLink";
  const plan = profile?.plan || "free";

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1517] p-6 rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] shadow-xs">
        <h1 className="text-2xl font-bold text-[#221C28] dark:text-[#FDFBF7] font-playfair flex items-center gap-3">
          <Settings className="w-7 h-7 text-[#9E1B54]" /> Pengaturan Akun & Profil
        </h1>
        <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm mt-1">Kelola data profil, email, dan paket langganan akun kamu.</p>
      </div>

      <div className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl p-6 sm:p-8 border border-[#F0E2DA] dark:border-[#33272B] shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-[#33272B] pb-6">
          <div className="w-16 h-16 rounded-full bg-[#9E1B54] flex items-center justify-center text-white text-2xl font-extrabold shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#221C28] dark:text-[#FDFBF7]">{name}</h2>
            <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm flex items-center gap-1.5 mt-0.5 font-medium">
              <Mail className="w-4 h-4 text-[#9E1B54]" /> {user.email}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#251E21]/50 border border-slate-200 dark:border-[#423338] space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status Paket Kamu</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-[#9E1B54] dark:text-[#F8D5E3] capitalize">{plan} Plan</span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                AKTIF
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#251E21]/50 border border-slate-200 dark:border-[#423338] space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Keamanan Akun</span>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> Terverifikasi Supabase Auth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
