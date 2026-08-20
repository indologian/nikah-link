import type { ComponentType } from "react";
import { buildThemeTokenStyle } from "@/lib/themes/tokens";

type ThemeRendererProps = {
  component: ComponentType<any>;
  invitation: any;
  themeColors?: unknown;
  [key: string]: any;
};

export function ThemeRenderer({ component: ThemeComponent, invitation, themeColors, ...props }: ThemeRendererProps) {
  const resolvedColors = themeColors ?? invitation?.theme_colors ?? invitation?.theme_version?.colors ?? {};
  const tokenStyle = buildThemeTokenStyle(resolvedColors);

  const themedInvitation = {
    ...invitation,
    theme_colors: resolvedColors,
  };

  return (
    <div
      data-nikahlink-theme
      className="contents"
      style={tokenStyle}
    >
      <ThemeComponent invitation={themedInvitation} {...props} />
    </div>
  );
}
