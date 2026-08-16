"use client";

import Link from "next/link";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="w-full flex flex-col items-center justify-center bg-[#FDFBF7] dark:bg-[#120E10] border-t border-[#EBE4DD] dark:border-[#33272B] box-border transition-colors"
      style={{
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "clamp(20px, 5vw, 40px)",
        paddingRight: "clamp(20px, 5vw, 40px)",
      }}
    >
      {/* Top CTA Banner */}
      <div className="w-full py-16 sm:py-20 border-b border-[#EBE4DD] dark:border-[#33272B] flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-xs font-semibold uppercase tracking-wider inline-block">
            Mulai Pernikahan Impianmu
          </span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7] leading-tight max-w-2xl mx-auto">
            Siap Membuat Undangan Digital Cantikmu?
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-md mx-auto">
            Bergabung bersama 125.000+ pasangan dan buat undangan pernikahan impianmu dalam 5 menit.
          </p>

          <div className="pt-2">
            <Link
              href="/daftar"
              className="btn-wevitation inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:scale-105 transition-transform"
            >
              <Sparkles size={16} />
              <span>Buat Undangan Gratis Sekarang</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-4xl lg:max-w-5xl py-12 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="rounded-full bg-[#C58F78] flex items-center justify-center"
              style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }}
            >
              <Heart size={16} className="text-white fill-white" strokeWidth={0} />
            </div>
            <span className="font-playfair text-xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">NikahLink</span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-semibold text-[#756767] dark:text-[#B39E9E]">
            <Link href="/" className="hover:text-[#C58F78] transition-colors">Beranda</Link>
            <Link href="/tema" className="hover:text-[#C58F78] transition-colors">Tema Desain</Link>
            <Link href="/harga" className="hover:text-[#C58F78] transition-colors">Pilihan Harga</Link>
            <Link href="/vendor" className="hover:text-[#C58F78] transition-colors">Vendor</Link>
            <Link href="/masuk" className="hover:text-[#C58F78] transition-colors">Masuk</Link>
          </div>
        </div>

        <div className="w-full mt-8 pt-8 border-t border-[#EBE4DD] dark:border-[#33272B] text-center text-xs text-slate-400 dark:text-slate-500 dark:text-[#B39E9E]">
          © {new Date().getFullYear()} NikahLink. Platform Undangan Pernikahan Digital #1 Indonesia.
        </div>
      </div>
    </footer>
  );
}
