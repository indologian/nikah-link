import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { isValidThemeRenderer } from "@/lib/themes/config";

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

  const customData = Object.fromEntries(
    runtimeTheme.fields.map((field) => [
      field.name,
      field.type === "image"
        ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
        : field.defaultValue ?? "",
    ])
  );

  const invitation = {
    id: "admin-theme-preview",
    username: "theme-preview",
    bride_name: "Juliet Capulet",
    groom_name: "Romeo Montague",
    bride_nickname: "Juliet",
    groom_nickname: "Romeo",
    bride_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    groom_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    love_story: "Preview tema NikahLink.",
    akad_date: "2026-10-24",
    akad_time: "08:00 WIB",
    akad_venue: "Masjid Agung Kota",
    akad_address: "Jl. Cinta Abadi No. 1",
    akad_maps_url: "https://maps.google.com",
    reception_date: "2026-10-24",
    reception_time: "11:00 - 14:00 WIB",
    reception_venue: "Gedung Serbaguna",
    reception_address: "Jl. Cinta Abadi No. 2",
    reception_maps_url: "https://maps.google.com",
    music_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-115207.mp3",
    cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    custom_message: "Preview tema undangan digital.",
    is_published: true,
    show_rsvp: true,
    show_gift: true,
    show_gallery: true,
    show_wishes: true,
    custom_data: customData,
    theme_colors: runtimeTheme.colors,
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
