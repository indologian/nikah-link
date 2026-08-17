"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Berapa lama proses pembuatan undangan digital?",
    a: "Sangat cepat! Cukup 5 menit untuk mengisi data mempelai, memilih tema, dan menambah info acara. Undangan langsung aktif dan bisa dibagikan.",
  },
  {
    q: "Apakah undangan digital benar-benar aktif selamanya?",
    a: "Ya! Paket Premium dan Pro NikahLink berlaku sekali bayar tanpa biaya langganan bulanan. Website undanganmu akan tetap aktif sebagai kenangan selamanya.",
  },
  {
    q: "Bagaimana cara membagikan undangan dengan nama tamu khusus?",
    a: "Di dashboard NikahLink, kamu cukup memasukkan nama tamu. Sistem akan otomatis membuatkan link unik khusus (misal: nikahlink.com/romeo-juliet?to=Budi) beserta teks sapaan manis yang siap dikirim via WhatsApp.",
  },
  {
    q: "Apakah tamu bisa memberikan kado secara cashless?",
    a: "Tentu! Kamu bisa memasukkan nomor rekening bank (BCA, Mandiri, dll), QRIS, atau nomor e-wallet. Tamu dapat menyalin nomor rekening dan mengirimkan hadiah dengan mudah.",
  },
  {
    q: "Apakah saya bisa mengubah informasi acara setelah undangan dibuat?",
    a: "Bisa banget! Kamu dapat mengedit data lokasi, waktu, foto, hingga lagu latar kapan saja dari dashboard tanpa mengubah link undangan yang sudah terlanjur dibagikan.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      className="w-full flex flex-col items-center justify-center py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Pertanyaan<br />Sering Diajukan
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Punya pertanyaan lain? Kami siap membantu menjawab semua keraguan kalian.
          </p>
        </div>

        {/* Accordion - Flat borders */}
        <div className="w-full text-left border-t border-slate-200 dark:border-slate-800">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full py-6 text-left font-medium tracking-tight text-slate-900 dark:text-white text-base sm:text-lg flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 px-4 transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <HelpCircle size={18} className="text-slate-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-6 pt-2 pl-[3.25rem] text-slate-500 text-sm sm:text-base leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
