import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getThemeConfig } from "@/lib/themes/registry";

export const metadata = {
  title: "Demo Tema | NikahLink",
  description: "Preview tema undangan digital NikahLink.",
};

export default async function DemoThemePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  // Cari tema berdasarkan SLUG, bukan ID
  const { data: theme } = await supabase
    .from("themes")
    .select("*")
    .eq("slug", params.id)
    .single();

  if (!theme) {
    notFound();
  }

  const themeConfig = getThemeConfig(theme.slug);
  const ThemeComponent = themeConfig.component;

  // Perbaiki struktur data dummy agar cocok dengan schema & tema
  const dummyInvitation = {
    id: "demo-invitation-123",
    username: "romeo-juliet",
    bride_name: "Juliet Capulet",
    groom_name: "Romeo Montague",
    bride_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    groom_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    love_story: "Takdir mempertemukan kami di sebuah acara pada tahun 2021. Berawal dari sapaan singkat, percakapan mengalir hingga kami menyadari ada ketulusan yang saling melengkapi.",

    // Gunakan field name yang benar (akad_venue, reception_date, dll)
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
    custom_message: "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i.",
    is_published: true,
    show_rsvp: true,
    show_gift: true,
    show_gallery: true,
    show_wishes: true,
    created_at: new Date().toISOString(),

    // Isi custom_data dengan nilai default yang valid atau URL gambar agar slider tidak kosong
    custom_data: themeConfig.fields.reduce((acc, field) => {
      if (field.type === 'image') {
        acc[field.name] = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";
      } else {
        acc[field.name] = field.defaultValue || "";
      }
      return acc;
    }, {} as Record<string, any>),
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 text-center py-2 text-xs font-medium sticky top-0 z-50">
        Mode Pratinjau Tema: {theme.name}
      </div>
      <ThemeComponent
        invitation={dummyInvitation}
        guestName="Tamu Demo"
        initialWishes={[]}
        giftAccounts={[]}
        isFreePlan={false}
        expiresAt={null}
        customData={dummyInvitation.custom_data}
      />
    </main>
  );
}