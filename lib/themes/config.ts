import { themesConfig } from "@/lib/themes/registry";

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: "#0F172A",
  secondary: "#FFFFFF",
  accent: "#000000",
  background: "#FFFFFF",
  text: "#111827",
};

export const THEME_RENDERERS = Object.keys(themesConfig);

export function normalizeThemeColors(input: unknown): ThemeColors {
  const source = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const hex = (value: unknown, fallback: string) =>
    typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)
      ? value.toUpperCase()
      : fallback;

  return {
    primary: hex(source.primary, DEFAULT_THEME_COLORS.primary),
    secondary: hex(source.secondary, DEFAULT_THEME_COLORS.secondary),
    accent: hex(source.accent, DEFAULT_THEME_COLORS.accent),
    background: hex(source.background, DEFAULT_THEME_COLORS.background),
    text: hex(source.text, DEFAULT_THEME_COLORS.text),
  };
}

export function isValidThemeRenderer(value: string): boolean {
  return Boolean(value && themesConfig[value]);
}
