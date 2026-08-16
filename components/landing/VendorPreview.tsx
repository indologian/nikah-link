"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Star, MapPin, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

const VENDOR_CATEGORIES = [
  { name: "Fotografi", emoji: "📷", count: 1240 },
  { name: "Katering", emoji: "🍽️", count: 890 },
  { name: "Dekorasi", emoji: "🌸", count: 650 },
  { name: "WO", emoji: "📋", count: 430 },
  { name: "Rias", emoji: "💄", count: 720 },
  { name: "Musik", emoji: "🎬", count: 560 },
];

const FEATURED_VENDORS = [
  {
    name: "Moments Captured Studio",
    category: "Fotografi",
    city: "Jakarta Selatan",
    rating: 4.9,
    reviews: 128,
    priceFrom: 3500000,
    gradient: "from-pink-100 to-rose-200",
  },
  {
    name: "Bumi Catering Nusantara",
    category: "Katering",
    city: "Bandung",
    rating: 4.8,
    reviews: 94,
    priceFrom: 65000000,
    gradient: "from-amber-100 to-yellow-200",
  },
  {
    name: "Floral Dreams by Sari",
    category: "Dekorasi",
    city: "Surabaya",
    rating: 5.0,
    reviews: 67,
    priceFrom: 18000000,
    gradient: "from-purple-100 to-indigo-200",
  },
];

export default function VendorPreview() {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });

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
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 25 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3"
        >
          <span className="px-4 py-1.5 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-xs font-semibold uppercase tracking-wider inline-block">
            Marketplace Vendor Pernikahan
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            Temukan Vendor Terbaik di Satu Tempat
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Ratusan vendor fotografi, dekorasi, katering, hingga WO berpengalaman se-Indonesia.
          </p>
        </motion.div>

        {/* Category Pills */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {VENDOR_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/vendor?kategori=${cat.name.toLowerCase()}`}
              className="bg-white dark:bg-[#1A1517] p-4 rounded-xl border border-[#EBE4DD] dark:border-[#33272B] hover:border-[#C58F78] shadow-sm hover:shadow-md transition-all text-center group space-y-1"
            >
              <span className="text-2xl mb-1 block">{cat.emoji}</span>
              <span className="text-xs font-bold text-[#2D2424] dark:text-[#FDFBF7] group-hover:text-[#C58F78] transition-colors block">
                {cat.name}
              </span>
              <span className="text-[10px] text-[#756767] dark:text-[#B39E9E] block">{cat.count}+ vendor</span>
            </Link>
          ))}
        </div>

        {/* Featured Vendors Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 items-stretch">
          {FEATURED_VENDORS.map((vendor) => (
            <div key={vendor.name} className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl border border-[#EBE4DD] dark:border-[#33272B] shadow-sm overflow-hidden flex flex-col justify-between group text-left">
              <div>
                <div className={`h-36 bg-gradient-to-br ${vendor.gradient} p-4 flex items-center justify-center border-b border-slate-100 dark:border-[#33272B] relative`}>
                  <span className="text-3xl opacity-80">
                    {vendor.category === "Fotografi" ? "📷" : vendor.category === "Katering" ? "🍽️" : "🌸"}
                  </span>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 dark:border-[#423338] text-emerald-700 text-[9px] font-bold flex items-center gap-1 shadow-sm">
                    <BadgeCheck size={13} className="text-emerald-600" /> Verified
                  </div>
                </div>

                <div className="p-5 space-y-1.5 text-left">
                  <span className="text-[9px] uppercase font-bold text-[#C58F78] tracking-wider">
                    {vendor.category}
                  </span>
                  <h3 className="font-bold text-[#2D2424] dark:text-[#FDFBF7] text-sm truncate">{vendor.name}</h3>
                  <p className="text-[#756767] dark:text-[#B39E9E] text-xs flex items-center gap-1">
                    <MapPin size={13} className="text-[#C58F78]" /> {vendor.city}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] border-t border-slate-100 dark:border-[#33272B] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-slate-800">{vendor.rating}</span>
                  <span className="text-xs text-slate-400">({vendor.reviews})</span>
                </div>
                <span className="text-xs font-bold text-[#C58F78]">
                  {formatRupiah(vendor.priceFrom)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-2">
          <Link
            href="/vendor"
            style={{ padding: "12px 28px", minHeight: "44px" }}
            className="btn-wevitation inline-flex items-center justify-center gap-2 rounded-xl font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform"
          >
            <span>Jelajahi Semua Vendor</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
