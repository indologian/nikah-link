import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { THEME_DEFINITIONS } from "@/lib/themes/definitions";
import type { ThemeComponentProps, ThemeDefinition } from "@/types/theme";

type ThemeComponent = ComponentType<ThemeComponentProps>;

export interface ThemeConfig {
  slug: string;
  component: ThemeComponent;
  fields: ThemeDefinition["fields"];
}

const MinimalistTheme = dynamic(() => import("@/components/themes/MinimalistTheme"));
const VintageEleganceTheme = dynamic(() => import("@/components/themes/VintageEleganceTheme"));
const RoyalBotanicalTheme = dynamic(() => import("@/components/themes/RoyalBotanicalTheme"));
const WayangClassicTheme = dynamic(() => import("@/components/themes/WayangClassicTheme"));
const ElegantBlushTheme = dynamic(() => import("@/components/themes/ElegantBlushTheme"));
const MidnightSparkleTheme = dynamic(() => import("@/components/themes/MidnightSparkleTheme"));
const SereinWhiteTheme = dynamic(() => import("@/components/themes/SereinWhiteTheme"));
const BalineseHarmonyTheme = dynamic(() => import("@/components/themes/BalineseHarmonyTheme"));
const MagazineCoverTheme = dynamic(() => import("@/components/themes/MagazineCoverTheme"));
const JavaneseBatikTheme = dynamic(() => import("@/components/themes/JavaneseBatikTheme"));
const LineArtBotanicalTheme = dynamic(() => import("@/components/themes/LineArtBotanicalTheme"));
const RoyalGoldTheme = dynamic(() => import("@/components/themes/RoyalGoldTheme"));
const OceanBreezeTheme = dynamic(() => import("@/components/themes/OceanBreezeTheme"));
const RusticWoodlandTheme = dynamic(() => import("@/components/themes/RusticWoodlandTheme"));
const ModernMonochromeTheme = dynamic(() => import("@/components/themes/ModernMonochromeTheme"));
const CosmicStarlightTheme = dynamic(() => import("@/components/themes/CosmicStarlightTheme"));
const EtherealWatercolorTheme = dynamic(() => import("@/components/themes/EtherealWatercolorTheme"));
const HeritageGununganTheme = dynamic(() => import("@/components/themes/HeritageGununganTheme"));
const BotanicalEleganceTheme = dynamic(() => import("@/components/themes/BotanicalEleganceTheme"));
const GoldenArchTheme = dynamic(() => import("@/components/themes/GoldenArchTheme"));
const TerracottaRustTheme = dynamic(() => import("@/components/themes/TerracottaRustTheme"));
const EtherealSnowTheme = dynamic(() => import("@/components/themes/EtherealSnowTheme"));
const GeometricAbstractTheme = dynamic(() => import("@/components/themes/GeometricAbstractTheme"));
const EditorialGalleryTheme = dynamic(() => import("@/components/themes/EditorialGalleryTheme"));

const COMPONENTS: Record<string, ThemeComponent> = {
  "minimalis": MinimalistTheme,
  "vintage-elegance": VintageEleganceTheme,
  "royal-botanical": RoyalBotanicalTheme,
  "wayang-classic": WayangClassicTheme,
  "elegant-blush": ElegantBlushTheme,
  "midnight-sparkle": MidnightSparkleTheme,
  "serein-white": SereinWhiteTheme,
  "balinese-harmony": BalineseHarmonyTheme,
  "magazine-cover": MagazineCoverTheme,
  "javanese-batik": JavaneseBatikTheme,
  "line-art-botanical": LineArtBotanicalTheme,
  "royal-gold": RoyalGoldTheme,
  "ocean-breeze": OceanBreezeTheme,
  "rustic-woodland": RusticWoodlandTheme,
  "modern-monochrome": ModernMonochromeTheme,
  "cosmic-starlight": CosmicStarlightTheme,
  "ethereal-watercolor": EtherealWatercolorTheme,
  "heritage-gunungan": HeritageGununganTheme,
  "botanical-elegance": BotanicalEleganceTheme,
  "golden-arch": GoldenArchTheme,
  "terracotta-rust": TerracottaRustTheme,
  "ethereal-snow": EtherealSnowTheme,
  "geometric-abstract": GeometricAbstractTheme,
  "editorial-gallery": EditorialGalleryTheme,
};

export const themesConfig: Record<string, ThemeConfig> = Object.fromEntries(
  Object.entries(THEME_DEFINITIONS).map(([slug, definition]) => [
    slug,
    {
      slug,
      fields: definition.fields,
      component: COMPONENTS[slug],
    },
  ]),
);

export const THEME_COMPONENT_KEYS = Object.freeze(Object.keys(COMPONENTS));

export function getThemeConfig(slug: string): ThemeConfig {
  const normalized = slug.trim().toLowerCase();
  const theme = themesConfig[normalized];

  if (theme) return theme;

  return {
    slug: normalized,
    fields: [],
    component: ({ invitation }: ThemeComponentProps) => (
      <div className="flex min-h-screen items-center justify-center bg-white p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tema Tidak Ditemukan</h1>
          <p className="mt-2 text-sm text-slate-500">
            Undangan {invitation?.bride_name ?? "ini"} menggunakan tema yang belum terdaftar.
          </p>
        </div>
      </div>
    ),
  };
}

export function hasThemeComponent(slug: string): boolean {
  return Boolean(COMPONENTS[slug.trim().toLowerCase()]);
}
