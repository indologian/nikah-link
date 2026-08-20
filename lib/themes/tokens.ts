import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";

export type ThemeTokenStyle = React.CSSProperties & Record<`--theme-${string}`, string>;

export function buildThemeTokenStyle(colors: unknown): ThemeTokenStyle {
  const normalized = normalizeThemeColors(colors);

  return {
    "--theme-primary": normalized.primary,
    "--theme-secondary": normalized.secondary,
    "--theme-accent": normalized.accent,
    "--theme-background": normalized.background,
    "--theme-text": normalized.text,
    "--theme-primary-rgb": hexToRgb(normalized.primary),
    "--theme-secondary-rgb": hexToRgb(normalized.secondary),
    "--theme-accent-rgb": hexToRgb(normalized.accent),
    "--theme-background-rgb": hexToRgb(normalized.background),
    "--theme-text-rgb": hexToRgb(normalized.text),
  };
}

export function getThemeColors(input: unknown): ThemeColors {
  return normalizeThemeColors(input);
}

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}
