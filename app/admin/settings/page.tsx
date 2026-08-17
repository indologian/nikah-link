import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Pengaturan Situs | Admin NikahLink",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/masuk");
  }



  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  const defaultConfig = {
    showHero: true,
    showWhy: true,
    showThemes: true,
    showFeatures: true,
    showHowItWorks: true,
    showEcoImpact: true,
    showVendor: true,
    showPricing: true,
    showTestimonial: true,
    showFaq: true,
  };

  const initialConfig = settings?.config || defaultConfig;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white mb-2">Pengaturan Tampilan</h1>
        <p className="text-slate-500 dark:text-slate-400">Atur bagian (section) mana saja yang ingin ditampilkan di halaman depan (Landing Page).</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <SettingsClient initialConfig={initialConfig} />
      </div>
    </div>
  );
}
