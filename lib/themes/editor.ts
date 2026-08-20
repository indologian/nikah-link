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

function getInvitationIdFromEditPath(): string | null {
  if (typeof window === "undefined") return null;

  const match = window.location.pathname.match(
    /^\/dashboard\/undangan\/([^/]+)\/edit\/?$/
  );

  return match?.[1] || null;
}

export async function getThemeForEditor(
  slug: string,
  versionId?: string | null
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

  let pinnedVersionId = versionId || null;

  // Existing invitations must keep their pinned version while editing the
  // same theme. When the user selects a different theme, resolve its latest
  // published version instead of incorrectly rejecting the selection because
  // the invitation is pinned to another theme.
  if (!pinnedVersionId) {
    const invitationId = getInvitationIdFromEditPath();

    if (invitationId) {
      const { data: invitation, error: invitationError } = await supabase
        .from("invitations")
        .select("theme_id, theme_version_id")
        .eq("id", invitationId)
        .maybeSingle();

      if (invitationError || !invitation) return null;

      if (invitation.theme_id === theme.id) {
        if (!invitation.theme_version_id) return null;
        pinnedVersionId = invitation.theme_version_id;
      }
    }
  }

  let versionQuery = supabase
    .from("theme_versions")
    .select("id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status")
    .eq("theme_id", theme.id);

  if (pinnedVersionId) {
    // Existing invitations edit the exact pinned version, even when it is
    // archived. This prevents silent visual changes to an existing invitation.
    versionQuery = versionQuery.eq("id", pinnedVersionId);
  } else {
    // New theme selection uses the latest published version.
    versionQuery = versionQuery
      .eq("is_published", true)
      .eq("lifecycle_status", "published")
      .order("version", { ascending: false })
      .limit(1);
  }

  const { data: version, error: versionError } = await versionQuery.maybeSingle();

  if (versionError || !version || version.theme_id !== theme.id) return null;
  if (version.component_key !== theme.component_key) return null;

  const runtime = resolveRuntimeTheme(theme, version);

  return {
    theme,
    version,
    runtime,
  };
}

export async function getPublishedThemeForEditor(slug: string): Promise<PublishedThemeEditor | null> {
  return getThemeForEditor(slug);
}
