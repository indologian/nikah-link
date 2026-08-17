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
      className="w-full flex flex-col items-center justify-center py-16 lg:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Cerita Pasangan
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Dipercaya 125.000+<br />Pasangan Bahagia
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Kisah nyata dari pasangan yang mempercayakan momen sakral mereka kepada NikahLink.
          </p>
        </div>

        {/* Testimonials Grid - Hairline borders */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-950 p-8 sm:p-10 space-y-6 flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, idx) => (
                    <Star key={idx} size={14} className="text-slate-900 dark:text-white fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-medium tracking-tight text-slate-900 dark:text-white text-base">{t.name}</h4>
                  <p className="text-slate-500 text-xs font-mono tracking-wider mt-1">{t.city} • Tema {t.theme}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <Heart size={14} className="text-slate-900 dark:text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
