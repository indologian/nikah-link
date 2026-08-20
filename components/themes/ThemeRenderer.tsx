import type { ComponentType } from "react";
import { buildThemeTokenStyle } from "@/lib/themes/tokens";

type ThemeRendererProps = {
  component: ComponentType<any>;
  invitation: any;
  themeColors?: unknown;
  themeKey?: string | null;
  themeVersion?: {
    id?: string | null;
    version?: number | null;
    colors?: unknown;
    component_key?: string | null;
  } | null;
  [key: string]: any;
};

/**
 * A small compatibility bridge for renderers that still contain legacy
 * Tailwind arbitrary-color utilities. It lets theme-version colors override
 * those utilities without rewriting large, visually sensitive components.
 */
function buildLegacyTokenCompatibilityCss(rendererKey?: string | null): string {
  const common = {
    ocean: {
      selector: '[data-nikahlink-theme="ocean-breeze"]',
      rules: [
        '[class*="bg-[#0B2545]"]{background-color:var(--theme-background)!important}',
        '[class*="text-[#0B2545]"]{color:var(--theme-background)!important}',
        '[class*="from-[#0B2545]"]{--tw-gradient-from:var(--theme-background)!important}',
        '[class*="bg-[#134074]"]{background-color:var(--theme-secondary)!important}',
        '[class*="text-[#134074]"]{color:var(--theme-secondary)!important}',
        '[class*="border-[#134074]"]{border-color:rgb(var(--theme-secondary-rgb)/var(--tw-border-opacity,1))!important}',
        '[class*="to-[#134074]"]{--tw-gradient-to:var(--theme-secondary)!important}',
        '[class*="bg-[#DDA15E]"]{background-color:var(--theme-primary)!important}',
        '[class*="text-[#DDA15E]"]{color:var(--theme-primary)!important}',
        '[class*="from-[#DDA15E]"]{--tw-gradient-from:var(--theme-primary)!important}',
        '[class*="bg-[#8DA9C4]"]{background-color:var(--theme-accent)!important}',
        '[class*="text-[#8DA9C4]"]{color:var(--theme-accent)!important}',
        '[class*="border-[#8DA9C4]"]{border-color:rgb(var(--theme-accent-rgb)/var(--tw-border-opacity,1))!important}',
        '[class*="bg-[#EEF4ED]"]{background-color:var(--theme-surface)!important}',
        '[class*="fill-[#EEF4ED]"]{fill:var(--theme-surface)!important}',
      ],
    },
    rustic: {
      selector: '[data-nikahlink-theme="rustic-woodland"]',
      rules: [
        '[class*="bg-[#2A3B2C]"]{background-color:var(--theme-background)!important}',
        '[class*="text-[#2A3B2C]"]{color:var(--theme-background)!important}',
        '[class*="from-[#2A3B2C]"]{--tw-gradient-from:var(--theme-background)!important}',
        '[class*="to-[#2A3B2C]"]{--tw-gradient-to:var(--theme-background)!important}',
        '[class*="border-[#2A3B2C]"]{border-color:var(--theme-background)!important}',
        '[class*="bg-[#1A261C]"]{background-color:var(--theme-secondary)!important}',
        '[class*="hover:bg-[#1A261C]"]{--tw-bg-opacity:1;background-color:var(--theme-secondary)!important}',
        '[class*="bg-[#C19A6B]"]{background-color:var(--theme-primary)!important}',
        '[class*="text-[#C19A6B]"]{color:var(--theme-primary)!important}',
        '[class*="border-[#C19A6B]"]{border-color:rgb(var(--theme-primary-rgb)/var(--tw-border-opacity,1))!important}',
        '[class*="bg-[#F4F1EA]"]{background-color:var(--theme-surface)!important}',
        '[class*="text-[#F4F1EA]"]{color:var(--theme-surface)!important}',
        '[class*="border-[#F4F1EA]"]{border-color:var(--theme-surface)!important}',
        '[class*="text-[#4A3B32]"]{color:var(--theme-text)!important}',
        '[class*="bg-[#Fdfbf7]"]{background-color:var(--theme-surface)!important}',
      ],
    },
    monochrome: {
      selector: '[data-nikahlink-theme="modern-monochrome"]',
      rules: [
        '[class*="bg-[#111111]"]{background-color:var(--theme-text)!important}',
        '[class*="text-[#111111]"]{color:var(--theme-text)!important}',
        '[class*="bg-[#F9F9F9]"]{background-color:var(--theme-surface)!important}',
        '[class*="bg-[#F1F1F1]"]{background-color:var(--theme-secondary)!important}',
        '[class*="bg-black"]{background-color:var(--theme-primary)!important}',
        '[class*="text-black"]{color:var(--theme-primary)!important}',
      ],
    },
    cosmic: {
      selector: '[data-nikahlink-theme="cosmic-starlight"]',
      rules: [
        '[class*="bg-[#050510]"]{background-color:var(--theme-background)!important}',
        '[class*="text-[#050510]"]{color:var(--theme-background)!important}',
        '[class*="from-[#050510]"]{--tw-gradient-from:var(--theme-background)!important}',
        '[class*="to-[#050510]"]{--tw-gradient-to:var(--theme-background)!important}',
        '[class*="bg-[#030308]"]{background-color:var(--theme-background)!important}',
        '[class*="bg-[#0A0A2A]"]{background-color:var(--theme-surface)!important}',
        '[class*="bg-[#0A0A1A]"]{background-color:var(--theme-surface)!important}',
        '[class*="bg-[#1A1A3A]"]{background-color:var(--theme-secondary)!important}',
        '[class*="from-[#1A1A4A]"]{--tw-gradient-from:var(--theme-secondary)!important}',
        '[class*="border-[#303080]"]{border-color:rgb(var(--theme-secondary-rgb)/var(--tw-border-opacity,1))!important}',
        '[class*="text-[#A0A0FF]"]{color:var(--theme-primary)!important}',
        '[class*="bg-[#A0A0FF]"]{background-color:var(--theme-primary)!important}',
        '[class*="border-[#A0A0FF]"]{border-color:rgb(var(--theme-primary-rgb)/var(--tw-border-opacity,1))!important}',
        '[class*="text-[#8080C0]"]{color:var(--theme-accent)!important}',
        '[class*="text-[#E0E0FF]"]{color:var(--theme-text)!important}',
      ],
    },
  } as const;

  const keyMap: Record<string, keyof typeof common> = {
    "ocean-breeze": "ocean",
    "rustic-woodland": "rustic",
    "modern-monochrome": "monochrome",
    "cosmic-starlight": "cosmic",
  };

  const group = rendererKey ? common[keyMap[rendererKey]] : undefined;
  if (!group) return "";
  return `${group.selector}{--theme-legacy-compat:1}\n${group.rules.map((rule) => `${group.selector} ${rule}`).join("\n")}`;
}

