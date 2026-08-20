import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ThemeCarousel from "@/components/landing/ThemeCarousel";
import { getThemeCatalog } from "@/services/themes/theme.query";

export const metadata: Metadata = {
  title: "Katalog Tema Undangan Digital | NikahLink",
  description: "Jelajahi pilihan tema undangan pernikahan digital modern, minimalis, floral, hingga adat Nusantara.",
};

export const dynamic = "force-dynamic";

export default async function TemaPage() {
  const themes = await getThemeCatalog();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Navbar />
      <ThemeCarousel themes={themes} />
      <Footer />
    </main>
  );
}
