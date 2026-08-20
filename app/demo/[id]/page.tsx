import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { getThemeConfig } from "@/components/themes/registry";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { buildThemePreviewCustomData, buildThemePreviewInvitation } from "@/lib/themes/preview";
import { getPublicDemoTheme } from "@/services/themes/theme.query";

export const metadata = {
  title: "Demo Tema | NikahLink",
  description: "Preview tema undangan digital NikahLink.",
};

export default async function DemoThemePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const slug = params.id.trim().toLowerCase();
  if (!slug) notFound();

  const result = await getPublicDemoTheme(slug);
  if (!result) notFound();

  const { theme, version: themeVersion } = result;
  const runtimeTheme = resolveRuntimeTheme(theme, themeVersion);
  const registeredTheme = getThemeConfig(runtimeTheme.componentKey);
  const customData = buildThemePreviewCustomData(runtimeTheme.fields);
  const dummyInvitation = {
    ...buildThemePreviewInvitation(runtimeTheme.colors, customData, "demo-invitation-123"),
    theme_version: themeVersion,
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="sticky top-0 z-[100] flex items-center justify-between gap-3 bg-blue-50 px-4 py-2 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
        <Link href="/tema" className="text-xs font-semibold hover:underline">← Kembali ke Tema</Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium sm:inline">Demo: {theme.name} v{runtimeTheme.version}</span>
          <Link href={`/daftar?tema=${encodeURIComponent(theme.slug)}`} className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-800 dark:bg-blue-200 dark:text-blue-950 dark:hover:bg-white">Gunakan Tema</Link>
        </div>
      </div>
      <ThemeRenderer
        component={registeredTheme.component}
        invitation={dummyInvitation}
        themeColors={runtimeTheme.colors}
        guestName="Tamu Demo"
        initialWishes={[]}
        giftAccounts={[]}
        isFreePlan={false}
        expiresAt={null}
        customData={customData}
        themeConfig={runtimeTheme.config}
        themeAssets={runtimeTheme.assets}
        themeVersion={themeVersion}
      />
    </main>
  );
}
