import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getThemeConfig } from "@/lib/themes/registry";

export const metadata = {
  title: "Demo Tema | NikahLink",
  description: "Preview tema undangan digital NikahLink.",
};

export default async function DemoThemePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Fetch theme from database
  const { data: theme } = await supabase
    .from("themes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!theme) {
    notFound();
  }

  // Get theme component from registry
  const themeConfig = getThemeConfig(theme.slug);
  const ThemeComponent = themeConfig.component;

  // Dummy invitation data for demo purposes
  const dummyInvitation = {
    id: "demo-invitation-123",
    username: "romeo-juliet",
    bride_name: "Juliet Capulet",
    bride_nickname: "Juliet",
    bride_parents: "Bpk. Capulet & Ibu Capulet",
    groom_name: "Romeo Montague",
    groom_nickname: "Romeo",
    groom_parents: "Bpk. Montague & Ibu Montague",
    akad_date: "2026-10-24T08:00:00Z",
    akad_location: "Masjid Agung Kota",
    akad_address: "Jl. Cinta Abadi No. 1",
    resepsi_date: "2026-10-24T11:00:00Z",
    resepsi_location: "Gedung Serbaguna",
    resepsi_address: "Jl. Cinta Abadi No. 2",
    theme_slug: theme.slug,
    is_published: true,
    show_rsvp: true,
    show_gift: true,
    show_gallery: true,
    show_wishes: true,
    created_at: new Date().toISOString(),
    // Simulate some default custom data for the theme based on its fields
    custom_data: themeConfig.fields.reduce((acc, field) => {
       acc[field.name] = field.defaultValue || "";
       return acc;
    }, {} as Record<string, any>),
    // Include some demo photos
    photos: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop"
    ],
    // Include the theme colors mapping
    theme_colors: theme.colors || {},
  };

  return (
    <div className="w-full relative">
      {/* Banner Demo Mode */}
      <div className="fixed top-0 left-0 w-full bg-slate-900 text-white text-center py-2 text-xs font-bold uppercase tracking-widest z-[9999] shadow-md flex flex-wrap items-center justify-center gap-4">
        <span>Mode Pratinjau Tema: {theme.name}</span>
        <a href={`/daftar?tema=${theme.id}`} className="bg-white text-slate-900 px-3 py-1 rounded-sm hover:bg-slate-200 transition-colors">
          Gunakan Tema Ini
        </a>
      </div>
      
      {/* Theme Component */}
      <div className="pt-[40px]">
        <ThemeComponent invitation={dummyInvitation} />
      </div>
    </div>
  );
}
