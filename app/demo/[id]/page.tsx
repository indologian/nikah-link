import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { buildThemePreviewCustomData, buildThemePreviewInvitation } from "@/lib/themes/preview";

export const metadata = {
  title: "Demo Tema | NikahLink",
  description: "Preview tema undangan digital NikahLink.",
};

export default async function DemoThemePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const slug = params.id.trim().toLowerCase();
  if (!slug) notFound();

  const supabase = await createClient();
  const { data: theme } = await supabase
    .from("themes")
    .select("id, name, slug, component_key, colors, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!theme) notFound();

  const { data: themeVersion } = await supabase
    .from("theme_versions")
    .select("*")
    .eq("theme_id", theme.id)
    .eq("is_published", true)
    .eq("lifecycle_status", "published")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!themeVersion) notFound();

  const runtimeTheme = resolveRuntimeTheme(theme, themeVersion);
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
        component={runtimeTheme.component}
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
