import type { ComponentType } from "react";
import { buildThemeTokenStyle } from "@/lib/themes/tokens";
import type { ThemeVersionLike } from "@/lib/themes/resolve";

 type ThemeRendererProps = {
  component: ComponentType<any>;
  invitation: any;
  themeColors?: unknown;
  themeVersion?: ThemeVersionLike | null;
  [key: string]: any;
};

export function ThemeRenderer({
  component: ThemeComponent,
  invitation,
  themeColors,
  themeVersion,
  ...props
}: ThemeRendererProps) {
  const resolvedColors = themeColors ?? themeVersion?.colors ?? invitation?.theme_colors ?? {};
  const tokenStyle = buildThemeTokenStyle(resolvedColors);

  const themedInvitation = {
    ...invitation,
    theme_colors: resolvedColors,
    theme_version: themeVersion ?? invitation?.theme_version ?? null,
  };

  return (
    <div data-nikahlink-theme className="contents" style={tokenStyle}>
      <ThemeComponent invitation={themedInvitation} {...props} />
    </div>
  );
}
