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

  if (!pinnedVersionId && invitationId) {
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select("theme_id, theme_version_id")
      .eq("id", invitationId)
      .maybeSingle();

    if (!invitationError && invitation && invitation.theme_id === theme.id) {
      pinnedVersionId = invitation.theme_version_id ?? null;
    }
  }

  const selectFields = "id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status";

  if (pinnedVersionId) {
    const { data: pinnedVersion, error: pinnedVersionError } = await supabase
      .from("theme_versions")
      .select(selectFields)
      .eq("id", pinnedVersionId)
      .eq("theme_id", theme.id)
      .maybeSingle();

    if (
      !pinnedVersionError &&
      pinnedVersion &&
      pinnedVersion.theme_id === theme.id &&
      pinnedVersion.component_key === theme.component_key
    ) {
      return {
        theme,
        version: pinnedVersion,
        runtime: resolveRuntimeTheme(theme, pinnedVersion),
      };
    }
  }

  // Primary path: current published version for this exact theme.
  const { data: publishedVersions } = await supabase
    .from("theme_versions")
    .select(selectFields)
    .eq("theme_id", theme.id)
    .eq("is_published", true)
    .order("version", { ascending: false })
    .limit(10);

  // Some older databases may have a published flag without the newer lifecycle
  // field being synchronized. We intentionally validate the component key in JS
  // and accept the newest published version for this exact theme.
  const version =
    publishedVersions?.find(
      (candidate: NonNullable<typeof publishedVersions>[number]) =>
        candidate.component_key === theme.component_key &&
        candidate.is_published === true
    ) ?? null;

  if (!version) return null;

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
