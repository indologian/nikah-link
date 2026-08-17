import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings, Mail, ShieldCheck } from "lucide-react";
import DeleteAccountSection from "@/components/dashboard/DeleteAccountSection";

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
    <div className="space-y-10 pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-1">
            Pengaturan Akun
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kelola data profil, akses login, dan paket langganan.
          </p>
        </div>
      </div>

      <div className="bg-transparent rounded-none flex flex-col gap-6">
        {/* Profile Block */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white text-2xl font-serif">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white">{name}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-slate-400" /> {user.email}
            </p>
          </div>
        </div>

        {/* Info Grid - Monochromatic */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:border-slate-900 dark:border-white transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-4">Status Paket</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-playfair font-bold text-slate-900 dark:text-white capitalize">{plan} Plan</span>
              <span className="px-3 py-1 rounded-none bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-widest font-bold border border-emerald-200 dark:border-emerald-800">
                AKTIF
              </span>
            </div>
          </div>

          <div className="p-6 rounded-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:border-slate-900 dark:border-white transition-colors">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-4">Keamanan Otentikasi</span>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 text-sm font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
              <span>Sesi Terverifikasi Aman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-10">
        <DeleteAccountSection />
      </div>
    </div>
  );
}
