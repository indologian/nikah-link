"use client";

import Link from "next/link";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top CTA Banner */}
      <div className="w-full py-24 border-b border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
            Mulai Pernikahan Impianmu
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-900 dark:text-white leading-tight max-w-3xl mx-auto tracking-tight">
            Siap Membuat Undangan Digital Cantikmu?
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Bergabung bersama 125.000+ pasangan dan buat undangan pernikahan impianmu dalam hitungan menit.
          </p>

          <div className="pt-4">
            <Link
              href="/daftar"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-wider text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              <span>Buat Undangan Gratis Sekarang</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 dark:bg-white flex items-center justify-center">
                <Heart size={12} className="text-white dark:text-slate-900 fill-current" strokeWidth={0} />
              </div>
              <span className="font-playfair text-xl font-bold text-slate-900 dark:text-white tracking-tight">NikahLink</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Buat undangan pernikahan digital elegan dan interaktif dengan mudah dalam hitungan menit. 
              Fokus pada hari bahagiamu, biarkan kami yang mengurus detail teknisnya.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white">Tautan</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-500">
              <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Beranda</Link>
              <Link href="/tema" className="hover:text-slate-900 dark:hover:text-white transition-colors">Katalog Tema</Link>
              <Link href="/harga" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pilihan Harga</Link>
              <Link href="/vendor" className="hover:text-slate-900 dark:hover:text-white transition-colors">Direktori Vendor</Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white">Kontak</h3>
            <div className="flex flex-col gap-3 text-sm text-slate-500">
              <p>
                <a href="https://wa.me/6285179714541" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">WhatsApp</a>
              </p>
              <p>
                <a href="mailto:beni.mustiko.a@gmail.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">Email Support</a>
              </p>
              <p className="pt-2 text-xs leading-relaxed">
                Klawisan X, Barepan, Margoagung, Seyegan,<br />
                Sleman, Yogyakarta
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-slate-400">
          <div>© {new Date().getFullYear()} NIKAHLINK.</div>
          <div>PLATFORM UNDANGAN DIGITAL #1 INDONESIA</div>
        </div>
      </div>
    </footer>
  );
}
