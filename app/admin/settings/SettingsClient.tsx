"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, LayoutTemplate } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
// I will just use standard custom tailwind toggle to avoid missing dependencies.

interface SettingsClientProps {
  initialConfig: {
    showHero: boolean;
    showWhy: boolean;
    showThemes: boolean;
    showFeatures: boolean;
    showHowItWorks: boolean;
    showEcoImpact: boolean;
    showVendor: boolean;
    showPricing: boolean;
    showTestimonial: boolean;
    showFaq: boolean;
  };
}

const SECTION_NAMES: Record<keyof SettingsClientProps["initialConfig"], string> = {
  showHero: "Hero Section (Beranda Utama)",
  showWhy: "Mengapa Memilih Kami (Why)",
  showThemes: "Katalog Tema (Themes)",
  showFeatures: "Fitur Unggulan (Features)",
  showHowItWorks: "Cara Kerja (How It Works)",
  showEcoImpact: "Dampak Lingkungan (Eco Impact)",
  showVendor: "Daftar Vendor (Vendors)",
  showPricing: "Pilihan Harga (Pricing)",
  showTestimonial: "Testimoni Pelanggan (Testimonial)",
  showFaq: "Tanya Jawab (FAQ)"
};

export default function SettingsClient({ initialConfig }: SettingsClientProps) {
  const [config, setConfig] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const supabase = createClient();

  const handleToggle = (key: keyof typeof config) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const executeSave = async () => {
    setShowConfirm(false);
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ config: config })
        .eq("id", 1);
        
      if (!error) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error("Save error:", error);
        alert("Gagal menyimpan: " + error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <LayoutTemplate className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Visibilitas Section</h2>
          <p className="text-sm text-slate-500">Matikan sakelar untuk menyembunyikan section dari pengunjung.</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {(Object.keys(SECTION_NAMES) as Array<keyof typeof config>).map((key) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {SECTION_NAMES[key]}
            </span>
            
            {/* Custom Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={config[key]}
                onChange={() => handleToggle(key)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-rose-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-none font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Perubahan"}
        </button>
        {saveSuccess && (
          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
            <CheckCircle2 className="w-4 h-4" /> Tersimpan
          </span>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeSave}
        title="Simpan Pengaturan?"
        description="Perubahan ini akan langsung berdampak pada halaman depan (Landing Page) website Anda. Lanjutkan?"
        confirmText="Ya, Simpan"
        cancelText="Batal"
      />
    </div>
  );
}
