import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ThemeCarousel from "@/components/landing/ThemeCarousel";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Katalog Tema Undangan Digital | NikahLink",
  description: "Jelajahi pilihan tema undangan pernikahan digital modern, minimalis, floral, hingga adat Nusantara.",
};

export const dynamic = "force-dynamic";

const THEME_SELECT =
  "id, name, slug, component_key, category, thumbnail_url, colors, is_premium, is_active, sort_order, created_at";

export default async function TemaPage() {
  const supabase = await createClient();

  const { data: themes, error } = await supabase
    .from("themes")
    .select(THEME_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load theme catalogue", error.message);
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Navbar />
      <ThemeCarousel themes={themes || []} />
      <Footer />
    </main>
  );
}
