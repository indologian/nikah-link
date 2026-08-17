"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Search, MapPin, Star, ShieldCheck, Phone, ArrowRight } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SAMPLE_VENDORS = [
  {
    id: "1",
    name: "Aura Motion Photography",
    category: "fotografi",
    city: "Jakarta Selatan",
    rating: 4.9,
    reviews: 128,
    priceFrom: 4500000,
    emoji: "📷",
    verified: true,
    desc: "Spesialis dokumentasi pernikahan candid, cinematic wedding film, dan prewedding studio.",
  },
  {
    id: "2",
    name: "Royal Garden Catering",
    category: "katering",
    city: "Bandung",
    rating: 4.95,
    reviews: 215,
    priceFrom: 65000000,
    emoji: "🍽️",
    verified: true,
    desc: "Catering pernikahan tradisional & internasional buffet dengan chef berstandard bintang 5.",
  },
  {
    id: "3",
    name: "Bloom & Elegance Decor",
    category: "dekorasi",
    city: "Jakarta",
    rating: 4.8,
    reviews: 89,
    priceFrom: 18000000,
    emoji: "🌸",
    verified: true,
    desc: "Dekorasi pernikahan rustic, modern floral, dan adat Nusantara custom impian.",
  },
  {
    id: "4",
    name: "Mahkota Wedding Organizer",
    category: "wo",
    city: "Surabaya",
    rating: 4.9,
    reviews: 96,
    priceFrom: 12000000,
    emoji: "📋",
    verified: true,
    desc: "Perencana acara pernikahan berpengalaman menangani 500+ event sejak 2018.",
  },
  {
    id: "5",
    name: "Griya Manten MUA & Attire",
    category: "rias",
    city: "Yogyakarta",
    rating: 4.88,
    reviews: 140,
    priceFrom: 8500000,
    emoji: "💄",
    verified: true,
    desc: "Makeup artist pengantin flawless, adat Sunda Siger, Solo Puteri, Paes Ageng & Modern.",
  },
  {
    id: "6",
    name: "Harmoni Strings Ensemble",
    category: "musik",
    city: "Jakarta",
    rating: 4.92,
    reviews: 64,
    priceFrom: 5000000,
    emoji: "🎬",
    verified: true,
    desc: "Live music akustik & orchestra string quartet pengiring momen akad dan resepsi.",
  },
];

const CATEGORIES = [
  { id: "all", label: "Semua Kategori" },
  { id: "fotografi", label: "Fotografi & Video" },
  { id: "katering", label: "Katering" },
  { id: "dekorasi", label: "Dekorasi" },
  { id: "wo", label: "Wedding Organizer" },
  { id: "rias", label: "Rias & Gaun" },
  { id: "musik", label: "Musik & Entertainment" },
];

export default function VendorPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredVendors = SAMPLE_VENDORS.filter((v) => {
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] dark:text-white flex flex-col w-full">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Editorial Page Header */}
        <div className="max-w-2xl mb-16 space-y-4">
          <span className="text-[var(--accent-rosegold)] text-xs font-semibold uppercase tracking-wider">
            Marketplace Vendor Terpercaya
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1]">
            Temukan Rekan Terbaik <br/>
            untuk Momen Anda.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
            Dari fotografi hingga dekorasi, jelajahi ratusan vendor berpengalaman yang siap mewujudkan pernikahan impian tanpa hambatan.
          </p>
        </div>

        {/* Search & Filter - F2 Panel Pattern */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama vendor atau kota..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-100 dark:bg-slate-900 border-none text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-rosegold)]/50 transition-shadow"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 min-w-max no-scrollbar border-b border-slate-200 dark:border-slate-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  selectedCategory === cat.id
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor List - Tabular/Flat Editorial format instead of AI slop cards */}
        <div className="flex flex-col gap-4">
          {filteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors items-start md:items-center justify-between"
            >
              {/* Left: Icon & Meta */}
              <div className="flex items-start gap-6 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                  {vendor.emoji}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-playfair text-xl font-bold text-slate-900 dark:text-white">
                      {vendor.name}
                    </h3>
                    {vendor.verified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-rosegold)]" /> {vendor.city}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {vendor.rating} ({vendor.reviews})
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl pt-2">
                    {vendor.desc}
                  </p>
                </div>
              </div>

              {/* Right: Price & CTA */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0 gap-4">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium block">Mulai dari</span>
                  <span className="font-bold text-lg text-[var(--text-primary)] dark:text-white">{formatRupiah(vendor.priceFrom)}</span>
                </div>
                
                <a
                  href={`https://wa.me/628123456789?text=Halo%20${encodeURIComponent(vendor.name)},%20saya%20tertarik%20dengan%20layanan%20vendor%20Anda%20melalui%20NikahLink.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-rosegold)] text-white text-sm font-semibold transition-transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--accent-rosegold)]/20"
                >
                  <Phone className="w-4 h-4" /> Hubungi Vendor
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
