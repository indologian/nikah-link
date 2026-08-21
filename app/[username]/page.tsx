import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ThemeRenderer } from "@/components/themes/ThemeRenderer";
import ThemeCustomDataSync from "@/components/themes/ThemeCustomDataSync";
import { resolveRuntimeTheme } from "@/lib/themes/runtime";
import { isValidThemeRenderer } from "@/lib/themes/config";
import { getThemeConfig } from "@/lib/themes/registry";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ to?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: inv } = await supabase
    .from("invitations")
    .select("bride_name, groom_name, cover_image_url")
    .eq("username", username)
    .single();

  if (!inv) return { title: "Undangan Tidak Ditemukan — NikahLink" };

  return {
    title: `Pernikahan ${inv.bride_name} & ${inv.groom_name} | NikahLink`,
    description: `Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dan memberikan doa restu pada pernikahan ${inv.bride_name} & ${inv.groom_name}.`,
    openGraph: { images: inv.cover_image_url ? [inv.cover_image_url] : [] },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const { username } = await params;
  const { to: guestNameFromUrl } = await searchParams;
  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*, themes(*)")
    .eq("username", username)
    .single();

  if (!invitation && username === "demo") {
    const demoInvitation = {
      id: "demo-invitation-id",
      username: "demo",
      bride_name: "Juliet Capulet",
      groom_name: "Romeo Montague",
      bride_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      groom_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      love_story: "Takdir mempertemukan kami di sebuah acara pada tahun 2021. Berawal dari sapaan singkat, percakapan mengalir hingga kami menyadari ada ketulusan yang saling melengkapi.",
      akad_date: "2026-10-24",
      akad_time: "08:00 WIB",
      akad_venue: "Masjid Raya Baiturrahman",
      akad_address: "Jl. Merdeka No. 45, Jakarta Pusat",
      akad_maps_url: "https://maps.google.com",
      reception_date: "2026-10-24",
      reception_time: "11:00 - 14:00 WIB",
      reception_venue: "Grand Ballroom Hotel Ritz Carlton",
      reception_address: "Jl. Jend. Sudirman No. 1, Jakarta",
      reception_maps_url: "https://maps.google.com",
      music_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-115207.mp3",
      cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      custom_message: "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i.",
      is_published: true,
      show_rsvp: true,
      show_gift: true,
      show_gallery: true,
      show_wishes: true,
      theme_colors: {
        primary: "#0F172A",
        secondary: "#FFFFFF",
        accent: "#000000",
        background: "#FFFFFF",
      },
      custom_data: {},
    };

    const DemoTheme = getThemeConfig("minimalis").component;
    return (
      <DemoTheme
        invitation={demoInvitation as any}
        guestName={guestNameFromUrl || "Tamu Undangan"}
        initialWishes={[]}
        giftAccounts={[
          { id: "1", type: "bank", bank_name: "BCA", account_number: "1234567890", account_name: "Romeo Montague" },
          { id: "2", type: "bank", bank_name: "Mandiri", account_number: "9876543210", account_name: "Juliet Capulet" },
        ]}
        isFreePlan={false}
        expiresAt={null}
        customData={{}}
      />
    );
  }

  if (!invitation) notFound();

  const [{ data: wishes }, { data: gifts }, { data: profile }, { data: themeVersion }] = await Promise.all([
    supabase.from("wishes").select("*").eq("invitation_id", invitation.id).order("created_at", { ascending: false }),
    supabase.from("gift_accounts").select("*").eq("invitation_id", invitation.id),
    supabase.from("profiles").select("plan").eq("user_id", invitation.user_id).single(),
    invitation.theme_version_id
      ? supabase.from("theme_versions").select("*").eq("id", invitation.theme_version_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (!invitation.themes) notFound();
  if (invitation.theme_version_id && !themeVersion) notFound();

  if (
    themeVersion &&
    (themeVersion.theme_id !== invitation.theme_id ||
      themeVersion.component_key !== invitation.themes.component_key)
  ) {
    notFound();
  }

  const isFreePlan = profile?.plan !== "premium" && profile?.plan !== "pro";
  const runtimeTheme = resolveRuntimeTheme(invitation.themes, themeVersion);

  if (!isValidThemeRenderer(runtimeTheme.componentKey)) notFound();

  const renderInvitation = {
    ...invitation,
    theme_colors: runtimeTheme.colors,
    theme_version: themeVersion,
  };
  const customData = invitation.custom_data || {};

  return (
    <>
      <ThemeRenderer
        component={runtimeTheme.component}
        invitation={renderInvitation}
        themeColors={runtimeTheme.colors}
        guestName={guestNameFromUrl || "Tamu Undangan"}
        initialWishes={wishes || []}
        giftAccounts={gifts || []}
        isFreePlan={isFreePlan}
        expiresAt={invitation.expires_at}
        customData={customData}
        themeConfig={runtimeTheme.config}
        themeAssets={runtimeTheme.assets}
        themeVersion={themeVersion}
      />
      <ThemeCustomDataSync
        themeKey={runtimeTheme.componentKey}
        customData={customData}
      />
    </>
  );
}