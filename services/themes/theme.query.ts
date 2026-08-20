import { createClient } from "@/lib/supabase/server";

const THEME_COLUMNS = "id, name, slug, component_key, category, thumbnail_url, preview_url, colors, is_premium, is_active, sort_order, created_at, editor_config, fields_schema, assets";
const THEME_VERSION_COLUMNS = "id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status, created_at";

export async function getThemeCatalog(options?: { includeInactive?: boolean }) {
  const supabase = await createClient();
  let query = supabase.from("themes").select(THEME_COLUMNS);
  if (!options?.includeInactive) query = query.eq("is_active", true);
  const { data, error } = await query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getThemeBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("themes").select(THEME_COLUMNS).eq("slug", slug.trim().toLowerCase()).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getThemeVersions(themeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("theme_versions").select(THEME_VERSION_COLUMNS).eq("theme_id", themeId).order("version", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPublishedThemeVersion(themeId: string, versionId?: string | null) {
  const supabase = await createClient();
  let query = supabase.from("theme_versions").select(THEME_VERSION_COLUMNS).eq("theme_id", themeId);
  if (versionId) query = query.eq("id", versionId);
  else query = query.eq("is_published", true).eq("lifecycle_status", "published").order("version", { ascending: false }).limit(1);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getThemeEditorData(themeId: string) {
  const [theme, versions] = await Promise.all([getThemeById(themeId), getThemeVersions(themeId)]);
  if (!theme) return null;
  return {
    theme,
    draft: versions.find((version) => version.lifecycle_status === "draft" && !version.is_published) ?? null,
    published: versions.find((version) => version.lifecycle_status === "published" && version.is_published) ?? null,
    versions,
  };
}

export async function getThemeById(themeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("themes").select(THEME_COLUMNS).eq("id", themeId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPublicDemoTheme(slug: string, versionId?: string | null) {
  const theme = await getThemeBySlug(slug);
  if (!theme || !theme.is_active) return null;
  const version = await getPublishedThemeVersion(theme.id, versionId);
  if (!version || !version.is_published || version.lifecycle_status !== "published") return null;
  if (version.theme_id !== theme.id || version.component_key !== theme.component_key) return null;
  return { theme, version };
}

export async function getAdminPreviewTheme(slug: string, versionId?: string | null) {
  const theme = await getThemeBySlug(slug);
  if (!theme) return null;
  const version = await getPublishedThemeVersion(theme.id, versionId);
  if (!version) return null;
  if (version.theme_id !== theme.id || version.component_key !== theme.component_key) return null;
  if (!theme.is_active && !versionId) return null;
  return { theme, version };
}

export async function getPublishedInvitationByUsername(username: string) {
  const supabase = await createClient();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("*")
    .eq("username", username)
    .eq("is_published", true)
    .single();
  if (invitationError || !invitation) return null;

  const [{ data: wishes }, { data: gifts }, { data: profile }, { data: theme }, { data: themeVersion }] = await Promise.all([
    supabase.from("wishes").select("*").eq("invitation_id", invitation.id).order("created_at", { ascending: false }),
    supabase.from("gift_accounts").select("*").eq("invitation_id", invitation.id),
    supabase.from("profiles").select("plan").eq("user_id", invitation.user_id).single(),
    supabase.from("themes").select(THEME_COLUMNS).eq("id", invitation.theme_id).maybeSingle(),
    invitation.theme_version_id
      ? supabase.from("theme_versions").select(THEME_VERSION_COLUMNS).eq("id", invitation.theme_version_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!theme) return null;
  if (invitation.theme_version_id && !themeVersion) return null;
  if (themeVersion && (themeVersion.theme_id !== invitation.theme_id || themeVersion.component_key !== theme.component_key)) return null;

  return { invitation, wishes: wishes ?? [], gifts: gifts ?? [], profile, theme, themeVersion };
}
