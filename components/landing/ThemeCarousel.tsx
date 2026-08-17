"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Semua", "Minimalis", "Floral", "Elegan", "Budaya", "Dark"];

const THEMES = [
  {
    id: "sakura-bloom",
    name: "Sakura Bloom",
    category: "Floral",
    bg: "bg-pink-50/80",
    textColor: "text-slate-800",
    badge: "Populer",
  },
  {
    id: "midnight-luxe",
    name: "Midnight Luxe",
    category: "Dark",
    bg: "bg-slate-900",
    textColor: "text-white",
    badge: "Premium",
  },
  {
    id: "javanese-heritage",
    name: "Javanese Heritage",
    category: "Budaya",
    bg: "bg-amber-50/80",
    textColor: "text-slate-800",
    badge: "Baru",
  },
  {
    id: "minimalist-clean",
    name: "Minimalist Clean",
    category: "Minimalis",
    bg: "bg-slate-100",
    textColor: "text-slate-800",
    badge: null,
  },
  {
    id: "tropical-garden",
    name: "Tropical Garden",
    category: "Floral",
    bg: "bg-emerald-50/80",
    textColor: "text-slate-800",
    badge: "Populer",
  },
  {
    id: "golden-arch",
    name: "Golden Arch",
    category: "Elegan",
    bg: "bg-amber-100/50",
    textColor: "text-slate-800",
    badge: "Premium",
  },
  {
    id: "rustic-charm",
    name: "Rustic Charm",
    category: "Minimalis",
    bg: "bg-stone-100",
    textColor: "text-slate-800",
    badge: null,
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    category: "Elegan",
    bg: "bg-indigo-950",
    textColor: "text-white",
    badge: "Baru",
  },
];

export default function ThemeCarousel() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = activeCategory === "Semua"
    ? THEMES
    : THEMES.filter((t) => t.category === activeCategory);

  return (
    <section className="w-full pt-16 pb-20 bg-white dark:bg-slate-950 transition-colors border-b border-slate-200 dark:border-slate-800">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-4">
              Koleksi Tema Desain
            </h2>
            <p className="text-slate-500 text-lg">
              30+ desain eksklusif yang dirancang dengan dedikasi untuk merayakan cerita Anda.
            </p>
          </div>
          <Link
            href="/daftar"
            className="group flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors hover:bg-slate-800 dark:hover:bg-slate-100 shrink-0"
          >
            Buat Undangan Gratis
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories (F2 Tabbed Panel Pattern style) */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-slate-200 dark:border-slate-800 pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border",
                activeCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                  : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photographic Grid - Hairline borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          <AnimatePresence mode="popLayout">
            {filtered.map((theme, i) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                key={theme.id}
                className="group relative overflow-hidden aspect-[3/4] bg-white dark:bg-slate-950"
              >
                {/* Simulated Visual Content */}
                <div className={cn("absolute inset-0 transition-transform duration-700 group-hover:scale-105 flex flex-col justify-center items-center text-center p-8", theme.bg)}>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-medium block mb-2 ${theme.textColor === 'text-white' ? 'text-white/60' : 'text-slate-500'}`}>
                    The Wedding of
                  </span>
                  <h4 className={`font-playfair text-2xl sm:text-3xl font-bold leading-tight ${theme.textColor}`}>
                    Romeo <br/>& Juliet
                  </h4>
                  <div className={`w-8 h-px mx-auto my-4 ${theme.textColor === 'text-white' ? 'bg-white/20' : 'bg-black/10'}`} />
                  <p className={`text-xs ${theme.textColor === 'text-white' ? 'text-white/70' : 'text-slate-500'}`}>
                    24 Oktober 2026
                  </p>
                </div>

                {/* Badges */}
                {theme.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-slate-900 dark:text-white border border-slate-200/50 dark:border-slate-800/50">
                      {theme.badge}
                    </span>
                  </div>
                )}

                {/* Hover / Mobile Overlay */}
                <div className="absolute inset-0 bg-black/60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-medium tracking-tight mb-4">{theme.name}</h3>
                    <div className="flex gap-2">
                      <Link
                         href={`/demo/${theme.id}`}
                        className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye size={14} /> Lihat
                      </Link>
                      <Link
                        href={`/daftar?tema=${theme.id}`}
                        className="flex-1 bg-white hover:bg-slate-200 text-slate-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors"
                      >
                        Gunakan
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
