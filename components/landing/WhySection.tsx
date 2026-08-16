"use client";

import { motion } from "framer-motion";
import { Palette, Zap, Users, Heart, Leaf, ShoppingBag } from "lucide-react";

const WHY_ITEMS = [
  {
    icon: Palette,
    title: "Desain Premium & Modern",
    description: "15+ tema eksklusif bergaya minimalis, floral, elegan hingga adat Nusantara. Diperbarui rutin mengikuti tren pernikahan terkini.",
  },
  {
    icon: Zap,
    title: "Siap dalam 5 Menit",
    description: "Isi data mempelai, pilih tema favorit, tambah daftar tamu. Tanpa butuh kemampuan koding atau desain, langsung bisa dibagikan.",
  },
  {
    icon: Users,
    title: "Personalisasi Nama Tamu",
    description: "Setiap tamu menerima undangan dengan sapaan khusus namanya sendiri + QR Code unik untuk check-in di lokasi acara.",
  },
  {
    icon: Heart,
    title: "Aktif Selamanya",
    description: "Cukup bayar sekali tanpa biaya langganan bulanan. Website undanganmu tetap aktif selamanya sebagai kenangan abadi.",
  },
  {
    icon: Leaf,
    title: "Ramah Lingkungan (Eco)",
    description: "Setiap undangan digital membantu menghemat kertas, tinta cetak, dan menekan emisi CO₂. Pilihan tepat untuk bumi kita.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace Vendor",
    description: "Temukan fotografer, katering, dekorasi, WO, hingga makeup artist terpercaya dengan ulasan jujur di satu platform.",
  },
];

export default function WhySection() {
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
            Kenapa NikahLink?
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7] leading-tight">
            Semua Keunggulan Impian dalam Satu Platform
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            NikahLink menggabungkan teknologi terkini dan kemudahan penggunaan untuk menciptakan pengalaman undangan digital yang tiada duanya.
          </p>
        </div>

        {/* 6 Wevitation White Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {WHY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="card-wevitation p-6 sm:p-7 flex flex-col justify-between group text-left bg-white dark:bg-[#1A1517] rounded-2xl border border-[#EBE4DD] dark:border-[#33272B] shadow-sm space-y-4"
              >
                <div className="space-y-4">
                  <div
                    className="rounded-2xl bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] flex items-center justify-center group-hover:scale-105 transition-transform"
                    style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}
                  >
                    <Icon size={22} className="text-[#C58F78]" />
                  </div>

                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#2D2424] dark:text-[#FDFBF7] group-hover:text-[#C58F78] transition-colors pt-1">
                    {item.title}
                  </h3>

                  <p className="text-[#756767] dark:text-[#B39E9E] text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
