import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getThemeConfig } from "@/lib/themes/registry";

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
    .select("id, name, slug, component_key, is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!theme) notFound();

  const themeConfig = getThemeConfig(theme.component_key);
  const ThemeComponent = themeConfig.component;

  if (themeConfig.slug === "fallback" || themeConfig.slug !== theme.component_key) {
    notFound();
  }

  const dummyInvitation = {
    id: "demo-invitation-123",
    username: "romeo-juliet",
    bride_name: "Juliet Capulet",
    groom_name: "Romeo Montague",
    bride_photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    groom_photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    love_story: "Takdir mempertemukan kami di sebuah acara pada tahun 2021. Berawal dari sapaan singkat, percakapan mengalir hingga kami menyadari ada ketulusan yang saling melengkapi.",
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
    custom_data: themeConfig.fields.reduce((acc, field) => {
      acc[field.name] = field.type === "image"
        ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
        : field.defaultValue ?? "";
      return acc;
    }, {} as Record<string, any>),
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <div className="sticky top-0 z-[100] flex items-center justify-between gap-3 bg-blue-50 px-4 py-2 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
        <Link href="/tema" className="text-xs font-semibold hover:underline">← Kembali ke Tema</Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium sm:inline">Demo: {theme.name}</span>
          <Link href={`/daftar?tema=${encodeURIComponent(theme.slug)}`} className="rounded-md bg-blue-700 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-800 dark:bg-blue-200 dark:text-blue-950 dark:hover:bg-white">
            Gunakan Tema
          </Link>
        </div>
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