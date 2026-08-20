"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { themesConfig } from "@/lib/themes/registry";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";
import { resolveThemeFields, serializeThemeFields, type ThemeFieldSchema } from "@/lib/themes/fields";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import type { Theme, ThemeVersion } from "@/types";

type Props = { theme: Theme | null };

const previewBase = {
  id: "theme-editor-preview",
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
  reception_date: "2026-10-24",
  reception_time: "11:00 - 14:00 WIB",
  reception_venue: "Gedung Serbaguna",
  reception_address: "Jl. Cinta Abadi No. 2",
  is_published: true,
  show_rsvp: true,
  show_gift: true,
  show_gallery: true,
  show_wishes: true,
};

const DEFAULT_COLORS: ThemeColors = normalizeThemeColors(undefined);

export default function ThemeEditorVersionedClient({ theme }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !theme;

  const [name, setName] = useState(theme?.name ?? "");
  const [slug, setSlug] = useState(theme?.slug ?? "");
  const [category, setCategory] = useState(theme?.category ?? "minimalis");
  const [componentKey, setComponentKey] = useState(theme?.component_key ?? "minimalis");
  const [isPremium, setIsPremium] = useState(theme?.is_premium ?? false);
  const [colors, setColors] = useState<ThemeColors>(normalizeThemeColors(theme?.colors ?? DEFAULT_COLORS));
  const [fields, setFields] = useState<ThemeFieldSchema[]>(() =>
    resolveThemeFields(theme?.fields_schema, (themesConfig[theme?.component_key ?? "minimalis"] ?? themesConfig.minimalis).fields)
  );
  const [versions, setVersions] = useState<ThemeVersion[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const rendererConfig = themesConfig[componentKey] ?? themesConfig.minimalis;
  const Renderer = rendererConfig.component;

  const applyRenderer = (nextKey: string) => {
    const nextConfig = themesConfig[nextKey] ?? themesConfig.minimalis;
    setComponentKey(nextKey);
    setFields(nextConfig.fields);
    setMessage("");
  };

  const loadVersions = async () => {
    if (!theme?.id) return;
    const { data, error: loadError } = await supabase
      .from("theme_versions")
      .select("*")
      .eq("theme_id", theme.id)
      .order("version", { ascending: false });
    if (loadError) {
      setError(loadError.message);
      return;
    }
    setVersions((data as ThemeVersion[]) ?? []);
  };

  useEffect(() => {
    void loadVersions();
  }, [theme?.id]);

  const customData = useMemo(() => {
    return Object.fromEntries(
      fields
        .filter((field) => field.enabled !== false)
        .map((field) => [
          field.name,
          field.defaultValue ?? (field.type === "image" ? previewBase.groom_photo_url : ""),
        ])
    );
  }, [fields]);

  const previewInvitation = useMemo(
    () => ({ ...previewBase, theme_colors: colors, custom_data: customData }),
    [colors, customData]
  );

  const updateField = (name: string, patch: Partial<ThemeFieldSchema>) => {
    setFields((current) => current.map((field) => (field.name === name ? { ...field, ...patch } : field)));
    setMessage("");
  };

  const save = async () => {
    setError("");
    setMessage("");

    try {
      const cleanSlug = slug.trim().toLowerCase();
      if (!name.trim()) throw new Error("Nama tema wajib diisi.");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) throw new Error("Slug tidak valid.");
      if (!themesConfig[componentKey]) throw new Error("Renderer tidak valid.");

      const normalizedColors = normalizeThemeColors(colors);
      const schema = serializeThemeFields(fields);
      const editorConfig = { tokens: normalizedColors };

      if (isNew) {
        const { error: insertError } = await supabase.from("themes").insert({
          name: name.trim(),
          slug: cleanSlug,
          category: category.trim() || "minimalis",
          component_key: componentKey,
          is_premium: isPremium,
          is_active: true,
          colors: normalizedColors,
          editor_config: editorConfig,
          fields_schema: schema,
          assets: {},
        });
        if (insertError) throw insertError;
        router.push("/admin/themes");
        router.refresh();
        return;
      }

      const { error: metadataError } = await supabase
        .from("themes")
        .update({
          name: name.trim(),
          category: category.trim() || "minimalis",
          is_premium: isPremium,
        })
        .eq("id", theme.id);
      if (metadataError) throw metadataError;

      const { error: draftError } = await supabase.rpc("create_theme_version_draft", {
        p_theme_id: theme.id,
        p_component_key: componentKey,
        p_config: editorConfig,
        p_fields_schema: schema,
        p_colors: normalizedColors,
        p_assets: theme.assets ?? {},
      });
      if (draftError) throw draftError;

      setMessage("Draft version berhasil disimpan.");
      await loadVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tema.");
    }
  };

  const loadVersion = (version: ThemeVersion) => {
    const nextConfig = themesConfig[version.component_key] ?? themesConfig.minimalis;
    setComponentKey(version.component_key);
    setColors(normalizeThemeColors(version.colors));
    setFields(resolveThemeFields(version.fields_schema, nextConfig.fields));
    setMessage(`v${version.version} dimuat ke editor.`);
  };

  const publish = async (versionId: string) => {
    setError("");
    const { error: rpcError } = await supabase.rpc("publish_theme_version", { p_version_id: versionId });
    if (rpcError) setError(rpcError.message);
    else {
      setMessage("Version berhasil dipublish.");
      await loadVersions();
    }
  };

  const rollback = async (versionId: string) => {
    if (!window.confirm("Rollback akan membuat snapshot version baru dari version ini. Lanjutkan?")) return;
    setError("");
    const { error: rpcError } = await supabase.rpc("rollback_theme_version", { p_version_id: versionId });
    if (rpcError) setError(rpcError.message);
    else {
      setMessage("Rollback berhasil dibuat sebagai version baru.");
      await loadVersions();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <button type="button" onClick={() => router.push("/admin/themes")} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">← Kembali</button>
          <h1 className="mt-2 text-2xl font-black">{isNew ? "Buat Theme Variant" : "Edit Theme Variant"}</h1>
          <p className="mt-1 text-sm text-slate-500">Field schema, warna, dan renderer disimpan per theme version.</p>
        </div>
        <button type="button" onClick={save} className="rounded-md bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Simpan Draft</button>
      </div>

      {error && <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {message && <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

      <div className="grid gap-8 xl:grid-cols-[460px_minmax(0,1fr)]">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-4">
            <label className="block text-sm">Nama<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-900" /></label>
            <label className="block text-sm">Slug<input value={slug} disabled={!isNew} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 disabled:opacity-60 dark:bg-slate-900" /></label>
            <label className="block text-sm">Kategori<input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-900" /></label>
            <label className="block text-sm">Renderer<select value={componentKey} onChange={(e) => applyRenderer(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 dark:bg-slate-900">{Object.keys(themesConfig).map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} /> Premium</label>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold">Theme Tokens</h2>
            <div className="grid grid-cols-2 gap-3">{(Object.keys(DEFAULT_COLORS) as Array<keyof ThemeColors>).map((key) => <label key={key} className="text-xs">{key}<input type="color" value={colors[key]} onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))} className="mt-1 h-9 w-full cursor-pointer" /></label>)}</div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Versioned Fields</h2><span className="text-xs text-slate-500">{fields.length} field</span></div>
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.name} className="rounded-lg border p-3 dark:border-slate-800">
                  <div className="mb-2 text-xs font-mono text-slate-500">{field.name} · {field.type}</div>
                  <input value={field.label} onChange={(e) => updateField(field.name, { label: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900" placeholder="Label" />
                  {field.placeholder !== undefined && <input value={field.placeholder ?? ""} onChange={(e) => updateField(field.name, { placeholder: e.target.value })} className="mt-2 w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-900" placeholder="Placeholder" />}
                  <div className="mt-2 flex gap-4 text-xs">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={field.required ?? false} onChange={(e) => updateField(field.name, { required: e.target.checked })} /> required</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={field.enabled !== false} onChange={(e) => updateField(field.name, { enabled: e.target.checked })} /> enabled</label>
                  </div>
                </div>
              ))}
              {fields.length === 0 && <div className="text-xs text-slate-500">Renderer ini tidak memiliki field khusus.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {!isNew && <div className="rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><h2 className="text-sm font-semibold">Version History</h2><div className="mt-3 space-y-2">{versions.map((version) => <div key={version.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 dark:border-slate-800"><button type="button" onClick={() => loadVersion(version)} className="text-left"><div className="text-sm font-semibold">v{version.version} · {version.component_key}</div><div className="text-xs text-slate-500">{version.lifecycle_status} · {Array.isArray(version.fields_schema) ? version.fields_schema.length : 0} fields</div></button><div className="flex gap-2">{version.lifecycle_status === "draft" && <button type="button" onClick={() => publish(version.id)} className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white">Publish</button>}{version.lifecycle_status !== "published" && <button type="button" onClick={() => rollback(version.id)} className="rounded border px-2 py-1 text-[11px] font-bold">Rollback</button>}</div></div>)}</div></div>}

          <div className="overflow-hidden rounded-xl border bg-slate-100 dark:border-slate-800 dark:bg-slate-900"><div className="border-b bg-white px-4 py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-950">Live Preview · {componentKey} · {fields.filter((f) => f.enabled !== false).length} fields</div><div className="max-h-[80vh] overflow-y-auto"><ThemeRenderer component={Renderer} invitation={{ ...previewInvitation }} themeColors={colors} themeKey={componentKey} themeVersion={{ component_key: componentKey, colors, fields_schema: fields, config: { tokens: colors } }} /></div></div>
        </div>
      </div>
    </div>
  );
}
