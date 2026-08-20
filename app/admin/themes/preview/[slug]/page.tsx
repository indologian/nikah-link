import { notFound } from "next/navigation";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { getThemeConfig } from "@/components/themes/registry";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { isValidThemeRenderer } from "@/lib/themes/config";
import { buildThemePreviewCustomData, buildThemePreviewInvitation } from "@/lib/themes/preview";
import { getAdminPreviewTheme } from "@/services/themes/theme.query";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ version?: string }>;
}

export default async function AdminThemePreviewPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { version } = await searchParams;
  const result = await getAdminPreviewTheme(slug, version || null);
  if (!result) notFound();

  const { theme, version: themeVersion } = result;
  const runtimeTheme = resolveRuntimeTheme(theme, themeVersion);
  if (!isValidThemeRenderer(runtimeTheme.componentKey)) notFound();

  const registeredTheme = getThemeConfig(runtimeTheme.componentKey);
  const customData = buildThemePreviewCustomData(runtimeTheme.fields);
  const invitation = {
    ...buildThemePreviewInvitation(runtimeTheme.colors, customData, "admin-theme-preview"),
    theme_version: themeVersion,
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-[100] flex items-center justify-between bg-slate-900 px-4 py-2 text-white">
        <div className="text-xs font-semibold">Admin Preview: {theme.name} v{runtimeTheme.version} · {themeVersion.lifecycle_status}</div>
        <a href="/admin/themes" className="text-xs font-medium underline underline-offset-2">Kembali</a>
      </div>
      <ThemeRenderer
        component={registeredTheme.component}
        invitation={invitation}
        themeColors={runtimeTheme.colors}
        guestName="Tamu Preview"
        initialWishes={[]}
        giftAccounts={[]}
        isFreePlan={false}
        expiresAt={null}
        customData={customData}
        themeConfig={runtimeTheme.config}
        themeAssets={runtimeTheme.assets}
        themeVersion={themeVersion}
      />
    </div>
  );
}
