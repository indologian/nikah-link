"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Theme } from "@/types";
import { Plus, Trash2, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function ThemesClient({ initialThemes }: { initialThemes: Theme[] }) {
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "minimalis",
    is_premium: false,
    colors_primary: "#9E1B54",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnailFile) return alert("Pilih gambar thumbnail terlebih dahulu");
    setIsSubmitting(true);

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = thumbnailFile.name.split(".").pop();
      const fileName = `${formData.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("themes")
        .upload(fileName, thumbnailFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("themes")
        .getPublicUrl(fileName);
      
      const thumbnailUrl = publicUrlData.publicUrl;

      // 2. Insert to DB
      const newTheme = {
        id: formData.id,
        name: formData.name,
        slug: formData.id,
        category: formData.category,
        thumbnail_url: thumbnailUrl,
        is_premium: formData.is_premium,
        is_active: true,
        colors: {
          primary: formData.colors_primary,
          secondary: "#FFFFFF",
          accent: "#000000",
          background: "#FFFFFF"
        }
      };

      const { error: insertError } = await supabase.from("themes").insert(newTheme);
      if (insertError) throw insertError;

      setThemes([newTheme as Theme, ...themes]);
      setIsAdding(false);
      setFormData({ id: "", name: "", category: "minimalis", is_premium: false, colors_primary: "#9E1B54" });
      setThumbnailFile(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, thumbnailUrl: string) => {
    if (!confirm("Yakin ingin menghapus tema ini?")) return;
    try {
      // Delete from DB
      await supabase.from("themes").delete().eq("id", id);
      
      // Attempt to delete from storage if it's stored in our bucket
      if (thumbnailUrl.includes("/themes/")) {
        const fileName = thumbnailUrl.split("/").pop();
        if (fileName) await supabase.storage.from("themes").remove([fileName]);
      }
      
      setThemes(themes.filter(t => t.id !== id));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">Katalog Tema</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> {isAdding ? "Tutup" : "Tambah Tema"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-12 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-medium text-slate-900 dark:text-white tracking-tight text-lg mb-6">Parameter Tema Baru</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">ID Tema (Unik)</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")})}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none"
                placeholder="misal: rustic-gold"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Nama Tema</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Kategori</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none"
              >
                <option value="minimalis">Minimalis</option>
                <option value="floral">Floral / Bunga</option>
                <option value="dark">Dark / Mewah</option>
                <option value="budaya">Adat / Budaya</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Warna Utama (Hex)</label>
              <div className="flex gap-4 items-end">
                <input
                  type="color"
                  value={formData.colors_primary}
                  onChange={e => setFormData({...formData, colors_primary: e.target.value})}
                  className="w-8 h-8 cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  required
                  value={formData.colors_primary}
                  onChange={e => setFormData({...formData, colors_primary: e.target.value})}
                  className="flex-1 px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none font-mono"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Jenis Tema</label>
              <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${formData.is_premium ? 'border-slate-900 bg-slate-900 dark:border-white dark:bg-white' : 'border-slate-300 dark:border-slate-600'}`}>
                   {formData.is_premium && <CheckCircle2 className="w-3 h-3 text-white dark:text-slate-900" />}
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={e => setFormData({...formData, is_premium: e.target.checked})}
                  className="hidden"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Tema Premium (Berbayar)</span>
              </label>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Upload Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full px-0 py-2 bg-transparent text-sm text-slate-900 dark:text-slate-200 focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:border file:border-slate-200 dark:file:border-slate-800 file:bg-transparent file:text-xs file:font-mono file:uppercase file:tracking-wider file:text-slate-900 dark:file:text-white hover:file:bg-slate-50 dark:hover:file:bg-slate-900 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Tema Ke Database"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {themes.map((theme) => (
          <div key={theme.id} className="group relative">
            <div className="aspect-[3/4] relative bg-slate-100 dark:bg-slate-900 mb-3 overflow-hidden border border-slate-200 dark:border-slate-800">
              {theme.thumbnail_url ? (
                <img src={theme.thumbnail_url} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                </div>
              )}
              {theme.is_premium && (
                <div className="absolute top-3 left-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-[9px] font-mono px-2 py-1 uppercase tracking-widest shadow-sm">
                  Premium
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm tracking-tight">{theme.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono uppercase tracking-wider">{theme.category}</p>
              </div>
              <button
                onClick={() => handleDelete(theme.id, theme.thumbnail_url)}
                className="text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="Hapus Tema"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {themes.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-slate-500">
            Belum ada tema. Klik "Tambah Tema" untuk mulai.
          </div>
        )}
      </div>
    </div>
  );
}
