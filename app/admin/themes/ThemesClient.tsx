"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Theme } from "@/types";
import { themesConfig } from "@/lib/themes/registry";
import { normalizeThemeColors, type ThemeColors } from "./theme-config";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  ExternalLink,
} from "lucide-react";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
const RENDERER_OPTIONS = Object.keys(themesConfig);

const DEFAULT_COLORS: ThemeColors = normalizeThemeColors(undefined);

const DEFAULT_FORM = {
  id: "",
  slug: "",
  component_key: "minimalis",
  name: "",
  category: "minimalis",
  is_premium: false,
  is_active: true,
  colors: DEFAULT_COLORS,
};

const COLOR_FIELDS: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
];

const formatRendererLabel = (key: string) =>
  key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

function buildPreviewInvitation(colors: ThemeColors, customData: Record<string, unknown>) {
  return {
    id: "admin-theme-preview",
    username: "theme-preview",
    bride_name: "Juliet Capulet",
    groom_name: "Romeo Montague",
    bride_nickname: "Juliet",
    groom_nickname: "Romeo",
    bride_photo_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    groom_photo_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    akad_date: "2026-10-24",
    akad_time: "08:00 WIB",
    akad_venue: "Masjid Agung Kota",
    akad_address: "Jl. Cinta Abadi No. 1",
    akad_maps_url: "https://maps.google.com",
    reception_date: "2026-10-24",
    reception_time: "11:00 - 14:00 WIB",
    reception_venue: "Gedung Serbaguna",
    reception_address: "Jl. Cinta Abadi No. 2",
    reception_maps_url: "https://maps.google.com",
    music_url:
      "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-115207.mp3",
    cover_image_url:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    custom_message: "Preview tema undangan digital.",
    love_story: "Preview tema NikahLink.",
    is_published: true,
    show_rsvp: true,
    show_gift: true,
    show_gallery: true,
    show_wishes: true,
    custom_data: customData,
    theme_colors: colors,
  };
}

