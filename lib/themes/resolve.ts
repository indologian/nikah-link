import { createElement, type ComponentType } from "react";
import { getThemeConfig } from "./registry";
import { normalizeThemeColors, type ThemeColors } from "./config";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";

type ThemeLike = {
  slug?: string | null;
  component_key?: string | null;
  is_active?: boolean | null;
  colors?: Record<string, unknown> | null;
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
  colors: ThemeColors;
  usedFallback: boolean;
};

function withThemeTokens(
  config: ReturnType<typeof getThemeConfig>,
  version: ThemeVersionLike | null,
  colors: ThemeColors,
) {
  const RawThemeComponent = config.component;
  const component = ((props: any) =>
    createElement(ThemeRenderer, {
      component: RawThemeComponent as ComponentType<any>,
      themeVersion: version,
      themeColors: colors,
      ...props,
    })) as ComponentType<any>;

  return { ...config, component };
}

/**
 * Resolve a theme from a DB theme record, an optional immutable theme version,
 * or a raw renderer key. A version's component_key is authoritative when
 * supplied; the theme component_key and slug remain compatibility fallbacks.
 * Version colors are authoritative; legacy rows fall back to theme colors.
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

  const rawConfig = getThemeConfig(requestedKey);
  const colors = normalizeThemeColors(version?.colors ?? (typeof theme === "string" ? null : theme?.colors));

  if (rawConfig.slug === "fallback") {
    const fallbackConfig = getThemeConfig(FALLBACK_THEME_KEY);
    return {
      requestedKey,
      resolvedKey: FALLBACK_THEME_KEY,
      config: withThemeTokens(fallbackConfig, version ?? null, colors),
      version: version ?? null,
      colors,
      usedFallback: true,
    };
  }

  return {
    requestedKey,
    resolvedKey: rawConfig.slug,
    config: withThemeTokens(rawConfig, version ?? null, colors),
    version: version ?? null,
    colors,
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