export function ThemeRenderer({
  component: ThemeComponent,
  invitation,
  themeColors,
  themeKey,
  themeVersion,
  ...props
}: ThemeRendererProps) {
  const rendererKey =
    themeKey ||
    themeVersion?.component_key ||
    invitation?.theme_version?.component_key ||
    invitation?.themes?.component_key ||
    invitation?.themes?.slug ||
    undefined;

  const resolvedColors =
    themeColors ??
    themeVersion?.colors ??
    invitation?.theme_version?.colors ??
    invitation?.theme_colors ??
    {};

  const tokenStyle = buildThemeTokenStyle(resolvedColors, rendererKey);
  const legacyCompatibilityCss = buildLegacyTokenCompatibilityCss(rendererKey);

  const themedInvitation = {
    ...invitation,
    theme_colors: resolvedColors,
    theme_version: themeVersion ?? invitation?.theme_version ?? null,
  };

  return (
    <div
      data-nikahlink-theme
      data-theme-key={rendererKey ?? undefined}
      className="contents"
      style={tokenStyle}
    >
      {legacyCompatibilityCss && <style dangerouslySetInnerHTML={{ __html: legacyCompatibilityCss }} />}
      <ThemeComponent invitation={themedInvitation} {...props} />
    </div>
  );
}
