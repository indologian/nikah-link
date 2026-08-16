import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ThemeCarousel from "@/components/landing/ThemeCarousel";

export const metadata: Metadata = {
  title: "Katalog Tema Undangan Digital | NikahLink",
  description: "Jelajahi 30+ pilihan tema undangan pernikahan digital modern, minimalis, floral, hingga adat Nusantara.",
};

export default function TemaPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#120E10] text-[#2D2424] dark:text-[#FDFBF7] flex flex-col w-full">
      <Navbar />
      <ThemeCarousel />
      <Footer />
    </main>
  );
}
