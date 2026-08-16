"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const THEME_PREVIEWS = [
  { name: "Sakura Bloom", emoji: "🌸", bg: "from-pink-50 via-rose-100 to-pink-200", textColor: "text-slate-800" },
  { name: "Midnight Luxe", emoji: "✨", bg: "from-slate-900 via-purple-950 to-slate-900", textColor: "text-white" },
  { name: "Tropical Garden", emoji: "🌿", bg: "from-emerald-50 via-teal-100 to-green-100", textColor: "text-slate-800" },
  { name: "Golden Arch", emoji: "👑", bg: "from-amber-50 via-yellow-100 to-amber-200", textColor: "text-slate-800" },
];

function PhoneMockup() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % THEME_PREVIEWS.length);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const theme = THEME_PREVIEWS[active];

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto mt-10 sm:mt-12">
      {/* Phone Mockup Frame */}
      <div className="relative z-10 rounded-[2.8rem] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-800">
        <div className="rounded-[2.2rem] overflow-hidden aspect-[9/18] bg-white dark:bg-[#1A1517] relative flex flex-col justify-between p-7 text-center border border-slate-100 dark:border-[#33272B] shadow-inner">
          {/* Mockup Background */}
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-b ${theme.bg} -z-10`}
          />

          {/* Dynamic Island Notch */}
          <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-5" />

          {/* Invitation Content Pratinjau */}
          <div className="my-auto space-y-4">
            <div
              className="rounded-full bg-[#C58F78] flex items-center justify-center mx-auto shadow-md"
              style={{ width: "52px", height: "52px", minWidth: "52px", minHeight: "52px" }}
            >
              <Heart size={26} className="text-white fill-white" strokeWidth={0} />
            </div>

            <div className="space-y-1">
              <span className={`text-[11px] uppercase tracking-widest font-semibold block ${theme.textColor === "text-white" ? "text-white/60" : "text-[#756767] dark:text-[#B39E9E]"}`}>
                The Wedding of
              </span>
              <h3 className={`font-playfair text-2xl sm:text-3xl font-bold ${theme.textColor}`}>
                Romeo & Juliet
              </h3>
              <p className={`text-xs mt-1 ${theme.textColor === "text-white" ? "text-white/70" : "text-[#756767] dark:text-[#B39E9E]"}`}>
                24 Oktober 2026
              </p>
            </div>

            <div className="pt-3">
              <span className="btn-wevitation inline-block px-6 py-2.5 rounded-full text-xs font-bold shadow-md">
                Buka Undangan
              </span>
            </div>
          </div>

          <div className={`text-[11px] pt-3 border-t ${theme.textColor === "text-white" ? "border-white/10 text-white/40" : "border-slate-200 dark:border-[#423338] text-slate-400"}`}>
            NikahLink.com
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {THEME_PREVIEWS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-[#C58F78]" : "w-2 bg-slate-300"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-[#756767] dark:text-[#B39E9E] font-medium mt-2">{theme.name}</p>
    </div>
  );
}

export default function HeroSection() {
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
      {/* Centered Container */}
      <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center">
        
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2D2424] dark:text-[#FDFBF7] leading-[1.25] tracking-tight max-w-3xl mx-auto"
        >
          Undangan Digital Modern & Elegan, Siap Dibagikan Dalam Hitungan Menit
        </motion.h1>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed mt-6 sm:mt-7 font-normal"
        >
          Buat undangan digital yang cantik, cepat dan mudah diedit – lengkap dengan RSVP Online, Galeri Foto, Musik, Kado Cashless dan Sistem Manajemen Tamu paling lengkap.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10 w-full max-w-md"
        >
          <Link
            href="/daftar"
            className="btn-wevitation w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Buat Undangan Gratis</span>
          </Link>
          <Link
            href="/tema"
            className="btn-demo-outline w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center"
          >
            Lihat Demo
          </Link>
        </motion.div>

        {/* Stats Row Divider Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[#756767] dark:text-[#B39E9E] text-xs sm:text-sm font-semibold mt-10 sm:mt-12 pt-6 border-t border-[#EBE4DD] dark:border-[#33272B] max-w-2xl mx-auto"
        >
          <span><strong className="text-[#2D2424] dark:text-[#FDFBF7] text-sm sm:text-base">125K+</strong> Pasangan</span>
          <span className="text-slate-300">|</span>
          <span><strong className="text-[#2D2424] dark:text-[#FDFBF7] text-sm sm:text-base">8.5M+</strong> Tamu Undangan</span>
          <span className="text-slate-300">|</span>
          <span><strong className="text-[#2D2424] dark:text-[#FDFBF7] text-sm sm:text-base">2.3M+</strong> Ucapan & Doa</span>
        </motion.div>

        {/* Centered Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full flex justify-center mt-4 sm:mt-6"
        >
          <PhoneMockup />
        </motion.div>

      </div>
    </section>
  );
}
