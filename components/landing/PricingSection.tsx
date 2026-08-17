"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Loader2 } from "lucide-react";
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
    features: [
      "1 Undangan Digital",
      "Aktif 24 jam",
      "Hingga 50 tamu",
      "5 foto galeri",
      "Musik latar standard",
      "Ucapan & doa tamu",
      "3 tema gratis",
    ],
    cta: "Daftar Gratis",
    ctaHref: "/daftar",
    ctaStyle: "border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50",
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Paling Favorit",
    price: "Rp79K",
    originalPrice: "Rp150K",
    priceNote: "Sekali bayar, aktif selamanya",
    features: [
      "1 Undangan Premium",
      "Aktif Selamanya",
      "Unlimited tamu terundang",
      "30 foto + 3 video galeri",
      "Musik latar custom MP3",
      "Akses semua 30+ tema premium",
      "Kado cashless (QRIS)",
      "Personalisasi nama tamu pada URL",
    ],
    cta: "Pilih Premium",
    ctaHref: "/daftar?plan=premium",
    ctaStyle: "bg-[var(--accent-rosegold)] text-white hover:bg-[var(--accent-rosegold-hover)]",
  },
  {
    id: "pro",
    name: "Pro VIP",
    subtitle: "Untuk yang Terbaik",
    price: "Rp149K",
    originalPrice: "Rp300K",
    priceNote: "Sekali bayar, aktif selamanya",
    features: [
      "Semua fitur paket Premium",
      "Unlimited foto & video galeri",
      "Custom domain sendiri",
      "Hapus logo & branding NikahLink",
      "Kustomisasi CSS/JS bebas",
      "2 undangan dalam 1 akun",
      "Prioritas dukungan 24/7",
      "Ekspor data tamu (XLSX)",
    ],
    cta: "Pilih Pro VIP",
    ctaHref: "/daftar?plan=pro",
    ctaStyle: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100",
  },
];

export default function PricingSection({ onCheckout, isLoading }: PricingSectionProps = {}) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative border-t border-slate-200 dark:border-slate-800 bg-[var(--bg-primary)]">
      {/* Hallmark: No aurora blobs or glowing gradients here */}

      <div className="flex flex-col items-start lg:flex-row lg:justify-between mb-16 gap-8">
        <div className="max-w-2xl space-y-4">
          <span className="text-[var(--accent-rosegold)] font-semibold tracking-widest text-xs uppercase">
            Investasi Momen Bahagia
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-[var(--text-primary)] dark:text-white leading-[1.1]">
            Satu kali bayar.<br/>
            Aktif selamanya.
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-base max-w-md lg:text-right lg:self-end">
          Pilih paket yang sesuai dengan kebutuhan pernikahan Anda. Tanpa biaya langganan bulanan yang tersembunyi.
        </p>
      </div>

      {/* Pricing Grid - Flat, editorial aesthetic */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
        {PLANS.map((plan, i) => {
          const isProcessing = isLoading === plan.id;
          
          return (
            <div
              key={plan.id}
              className={cn(
                "p-8 flex flex-col justify-between relative",
                i !== 0 && "border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800"
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-rosegold)]">
                    {plan.name}
                  </span>
                  {plan.id === "premium" && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-rosegold)] bg-[var(--accent-rosegold)]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} /> Favorit
                    </span>
                  )}
                </div>

                {/* Pricing */}
                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-playfair tracking-tight text-[var(--text-primary)] dark:text-white">
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-sm font-medium text-slate-400 dark:text-slate-500 line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {plan.priceNote}
                  </p>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800/50 my-8" />

                {/* Features List */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Check className="w-4 h-4 text-[var(--accent-rosegold)] shrink-0 mt-0.5" />
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
                    "w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-colors mt-auto",
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
                    "w-full block text-center py-3.5 rounded-full font-semibold text-sm transition-colors mt-auto",
                    plan.ctaStyle
                  )}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-center sm:text-left">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          Pembayaran terverifikasi otomatis melalui Midtrans (Bank Transfer, GoPay, QRIS).
        </p>
      </div>
    </section>
  );
}
