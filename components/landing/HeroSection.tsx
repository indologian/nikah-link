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
      <div className="relative w-full max-w-[320px] mx-auto h-[380px] lg:h-[440px] rounded-sm shadow-xl shadow-black/5 dark:shadow-white/5 bg-white dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
        <AnimatePresence>
          {THEME_PREVIEWS.map((theme, i) => (
            i === active && (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute inset-0 ${theme.bg} flex flex-col justify-between p-6 sm:p-8 text-center`}
              >
                <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-slate-900 dark:bg-white flex items-center justify-center">
                    <Heart size={20} className="text-white dark:text-slate-900 fill-current sm:w-6 sm:h-6" strokeWidth={0} />
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <span className={`text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium block ${theme.textColor === "text-white" ? "text-white/60" : "text-slate-500"}`}>
                      The Wedding of
                    </span>
                    <h3 className={`font-playfair text-4xl font-bold leading-tight ${theme.textColor}`}>
                      Romeo <br/>& Juliet
                    </h3>
                  </div>
                </div>

                <div className="mb-6 sm:mb-8">
                  <div className={`w-8 sm:w-12 h-px mx-auto mb-4 sm:mb-6 ${theme.textColor === "text-white" ? "bg-white/20" : "bg-black/10"}`} />
                  <p className={`text-sm ${theme.textColor === "text-white" ? "text-white/70" : "text-slate-500"}`}>
                    24 Oktober 2026
                  </p>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Floating Dot Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-10 gap-1.5">
          {THEME_PREVIEWS.map((theme, i) => (
            <button
              key={theme.name}
              onClick={() => setActive(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === active 
                  ? THEME_PREVIEWS[active].textColor === "text-white" ? "bg-white" : "bg-slate-900" 
                  : THEME_PREVIEWS[active].textColor === "text-white" ? "bg-white/30" : "bg-black/20"
              }`}
              aria-label={`Go to theme ${theme.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full pt-0 md:pt-4 pb-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start mt-4 sm:mt-8">
          
          {/* Left Column: Typography */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Sparkles size={14} />
              Platform Undangan Digital
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-playfair text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-medium leading-[1.05] tracking-tight mb-4"
            >
              Undangan Mewah, Siap Disebar dalam <span className="italic text-slate-500">Hitungan Menit.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 text-base sm:text-lg leading-relaxed mb-6 max-w-lg"
            >
              Buat undangan digital eksklusif tanpa ribet. Dilengkapi RSVP otomatis, buku tamu digital, hingga penerimaan kado tanpa kontak (cashless).
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Flat CTA Buttons */}
              <Link
                href="/daftar"
                className="group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                Buat Undangan Gratis
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="/tema"
                className="group flex items-center gap-2 px-8 py-4 border border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-sm text-slate-900 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Lihat Galeri Tema
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 sm:mt-12 flex items-center gap-8 pt-6 border-t border-slate-200 dark:border-slate-800"
            >
              <div>
                <div className="font-medium text-3xl tracking-tight text-slate-900 dark:text-white">125K+</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Pasangan</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
              <div>
                <div className="font-medium text-3xl tracking-tight text-slate-900 dark:text-white">8.5M+</div>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Tamu Undangan</div>
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
