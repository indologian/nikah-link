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
      className="w-full flex flex-col items-center justify-center py-16 lg:py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Langkah Mudah
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Cara Kerja NikahLink
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Hanya butuh 5 menit dari pendaftaran hingga undangan siap dibagikan ke seluruh keluarga & teman.
          </p>
        </div>

        {/* 5 Steps Grid - Hairline border grid trick */}
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white dark:bg-slate-950 p-6 sm:p-8 flex flex-col items-center group"
              >
                <div className="space-y-4 flex flex-col items-center">
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-1 mb-2 inline-block">
                    Tahap {s.step}
                  </div>

                  <div className="w-12 h-12 bg-slate-900 dark:bg-white flex items-center justify-center mb-2">
                    <Icon size={20} className="text-white dark:text-slate-900" />
                  </div>

                  <h3 className="font-medium tracking-tight text-slate-900 dark:text-white text-base">
                    {s.title}
                  </h3>

                  <p className="text-slate-500 text-xs leading-relaxed">
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
