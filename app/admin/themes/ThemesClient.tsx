"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Theme } from "@/types";
import { themesConfig } from "@/lib/themes/registry";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";
import { Eye, ExternalLink, Loader2, Plus, Save, CheckCircle2, Trash2, Edit2, Image as ImageIcon } from "lucide-react";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
const DEFAULT_COLORS = normalizeThemeColors(undefined);
const RENDERERS = Object.keys(themesConfig);
const CATEGORIES = ["minimalis", "floral", "elegan", "romantic", "dark", "budaya"];

type ThemeVersionRecord = {
  id: string;
  theme_id: string;
  version: number;
  component_key: string;
  config: unknown;
  fields_schema: unknown;
  colors: unknown;
  assets: unknown;
  fields_schema_authoritative: boolean;
  is_published: boolean;
  lifecycle_status: "draft" | "published" | "archived" | string;
};

type FormState = {
  id: string;
  slug: string;
  component_key: string;
  name: string;
  category: string;
  is_premium: boolean;
  is_active: boolean;
  colors: ThemeColors;
};

const DEFAULT_FORM: FormState = {
  id: "",
  slug: "",
  component_key: "minimalis",
  name: "",
  category: "minimalis",
  is_premium: false,
  is_active: true,
  colors: DEFAULT_COLORS,
};

