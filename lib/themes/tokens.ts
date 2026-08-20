import { normalizeThemeColors, type ThemeColors } from "@/lib/themes/config";

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
  "vintage-elegance": {
    background: "#F9F6F0",
    text: "#4A4036",
    primary: "#8B7355",
    secondary: "#E5DED2",
    accent: "#C1A57B",
    surface: "#FFFFFF",
  },
  "royal-botanical": {
    background: "#064E3B",
    text: "#F3F4F6",
    primary: "#D4AF37",
    secondary: "#14532D",
    accent: "#FCD34D",
    surface: "#0B3B2E",
  },
  "wayang-classic": {
    background: "#2A1B14",
    text: "#F5E6D3",
    primary: "#D4AF37",
    secondary: "#3A251B",
    accent: "#8B4513",
    surface: "#1F140F",
  },
  "elegant-blush": {
    background: "#FFF5F5",
    text: "#4A4A4A",
    primary: "#B76E79",
    secondary: "#F7EAEA",
    accent: "#E8D8D8",
    surface: "#FFFFFF",
  },
  "midnight-sparkle": {
    background: "#0B132B",
    text: "#FFFFFF",
    primary: "#FFD700",
    secondary: "#121A35",
    accent: "#1C2541",
    surface: "#0B132B",
  },
  "serein-white": {
    background: "#FFFFFF",
    text: "#111827",
    primary: "#9CA3AF",
    secondary: "#E5E7EB",
    accent: "#F3F4F6",
    surface: "#FFFFFF",
  },
  "balinese-harmony": {
    background: "#F4F4F0",
    text: "#4B4642",
    primary: "#D4AF37",
    secondary: "#E5E1D9",
    accent: "#8B7355",
    surface: "#FFFFFF",
  },
  "magazine-cover": {
    background: "#FFFFFF",
    text: "#000000",
    primary: "#000000",
    secondary: "#F3F3F3",
    accent: "#E5E5E5",
    surface: "#000000",
  },
  "javanese-batik": {
    background: "#FDFBF7",
    text: "#3E2723",
    primary: "#B48B3D",
    secondary: "#EEE6D7",
    accent: "#5D4037",
    surface: "#FFFFFF",
  },
  "line-art-botanical": {
    background: "#FAF9F6",
    text: "#2C3E2D",
    primary: "#6B8E23",
    secondary: "#EEF1EA",
    accent: "#E2C2B3",
    surface: "#FFFFFF",
  },
  "ocean-breeze": {
    background: "#0B2545",
    text: "#FFFFFF",
    primary: "#DDA15E",
    secondary: "#134074",
    accent: "#8DA9C4",
    surface: "#EEF4ED",
  },
  "rustic-woodland": {
    background: "#2A3B2C",
    text: "#4A3B32",
    primary: "#C19A6B",
    secondary: "#1A261C",
    accent: "#C19A6B",
    surface: "#F4F1EA",
  },
  "modern-monochrome": {
    background: "#FFFFFF",
    text: "#111111",
    primary: "#000000",
    secondary: "#F1F1F1",
    accent: "#777777",
    surface: "#F9F9F9",
  },
  "cosmic-starlight": {
    background: "#050510",
    text: "#E0E0FF",
    primary: "#A0A0FF",
    secondary: "#1A1A4A",
    accent: "#8080C0",
    surface: "#0A0A1A",
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
): React.CSSProperties & Record<`--theme-${string}`, string> {
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
