import type { ComponentType } from "react";
import { buildThemeTokenStyle } from "@/lib/themes/tokens";
import type { ThemeComponentProps, ThemeInvitationData } from "@/types/theme";

type ThemeRendererProps = ThemeComponentProps & {
  component: ComponentType<ThemeComponentProps>;
  invitation: ThemeInvitationData;
  themeColors?: unknown;
};

export function ThemeRenderer({ component: ThemeComponent, invitation, themeColors, ...props }: ThemeRendererProps) {
  const resolvedColors = themeColors ?? invitation.theme_colors ?? invitation.theme_version?.colors ?? {};
  const tokenStyle = buildThemeTokenStyle(resolvedColors);

  const themedInvitation: ThemeInvitationData = {
    ...invitation,
    theme_colors: resolvedColors as ThemeInvitationData["theme_colors"],
  };

  return (
    <div data-nikahlink-theme className="contents" style={tokenStyle}>
      <ThemeComponent invitation={themedInvitation} {...props} />
    </div>
  );
}
