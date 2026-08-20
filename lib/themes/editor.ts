import { loadThemeEditorContext } from "@/actions/themes/theme";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";

export type ThemeEditorOptions = {
  versionId?: string | null;
  invitationId?: string | null;
};

/**
 * Compatibility facade for the existing invitation editors.
 * The actual query/lifecycle logic lives in actions/services.
 */
export async function getPublishedThemeForEditor(
  slug: string,
  options?: ThemeEditorOptions,
) {
  let invitationId = options?.invitationId ?? null;

  if (!invitationId && typeof window !== "undefined") {
    const match = window.location.pathname.match(/^\/dashboard\/undangan\/([^/]+)\/edit\/?$/);
    invitationId = match?.[1] ?? null;
  }

  const result = await loadThemeEditorContext({
    slug,
    versionId: options?.versionId ?? null,
    invitationId,
  });

  if (!result) return null;

  return {
    theme: result.theme,
    version: result.version,
    runtime: resolveRuntimeTheme(result.theme, result.version),
  };
}
