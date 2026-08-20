import type { ThemeField } from "@/lib/themes/registry";
import type { ThemeColors } from "@/lib/themes/config";

export function buildThemePreviewCustomData(fields: ThemeField[]) {
  return Object.fromEntries(
    (fields || []).map((field) => [
      field.name,
      field.type === "image"
        ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
        : field.defaultValue ?? "",
    ])
  );
}

export function buildThemePreviewInvitation(colors: ThemeColors, customData: Record<string, unknown>, id = "theme-preview") {
  return {
    id,
    username: "romeo-juliet",
    bride_name: "Juliet Capulet",
    groom_name: "Romeo Montague",
    bride_nickname: "Juliet",
    groom_nickname: "Romeo",
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
    theme_colors: colors,
    theme_version: null,
    custom_data: customData,
  };
}
