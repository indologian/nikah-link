"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, ArrowRight } from "lucide-react";

const THEME_PREVIEWS = [
  { name: "Sakura Bloom", emoji: "🌸", bg: "bg-pink-50/80", textColor: "text-slate-800" },
  { name: "Midnight Luxe", emoji: "✨", bg: "bg-slate-900", textColor: "text-white" },
  { name: "Tropical Garden", emoji: "🌿", bg: "bg-emerald-50/80", textColor: "text-slate-800" },
  { name: "Golden Arch", emoji: "👑", bg: "bg-amber-50/80", textColor: "text-slate-800" },
];

function FloatingThemeCards() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % THEME_PREVIEWS.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-auto md:h-[600px] flex items-center justify-center">
      {/* 
        Hallmark Pattern: No redrawn chrome.
        Instead of a fake phone with dynamic islands, we show the invitation
        as a pure, floating editorial card.
      */}
      <div className="relative w-full max-w-[320px] mx-auto h-[500px]">
        <AnimatePresence mode="popLayout">
          {THEME_PREVIEWS.map((theme, i) => (
            i === active && (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute inset-0 rounded-2xl ${theme.bg} shadow-2xl border border-black/5 dark:border-white/5 flex flex-col justify-between p-8 text-center backdrop-blur-sm overflow-hidden`}
              >
                <div className="mt-8 space-y-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--accent-rosegold)] flex items-center justify-center shadow-lg">
                    <Heart size={24} className="text-white fill-white" strokeWidth={0} />
                  </div>

                  <div className="space-y-2">
                    <span className={`text-xs uppercase tracking-[0.2em] font-medium block ${theme.textColor === "text-white" ? "text-white/60" : "text-slate-500"}`}>
                      The Wedding of
                    </span>
                    <h3 className={`font-playfair text-4xl font-bold leading-tight ${theme.textColor}`}>
                      Romeo <br/>& Juliet
                    </h3>
                  </div>
                </div>

                <div className="mb-4">
                  <div className={`w-12 h-px mx-auto mb-6 ${theme.textColor === "text-white" ? "bg-white/20" : "bg-black/10"}`} />
                  <p className={`text-sm ${theme.textColor === "text-white" ? "text-white/70" : "text-slate-500"}`}>
                    24 Oktober 2026
                  </p>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Floating Indicator Pill */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm z-10">
          {THEME_PREVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[var(--accent-rosegold)]" : "w-1.5 bg-slate-300 dark:bg-slate-700"
              }`}
              aria-label={`Show theme ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Minimal grid background for subtle texture (not an aurora blob) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-10 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Typography (H2 Split Diptych) */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-rosegold)]/10 text-[var(--accent-rosegold)] text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles size={14} />
              Platform Undangan Digital
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Undangan elegan, <br/>
              siap dalam <span className="text-[var(--accent-rosegold)] italic">hitungan menit.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-lg"
            >
              Buat undangan pernikahan digital yang cantik dan modern. Lengkap dengan RSVP Online, manajemen tamu, hingga penerimaan kado cashless.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* C3 Typographic Link CTA pattern instead of generic button block */}
              <Link
                href="/daftar"
                className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3.5 rounded-full font-medium text-sm transition-all hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm"
              >
                Buat Undangan Gratis
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/tema"
                className="group flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-sm text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Lihat Galeri Tema
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 flex items-center gap-6 pt-6 border-t border-slate-200 dark:border-slate-800"
            >
              <div>
                <div className="font-bold text-2xl text-slate-900 dark:text-white">125K+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Pasangan</div>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
              <div>
                <div className="font-bold text-2xl text-slate-900 dark:text-white">8.5M+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Tamu Undangan</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full flex justify-center md:justify-end"
          >
            <FloatingThemeCards />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
