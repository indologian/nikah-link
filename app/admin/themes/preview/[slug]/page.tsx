import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { isValidThemeRenderer } from "@/lib/themes/config";
import { buildThemePreviewCustomData, buildThemePreviewInvitation } from "@/lib/themes/preview";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ version?: string }>;
}

export default async function AdminThemePreviewPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { version } = await searchParams;
  const normalizedSlug = slug.trim().toLowerCase();
  const supabase = await createClient();

  const { data: theme } = await supabase
    .from("themes")
    .select("id, name, slug, component_key, colors, is_active")
    .eq("slug", normalizedSlug)
    .single();
  if (!theme) notFound();

  let themeVersionQuery = supabase
    .from("theme_versions")
    .select("*")
    .eq("theme_id", theme.id);

  if (version) {
    themeVersionQuery = themeVersionQuery.eq("id", version);
  } else {
    themeVersionQuery = themeVersionQuery
      .eq("is_published", true)
      .eq("lifecycle_status", "published")
      .order("version", { ascending: false })
      .limit(1);
  }

  const { data: themeVersion } = await themeVersionQuery.maybeSingle();
  if (!themeVersion) notFound();
  if (!theme.is_active && themeVersion.lifecycle_status === "published") notFound();

  const runtimeTheme = resolveRuntimeTheme(theme, themeVersion);
  if (!isValidThemeRenderer(runtimeTheme.componentKey)) notFound();

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
        component={runtimeTheme.component}
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
