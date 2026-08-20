"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PricingSection from "@/components/landing/PricingSection";
import { MIDTRANS_SNAP_URL } from "@/lib/midtrans-client";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type MidtransResultHandler = () => void;

type MidtransSnap = {
  pay: (
    token: string,
    callbacks: {
      onSuccess: MidtransResultHandler;
      onPending: MidtransResultHandler;
      onError: MidtransResultHandler;
      onClose: MidtransResultHandler;
    },
  ) => void;
};

declare global {
  interface Window {
    snap?: MidtransSnap;
  }
}

type PaymentTokenResponse = {
  token?: string;
  redirect_url?: string;
  error?: string;
};

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleCheckout = async (plan: "premium" | "pro") => {
    setLoadingPlan(plan);
    setMessage("");

    try {
      const res = await fetch("/api/payment/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as PaymentTokenResponse;

      if (!res.ok || !data.token) {
        if (res.status === 401) {
          router.push("/masuk?redirect=/harga");
          return;
        }
        throw new Error(data.error || "Gagal memproses pembayaran.");
      }

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: () => {
            setMessage("Pembayaran Berhasil! Akun kamu kini telah aktif.");
            setLoadingPlan(null);
          },
          onPending: () => {
            setMessage("Menunggu pembayaran. Silakan selesaikan transaksi.");
            setLoadingPlan(null);
          },
          onError: () => {
            setMessage("Pembayaran gagal. Silakan coba lagi.");
            setLoadingPlan(null);
          },
          onClose: () => {
            setLoadingPlan(null);
          },
        });
      } else if (data.redirect_url) {
        window.location.assign(data.redirect_url);
      } else {
        throw new Error("Token pembayaran tidak tersedia.");
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col w-full">
      <Script
        src={MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <Navbar />

      {message && (
        <div className="pt-24 px-4 max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-none bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> {message}
          </motion.div>
        </div>
      )}

      <PricingSection onCheckout={handleCheckout} isLoading={loadingPlan} />

      <Footer />
    </main>
  );
}
