import {
  getThemeConfig as getRegisteredThemeConfig,
  themesConfig,
} from "./registry";
import {
  resolveThemeConfig,
} from "./resolve";

export type {
  FieldType,
  ThemeField,
  ThemeConfig,
} from "./registry";

export { themesConfig };

/**
 * Compatibility API for existing consumers.
 * All theme lookups now pass through the canonical resolver so missing,
 * archived, or legacy renderer keys use the same fallback contract.
 */
export function getThemeConfig(themeKey?: string | null) {
  return resolveThemeConfig(themeKey).config;
}

/**
 * Direct access to the raw renderer registry is intentionally kept explicit.
 * New code should prefer resolveThemeConfig() for application-level lookups.
 */
export { getRegisteredThemeConfig };