function previewInvitation(colors: ThemeColors, fields: any[]) {
  return {
    id: "admin-theme-preview",
    username: "theme-preview",
    bride_name: "Juliet Capulet",
    groom_name: "Romeo Montague",
    bride_nickname: "Juliet",
    groom_nickname: "Romeo",
    bride_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    groom_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
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
    music_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-115207.mp3",
    cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    custom_message: "Preview tema undangan digital.",
    love_story: "Preview tema NikahLink.",
    is_published: true,
    show_rsvp: true,
    show_gift: true,
    show_gallery: true,
    show_wishes: true,
    custom_data: Object.fromEntries((fields || []).map((field: any) => [field.name, field.type === "image" ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop" : field.defaultValue ?? ""])),
    theme_colors: colors,
  };
}

export default function ThemesClient({ initialThemes }: { initialThemes: Theme[] }) {
  const supabase = createClient();
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [draftVersion, setDraftVersion] = useState<ThemeVersionRecord | null>(null);
  const [savedVersion, setSavedVersion] = useState<ThemeVersionRecord | null>(null);
  const [error, setError] = useState("");

  const selectedConfig = useMemo(() => themesConfig[form.component_key] || themesConfig.minimalis, [form.component_key]);
  const PreviewComponent = selectedConfig.component;
  const preview = useMemo(() => previewInvitation(form.colors, selectedConfig.fields), [form.colors, selectedConfig.fields]);

  const reset = () => {
    setForm(DEFAULT_FORM);
    setThumbnailFile(null);
    setDraftVersion(null);
    setSavedVersion(null);
    setError("");
    setIsOpen(false);
  };

  const loadVersions = async (themeId: string) => {
    const { data, error: versionError } = await supabase
      .from("theme_versions")
      .select("id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status")
      .eq("theme_id", themeId)
      .order("version", { ascending: false });
    if (versionError) throw versionError;
    const rows = (data || []) as ThemeVersionRecord[];
    const draft = rows.find((row) => row.lifecycle_status === "draft" && !row.is_published) || null;
    const published = rows.find((row) => row.lifecycle_status === "published" && row.is_published) || null;
    setDraftVersion(draft);
    setSavedVersion(published);
    if (draft?.colors) setForm((current) => ({ ...current, colors: normalizeThemeColors(draft.colors) }));
    return { draft, published };
  };

  const editTheme = async (theme: Theme) => {
    setError("");
    setIsOpen(true);
    setForm({
      id: theme.id,
      slug: theme.slug,
      component_key: theme.component_key || theme.slug,
      name: theme.name,
      category: theme.category,
      is_premium: theme.is_premium,
      is_active: theme.is_active,
      colors: normalizeThemeColors(theme.colors),
    });
    try {
      await loadVersions(theme.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat versi tema.");
    }
  };

  const addTheme = () => {
    setForm(DEFAULT_FORM);
    setThumbnailFile(null);
    setDraftVersion(null);
    setSavedVersion(null);
    setError("");
    setIsOpen(true);
  };

  const uploadThumbnail = async (file: File, slug: string) => {
    if (!IMAGE_TYPES.includes(file.type)) throw new Error("Thumbnail harus JPG, PNG, atau WEBP.");
    if (file.size > MAX_THUMBNAIL_SIZE) throw new Error("Ukuran thumbnail maksimal 2 MB.");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `thumbnails/${slug}-${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("themes").upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    return supabase.storage.from("themes").getPublicUrl(path).data.publicUrl;
  };

  const saveTheme = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const slug = form.slug.trim().toLowerCase();
      const name = form.name.trim();
      if (!name) throw new Error("Nama tema wajib diisi.");
      if (!SLUG_PATTERN.test(slug)) throw new Error("Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.");
      if (!themesConfig[form.component_key]) throw new Error("Renderer tema tidak valid.");

      const thumbnailUrl = thumbnailFile ? await uploadThumbnail(thumbnailFile, slug) : null;
      if (!form.id) {
        if (!thumbnailUrl) throw new Error("Pilih thumbnail tema terlebih dahulu.");
        const { data, error: rpcError } = await supabase.rpc("create_theme_draft", {
          p_name: name,
          p_slug: slug,
          p_category: form.category,
          p_component_key: form.component_key,
          p_is_premium: form.is_premium,
          p_thumbnail_url: thumbnailUrl,
          p_colors: normalizeThemeColors(form.colors),
          p_config: {},
          p_fields_schema: selectedConfig.fields,
          p_assets: {},
        });
        if (rpcError) throw rpcError;
        const created = data as Theme;
        setThemes((current) => [created, ...current]);
        setForm((current) => ({ ...current, id: created.id, is_active: false }));
        await loadVersions(created.id);
        setError("Tema dibuat sebagai draft. Review preview lalu tekan Publish.");
        return;
      }

      const existing = themes.find((theme) => theme.id === form.id);
      const metadata = {
        name,
        category: form.category,
        thumbnail_url: thumbnailUrl ?? existing?.thumbnail_url ?? null,
        is_premium: form.is_premium,
      };
      const { data: updated, error: updateError } = await supabase.from("themes").update(metadata).eq("id", form.id).select("*").single();
      if (updateError) throw updateError;
      setThemes((current) => current.map((theme) => (theme.id === form.id ? (updated as Theme) : theme)));

      const versionState = await loadVersions(form.id);
      const published = versionState.published;
      const source = versionState.draft || published;
      const componentKey = existing?.component_key || form.component_key;
      const fieldsSchema = versionState.draft?.fields_schema ?? published?.fields_schema ?? selectedConfig.fields;
      const config = versionState.draft?.config ?? published?.config ?? {};
      const assets = versionState.draft?.assets ?? published?.assets ?? {};
      const colors = normalizeThemeColors(form.colors);

      if (versionState.draft) {
        const { data: updatedDraft, error: draftError } = await supabase.rpc("update_theme_draft", {
          p_version_id: versionState.draft.id,
          p_component_key: versionState.draft.component_key,
          p_config: config,
          p_fields_schema: fieldsSchema,
          p_colors: colors,
          p_assets: assets,
        });
        if (draftError) throw draftError;
        setDraftVersion(updatedDraft as ThemeVersionRecord);
      } else {
        const { data: createdDraft, error: draftError } = await supabase.rpc("create_theme_version_draft", {
          p_theme_id: form.id,
          p_component_key: componentKey,
          p_config: config,
          p_fields_schema: fieldsSchema,
          p_colors: colors,
          p_assets: assets,
        });
        if (draftError) throw draftError;
        setDraftVersion(createdDraft as ThemeVersionRecord);
      }
      setError("Perubahan disimpan sebagai draft dan belum dipublish.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tema.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const publishDraft = async () => {
    if (!draftVersion || isPublishing) return;
    setIsPublishing(true);
    setError("");
    try {
      const { data, error: rpcError } = await supabase.rpc("publish_theme_version", { p_version_id: draftVersion.id });
      if (rpcError) throw rpcError;
      const published = data as ThemeVersionRecord;
      const { data: activated, error: activationError } = await supabase.from("themes").update({ is_active: true }).eq("id", form.id).select("*").single();
      if (activationError) throw activationError;
      setThemes((current) => current.map((theme) => (theme.id === form.id ? (activated as Theme) : theme)));
      setSavedVersion(published);
      setDraftVersion(null);
      setForm((current) => ({ ...current, colors: normalizeThemeColors(published.colors), is_active: true }));
      setError(`Versi ${published.version} berhasil dipublish.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mempublish draft.");
    } finally {
      setIsPublishing(false);
    }
  };

  const archiveTheme = async (id: string) => {
    if (!confirm("Nonaktifkan tema ini? Tema akan hilang dari katalog publik tetapi aman untuk undangan yang sudah menggunakannya.")) return;
    const { data, error: updateError } = await supabase.from("themes").update({ is_active: false }).eq("id", id).select("*").single();
    if (updateError) return alert(updateError.message);
    setThemes((current) => current.map((theme) => (theme.id === id ? (data as Theme) : theme)));
  };

  const restoreTheme = async (id: string) => {
    const { data, error: updateError } = await supabase.from("themes").update({ is_active: true }).eq("id", id).select("*").single();
    if (updateError) return alert(updateError.message);
    setThemes((current) => current.map((theme) => (theme.id === id ? (data as Theme) : theme)));
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
        <div><h2 className="text-lg font-medium text-slate-900 dark:text-white">Katalog Tema</h2><p className="mt-1 text-xs text-slate-500">Theme lifecycle: Draft → Preview → Publish.</p></div>
        <button onClick={isOpen ? reset : addTheme} className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-slate-900"><Plus className="h-4 w-4" />{isOpen ? "Batal" : "Tambah Tema"}</button>
      </div>

      {isOpen && (
        <div className="mb-12 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <form onSubmit={saveTheme} className="space-y-6 border-t border-slate-200 pt-6 dark:border-slate-800">
            {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">{error}</div>}
            <div className="grid gap-6 md:grid-cols-2">
              <label><span className="label">Slug</span><input disabled={Boolean(form.id)} value={form.slug} onChange={(e)=>setForm((c)=>({...c,slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"")}))} required className="field" /></label>
              <label><span className="label">Nama</span><input value={form.name} onChange={(e)=>setForm((c)=>({...c,name:e.target.value}))} required className="field" /></label>
              <label><span className="label">Renderer</span><select disabled={Boolean(form.id)} value={form.component_key} onChange={(e)=>setForm((c)=>({...c,component_key:e.target.value}))} className="field">{RENDERERS.map((key)=><option key={key} value={key}>{key}</option>)}</select></label>
              <label><span className="label">Kategori</span><select value={form.category} onChange={(e)=>setForm((c)=>({...c,category:e.target.value}))} className="field">{CATEGORIES.map((key)=><option key={key} value={key}>{key}</option>)}</select></label>
              <label className="md:col-span-2 flex items-center gap-3"><input type="checkbox" checked={form.is_premium} onChange={(e)=>setForm((c)=>({...c,is_premium:e.target.checked}))} /><span className="text-sm">Tema Premium</span></label>
              <label className="md:col-span-2"><span className="label">Thumbnail</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>setThumbnailFile(e.target.files?.[0] || null)} className="text-xs" /><span className="mt-1 block text-[10px] text-slate-400">JPG, PNG, WEBP · maksimal 2 MB</span></label>
            </div>

            <div><div className="mb-3 flex items-center justify-between"><span className="label">Theme Colors</span><button type="button" onClick={()=>setForm((c)=>({...c,colors:DEFAULT_COLORS}))} className="text-[10px] font-mono uppercase text-slate-500">Reset</button></div><div className="grid gap-3 sm:grid-cols-2">{Object.entries(form.colors).map(([key,value])=><label key={key} className="flex items-center gap-3 rounded border border-slate-200 p-3 dark:border-slate-800"><input type="color" value={value} onChange={(e)=>setForm((c)=>({...c,colors:{...c.colors,[key]:e.target.value}}))} /><span className="text-xs font-mono">{key}</span><input value={value} onChange={(e)=>setForm((c)=>({...c,colors:{...c.colors,[key]:e.target.value}}))} className="min-w-0 flex-1 bg-transparent font-mono text-xs" /></label>)}</div></div>

            <div className="flex flex-wrap justify-end gap-3">
              {form.id && savedVersion && <a href={`/admin/themes/preview/${encodeURIComponent(form.slug)}?version=${savedVersion.id}`} target="_blank" rel="noreferrer" className="btn-secondary"><ExternalLink className="h-4 w-4" /> Preview Published v{savedVersion.version}</a>}
              {draftVersion && <a href={`/admin/themes/preview/${encodeURIComponent(form.slug)}?version=${draftVersion.id}`} target="_blank" rel="noreferrer" className="btn-secondary"><Eye className="h-4 w-4" /> Preview Draft v{draftVersion.version}</a>}
              <button type="submit" disabled={isSubmitting} className="btn-primary"><Save className="h-4 w-4" />{isSubmitting ? "Menyimpan..." : form.id ? "Simpan Draft" : "Buat Draft"}</button>
              {draftVersion && <button type="button" disabled={isPublishing} onClick={publishDraft} className="btn-primary"><CheckCircle2 className="h-4 w-4" />{isPublishing ? "Publishing..." : `Publish v${draftVersion.version}`}</button>}
            </div>
          </form>

          <section className="sticky top-6 overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"><div className="border-b border-slate-200 px-4 py-3 text-xs font-semibold dark:border-slate-800">Live Preview · {form.id ? (draftVersion ? `Draft v${draftVersion.version}` : savedVersion ? `Published v${savedVersion.version}` : "Unsaved") : "New Draft"}</div><div className="h-[720px] overflow-auto"><PreviewComponent invitation={preview} guestName="Tamu Preview" initialWishes={[]} giftAccounts={[]} isFreePlan={false} expiresAt={null} customData={preview.custom_data} /></div></section>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">{themes.map((theme)=><div key={theme.id} className={`group ${!theme.is_active ? "opacity-60" : ""}`}><div className="relative mb-3 aspect-[3/4] overflow-hidden border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">{theme.thumbnail_url?<img src={theme.thumbnail_url} alt={theme.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/>:<div className="flex h-full items-center justify-center"><ImageIcon className="h-6 w-6 text-slate-400"/></div>}{theme.is_premium&&<div className="absolute left-3 top-3 bg-white px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-slate-900">Premium</div>}{!theme.is_active&&<div className="absolute bottom-3 left-3 bg-slate-900 px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-white">Nonaktif</div>}</div><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-medium text-slate-900 dark:text-white">{theme.name}</h3><p className="truncate font-mono text-xs text-slate-500">{theme.slug}</p><p className="truncate font-mono text-[11px] text-slate-500">Renderer: {theme.component_key}</p></div><div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"><button onClick={()=>editTheme(theme)} title="Edit"><Edit2 className="h-4 w-4"/></button>{theme.is_active?<button onClick={()=>archiveTheme(theme.id)} title="Nonaktifkan"><Trash2 className="h-4 w-4 text-rose-600"/></button>:<button onClick={()=>restoreTheme(theme.id)} title="Aktifkan"><CheckCircle2 className="h-4 w-4 text-emerald-600"/></button>}</div></div></div>)}</div>

      <style jsx>{`.label{display:block;margin-bottom:.35rem;font-size:.65rem;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;letter-spacing:.08em;color:#64748b}.field{width:100%;background:transparent;border-bottom:1px solid #e2e8f0;padding:.5rem 0;font-size:.875rem;outline:none}.btn-primary{display:inline-flex;align-items:center;gap:.5rem;background:#0f172a;color:#fff;padding:.625rem 1rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.btn-secondary{display:inline-flex;align-items:center;gap:.5rem;border:1px solid #e2e8f0;padding:.625rem 1rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}`}</style>
    </div>
  );
}
