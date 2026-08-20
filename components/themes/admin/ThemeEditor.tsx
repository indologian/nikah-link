"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadThemeEditor, publishThemeDraft, saveThemeDraft, setThemeEnabled } from "@/actions/themes/theme";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import type { Theme } from "@/types";
import { Eye, Save, Upload, Archive, RotateCcw } from "lucide-react";

type ThemeVersion = {
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
  lifecycle_status: string;
};

type Props = {
  theme: Theme | null;
  onClose: () => void;
  onThemeChanged: (theme: Theme) => void;
};

const CATEGORIES = ["minimalis", "floral", "elegan", "romantic", "dark", "budaya"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;

export default function ThemeEditor({ theme, onClose, onThemeChanged }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [editor, setEditor] = useState<Awaited<ReturnType<typeof loadThemeEditor>>>(null);
  const [form, setForm] = useState({ name: "", category: "minimalis", isPremium: false, colors: normalizeThemeColors(undefined) });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    if (!theme) return;
    loadThemeEditor(theme.id).then((data) => {
      if (!active) return;
      setEditor(data);
      const source = data?.draft ?? data?.published;
      setForm({
        name: theme.name,
        category: theme.category,
        isPremium: theme.is_premium,
        colors: normalizeThemeColors(source?.colors ?? theme.colors),
      });
      setMessage("");
    }).catch((error) => active && setMessage(error instanceof Error ? error.message : "Gagal memuat editor."));
    return () => { active = false; };
  }, [theme]);

  if (!theme) return null;

  const version = editor?.draft ?? editor?.published ?? null;
  const runtime = version ? resolveRuntimeTheme(theme, version) : resolveRuntimeTheme(theme, null);
  const previewUrl = `/admin/themes/preview/${encodeURIComponent(theme.slug)}${version ? `?version=${encodeURIComponent(version.id)}` : ""}`;

  const uploadThumbnail = async (file: File) => {
    if (!IMAGE_TYPES.includes(file.type)) throw new Error("Thumbnail harus JPG, PNG, atau WEBP.");
    if (file.size > MAX_THUMBNAIL_SIZE) throw new Error("Ukuran thumbnail maksimal 2 MB.");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `thumbnails/${theme.slug}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("themes").upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });
    if (error) throw error;
    return supabase.storage.from("themes").getPublicUrl(path).data.publicUrl;
  };

  const handleSave = async () => {
    if (!version || busy) return;
    setBusy(true);
    setMessage("");
    let uploadedUrl: string | null = null;
    try {
      if (thumbnailFile) uploadedUrl = await uploadThumbnail(thumbnailFile);
      const draft = await saveThemeDraft({
        themeId: theme.id,
        versionId: editor?.draft?.id ?? null,
        componentKey: theme.component_key,
        name: form.name,
        category: form.category,
        isPremium: form.isPremium,
        thumbnailUrl: uploadedUrl ?? theme.thumbnail_url ?? null,
        config: version.config ?? {},
        fieldsSchema: version.fields_schema ?? [],
        colors: form.colors,
        assets: version.assets ?? {},
      });
      const data = await loadThemeEditor(theme.id);
      setEditor(data);
      if (data?.theme) onThemeChanged(data.theme as Theme);
      setThumbnailFile(null);
      setMessage(`Draft versi ${(draft as ThemeVersion | null)?.version ?? data?.draft?.version ?? version.version} tersimpan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan draft.");
    } finally {
      setBusy(false);
    }
  };

  const handlePublish = async () => {
    if (!editor?.draft || busy) return;
    setBusy(true);
    setMessage("");
    try {
      await publishThemeDraft(editor.draft.id);
      const data = await loadThemeEditor(theme.id);
      setEditor(data);
      if (data?.theme) onThemeChanged(data.theme as Theme);
      setMessage(`Versi ${data?.published?.version ?? editor.draft.version} berhasil dipublish.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mempublish draft.");
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (active: boolean) => {
    setBusy(true);
    try {
      const updated = await setThemeEnabled(theme.id, active);
      onThemeChanged(updated as Theme);
      setMessage(active ? "Tema diaktifkan." : "Tema diarsipkan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengubah status tema.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Theme Editor</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{theme.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{theme.slug} · {theme.component_key}</p>
          </div>
          <button onClick={onClose} className="text-xs font-semibold text-slate-500 underline underline-offset-4">Tutup</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Nama
            <input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2.5 text-sm dark:border-slate-700 dark:text-white" />
          </label>
          <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Kategori
            <select value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))} className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2.5 text-sm dark:border-slate-700 dark:text-white">
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm((v) => ({ ...v, isPremium: e.target.checked }))} /> Tema Premium
        </label>

        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Theme Tokens</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(form.colors) as Array<keyof ThemeColors>).map((key) => (
              <label key={key} className="space-y-2 text-xs font-semibold capitalize text-slate-600 dark:text-slate-300">
                {key}
                <input type="color" value={form.colors[key]} onChange={(e) => setForm((v) => ({ ...v, colors: { ...v.colors, [key]: e.target.value } }))} className="h-10 w-full cursor-pointer rounded border border-slate-300 bg-transparent p-1 dark:border-slate-700" />
              </label>
            ))}
          </div>
        </div>

        <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Thumbnail
          <input type="file" accept={IMAGE_TYPES.join(",")} onChange={(e: ChangeEvent<HTMLInputElement>) => setThumbnailFile(e.target.files?.[0] ?? null)} className="block w-full rounded-md border border-slate-300 px-3 py-2 text-xs dark:border-slate-700 dark:text-slate-300" />
        </label>

        {message && <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">{message}</div>}

        <div className="flex flex-wrap gap-3">
          <button disabled={busy || !version} onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-white dark:text-slate-900"><Save className="h-4 w-4" /> Simpan Draft</button>
          <button disabled={busy || !editor?.draft} onClick={handlePublish} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200">Publish</button>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:text-slate-200"><Eye className="h-4 w-4" /> Preview</a>
          {theme.is_active ? (
            <button disabled={busy} onClick={() => toggleActive(false)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"><Archive className="h-4 w-4" /> Arsipkan</button>
          ) : (
            <button disabled={busy} onClick={() => toggleActive(true)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"><RotateCcw className="h-4 w-4" /> Aktifkan</button>
          )}
        </div>
      </div>

      <aside className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Version State</div>
        <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex items-center justify-between"><span>Published</span><strong>{editor?.published ? `v${editor.published.version}` : "—"}</strong></div>
          <div className="flex items-center justify-between"><span>Draft</span><strong>{editor?.draft ? `v${editor.draft.version}` : "—"}</strong></div>
          <div className="flex items-center justify-between"><span>Renderer</span><strong className="font-mono text-xs">{runtime.componentKey}</strong></div>
          <div className="flex items-center justify-between"><span>Status</span><strong>{theme.is_active ? "active" : "archived"}</strong></div>
        </div>
        <div className="mt-6 text-xs leading-5 text-slate-500">Perubahan editor selalu masuk ke draft. Public demo menggunakan versi published; admin preview dapat membuka versi tertentu.</div>
      </aside>
    </div>
  );
}
