import { createClient } from "@/lib/supabase/server";
import { normalizeThemeColors } from "@/lib/themes/config";

export interface UpdateThemeDraftInput {
  themeId: string;
  versionId: string;
  name: string;
  category: string;
  isPremium: boolean;
  thumbnailUrl: string | null;
  config: unknown;
  fieldsSchema: unknown;
  colors: unknown;
  assets: unknown;
}

export async function createThemeVersionDraft(input: {
  themeId: string;
  componentKey: string;
  config: unknown;
  fieldsSchema: unknown;
  colors: unknown;
  assets: unknown;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_theme_version_draft", {
    p_theme_id: input.themeId,
    p_component_key: input.componentKey,
    p_config: input.config ?? {},
    p_fields_schema: input.fieldsSchema ?? [],
    p_colors: normalizeThemeColors(input.colors),
    p_assets: input.assets ?? {},
  });
  if (error) throw error;
  return data;
}

export async function updateThemeAndDraft(input: UpdateThemeDraftInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("update_theme_and_draft", {
    p_version_id: input.versionId,
    p_name: input.name.trim(),
    p_category: input.category,
    p_is_premium: input.isPremium,
    p_thumbnail_url: input.thumbnailUrl,
    p_config: input.config ?? {},
    p_fields_schema: input.fieldsSchema ?? [],
    p_colors: normalizeThemeColors(input.colors),
    p_assets: input.assets ?? {},
  });
  if (error) throw error;
  return data;
}

export async function publishThemeVersion(versionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("publish_theme_version", { p_version_id: versionId });
  if (error) throw error;
  return data;
}

export async function setThemeActive(themeId: string, isActive: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("themes").update({ is_active: isActive }).eq("id", themeId).select("*").single();
  if (error) throw error;
  return data;
}
