"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Theme } from "@/types";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { Archive, CheckCircle2, Edit2, Eye, ExternalLink, RotateCcw, Save } from "lucide-react";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
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
  lifecycle_status: string;
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
  component_key: "",
  name: "",
  category: "minimalis",
  is_premium: false,
  is_active: true,
  colors: normalizeThemeColors(undefined),
};

function getStoragePath(url: string | null | undefined) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/themes/";
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null;
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
  const [publishedVersion, setPublishedVersion] = useState<ThemeVersionRecord | null>(null);
  const [error, setError] = useState("");

  const previewVersion = draftVersion ?? publishedVersion;
  const previewRuntime = useMemo(
    () => resolveRuntimeTheme(
      { slug: form.slug, component_key: form.component_key, colors: form.colors },
      previewVersion,
    ),
    [form.slug, form.component_key, form.colors, previewVersion],
  );
  const previewUrl = form.slug
    ? `/admin/themes/preview/${encodeURIComponent(form.slug)}${previewVersion ? `?version=${encodeURIComponent(previewVersion.id)}` : ""}`
    : null;

  const reset = () => {
    setForm(DEFAULT_FORM);
    setThumbnailFile(null);
    setDraftVersion(null);
    setPublishedVersion(null);
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
    setPublishedVersion(published);

    if (draft?.colors) {
      setForm((current) => ({ ...current, colors: normalizeThemeColors(draft.colors) }));
    } else if (published?.colors) {
      setForm((current) => ({ ...current, colors: normalizeThemeColors(published.colors) }));
    }

    return { draft, published };
  };

  const editTheme = async (theme: Theme) => {
    setError("");
    setIsOpen(true);
    setForm({
      id: theme.id,
      slug: theme.slug,
      component_key: theme.component_key,
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

  const uploadThumbnail = async (file: File, slug: string) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      throw new Error("Thumbnail harus JPG, PNG, atau WEBP.");
    }
    if (file.size > MAX_THUMBNAIL_SIZE) {
      throw new Error("Ukuran thumbnail maksimal 2 MB.");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `thumbnails/${slug}-${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("themes").upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) throw uploadError;
    return {
      path,
      url: supabase.storage.from("themes").getPublicUrl(path).data.publicUrl,
    };
  };

  const saveTheme = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting || !form.id) return;

    setIsSubmitting(true);
    setError("");
    let uploadedPath: string | null = null;

    try {
      const name = form.name.trim();
      if (!name) throw new Error("Nama tema wajib diisi.");

      const existing = themes.find((theme) => theme.id === form.id);
      if (!existing) throw new Error("Tema tidak ditemukan.");

      const versionState = draftVersion?.theme_id === form.id
        ? { draft: draftVersion, published: publishedVersion }
        : await loadVersions(form.id);

      const source = versionState.draft ?? versionState.published;
      if (!source) throw new Error("Tema belum memiliki versi yang dapat diedit.");

      let versionId = versionState.draft?.id ?? null;
      if (!versionId) {
        const { data: createdDraft, error: draftError } = await supabase.rpc("create_theme_version_draft", {
          p_theme_id: form.id,
          p_component_key: form.component_key,
          p_config: source.config ?? {},
          p_fields_schema: source.fields_schema ?? [],
          p_colors: normalizeThemeColors(form.colors),
          p_assets: source.assets ?? {},
        });

        if (draftError) throw draftError;
        versionId = (createdDraft as ThemeVersionRecord).id;
      }

      const uploaded = thumbnailFile ? await uploadThumbnail(thumbnailFile, form.slug) : null;
      uploadedPath = uploaded?.path ?? null;

      const { data: updatedDraft, error: atomicError } = await supabase.rpc("update_theme_and_draft", {
        p_version_id: versionId,
        p_name: name,
        p_category: form.category,
        p_is_premium: form.is_premium,
        p_thumbnail_url: uploaded?.url ?? existing.thumbnail_url ?? null,
        p_config: source.config ?? {},
        p_fields_schema: source.fields_schema ?? [],
        p_colors: normalizeThemeColors(form.colors),
        p_assets: source.assets ?? {},
      });

      if (atomicError) throw atomicError;

      const { data: refreshedTheme, error: themeError } = await supabase
        .from("themes")
        .select("*")
        .eq("id", form.id)
        .single();
      if (themeError) throw themeError;

      setThemes((current) => current.map((theme) => theme.id === form.id ? refreshedTheme as Theme : theme));

      if (uploadedPath && existing.thumbnail_url) {
        const oldPath = getStoragePath(existing.thumbnail_url);
        if (oldPath && oldPath !== uploadedPath) {
          await supabase.storage.from("themes").remove([oldPath]);
        }
      }

      uploadedPath = null;
      setDraftVersion(updatedDraft as ThemeVersionRecord);
      setError("Perubahan disimpan sebagai draft dan belum dipublish.");
    } catch (err: unknown) {
      if (uploadedPath) {
        await supabase.storage.from("themes").remove([uploadedPath]);
      }
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
      const { data, error: rpcError } = await supabase.rpc("publish_theme_version", {
        p_version_id: draftVersion.id,
      });
      if (rpcError) throw rpcError;

      const published = data as ThemeVersionRecord;
      const { data: refreshedTheme, error: themeError } = await supabase
        .from("themes")
        .select("*")
        .eq("id", form.id)
        .single();
      if (themeError) throw themeError;

      setThemes((current) => current.map((theme) => theme.id === form.id ? refreshedTheme as Theme : theme));
      setPublishedVersion(published);
      setDraftVersion(null);
      setForm((current) => ({
        ...current,
        colors: normalizeThemeColors(published.colors),
        is_active: true,
      }));
      setError(`Versi ${published.version} berhasil dipublish.`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mempublish draft.");
    } finally {
      setIsPublishing(false);
    }
  };

  const archiveTheme = async (id: string) => {
    if (!confirm("Nonaktifkan tema ini? Tema tetap aman untuk undangan lama.")) return;
    const { data, error: updateError } = await supabase
      .from("themes")
      .update({ is_active: false })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) return alert(updateError.message);
    setThemes((current) => current.map((theme) => theme.id === id ? data as Theme : theme));
    if (form.id === id) setForm((current) => ({ ...current, is_active: false }));
  };

  const restoreTheme = async (id: string) => {
    const { data, error: updateError } = await supabase
      .from("themes")
      .update({ is_active: true })
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) return alert(updateError.message);
    setThemes((current) => current.map((theme) => theme.id === id ? data as Theme : theme));
    if (form.id === id) setForm((current) => ({ ...current, is_active: true }));
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Katalog Tema</h2>
          <p className="mt-1 text-xs text-slate-500">Tema baru ditambahkan melalui code/registry. Di sini hanya edit, preview, publish, dan arsipkan.</p>
        </div>
        {isOpen && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Tutup Editor
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mb-12 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <form onSubmit={saveTheme} className="space-y-6 border-t border-slate-200 pt-6 dark:border-slate-800">
            {error && (
              <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {error}
              </div>
            )}

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              Tema baru tidak dibuat dari dashboard. Tambahkan renderer baru di <code>components/themes</code>, daftarkan di <code>lib/themes/registry.tsx</code>, lalu seed metadata/version melalui migration.
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Nama Tema
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none ring-0 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Kategori
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Slug
                <input value={form.slug} readOnly className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500" />
              </label>

              <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Renderer
                <input value={form.component_key} readOnly className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-500" />
              </label>
            </div>

            <label className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={form.is_premium}
                onChange={(event) => setForm((current) => ({ ...current, is_premium: event.target.checked }))}
                className="h-4 w-4"
              />
              Tema Premium
            </label>

            <div>
              <div className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-300">Warna Tema</div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {(Object.keys(form.colors) as Array<keyof ThemeColors>).map((key) => (
                  <label key={key} className="space-y-2 text-xs font-semibold capitalize text-slate-600 dark:text-slate-300">
                    {key}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.colors[key]}
                        onChange={(event) => setForm((current) => ({
                          ...current,
                          colors: { ...current.colors, [key]: event.target.value },
                        }))}
                        className="h-10 w-12 cursor-pointer rounded border border-slate-300 bg-transparent p-1 dark:border-slate-700"
                      />
                      <input
                        value={form.colors[key]}
                        onChange={(event) => setForm((current) => ({
                          ...current,
                          colors: { ...current.colors, [key]: event.target.value },
                        }))}
                        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-2 text-xs font-normal text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <label className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              Ganti Thumbnail
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)}
                className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-normal text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-white dark:text-slate-900"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Menyimpan..." : "Simpan Draft"}
              </button>

              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <Eye className="h-4 w-4" /> Preview {previewVersion ? `v${previewVersion.version}` : ""}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {draftVersion && (
                <button
                  type="button"
                  onClick={publishDraft}
                  disabled={isPublishing}
                  className="inline-flex items-center gap-2 bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isPublishing ? "Publishing..." : `Publish v${draftVersion.version}`}
                </button>
              )}
            </div>

            {publishedVersion && (
              <div className="text-xs text-slate-500">
                Current published version: <strong>v{publishedVersion.version}</strong>. Draft version: {draftVersion ? <strong>v{draftVersion.version}</strong> : "none"}.
              </div>
            )}
          </form>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Editor Info</div>
              <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{form.name || "Tema"}</div>
              <div className="mt-1 text-xs text-slate-500">{previewRuntime.componentKey} · {previewVersion ? `v${previewVersion.version}` : "belum ada version"}</div>
            </div>
            <div className="space-y-3 p-5 text-xs text-slate-500">
              <div>Theme renderer: <strong>{previewRuntime.componentKey}</strong></div>
              <div>Lifecycle: <strong>{draftVersion ? "draft" : publishedVersion?.lifecycle_status || "unknown"}</strong></div>
              <div>Fields schema: <strong>{Array.isArray(previewRuntime.fields) ? `${previewRuntime.fields.length} fields` : "unknown"}</strong></div>
              <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-900">
                Layout/desain baru tidak dibuat dari halaman ini. Renderer baru harus ditambahkan di source code.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => (
          <article key={theme.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
              {theme.thumbnail_url ? (
                <img src={theme.thumbnail_url} alt={theme.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-500">No thumbnail</div>
              )}
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{theme.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{theme.slug} · {theme.component_key}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${theme.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {theme.is_active ? "Aktif" : "Arsip"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-900 dark:text-slate-300">{theme.category}</span>
                {theme.is_premium && <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Premium</span>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editTheme(theme)}
                  className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <a
                  href={`/admin/themes/preview/${encodeURIComponent(theme.slug)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </a>
                {theme.is_active ? (
                  <button
                    type="button"
                    onClick={() => archiveTheme(theme.id)}
                    className="inline-flex items-center gap-2 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 dark:border-rose-900/50 dark:text-rose-300"
                  >
                    <Archive className="h-3.5 w-3.5" /> Arsipkan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => restoreTheme(theme.id)}
                    className="inline-flex items-center gap-2 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-300"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Aktifkan
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
