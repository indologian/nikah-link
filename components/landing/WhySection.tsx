"use client";

import { motion } from "framer-motion";
import { Palette, Zap, Users, Heart, Leaf, ShoppingBag } from "lucide-react";

const WHY_ITEMS = [
  {
    icon: Palette,
    title: "Eksklusif & Tidak Pasaran",
    description: "Tinggalkan desain undangan yang kaku. Nikmati puluhan tema premium yang membuat tamu Anda terkesan sejak detik pertama.",
  },
  {
    icon: Zap,
    title: "Bikinnya Cuma 5 Menit",
    description: "Tidak perlu jago desain atau koding. Cukup isi formulir, masukkan foto, dan undangan siap disebar hari ini juga.",
  },
  {
    icon: Users,
    title: "Bebas Drama RSVP",
    description: "Lupakan mencatat kehadiran tamu satu-satu lewat WhatsApp. Semua konfirmasi kehadiran terekap otomatis di dashboard Anda.",
  },
  {
    icon: Heart,
    title: "Bayar Sekali, Aktif Selamanya",
    description: "Tanpa biaya langganan bulanan yang mencekik. Website undangan pernikahan Anda akan menjadi kenangan digital yang abadi.",
  },
  {
    icon: ShoppingBag,
    title: "Terima Kado Tanpa Ribet",
    description: "Tamu yang berhalangan hadir tetap bisa memberikan kado melalui fitur amplop digital (QRIS, e-Wallet, Bank Transfer) yang aman.",
  },
  {
    icon: Leaf,
    title: "Praktis & Ramah Lingkungan",
    description: "Hemat jutaan rupiah dari biaya cetak dan ongkos kirim. Cukup bagikan link via WA, dan bantu kurangi limbah kertas.",
  },
];

export default function WhySection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-16 lg:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Tinggalkan Cara Lama
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Kenapa Beralih ke<br />Undangan Digital?
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg mx-auto">
            Kami menyelesaikan semua masalah undangan cetak yang mahal, lambat, dan merepotkan. Saatnya beralih ke cara yang lebih cerdas.
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
