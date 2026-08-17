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
      className="w-full flex flex-col items-center justify-center py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0 }}
          animate={isHeadingInView ? { opacity: 1 } : {}}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Marketplace Vendor
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Vendor Terbaik<br />Di Satu Tempat
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Ratusan vendor fotografi, dekorasi, katering, hingga WO berpengalaman se-Indonesia.
          </p>
        </motion.div>

        {/* Category Pills - Flat grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 mb-12">
          {VENDOR_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/vendor?kategori=${cat.name.toLowerCase()}`}
              className="bg-white dark:bg-slate-950 p-6 flex flex-col items-center justify-center gap-2 group hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span className="text-2xl mb-2">{cat.emoji}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors block">
                {cat.name}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">{cat.count}+</span>
            </Link>
          ))}
        </div>

        {/* Featured Vendors Cards - Hairline Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 mb-12">
          {FEATURED_VENDORS.map((vendor) => (
            <div key={vendor.name} className="bg-white dark:bg-slate-950 flex flex-col justify-between group text-left">
              <div>
                <div className="h-48 bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 relative">
                  <span className="text-4xl opacity-50 grayscale group-hover:grayscale-0 transition-all">
                    {vendor.category === "Fotografi" ? "📷" : vendor.category === "Katering" ? "🍽️" : "🌸"}
                  </span>
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <BadgeCheck size={12} className="text-slate-900 dark:text-white" /> Verified
                  </div>
                </div>

                <div className="p-8 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                    {vendor.category}
                  </span>
                  <h3 className="font-medium text-lg tracking-tight text-slate-900 dark:text-white truncate">{vendor.name}</h3>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <MapPin size={14} /> {vendor.city}
                  </p>
                </div>
              </div>

              <div className="p-8 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-slate-900 dark:text-white fill-current" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{vendor.rating}</span>
                  <span className="text-xs font-mono text-slate-500">({vendor.reviews})</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatRupiah(vendor.priceFrom)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <Link
            href="/vendor"
            className="inline-flex items-center justify-center gap-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-900 dark:border-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-colors hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900"
          >
            Jelajahi Semua Vendor
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
