"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Semua", "Minimalis", "Floral", "Elegan", "Budaya", "Dark"];

const THEMES = [
  {
    id: "sakura-bloom",
    name: "Sakura Bloom",
    category: "Floral",
    gradient: "from-pink-50 via-rose-100 to-pink-200",
    emoji: "🌸",
    dark: false,
    isPremium: false,
    badge: "POPULER",
  },
  {
    id: "midnight-luxe",
    name: "Midnight Luxe",
    category: "Dark",
    gradient: "from-slate-900 via-purple-950 to-slate-900",
    emoji: "✨",
    dark: true,
    isPremium: true,
    badge: "PREMIUM",
  },
  {
    id: "javanese-heritage",
    name: "Javanese Heritage",
    category: "Budaya",
    gradient: "from-amber-50 via-orange-100 to-yellow-100",
    emoji: "🏛️",
    dark: false,
    isPremium: true,
    badge: "BARU",
  },
  {
    id: "minimalist-clean",
    name: "Minimalist Clean",
    category: "Minimalis",
    gradient: "from-slate-100 via-gray-100 to-slate-200",
    emoji: "○",
    dark: false,
    isPremium: false,
    badge: null,
  },
  {
    id: "tropical-garden",
    name: "Tropical Garden",
    category: "Floral",
    gradient: "from-emerald-50 via-teal-100 to-green-100",
    emoji: "🌿",
    dark: false,
    isPremium: false,
    badge: "POPULER",
  },
  {
    id: "golden-arch",
    name: "Golden Arch",
    category: "Elegan",
    gradient: "from-amber-100 via-yellow-100 to-amber-200",
    emoji: "👑",
    dark: false,
    isPremium: true,
    badge: "PREMIUM",
  },
  {
    id: "rustic-charm",
    name: "Rustic Charm",
    category: "Minimalis",
    gradient: "from-stone-100 via-amber-50 to-stone-200",
    emoji: "🌾",
    dark: false,
    isPremium: false,
    badge: null,
  },
  {
    id: "royal-blue",
    name: "Royal Blue",
    category: "Elegan",
    gradient: "from-blue-900 via-indigo-900 to-blue-950",
    emoji: "💠",
    dark: true,
    isPremium: true,
    badge: "BARU",
  },
];

export default function ThemeCarousel() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered = activeCategory === "Semua"
    ? THEMES
    : THEMES.filter((t) => t.category === activeCategory);

  return (
    <section
      className="w-full flex flex-col items-center justify-center py-14 sm:py-20 lg:py-24 bg-[#FDFBF7] dark:bg-[#120E10] border-b border-[#EBE4DD] dark:border-[#33272B] box-border"
      style={{
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "clamp(20px, 5vw, 40px)",
        paddingRight: "clamp(20px, 5vw, 40px)",
      }}
    >
      <div className="w-full max-w-4xl lg:max-w-5xl flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span className="px-4 py-1.5 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-xs font-semibold uppercase tracking-wider inline-block">
            Koleksi Tema Desain
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            30+ Desain Undangan Eksklusif
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-md mx-auto">
            Temukan tema pernikahan yang paling merepresentasikan kisah cinta kalian.
          </p>
        </div>

        {/* Filter Categories Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ padding: "8px 20px", minHeight: "40px" }}
              className={cn(
                "rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer border",
                activeCategory === cat
                  ? "btn-wevitation text-white border-[#C58F78] shadow-md"
                  : "bg-white dark:bg-[#1A1517] text-[#2D2424] dark:text-[#FDFBF7] hover:bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] border-[#EBE4DD] dark:border-[#33272B]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theme Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filtered.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{ minHeight: "390px" }}
              className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl border border-[#EBE4DD] dark:border-[#33272B] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group text-left"
            >
              {/* Mockup Top */}
              <div
                style={{ height: "220px", minHeight: "220px" }}
                className={`relative bg-gradient-to-b ${theme.gradient} p-5 flex flex-col items-center justify-center text-center overflow-hidden border-b border-slate-100 dark:border-[#33272B]`}
              >
                {theme.badge && (
                  <div
                    style={{ padding: "3px 10px" }}
                    className="absolute top-3 left-3 rounded-full bg-white/90 dark:bg-[#1A1517]/90 backdrop-blur-md border border-slate-200 dark:border-[#423338] text-[#2D2424] dark:text-[#FDFBF7] text-[9px] font-bold uppercase shadow-sm"
                  >
                    {theme.badge}
                  </div>
                )}

                <div className="text-3xl mb-1.5">{theme.emoji}</div>
                <span className={`text-[9px] uppercase tracking-widest block font-semibold ${theme.dark ? "text-white/70" : "text-[#756767] dark:text-[#B39E9E]"}`}>
                  The Wedding of
                </span>
                <h4 className={`font-playfair text-lg font-bold mt-0.5 ${theme.dark ? "text-white" : "text-[#2D2424] dark:text-[#FDFBF7]"}`}>
                  Romeo & Juliet
                </h4>
                <p className={`text-[10px] mt-0.5 ${theme.dark ? "text-white/60" : "text-[#756767] dark:text-[#B39E9E]"}`}>
                  24 Oktober 2026
                </p>
              </div>

              {/* Card Footer */}
              <div
                style={{ padding: "16px", minHeight: "140px" }}
                className="bg-white dark:bg-[#1A1517] flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#2D2424] dark:text-[#FDFBF7] text-sm">{theme.name}</h3>
                  {theme.isPremium ? (
                    <span
                      style={{ padding: "2px 8px" }}
                      className="text-[9px] font-bold text-[#C58F78] dark:text-[#E8BAA6] bg-[#F7EDE8] dark:bg-[#C58F78]/10 border border-[#F0DDD5] dark:border-[#C58F78]/30 rounded-full"
                    >
                      PREMIUM
                    </span>
                  ) : (
                    <span
                      style={{ padding: "2px 8px" }}
                      className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-full"
                    >
                      GRATIS
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/demo"
                    style={{ padding: "8px 12px", minHeight: "38px" }}
                    className="flex-1 text-center text-[11px] font-semibold text-[#2D2424] dark:text-[#FDFBF7] bg-[#F8F3EC] dark:bg-[#251E21]/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-[#EBE4DD] dark:border-[#33272B] rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={13} />
                    <span>Pratinjau</span>
                  </Link>
                  <Link
                    href={`/daftar?tema=${theme.id}`}
                    style={{ padding: "8px 12px", minHeight: "38px" }}
                    className="flex-1 text-center text-[11px] font-bold btn-wevitation rounded-xl shadow-md transition-colors flex items-center justify-center"
                  >
                    Gunakan
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Themes CTA */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href="/tema"
            style={{ padding: "12px 28px", minHeight: "46px" }}
            className="btn-wevitation inline-flex items-center justify-center gap-2 rounded-xl font-bold text-white text-sm shadow-xl hover:scale-105 transition-transform"
          >
            <Sparkles size={16} />
            <span>Lihat Semua 30+ Tema Desain</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
