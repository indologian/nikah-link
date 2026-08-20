"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Loader2, Save, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { themesConfig } from "@/lib/themes/registry";
import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import type { Theme } from "@/types";

type Props = { theme: Theme | null };

const COLOR_FIELDS: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
];

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
  akad_maps_url: "https://maps.google.com",
  reception_date: "2026-10-24",
  reception_time: "11:00 - 14:00 WIB",
  reception_venue: "Gedung Serbaguna",
  reception_address: "Jl. Cinta Abadi No. 2",
  reception_maps_url: "https://maps.google.com",
  music_url: "",
  cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  is_published: true,
  show_rsvp: true,
  show_gift: true,
  show_gallery: true,
  show_wishes: true,
};

export default function ThemeEditorClient({ theme }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const isNew = !theme;

  const [name, setName] = useState(theme?.name ?? "");
  const [slug, setSlug] = useState(theme?.slug ?? "");
  const [category, setCategory] = useState(theme?.category ?? "minimalis");
  const [componentKey, setComponentKey] = useState(theme?.component_key ?? "minimalis");
  const [isPremium, setIsPremium] = useState(theme?.is_premium ?? false);
  const [colors, setColors] = useState<ThemeColors>(normalizeThemeColors(theme?.colors));
  const [config, setConfig] = useState<Record<string, unknown>>(theme?.editor_config ?? {});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedConfig = themesConfig[componentKey] ?? themesConfig.minimalis;
  const Renderer = selectedConfig.component;
  const customData = useMemo(() => {
    const persistedFields = Array.isArray(theme?.fields_schema) ? theme?.fields_schema as Array<Record<string, any>> : [];
    const fields = persistedFields.length ? persistedFields : selectedConfig.fields;
    return Object.fromEntries(
      fields.map((field) => [
        field.name,
        field.defaultValue ?? (field.type === "image" ? previewBase.cover_image_url : ""),
      ])
    );
  }, [selectedConfig, theme?.fields_schema]);

  const previewInvitation = useMemo(() => ({
    ...previewBase,
    theme_colors: colors,
    custom_data: customData,
  }), [colors, customData]);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    setIsSaving(true);

    try {
      const cleanSlug = slug.trim().toLowerCase();
      const cleanName = name.trim();
      if (!cleanName) throw new Error("Nama tema wajib diisi.");
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
        throw new Error("Slug tidak valid.");
      }
      if (!themesConfig[componentKey]) throw new Error("Renderer tidak valid.");

      const payload = {
        name: cleanName,
        slug: cleanSlug,
        category: category.trim() || "minimalis",
        component_key: componentKey,
        is_premium: isPremium,
        is_active: theme?.is_active ?? true,
        colors: normalizeThemeColors(colors),
        editor_config: {
          ...config,
          tokens: normalizeThemeColors(colors),
        },
        fields_schema: selectedConfig.fields,
        assets: theme?.assets ?? {},
      };

      if (theme) {
        const { error: updateError } = await supabase
          .from("themes")
          .update(payload)
          .eq("id", theme.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("themes")
          .insert(payload);
        if (insertError) throw insertError;
      }

      setSaved(true);
      router.push("/admin/themes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tema.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button onClick={() => router.push("/admin/themes")} className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Kembali ke katalog
          </button>
          <h1 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{isNew ? "Buat Theme Variant" : "Edit Theme Variant"}</h1>
          <p className="mt-1 text-sm text-slate-500">Konfigurasi ini disimpan sebagai snapshot theme version immutable.</p>
        </div>
        <button onClick={save} disabled={isSaving} className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 disabled:opacity-60">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan
        </button>
      </div>

      {error && <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {saved && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Tema berhasil disimpan.</div>}

      <div className="grid xl:grid-cols-[420px_minmax(0,1fr)] gap-8 items-start">
        <form onSubmit={save} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">Metadata</h2>
            <p className="mt-1 text-xs text-slate-500">Identity katalog tetap terpisah dari renderer.</p>
          </div>

          <label className="block space-y-2 text-sm">
            <span>Nama Tema</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800 dark:bg-slate-900" />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Slug</span>
            <input value={slug} disabled={!isNew} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900" />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Kategori</span>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800 dark:bg-slate-900" />
          </label>

          <label className="block space-y-2 text-sm">
            <span>Renderer</span>
            <select value={componentKey} onChange={(e) => setComponentKey(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
              {Object.keys(themesConfig).map((key) => <option key={key} value={key}>{key}</option>)}
            </select>
          </label>

          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} /> Premium
          </label>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold">Theme Tokens</span>
            </div>
            <div className="space-y-3">
              {COLOR_FIELDS.map((field) => (
                <label key={field.key} className="grid grid-cols-[1fr_72px] items-center gap-3 text-sm">
                  <span>{field.label}</span>
                  <input type="color" value={colors[field.key]} onChange={(e) => updateColor(field.key, e.target.value)} className="h-9 w-16 cursor-pointer rounded border border-slate-200 bg-transparent" />
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Field Schema</h3>
            <div className="space-y-2">
              {selectedConfig.fields.map((field) => (
                <div key={field.name} className="rounded-md bg-slate-50 px-3 py-2 text-xs dark:bg-slate-900">
                  <div className="font-medium">{field.label}</div>
                  <div className="text-slate-500">{field.name} · {field.type}</div>
                </div>
              ))}
              {selectedConfig.fields.length === 0 && <div className="text-xs text-slate-500">Renderer ini tidak memiliki field tambahan.</div>}
            </div>
          </div>
        </form>

        <section className="sticky top-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Live Preview</div>
              <div className="text-xs text-slate-500">{componentKey} · {selectedConfig.fields.length} field</div>
            </div>
            <Eye className="h-4 w-4 text-slate-500" />
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            <ThemeRenderer
              component={Renderer}
              invitation={previewInvitation}
              themeColors={colors}
              themeKey={componentKey}
              themeVersion={{ component_key: componentKey, colors, config, fields_schema: selectedConfig.fields }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
