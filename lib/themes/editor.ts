import { createClient } from "@/lib/supabase/client";
import { resolveRuntimeTheme, type RuntimeTheme, type ThemeVersionSnapshot } from "@/lib/themes/runtime";

export type ThemeEditorRecord = {
  id: string;
  name: string;
  slug: string;
  component_key: string;
  colors: unknown;
  is_premium: boolean;
  is_active: boolean;
  thumbnail_url: string | null;
};

export type PublishedThemeEditor = {
  theme: ThemeEditorRecord;
  version: ThemeVersionSnapshot & {
    id: string;
    theme_id: string;
    version: number;
    component_key: string;
    fields_schema_authoritative: boolean;
    is_published: boolean;
    lifecycle_status: string;
  };
  runtime: RuntimeTheme;
};

export async function getPublishedThemeForEditor(slug: string): Promise<PublishedThemeEditor | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const supabase = createClient();
  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .select("id, name, slug, component_key, colors, is_premium, is_active, thumbnail_url")
    .eq("slug", normalizedSlug)
    .single();

  if (themeError || !theme) return null;

  const { data: version, error: versionError } = await supabase
    .from("theme_versions")
    .select("id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status")
    .eq("theme_id", theme.id)
    .eq("is_published", true)
    .eq("lifecycle_status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionError || !version || version.theme_id !== theme.id) return null;
  if (version.component_key !== theme.component_key) return null;

  const runtime = resolveRuntimeTheme(theme, version);

  return {
    theme,
    version,
    runtime,
  };
}
