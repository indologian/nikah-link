/**
 * @deprecated Import React theme registry APIs from `@/components/themes/registry`.
 * This shim exists to keep older feature modules source-compatible during migration.
 */
export {
  themesConfig,
  getThemeConfig,
  hasThemeComponent,
  THEME_COMPONENT_KEYS,
} from "@/components/themes/registry";

export type { ThemeConfig } from "@/components/themes/registry";
export type {
  ThemeField,
  ThemeFieldType as FieldType,
} from "@/types/theme";
