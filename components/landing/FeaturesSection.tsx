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
            Fitur Terlengkap
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">
            18+ Fitur Unggulan untuk Undangan Sempurna
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Semua yang kalian butuhkan untuk pernikahan impian telah siap digunakan tanpa perlu biaya tambahan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 text-left">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="card-wevitation p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] shadow-sm flex flex-col justify-between space-y-3 group"
              >
                <div
                  className="rounded-xl bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] flex items-center justify-center group-hover:scale-105 transition-transform mb-1"
                  style={{ width: "44px", height: "44px", minWidth: "44px", minHeight: "44px" }}
                >
                  <Icon size={22} className="text-[#C58F78]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#2D2424] dark:text-[#FDFBF7] text-base group-hover:text-[#C58F78] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[#756767] dark:text-[#B39E9E] text-xs sm:text-sm mt-1.5 leading-relaxed">
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
