import { getThemeConfig } from "@/lib/themes/registry";

const FALLBACK_THEME_KEY = "minimalis";

export function resolveThemeConfig(componentKey?: string | null) {
  const requestedKey = componentKey?.trim() || FALLBACK_THEME_KEY;
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
    resolvedKey: requestedKey,
    config,
    usedFallback: false,
  };
}
