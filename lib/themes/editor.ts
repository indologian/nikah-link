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

type ThemeEditorOptions = {
  versionId?: string | null;
  invitationId?: string | null;
};

function getLegacyInvitationIdFromPath(): string | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/dashboard\/undangan\/([^/]+)\/edit\/?$/);
  return match?.[1] || null;
}

export async function getThemeForEditor(
  slug: string,
  options?: ThemeEditorOptions
): Promise<PublishedThemeEditor | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;

  const supabase = createClient();
  const { data: theme, error: themeError } = await supabase
    .from("themes")
    .select("id, name, slug, component_key, colors, is_premium, is_active, thumbnail_url")
    .eq("slug", normalizedSlug)
    .single();

  if (themeError || !theme) return null;

  let pinnedVersionId = options?.versionId ?? null;
  const invitationId = options?.invitationId ?? getLegacyInvitationIdFromPath();

  // Existing invitations normally pin the exact theme version they were created with.
  // Legacy invitations may have no theme_version_id, and older data may reference a
  // version that is no longer published. In those cases the editor should recover by
  // using the current published version for the same theme instead of reporting that
  // the theme has no published version.
  if (!pinnedVersionId && invitationId) {
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select("theme_id, theme_version_id")
      .eq("id", invitationId)
      .maybeSingle();

    if (invitationError || !invitation) return null;
    if (invitation.theme_id !== theme.id) return null;
    pinnedVersionId = invitation.theme_version_id ?? null;
  }

  const selectFields = "id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status";

  // First try the invitation's pinned version. This preserves the version for
  // existing invitations when that version is still compatible with the theme.
  if (pinnedVersionId) {
    const { data: pinnedVersion, error: pinnedVersionError } = await supabase
      .from("theme_versions")
      .select(selectFields)
      .eq("id", pinnedVersionId)
      .eq("theme_id", theme.id)
      .maybeSingle();

    if (!pinnedVersionError && pinnedVersion && pinnedVersion.theme_id === theme.id && pinnedVersion.component_key === theme.component_key) {
      return {
        theme,
        version: pinnedVersion,
        runtime: resolveRuntimeTheme(theme, pinnedVersion),
      };
    }
  }

  // Recovery path for legacy/stale invitations: resolve the newest published
  // version belonging to this exact theme and matching its component key.
  const { data: publishedVersions, error: publishedVersionError } = await supabase
    .from("theme_versions")
    .select(selectFields)
    .eq("theme_id", theme.id)
    .eq("is_published", true)
    .eq("lifecycle_status", "published")
    .eq("component_key", theme.component_key)
    .order("version", { ascending: false })
    .limit(1);

  const version = publishedVersions?.[0] ?? null;
  if (publishedVersionError || !version) return null;

  return {
    theme,
    version,
    runtime: resolveRuntimeTheme(theme, version),
  };
}

export async function getPublishedThemeForEditor(
  slug: string,
  options?: ThemeEditorOptions
): Promise<PublishedThemeEditor | null> {
  return getThemeForEditor(slug, options);
}
