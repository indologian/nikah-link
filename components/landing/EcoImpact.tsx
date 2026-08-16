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
      className="w-full flex flex-col items-center justify-center py-14 sm:py-20 lg:py-24 bg-[#FDFBF7] dark:bg-[#120E10] border-b border-[#EBE4DD] dark:border-[#33272B] box-border"
      style={{
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "clamp(20px, 5vw, 40px)",
        paddingRight: "clamp(20px, 5vw, 40px)",
      }}
    >
      <div className="w-full max-w-4xl lg:max-w-5xl flex flex-col items-center justify-center text-center">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-300 bg-emerald-50 inline-block">
            <Leaf size={16} className="text-emerald-700" />
            <span className="text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Eco-Friendly Platform
            </span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            Undangan Digital untuk <br />
            <span className="italic text-emerald-700">Bumi yang Lebih Baik</span>
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Setiap undangan digital yang kalian buat berdampak nyata bagi lingkungan.
            Bersama NikahLink, rayakan cinta sekaligus jaga bumi.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {ECO_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-[#1A1517] rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-sm text-center flex flex-col items-center justify-between space-y-3"
              >
                <div className="space-y-3">
                  <div
                    className="rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto"
                    style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}
                  >
                    <Icon size={22} className="text-emerald-700" />
                  </div>

                  <div>
                    <span className="text-3xl font-extrabold text-[#2D2424] dark:text-[#FDFBF7]">{stat.value}</span>
                    {stat.unit && (
                      <span className="text-xs text-emerald-700 ml-1 font-bold">{stat.unit}</span>
                    )}
                  </div>

                  <p className="text-slate-900 font-bold text-sm">{stat.label}</p>
                  <p className="text-[#756767] dark:text-[#B39E9E] text-xs leading-relaxed">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
