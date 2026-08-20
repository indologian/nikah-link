import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getThemeConfig } from "@/lib/themes/registry";
import { normalizeThemeColors } from "@/lib/themes/config";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminThemePreviewPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug.trim().toLowerCase();
  const supabase = await createClient();

  const { data: theme } = await supabase
    .from("themes")
    .select("id, name, slug, component_key, colors, is_active")
    .eq("slug", normalizedSlug)
    .single();

  if (!theme || !theme.is_active) notFound();

  const { data: themeVersion } = await supabase
    .from("theme_versions")
    .select("*")
    .eq("theme_id", theme.id)
    .eq("is_published", true)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const rendererKey = themeVersion?.component_key || theme.component_key || theme.slug;
  const config = getThemeConfig(rendererKey);
  if (config.slug !== rendererKey) notFound();

  const themeColors = normalizeThemeColors(themeVersion?.colors ?? theme.colors);
  const customData = Object.fromEntries(
    config.fields.map((field) => [
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
    theme_colors: themeColors,
    theme_version: themeVersion,
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-[100] flex items-center justify-between bg-slate-900 px-4 py-2 text-white">
        <div className="text-xs font-semibold">Admin Preview: {theme.name}{themeVersion?.version ? ` v${themeVersion.version}` : ""}</div>
        <a href="/admin/themes" className="text-xs font-medium underline underline-offset-2">Kembali</a>
      </div>
      <ThemeRenderer
        component={config.component}
        invitation={invitation}
        themeKey={rendererKey}
        themeColors={themeColors}
        themeVersion={themeVersion}
        guestName="Tamu Preview"
        initialWishes={[]}
        giftAccounts={[]}
        isFreePlan={false}
        expiresAt={null}
        customData={customData}
      />
    </div>
  );
}
