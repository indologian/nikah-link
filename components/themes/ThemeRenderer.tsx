import type { ComponentType } from "react";
import { buildThemeTokenStyle } from "@/lib/themes/tokens";

type ThemeRendererProps = {
  component: ComponentType<any>;
  invitation: any;
  themeColors?: unknown;
  themeVersion?: {
    id?: string | null;
    version?: number | null;
    colors?: Record<string, unknown> | null;
    component_key?: string | null;
  } | null;
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
      <style>{`
        [data-nikahlink-theme] .text-rose-gold-300,
        [data-nikahlink-theme] .text-rose-gold-400,
        [data-nikahlink-theme] .text-rose-gold-500,
        [data-nikahlink-theme] .text-rose-gold-600 {
          color: var(--theme-primary) !important;
        }

        [data-nikahlink-theme] .bg-rose-gold-500,
        [data-nikahlink-theme] .bg-rose-gold-500\/90,
        [data-nikahlink-theme] .bg-rose-gold-500\/20,
        [data-nikahlink-theme] .bg-rose-gold-500\/10,
        [data-nikahlink-theme] .bg-rose-gold-400 {
          background-color: rgba(var(--theme-primary-rgb), 1) !important;
        }

        [data-nikahlink-theme] .border-rose-gold-300,
        [data-nikahlink-theme] .border-rose-gold-400,
        [data-nikahlink-theme] .border-rose-gold-500,
        [data-nikahlink-theme] .border-rose-gold-600 {
          border-color: var(--theme-primary) !important;
        }

        [data-nikahlink-theme] .bg-gradient-to-br.from-rose-gold-400.to-rose-gold-600,
        [data-nikahlink-theme] .bg-gradient-to-br.from-rose-gold-400.to-rose-gold-600 {
          background-image: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)) !important;
        }

        [data-nikahlink-theme] .btn-gradient {
          background-image: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)) !important;
        }

        [data-nikahlink-theme] .text-gradient {
          background-image: linear-gradient(135deg, var(--theme-primary), var(--theme-accent)) !important;
        }
      `}</style>
      <ThemeComponent invitation={themedInvitation} {...props} />
    </div>
  );
}
