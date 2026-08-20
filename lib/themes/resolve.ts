import { getThemeConfig } from "./registry";

type ThemeLike = {
  slug?: string | null;
  component_key?: string | null;
  is_active?: boolean | null;
};

export type ThemeVersionLike = {
  id?: string | null;
  version?: number | null;
  component_key?: string | null;
  config?: Record<string, unknown> | null;
  fields_schema?: unknown;
  colors?: Record<string, unknown> | null;
  assets?: Record<string, unknown> | null;
  is_published?: boolean | null;
};

const FALLBACK_THEME_KEY = "minimalis";

export type ResolvedTheme = {
  requestedKey: string;
  resolvedKey: string;
  config: ReturnType<typeof getThemeConfig>;
  version: ThemeVersionLike | null;
  usedFallback: boolean;
};

/**
 * Resolve a theme from a DB theme record, an optional immutable theme version,
 * or a raw renderer key. A version's component_key is authoritative when
 * supplied; the theme component_key and slug remain compatibility fallbacks.
 */
export function resolveThemeConfig(
  theme?: ThemeLike | string | null,
  version?: ThemeVersionLike | null,
): ResolvedTheme {
  const requestedKey =
    typeof theme === "string"
      ? theme.trim() || FALLBACK_THEME_KEY
      : version?.component_key?.trim() ||
        theme?.component_key?.trim() ||
        theme?.slug?.trim() ||
        FALLBACK_THEME_KEY;

  const config = getThemeConfig(requestedKey);

  if (config.slug === "fallback") {
    return {
      requestedKey,
      resolvedKey: FALLBACK_THEME_KEY,
      config: getThemeConfig(FALLBACK_THEME_KEY),
      version: version ?? null,
      usedFallback: true,
    };
  }

  return {
    requestedKey,
    resolvedKey: config.slug,
    config,
    version: version ?? null,
    usedFallback: false,
  };
}

export function resolveThemeRendererKey(
  theme?: ThemeLike | string | null,
  version?: ThemeVersionLike | null,
): string {
  return resolveThemeConfig(theme, version).resolvedKey;
}

export function isThemeRendererAvailable(
  theme?: ThemeLike | string | null,
  version?: ThemeVersionLike | null,
): boolean {
  return !resolveThemeConfig(theme, version).usedFallback;
}

export { FALLBACK_THEME_KEY };
