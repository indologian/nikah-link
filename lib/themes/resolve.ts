import { getThemeConfig } from "@/lib/themes/registry";

type ThemeLike = {
  slug?: string | null;
  component_key?: string | null;
  is_active?: boolean | null;
};

const FALLBACK_THEME_KEY = "minimalis";

export type ResolvedTheme = {
  requestedKey: string;
  resolvedKey: string;
  config: ReturnType<typeof getThemeConfig>;
  usedFallback: boolean;
};

/**
 * Resolve a theme from a DB theme record or a raw renderer key.
 * component_key is authoritative; slug is only a compatibility fallback
 * for legacy rows that predate component_key.
 */
export function resolveThemeConfig(theme?: ThemeLike | string | null): ResolvedTheme {
  const requestedKey =
    typeof theme === "string"
      ? theme.trim()
      : theme?.component_key?.trim() || theme?.slug?.trim() || FALLBACK_THEME_KEY;

  const config = getThemeConfig(requestedKey);

  if (config.slug === "fallback") {
    return {
      requestedKey,
      resolvedKey: FALLBACK_THEME_KEY,
      config: getThemeConfig(FALLBACK_THEME_KEY),
      usedFallback: true,
    };
  }

  return {
    requestedKey,
    resolvedKey: config.slug,
    config,
    usedFallback: false,
  };
}

export function resolveThemeRendererKey(theme?: ThemeLike | string | null): string {
  return resolveThemeConfig(theme).resolvedKey;
}

export function isThemeRendererAvailable(theme?: ThemeLike | string | null): boolean {
  return !resolveThemeConfig(theme).usedFallback;
}

export { FALLBACK_THEME_KEY };
