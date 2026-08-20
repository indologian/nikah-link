import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { buildThemePreviewCustomData, buildThemePreviewInvitation } from "@/lib/themes/preview";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { isValidThemeRenderer } from "@/lib/themes/config";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ version?: string }>;
}

export default async function PublicThemeDemoPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { version } = await searchParams;
  const normalizedSlug = slug.trim().toLowerCase();
  const supabase = await createClient();

  const { data: theme } = await supabase
    .from("themes")
    .select("id, name, slug, component_key, colors, is_active")
    .eq("slug", normalizedSlug)
    .single();

  if (!theme || !theme.is_active) notFound();

  let versionQuery = supabase
    .from("theme_versions")
    .select("*")
    .eq("theme_id", theme.id);

  if (version) {
    versionQuery = versionQuery.eq("id", version);
  } else {
    versionQuery = versionQuery
      .eq("is_published", true)
      .eq("lifecycle_status", "published")
      .order("version", { ascending: false })
      .limit(1);
  }

  const { data: themeVersion } = await versionQuery.maybeSingle();
  if (!themeVersion) notFound();
  if (themeVersion.theme_id !== theme.id) notFound();
  if (themeVersion.component_key !== theme.component_key) notFound();

  // Public demos can only expose published versions. Historical versions remain
  // available through the admin preview route, not this public route.
  if (!themeVersion.is_published || themeVersion.lifecycle_status !== "published") {
    notFound();
  }

  const runtimeTheme = resolveRuntimeTheme(theme, themeVersion);
  if (!isValidThemeRenderer(runtimeTheme.componentKey)) notFound();

  const customData = buildThemePreviewCustomData(runtimeTheme.fields);
  const invitation = {
    ...buildThemePreviewInvitation(runtimeTheme.colors, customData, `public-theme-demo-${theme.slug}`),
    theme_version: themeVersion,
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-[100] flex items-center justify-between bg-slate-900 px-4 py-2 text-white">
        <div className="text-xs font-semibold">Demo Tema: {theme.name} v{themeVersion.version}</div>
        <a href="/" className="text-xs font-medium underline underline-offset-2">NikahLink</a>
      </div>
      <ThemeRenderer
        component={runtimeTheme.component}
        invitation={invitation}
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
    </div>
  );
}
