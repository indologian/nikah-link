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
      <ThemeComponent invitation={themedInvitation} {...props} />
    </div>
  );
}
