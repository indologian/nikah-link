"use client";

import { motion } from "framer-motion";
import { Leaf, Wind, Heart, Banknote } from "lucide-react";

const ECO_STATS = [
  {
    icon: Leaf,
    value: "2,150",
    unit: "ton",
    label: "Kertas Dihindari",
    description: "Setara 4.300 pohon yang diselamatkan dari penebangan",
  },
  {
    icon: Wind,
    value: "890",
    unit: "ton CO₂",
    label: "Emisi Berkurang",
    description: "Setara emisi 500 mobil yang tidak beroperasi selama setahun",
  },
  {
    icon: Heart,
    value: "125K+",
    unit: "pasangan",
    label: "Memilih Digital",
    description: "Bergabung bersama ribuan pasangan peduli lingkungan",
  },
  {
    icon: Banknote,
    value: "Rp 62M+",
    unit: "",
    label: "Cetak Dihemat",
    description: "Total penghematan percetakan undangan fisik",
  },
];

export default function EcoImpact() {
  return (
    <section
      className="w-full flex flex-col items-center justify-center py-16 lg:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Dampak Lingkungan
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Undangan Digital<br />
            Untuk Bumi yang Lebih Baik
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Setiap undangan digital yang kalian buat berdampak nyata bagi lingkungan. Bersama NikahLink, rayakan cinta sekaligus jaga bumi.
          </p>
        </div>

        {/* Stats Grid - Hairline border grid trick */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {ECO_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-slate-950 p-8 sm:p-10 text-center flex flex-col items-center group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-slate-900 dark:bg-white flex items-center justify-center mx-auto mb-6">
                    <Icon size={20} className="text-white dark:text-slate-900" />
                  </div>

                  <div>
                    <span className="text-4xl font-medium tracking-tight text-slate-900 dark:text-white block mb-1">{stat.value}</span>
                    {stat.unit && (
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-4">{stat.unit}</span>
                    )}
                  </div>

                  <p className="text-slate-900 dark:text-white font-medium text-base mb-2">{stat.label}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
