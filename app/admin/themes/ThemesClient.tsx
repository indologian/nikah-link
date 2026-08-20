"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Theme } from "@/types";
import { themesConfig } from "@/lib/themes/registry";
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;

const RENDERER_OPTIONS = Object.keys(themesConfig);

const DEFAULT_FORM = {
  id: "",
  slug: "",
  component_key: "minimalis",
  name: "",
  category: "minimalis",
  is_premium: false,
  colors_primary: "#0F172A",
};

const formatRendererLabel = (key: string) =>
  key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function ThemesClient({ initialThemes }: { initialThemes: Theme[] }) {
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const supabase = createClient();

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setThumbnailFile(null);
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleEditClick = (theme: Theme) => {
    setFormData({
      id: theme.id,
      slug: theme.slug,
      component_key: theme.component_key || theme.slug,
      name: theme.name,
      category: theme.category,
      is_premium: theme.is_premium,
      colors_primary: theme.colors?.primary || "#0F172A",
    });
    setIsEditing(theme.id);
    setIsAdding(true);
    setThumbnailFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    const slug = formData.slug.trim().toLowerCase();
    const name = formData.name.trim();
    const componentKey = formData.component_key.trim();

    if (!name) throw new Error("Nama tema wajib diisi.");
    if (!slug || !SLUG_PATTERN.test(slug)) {
      throw new Error("Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.");
    }
    if (!componentKey || !themesConfig[componentKey]) {
      throw new Error("Renderer tema tidak valid atau belum terdaftar di registry.");
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(formData.colors_primary)) {
      throw new Error("Warna utama harus berupa HEX valid, contoh #0F172A.");
    }

    return { slug, name, componentKey };
  };

  const handleThumbnailChange = (file: File | null) => {
    if (!file) {
      setThumbnailFile(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("Thumbnail harus berupa JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      alert("Ukuran thumbnail maksimal 2 MB.");
      return;
    }

    setThumbnailFile(file);
  };

  const uploadThumbnail = async (file: File, themeSlug: string) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${themeSlug}-${crypto.randomUUID()}.${extension}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("themes")
      .upload(filePath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("themes").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { slug, name, componentKey } = validateForm();

      if (!isEditing && !thumbnailFile) {
        throw new Error("Pilih thumbnail tema terlebih dahulu.");
      }

      let thumbnailUrl = "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile, slug);
      } else if (isEditing) {
        thumbnailUrl = themes.find((theme) => theme.id === isEditing)?.thumbnail_url || "";
      }

      const existingTheme = isEditing
        ? themes.find((theme) => theme.id === isEditing)
        : null;

      const themeData = {
        name,
        slug,
        component_key: componentKey,
        category: formData.category,
        thumbnail_url: thumbnailUrl || null,
        is_premium: formData.is_premium,
        is_active: existingTheme?.is_active ?? true,
        colors: {
          primary: formData.colors_primary,
          secondary: existingTheme?.colors?.secondary || "#FFFFFF",
          accent: existingTheme?.colors?.accent || "#000000",
          background: existingTheme?.colors?.background || "#FFFFFF",
        },
      };

      if (isEditing) {
        const { data: updatedTheme, error: updateError } = await supabase
          .from("themes")
          .update(themeData)
          .eq("id", isEditing)
          .select("*")
          .single();

        if (updateError) throw updateError;
        setThemes((current) => current.map((theme) => (theme.id === isEditing ? updatedTheme as Theme : theme)));
      } else {
        const { data: createdTheme, error: insertError } = await supabase
          .from("themes")
          .insert(themeData)
          .select("*")
          .single();

        if (insertError) throw insertError;
        setThemes((current) => [createdTheme as Theme, ...current]);
      }

      resetForm();
    } catch (err: any) {
      alert("Gagal menyimpan tema: " + (err.message || "Terjadi kesalahan."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Nonaktifkan tema ini? Tema akan disembunyikan dari katalog publik, tetapi tetap aman untuk undangan yang sudah menggunakannya.")) return;

    try {
      const { data: updatedTheme, error: updateError } = await supabase
        .from("themes")
        .update({ is_active: false })
        .eq("id", id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      setThemes((current) => current.map((theme) => (theme.id === id ? updatedTheme as Theme : theme)));
    } catch (err: any) {
      alert("Gagal menonaktifkan tema: " + (err.message || "Terjadi kesalahan."));
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { data: updatedTheme, error: updateError } = await supabase
        .from("themes")
        .update({ is_active: true })
        .eq("id", id)
        .select("*")
        .single();

      if (updateError) throw updateError;
      setThemes((current) => current.map((theme) => (theme.id === id ? updatedTheme as Theme : theme)));
    } catch (err: any) {
      alert("Gagal mengaktifkan tema: " + (err.message || "Terjadi kesalahan."));
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">Katalog Tema</h2>
        </div>
        <button
          onClick={() => (isAdding ? resetForm() : setIsAdding(true))}
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> {isAdding ? "Batal" : "Tambah Tema"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="mb-12 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-medium text-slate-900 dark:text-white tracking-tight text-lg mb-6">
            {isEditing ? "Edit Tema" : "Parameter Tema Baru"}
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">ID Database</label>
              <input
                type="text"
                value={isEditing ? formData.id : "Otomatis oleh database (UUID)"}
                readOnly
                disabled
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-500 rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Slug Tema</label>
              <input
                type="text"
                required
                disabled={!!isEditing}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none disabled:opacity-50"
                placeholder="misal: rustic-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Renderer Tema</label>
              <select
                value={formData.component_key}
                onChange={(e) => setFormData({ ...formData, component_key: e.target.value })}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none"
              >
                {RENDERER_OPTIONS.map((key) => (
                  <option key={key} value={key}>{formatRendererLabel(key)}</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Renderer harus sudah terdaftar di <code>lib/themes/registry.tsx</code>.</p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Nama Tema</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none"
              >
                <option value="minimalis">Minimalis</option>
                <option value="floral">Floral / Bunga</option>
                <option value="elegan">Elegan</option>
                <option value="romantic">Romantic</option>
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
                  onChange={(e) => setFormData({ ...formData, colors_primary: e.target.value })}
                  className="w-8 h-8 cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  required
                  value={formData.colors_primary}
                  onChange={(e) => setFormData({ ...formData, colors_primary: e.target.value })}
                  className="flex-1 px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors rounded-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">Jenis Tema</label>
              <label className="flex items-center gap-3 mt-3 cursor-pointer group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${formData.is_premium ? "border-slate-900 bg-slate-900 dark:border-white dark:bg-white" : "border-slate-300 dark:border-slate-600"}`}>
                  {formData.is_premium && <CheckCircle2 className="w-3 h-3 text-white dark:text-slate-900" />}
                </div>
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                  className="hidden"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Tema Premium (Berbayar)</span>
              </label>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500">
                {isEditing ? "Ganti Thumbnail (Opsional)" : "Upload Thumbnail"}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!isEditing}
                onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
                className="w-full px-0 py-2 bg-transparent text-sm text-slate-900 dark:text-slate-200 focus:outline-none file:mr-4 file:py-1.5 file:px-4 file:border file:border-slate-200 dark:file:border-slate-800 file:bg-transparent file:text-xs file:font-mono file:uppercase file:tracking-wider file:text-slate-900 dark:file:text-white hover:file:bg-slate-50 dark:hover:file:bg-slate-900 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP • maksimal 2 MB</p>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? "Simpan Perubahan" : "Simpan Tema Ke Database")}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {themes.map((theme) => (
          <div key={theme.id} className={`group relative ${!theme.is_active ? "opacity-60" : ""}`}>
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
              {!theme.is_active && (
                <div className="absolute bottom-3 left-3 bg-slate-900 text-white text-[9px] font-mono px-2 py-1 uppercase tracking-widest">
                  Nonaktif
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm tracking-tight">{theme.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">{theme.slug}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-mono">Renderer: {theme.component_key || "-"}</p>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{theme.category}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditClick(theme)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                  title="Edit Tema"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {theme.is_active ? (
                  <button
                    onClick={() => handleArchive(theme.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Nonaktifkan Tema"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(theme.id)}
                    className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                    title="Aktifkan Kembali"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
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