export default function ThemesClient({ initialThemes }: { initialThemes: Theme[] }) {
  const supabase = createClient();
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(DEFAULT_FORM);

  const selectedConfig = useMemo(
    () => themesConfig[formData.component_key] || themesConfig.minimalis,
    [formData.component_key]
  );
  const PreviewComponent = selectedConfig.component;
  const previewInvitation = useMemo(() => {
    const customData = Object.fromEntries(
      selectedConfig.fields.map((field) => [
        field.name,
        field.type === "image"
          ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
          : field.defaultValue ?? "",
      ])
    );
    return buildPreviewInvitation(formData.colors, customData);
  }, [formData.colors, selectedConfig]);

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setThumbnailFile(null);
    setError("");
    setEditingId(null);
    setIsOpen(false);
  };

  const handleAdd = () => {
    setFormData(DEFAULT_FORM);
    setThumbnailFile(null);
    setError("");
    setEditingId(null);
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = (theme: Theme) => {
    setFormData({
      id: theme.id,
      slug: theme.slug,
      component_key: theme.component_key || theme.slug,
      name: theme.name,
      category: theme.category,
      is_premium: theme.is_premium,
      is_active: theme.is_active,
      colors: normalizeThemeColors(theme.colors),
    });
    setThumbnailFile(null);
    setError("");
    setEditingId(theme.id);
    setIsOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateForm = () => {
    const slug = formData.slug.trim().toLowerCase();
    const name = formData.name.trim();

    if (!name) throw new Error("Nama tema wajib diisi.");
    if (!slug || !SLUG_PATTERN.test(slug)) {
      throw new Error("Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.");
    }
    if (!themesConfig[formData.component_key]) {
      throw new Error("Renderer tema tidak valid atau belum terdaftar di registry.");
    }

    return { slug, name };
  };

  const handleThumbnailChange = (file: File | null) => {
    if (!file) {
      setThumbnailFile(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Thumbnail harus berupa JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setError("Ukuran thumbnail maksimal 2 MB.");
      return;
    }
    setError("");
    setThumbnailFile(file);
  };

  const uploadThumbnail = async (file: File, slug: string) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filePath = `thumbnails/${slug}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("themes").upload(filePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) throw uploadError;

    return supabase.storage.from("themes").getPublicUrl(filePath).data.publicUrl;
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      const { slug, name } = validateForm();
      if (!editingId && !thumbnailFile) {
        throw new Error("Pilih thumbnail tema terlebih dahulu.");
      }

      let thumbnailUrl = "";
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile, slug);
      } else if (editingId) {
        thumbnailUrl = themes.find((theme) => theme.id === editingId)?.thumbnail_url || "";
      }

      const existingTheme = editingId ? themes.find((theme) => theme.id === editingId) : null;
      const themeData = {
        name,
        slug,
        component_key: formData.component_key,
        category: formData.category,
        thumbnail_url: thumbnailUrl || null,
        is_premium: formData.is_premium,
        is_active: existingTheme?.is_active ?? true,
        colors: normalizeThemeColors(formData.colors),
      };

      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("themes")
          .update(themeData)
          .eq("id", editingId)
          .select("*")
          .single();
        if (updateError) throw updateError;
        setThemes((current) => current.map((theme) => (theme.id === editingId ? (data as Theme) : theme)));
      } else {
        const { data, error: insertError } = await supabase
          .from("themes")
          .insert(themeData)
          .select("*")
          .single();
        if (insertError) throw insertError;
        setThemes((current) => [data as Theme, ...current]);
      }

      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setFormData((current) => ({
      ...current,
      colors: { ...current.colors, [key]: value },
    }));
  };

  const handleArchive = async (id: string) => {
    if (!confirm("Nonaktifkan tema ini? Tema akan disembunyikan dari katalog publik, tetapi tetap aman untuk undangan yang sudah menggunakannya.")) return;
    try {
      const { data, error: updateError } = await supabase
        .from("themes")
        .update({ is_active: false })
        .eq("id", id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      setThemes((current) => current.map((theme) => (theme.id === id ? (data as Theme) : theme)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      alert("Gagal menonaktifkan tema: " + message);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from("themes")
        .update({ is_active: true })
        .eq("id", id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      setThemes((current) => current.map((theme) => (theme.id === id ? (data as Theme) : theme)));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      alert("Gagal mengaktifkan tema: " + message);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">Katalog Tema</h2>
          <p className="text-xs text-slate-500 mt-1">Kelola metadata, renderer, warna, thumbnail, dan status tema.</p>
        </div>
        <button
          onClick={() => (isOpen ? resetForm() : handleAdd())}
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> {isOpen ? "Batal" : "Tambah Tema"}
        </button>
      </div>

      {isOpen && (
        <div className="mb-12 grid xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)] gap-8 items-start">
          <form onSubmit={handleSave} className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white tracking-tight text-lg">
                {editingId ? "Edit Tema" : "Parameter Tema Baru"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Perubahan warna akan terlihat langsung di panel preview.</p>
            </div>

            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <label className="space-y-1">
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">ID Database</span>
                <input
                  type="text"
                  value={editingId ? formData.id : "Otomatis oleh database (UUID)"}
                  readOnly
                  disabled
                  className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-500"
                />
              </label>

              <label className="space-y-1">
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Slug Tema</span>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingId)}
                  value={formData.slug}
                  onChange={(e) => setFormData((current) => ({ ...current, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                  placeholder="rustic-gold"
                  className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 disabled:opacity-50"
                />
              </label>

              <label className="space-y-1">
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Renderer Tema</span>
                <select
                  value={formData.component_key}
                  onChange={(e) => setFormData((current) => ({ ...current, component_key: e.target.value }))}
                  className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200"
                >
                  {RENDERER_OPTIONS.map((key) => (
                    <option key={key} value={key}>{formatRendererLabel(key)}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Nama Tema</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))}
                  className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200"
                />
              </label>

              <label className="space-y-1">
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500">Kategori</span>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))}
                  className="w-full px-0 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200"
                >
                  <option value="minimalis">Minimalis</option>
                  <option value="floral">Floral / Bunga</option>
                  <option value="elegan">Elegan</option>
                  <option value="romantic">Romantic</option>
                  <option value="dark">Dark / Mewah</option>
                  <option value="budaya">Adat / Budaya</option>
                </select>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500">Theme Colors</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Token ini diteruskan ke renderer melalui <code>theme_colors</code>.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData((current) => ({ ...current, colors: { ...DEFAULT_COLORS } }))}
                  className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Reset Warna
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {COLOR_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 rounded-md border border-slate-200 dark:border-slate-800 px-3 py-2">
                    <input
                      type="color"
                      value={formData.colors[key]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="h-9 w-9 cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-medium text-slate-700 dark:text-slate-200">{label}</span>
                      <input
                        type="text"
                        value={formData.colors[key]}
                        onChange={(e) => updateColor(key, e.target.value)}
                        className="w-full bg-transparent text-xs font-mono text-slate-500 focus:outline-none"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Jenis Tema</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData((current) => ({ ...current, is_premium: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Tema Premium</span>
                </label>
              </div>

              <div>
                <span className="block text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">Thumbnail</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required={!editingId}
                  onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:rounded file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP • maksimal 2 MB</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4">
              {editingId && (
                <a
                  href={`/admin/themes/preview/${encodeURIComponent(formData.slug)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  <ExternalLink className="w-4 h-4" /> Preview Tersimpan
                </a>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {editingId ? "Simpan Perubahan" : "Simpan Tema"}
              </button>
            </div>
          </form>

          <section className="sticky top-6 rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Live Preview</div>
                <div className="text-[10px] text-slate-500">{formatRendererLabel(formData.component_key)}</div>
              </div>
              <Eye className="w-4 h-4 text-slate-400" />
            </div>
            <div className="h-[720px] overflow-auto bg-white">
              <PreviewComponent
                invitation={previewInvitation}
                guestName="Tamu Preview"
                initialWishes={[]}
                giftAccounts={[]}
                isFreePlan={false}
                expiresAt={null}
                customData={previewInvitation.custom_data}
              />
            </div>
          </section>
        </div>
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
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-medium text-slate-900 dark:text-white text-sm tracking-tight truncate">{theme.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">{theme.slug}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono truncate">Renderer: {theme.component_key || "-"}</p>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{theme.category}</p>
              </div>
              <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditClick(theme)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
                  title="Edit Tema"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {theme.is_active ? (
                  <button
                    onClick={() => handleArchive(theme.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Nonaktifkan Tema"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(theme.id)}
                    className="text-slate-400 hover:text-emerald-600 p-1"
                    title="Aktifkan Kembali"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {themes.length === 0 && !isOpen && (
          <div className="col-span-full py-12 text-center text-slate-500">
            Belum ada tema. Klik "Tambah Tema" untuk mulai.
          </div>
        )}
      </div>
    </div>
  );
}
