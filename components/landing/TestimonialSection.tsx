"use client";

import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ayu & Rizal",
    city: "Jakarta",
    theme: "Sakura Bloom",
    quote: "Undangan digital kami dipuji semua kerabat! Prosesnya mudah banget dan bisa langsung dibagikan ke ribuan tamu via WA.",
    stars: 5,
  },
  {
    name: "Siti & Andi",
    city: "Surabaya",
    theme: "Javanese Heritage",
    quote: "Fitur kado cashless dan konfirmasi RSVP-nya sangat membantu panitia pernikahan kami. Sangat worth it!",
    stars: 5,
  },
  {
    name: "Dewi & Budi",
    city: "Bandung",
    theme: "Midnight Luxe",
    quote: "Desainnya luar biasa mewah. Tamu-tamu terkesan saat buka amplop animasinya. Terima kasih NikahLink!",
    stars: 5,
  },
];

export default function TestimonialSection() {
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
            Cerita Pasangan
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            Dipercaya 125.000+ Pasangan Bahagia
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Kisah nyata dari pasangan yang mempercayakan momen sakral mereka kepada NikahLink.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-wevitation bg-white dark:bg-[#1A1517] p-6 sm:p-7 space-y-4 flex flex-col justify-between text-left border border-[#EBE4DD] dark:border-[#33272B] shadow-sm rounded-2xl"
            >
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, idx) => (
                    <Star key={idx} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[#2D2424] dark:text-[#FDFBF7] text-xs sm:text-sm italic leading-relaxed pt-1">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-[#33272B] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#2D2424] dark:text-[#FDFBF7] text-xs sm:text-sm">{t.name}</h4>
                  <p className="text-[#756767] dark:text-[#B39E9E] text-[11px] mt-0.5">{t.city} • Tema {t.theme}</p>
                </div>
                <div
                  className="rounded-full bg-[#F7EDE8] dark:bg-[#251E21] flex items-center justify-center border border-[#F0DDD5] dark:border-[#423338]"
                  style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }}
                >
                  <Heart size={15} className="text-[#C58F78] fill-[#C58F78]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
