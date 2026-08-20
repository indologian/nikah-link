import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";

export type ThemeTokenStyle = React.CSSProperties & Record<`--theme-${string}`, string>;

type RendererTokenDefaults = Partial<ThemeColors> & {
  surface?: string;
};

/**
 * Renderer defaults preserve the visual palette that existed before the
 * token system was introduced. Database/version colors override these values.
 */
export const RENDERER_TOKEN_DEFAULTS: Record<string, RendererTokenDefaults> = {
  minimalis: {
    background: "#0D0914",
    text: "#FFFFFF",
    primary: "#D58A9D",
    secondary: "#1A1226",
    accent: "#E8B4C2",
    surface: "#15101D",
  },
  "golden-arch": {
    background: "#F5F4F0",
    text: "#1E1E1E",
    primary: "#D4AF37",
    secondary: "#E0DED5",
    accent: "#D4AF37",
    surface: "#FFFFFF",
  },
  "royal-gold": {
    background: "#080B13",
    text: "#FFFFFF",
    primary: "#D4AF37",
    secondary: "#0B101D",
    accent: "#F2D26D",
    surface: "#0B101D",
  },
};

function getRendererFallbackColors(rendererKey?: string | null): ThemeColors {
  const fallback = RENDERER_TOKEN_DEFAULTS[rendererKey || ""] ?? {};
  return normalizeThemeColors(fallback);
}

function mergeThemeColors(input: unknown, rendererKey?: string | null): ThemeColors {
  const source = input && typeof input === "object"
    ? (input as Record<string, unknown>)
    : {};
  const fallback = getRendererFallbackColors(rendererKey);

  return normalizeThemeColors({
    primary: source.primary ?? fallback.primary,
    secondary: source.secondary ?? fallback.secondary,
    accent: source.accent ?? fallback.accent,
    background: source.background ?? fallback.background,
    text: source.text ?? fallback.text,
  });
}

export function buildThemeTokenStyle(
  colors: unknown,
  rendererKey?: string | null,
): ThemeTokenStyle {
  const normalized = mergeThemeColors(colors, rendererKey);
  const rendererDefaults = RENDERER_TOKEN_DEFAULTS[rendererKey || ""] ?? {};
  const surface = rendererDefaults.surface ?? normalized.background;

  return {
    "--theme-primary": normalized.primary,
    "--theme-secondary": normalized.secondary,
    "--theme-accent": normalized.accent,
    "--theme-background": normalized.background,
    "--theme-text": normalized.text,
    "--theme-surface": surface,
    "--theme-primary-rgb": hexToRgb(normalized.primary),
    "--theme-secondary-rgb": hexToRgb(normalized.secondary),
    "--theme-accent-rgb": hexToRgb(normalized.accent),
    "--theme-background-rgb": hexToRgb(normalized.background),
    "--theme-text-rgb": hexToRgb(normalized.text),
    "--theme-surface-rgb": hexToRgb(surface),
  };
}

export function getThemeColors(input: unknown, rendererKey?: string | null): ThemeColors {
  return mergeThemeColors(input, rendererKey);
}

function hexToRgb(hex: string): string {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}
