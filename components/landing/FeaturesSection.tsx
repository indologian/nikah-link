"use client";

import { motion } from "framer-motion";
import {
  Monitor, PenLine, Music, MessageCircleHeart, Gift, Images,
  Send, Users, QrCode, BarChart3, MapPin, Calendar
} from "lucide-react";

const FEATURES = [
  { icon: Monitor, title: "Aktif Selamanya", desc: "Satu kali bayar, website undanganmu tetap aktif tanpa batas waktu." },
  { icon: PenLine, title: "Personalisasi Suka-suka", desc: "Edit tema, foto, teks, musik, dan informasi acara kapan saja dari dashboard." },
  { icon: Music, title: "Musik Latar Custom", desc: "Upload lagu MP3 romantis favorit kalian yang berputar otomatis saat dibuka." },
  { icon: MessageCircleHeart, title: "Buku Tamu & Wishes Wall", desc: "Koleksi pesan, ucapan, dan doa tulus dari para tamu terundang secara live." },
  { icon: Gift, title: "Kado Cashless & QRIS", desc: "Tamu dapat memberikan amplop digital via transfer bank, e-wallet, atau QRIS." },
  { icon: Images, title: "Galeri Foto & Film", desc: "Sematkan galeri foto pre-wedding resolusi tinggi & video kenangan romantis." },
  { icon: Send, title: "Share Link Manual WhatsApp", desc: "Format pesan sapaan manis yang siap dikirim langsung via WhatsApp ke tamu." },
  { icon: Users, title: "Manajemen Tamu Khusus", desc: "Atur daftar nama tamu, sesi kedatangan (pagi/siang/malam), dan kuota." },
  { icon: QrCode, title: "QR Code Check-in Tamu", desc: "Tamu mendapatkan kode QR unik untuk verifikasi kedatangan di penerima tamu." },
  { icon: BarChart3, title: "Analitik Real-time", desc: "Pantau statistik pengunjung, jumlah konfirmasi RSVP, dan total amplop masuk." },
  { icon: MapPin, title: "Integrasi Google Maps", desc: "Petunjuk arah sekali klik memudahkan tamu menuju lokasi akad & resepsi." },
  { icon: Calendar, title: "Countdown Timer", desc: "Hitung mundur otomatis hingga hari bahagia pernikahan kalian." },
];

export default function FeaturesSection() {
  return (
    <section
      id="fitur"
      className="w-full flex flex-col items-center justify-center py-20 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase block">
            Fitur Terlengkap
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            18+ Fitur Unggulan<br />Untuk Hari Sempurna
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Semua yang kalian butuhkan untuk pernikahan impian telah siap digunakan tanpa perlu biaya tambahan.
          </p>
        </div>

        {/* Features Grid - Hairline border grid trick */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-slate-950 p-6 sm:p-8 flex flex-col space-y-4 group"
              >
                <div className="w-10 h-10 bg-slate-900 dark:bg-white flex items-center justify-center mb-2">
                  <Icon size={18} className="text-white dark:text-slate-900" />
                </div>
                <div>
                  <h3 className="font-medium tracking-tight text-slate-900 dark:text-white text-base">
                    {feat.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                    {feat.desc}
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
