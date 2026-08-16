"use client";

import { motion } from "framer-motion";
import { UserPlus, Palette, FileEdit, Share2, HeartHandshake } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserPlus,
    title: "Buat Akun Gratis",
    description: "Daftar dalam 30 detik tanpa biaya. Akses langsung dashboard pembuat undangan digital.",
  },
  {
    step: "02",
    icon: Palette,
    title: "Pilih Tema Impian",
    description: "Pilih dari 30+ tema eksklusif minimalis, floral, atau adat Nusantara favorit kalian.",
  },
  {
    step: "03",
    icon: FileEdit,
    title: "Isi Informasi Acara",
    description: "Lengkapi data mempelai, lokasi Google Maps, cerita cinta, galeri foto, & rekening kado.",
  },
  {
    step: "04",
    icon: Share2,
    title: "Personalisasi & Bagikan",
    description: "Tambah nama tamu dan bagikan link khusus beserta pesan sapaan manis via WhatsApp.",
  },
  {
    step: "05",
    icon: HeartHandshake,
    title: "Pantau RSVP Real-time",
    description: "Terima konfirmasi kehadiran tamu, ucapan doa, dan amplop digital langsung di dashboard.",
  },
];

export default function HowItWorks() {
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
          <span className="px-4 py-1.5 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-xs font-semibold uppercase tracking-wider inline-block">
            Langkah Mudah
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            Cara Kerja Undangan Digital NikahLink
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Hanya butuh 5 menit dari pendaftaran hingga undangan siap dibagikan ke seluruh keluarga & teman.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-5 sm:gap-6 items-stretch text-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white dark:bg-[#1A1517] rounded-2xl p-5 border border-[#EBE4DD] dark:border-[#33272B] shadow-sm text-center flex flex-col items-center justify-between group space-y-3"
              >
                <div className="space-y-3 flex flex-col items-center">
                  <div className="text-xs font-extrabold text-[#C58F78] bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] px-2.5 py-0.5 rounded-full inline-block">
                    {s.step}
                  </div>

                  <div
                    className="rounded-xl bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform"
                    style={{ width: "42px", height: "42px", minWidth: "42px", minHeight: "42px" }}
                  >
                    <Icon size={20} className="text-[#C58F78]" />
                  </div>

                  <h3 className="font-bold text-[#2D2424] dark:text-[#FDFBF7] text-xs sm:text-sm">
                    {s.title}
                  </h3>

                  <p className="text-[#756767] dark:text-[#B39E9E] text-[11px] leading-relaxed">
                    {s.description}
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
