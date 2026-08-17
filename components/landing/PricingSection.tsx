"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  onCheckout?: (plan: "premium" | "pro") => void;
  isLoading?: string | null;
}

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  priceNote: string;
  fomoBadge?: string;
  features: PlanFeature[];
  cta: string;
  ctaHref: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    subtitle: "Coba Dulu",
    price: "Rp0",
    priceNote: "Hanya untuk uji coba",
    fomoBadge: "⏳ Habis dalam 24 Jam",
    features: [
      { text: "1 Undangan Digital", included: true },
      { text: "Aktif 24 jam", included: true },
      { text: "Hingga 50 tamu", included: true },
      { text: "5 foto galeri", included: true },
      { text: "Musik latar custom MP3", included: true },
      { text: "Ucapan & doa tamu", included: true },
      { text: "Aktif Selamanya", included: false },
      { text: "Personalisasi URL", included: false },
      { text: "Kado cashless (QRIS)", included: false },
      { text: "Custom domain", included: false },
    ],
    cta: "Coba 24 Jam",
    ctaHref: "/daftar",
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Paling Favorit",
    price: "Rp99K",
    originalPrice: "Rp249K",
    priceNote: "Sekali bayar, masa aktif 3 bulan",
    features: [
      { text: "1 Undangan Premium", included: true },
      { text: "Aktif 3 Bulan", included: true },
      { text: "Unlimited tamu terundang", included: true },
      { text: "30 foto + 3 video galeri", included: true },
      { text: "Musik latar custom MP3", included: true },
      { text: "Akses semua 30+ tema premium", included: true },
      { text: "Kado cashless (QRIS)", included: true },
      { text: "Personalisasi URL", included: true },
      { text: "Custom domain sendiri", included: false },
    ],
    cta: "Upgrade & Bebas Akses",
    ctaHref: "/daftar?plan=premium",
  },
  {
    id: "pro",
    name: "Pro VIP",
    subtitle: "Untuk yang Terbaik",
    price: "Rp299K",
    originalPrice: "Rp499K",
    priceNote: "Sekali bayar, aktif selamanya",
    features: [
      { text: "Semua fitur paket Premium", included: true },
      { text: "Unlimited foto & video galeri", included: true },
      { text: "Custom domain sendiri", included: true, highlight: true },
      { text: "Hapus logo & branding", included: true, highlight: true },
      { text: "Kustomisasi CSS/JS bebas", included: true },
      { text: "2 undangan dalam 1 akun", included: true },
      { text: "Prioritas dukungan 24/7", included: true },
      { text: "Ekspor data tamu (XLSX)", included: true },
    ],
    cta: "Dapatkan Akses Penuh",
    ctaHref: "/daftar?plan=pro",
  },
];

export default function PricingSection({ onCheckout, isLoading }: PricingSectionProps = {}) {
  return (
    <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="flex flex-col items-start lg:flex-row lg:justify-between mb-16 gap-8">
        <div className="max-w-2xl space-y-4">
          <span className="text-slate-900 dark:text-white font-mono tracking-widest text-xs uppercase">
            Investasi Momen Bahagia
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.05]">
            Satu kali bayar.<br/>
            Aktif selamanya.
          </h2>
        </div>
        <p className="text-slate-500 text-lg max-w-md lg:text-right lg:self-end">
          Pilih paket yang sesuai dengan kebutuhan pernikahan Anda. Tanpa biaya langganan bulanan yang tersembunyi.
        </p>
      </div>

      {/* Pricing Grid - Flat, editorial aesthetic */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-x md:border-x-0 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        {PLANS.map((plan, i) => {
          const isProcessing = isLoading === plan.id;
          const isPremium = plan.id === "premium";
          
          return (
            <div
              key={plan.id}
              className={cn(
                "p-8 sm:p-10 flex flex-col justify-between relative",
                "border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 transition-colors",
                i === 0 && "md:border-l",
                i === PLANS.length - 1 && "md:border-r",
                isPremium ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : ""
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "text-xs font-mono font-bold uppercase tracking-widest",
                    isPremium ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white"
                  )}>
                    {plan.name}
                  </span>
                  {isPremium && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-900 bg-white dark:text-white dark:bg-slate-900 px-2 py-0.5 flex items-center gap-1">
                      <Sparkles size={10} /> Favorit
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="my-8">
                  {plan.fomoBadge && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold uppercase tracking-wider border border-rose-200 dark:border-rose-900/50">
                        {plan.fomoBadge}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-5xl font-medium tracking-tight",
                      isPremium ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white"
                    )}>
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className={cn(
                        "text-sm font-mono line-through",
                        isPremium ? "text-slate-400 dark:text-slate-500" : "text-slate-400"
                      )}>
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm mt-2 font-mono",
                    isPremium ? "text-slate-300 dark:text-slate-600" : "text-slate-500"
                  )}>
                    {plan.priceNote}
                  </p>
                </div>

                <div className={cn(
                  "w-full h-px my-8",
                  isPremium ? "bg-slate-800 dark:bg-slate-200" : "bg-slate-200 dark:bg-slate-800"
                )} />

                {/* Features List */}
                <ul className="space-y-4 mb-12">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={cn(
                      "flex items-start gap-3 text-sm",
                      !feature.included && "opacity-50",
                      feature.highlight && "font-bold"
                    )}>
                      {feature.included ? (
                        <Check className={cn(
                          "w-4 h-4 shrink-0 mt-0.5",
                          isPremium ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white"
                        )} />
                      ) : (
                        <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center font-bold font-mono text-xs">×</span>
                      )}
                      <span className={cn(
                        "leading-snug",
                        !feature.included && "line-through",
                        isPremium 
                          ? (feature.highlight ? "text-white dark:text-slate-900" : "text-slate-300 dark:text-slate-700") 
                          : (feature.highlight ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300")
                      )}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {onCheckout && plan.id !== "free" ? (
                <button
                  onClick={() => onCheckout(plan.id as "premium" | "pro")}
                  disabled={!!isLoading}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 font-bold uppercase tracking-wider text-xs transition-colors mt-auto border",
                    isPremium 
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-white dark:border-slate-900"
                      : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white hover:bg-slate-800 dark:hover:bg-slate-100",
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
                    "w-full block text-center py-4 font-bold uppercase tracking-wider text-xs transition-colors mt-auto border",
                    isPremium
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-white dark:border-slate-900"
                      : "bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-12 text-center sm:text-left border-t border-slate-200 dark:border-slate-800 pt-6">
        <p className="text-slate-500 font-mono text-xs uppercase tracking-wider">
          Pembayaran terverifikasi otomatis melalui Midtrans (Bank Transfer, GoPay, QRIS).
        </p>
      </div>
    </section>
  );
}
