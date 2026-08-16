"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Theme } from "@/types";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-200">Daftar Tema</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Tema
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white mb-4">Tambah Tema Baru</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">ID Tema (Unik, misal: rustic-gold)</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")})}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Nama Tema (Tampilan)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Kategori</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="minimalis">Minimalis</option>
                <option value="floral">Floral / Bunga</option>
                <option value="dark">Dark / Mewah</option>
                <option value="budaya">Adat / Budaya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Warna Utama (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.colors_primary}
                  onChange={e => setFormData({...formData, colors_primary: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  required
                  value={formData.colors_primary}
                  onChange={e => setFormData({...formData, colors_primary: e.target.value})}
                  className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Jenis Tema</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={e => setFormData({...formData, is_premium: e.target.checked})}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-950 border-slate-800"
                />
                <span className="text-sm text-slate-200">Tema Premium (Berbayar)</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Upload Thumbnail (.jpg / .png)</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-500 hover:file:bg-rose-500/20"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Tema"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group">
            <div className="aspect-[3/4] relative bg-slate-800">
              {theme.thumbnail_url ? (
                <img src={theme.thumbnail_url} alt={theme.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-slate-700" />
                </div>
              )}
              {theme.is_premium && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                  Premium
                </div>
              )}
            </div>
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-200 text-sm">{theme.name}</h3>
                <p className="text-xs text-slate-500 mt-1 capitalize">{theme.category}</p>
              </div>
              <button
                onClick={() => handleDelete(theme.id, theme.thumbnail_url)}
                className="text-slate-500 hover:text-rose-500 transition-colors p-1"
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
