"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Search, MapPin, Star, ShieldCheck, Phone } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const SAMPLE_VENDORS = [
  {
    id: "1",
    name: "Aura Motion Photography",
    category: "fotografi",
    city: "Jakarta Selatan",
    rating: 4.9,
    reviews: 128,
    priceFrom: 4500000,
    gradient: "from-pink-100 to-rose-200",
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
    gradient: "from-amber-100 to-yellow-200",
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
    gradient: "from-purple-100 to-indigo-200",
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
    gradient: "from-emerald-100 to-teal-200",
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
    gradient: "from-rose-100 to-pink-200",
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
    gradient: "from-blue-100 to-indigo-200",
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
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#120E10] text-[#2D2424] dark:text-[#FDFBF7] flex flex-col w-full transition-colors">
      <Navbar />

      <div
        className="w-full max-w-5xl mx-auto pt-24 sm:pt-28 pb-16 box-border"
        style={{
          width: "100%",
          boxSizing: "border-box",
          paddingLeft: "clamp(20px, 5vw, 40px)",
          paddingRight: "clamp(20px, 5vw, 40px)",
        }}
      >
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="px-4 py-1.5 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-xs font-semibold uppercase tracking-wider inline-block">
            Marketplace Vendor Terpercaya
          </span>
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            Temukan Vendor Pernikahan <span className="text-[#C58F78]">Terbaik</span>
          </h1>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base leading-relaxed">
            Ratusan vendor fotografi, dekorasi, katering, hingga WO berpengalaman siap mewujudkan pernikahan impianmu.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756767] dark:text-[#B39E9E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari vendor atau kota (contoh: Jakarta, Bandung)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#FDFBF7] placeholder:text-[#756767] dark:text-[#B39E9E]/70 dark:placeholder:text-[#8D7575] dark:text-[#B39E9E] text-sm focus:outline-none focus:border-[#C58F78] shadow-xs font-medium transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === cat.id
                    ? "btn-wevitation text-white border-[#C58F78] shadow-sm"
                    : "bg-white dark:bg-[#1A1517] text-[#2D2424] dark:text-[#FDFBF7] dark:text-[#D1C4C4] border-[#EBE4DD] dark:border-[#33272B] hover:bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] dark:hover:bg-[#251E21]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl border border-[#EBE4DD] dark:border-[#33272B] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className={`relative h-44 bg-gradient-to-br ${vendor.gradient} p-4 flex items-center justify-center border-b border-slate-100 dark:border-[#33272B]`}>
                  <span className="text-4xl opacity-80">
                    {vendor.category === "fotografi" ? "📷" : vendor.category === "katering" ? "🍽️" : vendor.category === "dekorasi" ? "🌸" : vendor.category === "wo" ? "📋" : vendor.category === "rias" ? "💄" : "🎬"}
                  </span>
                  
                  {vendor.verified && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-[#1A1517]/95 backdrop-blur-md border border-slate-200 dark:border-[#423338] text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Vendor
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-white/95 dark:bg-[#1A1517]/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-amber-500 font-bold border border-slate-200 dark:border-[#423338] shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-[#2D2424] dark:text-[#FDFBF7] dark:text-[#E8E1E1]">{vendor.rating}</span>
                    <span className="text-[#756767] dark:text-[#B39E9E] text-[10px]">({vendor.reviews})</span>
                  </div>
                </div>

                <div className="p-6 space-y-2 text-left">
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#2D2424] dark:text-[#FDFBF7] group-hover:text-[#C58F78] transition-colors">
                      {vendor.name}
                    </h3>
                    <p className="text-[#756767] dark:text-[#B39E9E] text-xs flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#C58F78]" /> {vendor.city}
                    </p>
                  </div>

                  <p className="text-[#756767] dark:text-[#B39E9E] text-xs leading-relaxed line-clamp-2 pt-1">
                    {vendor.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] border-t border-[#EBE4DD] dark:border-[#33272B] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-[#756767] dark:text-[#B39E9E] font-semibold block">Mulai dari</span>
                  <span className="font-bold text-sm text-[#C58F78]">{formatRupiah(vendor.priceFrom)}</span>
                </div>

                <a
                  href={`https://wa.me/628123456789?text=Halo%20${encodeURIComponent(vendor.name)},%20saya%20tertarik%20dengan%20layanan%20vendor%20Anda%20melalui%20NikahLink.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-wevitation px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Hubungi
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
