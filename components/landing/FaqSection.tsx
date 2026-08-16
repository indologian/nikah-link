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
      className="w-full flex flex-col items-center justify-center py-14 sm:py-20 lg:py-24 bg-[#FDFBF7] dark:bg-[#120E10] border-b border-[#EBE4DD] dark:border-[#33272B] box-border"
      style={{
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "clamp(20px, 5vw, 40px)",
        paddingRight: "clamp(20px, 5vw, 40px)",
      }}
    >
      <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12 space-y-3">
          <span className="px-4 py-1.5 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-xs font-semibold uppercase tracking-wider inline-block">
            FAQ
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            Pertanyaan Sering Diajukan
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base leading-relaxed">
            Punya pertanyaan lain? Kami siap membantu menjawab semua keraguan kalian.
          </p>
        </div>

        {/* Accordion */}
        <div className="w-full space-y-4 text-left">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="w-full bg-white dark:bg-[#1A1517] rounded-2xl border border-[#EBE4DD] dark:border-[#33272B] shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full p-5 sm:p-6 text-left font-bold text-[#2D2424] dark:text-[#FDFBF7] text-sm sm:text-base flex items-center justify-between gap-4 hover:text-[#C58F78] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-[#C58F78] flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#C58F78]" : ""
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
                      <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 text-[#756767] dark:text-[#B39E9E] text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-[#33272B]">
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
