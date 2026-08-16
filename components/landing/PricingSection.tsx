"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  onCheckout?: (plan: "premium" | "pro") => void;
  isLoading?: string | null;
}

const PLANS = [
  {
    id: "free",
    name: "Gratis",
    subtitle: "Coba Dulu",
    price: "Rp0",
    priceNote: "Selamanya gratis",
    icon: Zap,
    popular: false,
    features: [
      "1 Undangan Digital",
      "Aktif 24 jam",
      "Hingga 50 tamu",
      "5 foto galeri",
      "Musik latar standard",
      "Ucapan & doa tamu",
      "3 tema gratis",
      "Countdown timer",
    ],
    cta: "Daftar Gratis",
    ctaHref: "/daftar",
    ctaStyle: "bg-slate-100 dark:bg-[#251E21] text-[#2D2424] dark:text-[#FDFBF7] hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-[#423338]",
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Paling Favorit",
    price: "Rp79K",
    originalPrice: "Rp150K",
    priceNote: "Sekali bayar, aktif selamanya",
    discount: "47% OFF",
    icon: Crown,
    popular: true,
    features: [
      "1 Undangan Premium",
      "Aktif Selamanya",
      "Unlimited tamu terundang",
      "30 foto + 3 video galeri",
      "Musik latar custom MP3",
      "Ucapan & doa tamu live feed",
      "Akses semua 30+ tema premium",
      "Countdown timer otomatis",
      "QR Code unik per tamu",
      "Kado cashless (bank/e-wallet/QRIS)",
      "Personalisasi nama tamu pada URL",
      "Link live streaming acara",
      "Direct share manual WhatsApp",
    ],
    cta: "Pilih Premium",
    ctaHref: "/daftar?plan=premium",
    ctaStyle: "btn-wevitation text-white shadow-md",
  },
  {
    id: "pro",
    name: "Pro VIP",
    subtitle: "Untuk yang Terbaik",
    price: "Rp149K",
    originalPrice: "Rp300K",
    priceNote: "Sekali bayar, aktif selamanya",
    discount: "50% OFF",
    icon: Building2,
    popular: false,
    features: [
      "Semua fitur paket Premium",
      "Unlimited foto & video galeri",
      "Custom domain sendiri",
      "Hapus logo & branding NikahLink",
      "Kustomisasi CSS/JS bebas",
      "2 undangan dalam 1 akun",
      "Prioritas dukungan 24/7",
      "Ekspor data tamu (CSV/PDF)",
    ],
    cta: "Pilih Pro VIP",
    ctaHref: "/daftar?plan=pro",
    ctaStyle: "bg-[#2D2424] text-white hover:bg-slate-800 shadow-sm",
  },
];

export default function PricingSection({ onCheckout, isLoading }: PricingSectionProps = {}) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      {/* Decorative bg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#FCEBF2] dark:from-[#2A1620] to-transparent rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[#C58F78] font-bold tracking-widest text-sm uppercase">Investasi Momen Bahagia</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[#2D2424] dark:text-[#FDFBF7] leading-tight">
            Pilih Paket yang Sesuai dengan Pernikahan Impian Anda
          </h2>
          <p className="text-slate-600 dark:text-[#D1C4C4] text-sm sm:text-base">
            Tanpa biaya tersembunyi. Upgrade kapan saja jika kebutuhan Anda bertambah.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            const isProcessing = isLoading === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative overflow-hidden bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] shadow-sm hover:shadow-md space-y-5 text-left",
                  plan.popular && "border-[#C58F78] ring-2 ring-[#C58F78]/20 md:-translate-y-2"
                )}
              >
                <div>
                  {/* Popular Badge Header */}
                  {plan.popular && (
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles size={13} /> Paling Favorit Pasangan
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C58F78]">
                      {plan.subtitle}
                    </span>
                    {plan.discount && (
                      <span className="text-[11px] font-bold text-white bg-[#C58F78] px-2.5 py-0.5 rounded-full">
                        {plan.discount}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#2D2424] dark:text-[#FDFBF7]">
                    {plan.name}
                  </h3>

                  {/* Pricing */}
                  <div className="my-4 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-[#2D2424] dark:text-[#FDFBF7]">
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-sm font-medium text-slate-400 dark:text-[#8C7A7A] line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-[#B39E9E]">
                    {plan.priceNote}
                  </p>

                  <div className="w-full h-px bg-slate-100 dark:bg-[#33272B] my-6" />

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-[#D1C4C4]">
                        <Check className="w-4 h-4 text-[#C58F78] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {onCheckout && plan.id !== "free" ? (
                  <button
                    onClick={() => onCheckout(plan.id as "premium" | "pro")}
                    disabled={!!isLoading}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all mt-4",
                      plan.ctaStyle,
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>
                ) : (
                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      "w-full block text-center py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all mt-4",
                      plan.ctaStyle
                    )}
                  >
                    {plan.cta}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
        <p className="text-center text-[#756767] dark:text-[#B39E9E] text-xs mt-8 font-medium">
          * Pembayaran terverifikasi otomatis & aman melalui Midtrans (Bank Transfer, GoPay, QRIS, Credit Card).
        </p>
      </div>
    </section>
  );
}
