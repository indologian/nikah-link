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
    <section className="w-full flex flex-col items-center justify-center py-16 lg:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Kenapa NikahLink?
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Platform Terbaik<br />Untuk Hari Bahagiamu
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg mx-auto">
            Kami menggabungkan teknologi terkini dan kemudahan penggunaan untuk menciptakan pengalaman undangan digital yang sempurna.
          </p>
        </div>

        {/* 6 Grid Items - 1px hairline border trick */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {WHY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-950 p-8 sm:p-10 flex flex-col text-left group"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-slate-900 dark:bg-white flex items-center justify-center">
                    <Icon size={20} className="text-white dark:text-slate-900" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
