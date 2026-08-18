import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ThemeCarousel from "@/components/landing/ThemeCarousel";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Katalog Tema Undangan Digital | NikahLink",
  description: "Jelajahi 30+ pilihan tema undangan pernikahan digital modern, minimalis, floral, hingga adat Nusantara.",
};

export default async function TemaPage() {
  const supabase = await createClient();
  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Navbar />
      <ThemeCarousel themes={themes || []} />
      <Footer />
    </main>
  );
}
