import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PublicInvitationClient from "./PublicInvitationClient";
import type { Metadata } from "next";

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

  if (!inv) {
    return { title: "Undangan Tidak Ditemukan — NikahLink" };
  }

  return {
    title: `Pernikahan ${inv.bride_name} & ${inv.groom_name} | NikahLink`,
    description: `Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir dan memberikan doa restu pada pernikahan ${inv.bride_name} & ${inv.groom_name}.`,
    openGraph: {
      images: inv.cover_image_url ? [inv.cover_image_url] : [],
    },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: Props) {
  const { username } = await params;
  const { to: guestNameFromUrl } = await searchParams;
  const supabase = await createClient();

  // Fetch invitation details
  const { data: invitation } = await supabase
    .from("invitations")
    .select("*, themes(*)")
    .eq("username", username)
    .single();

  // Demo fallback if username is demo or not created yet
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
    };

    return (
      <PublicInvitationClient
        invitation={demoInvitation as any}
        guestName={guestNameFromUrl || "Tamu Undangan"}
        initialWishes={[]}
        giftAccounts={[
          { id: "1", type: "bank", bank_name: "BCA", account_number: "1234567890", account_name: "Romeo Montague" },
          { id: "2", type: "bank", bank_name: "Mandiri", account_number: "9876543210", account_name: "Juliet Capulet" },
        ]}
        isFreePlan={false}
        createdAt={new Date().toISOString()}
      />
    );
  }

  if (!invitation) {
    notFound();
  }

  // Fetch initial wishes & gift accounts & profile plan
  const [{ data: wishes }, { data: gifts }, { data: profile }] = await Promise.all([
    supabase
      .from("wishes")
      .select("*")
      .eq("invitation_id", invitation.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("gift_accounts")
      .select("*")
      .eq("invitation_id", invitation.id),
    supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", invitation.user_id)
      .single()
  ]);

  const isFreePlan = profile?.plan === "free";

  return (
    <PublicInvitationClient
      invitation={invitation}
      guestName={guestNameFromUrl || "Tamu Undangan"}
      initialWishes={wishes || []}
      giftAccounts={gifts || []}
      isFreePlan={isFreePlan}
      createdAt={invitation.created_at}
    />
  );
}
