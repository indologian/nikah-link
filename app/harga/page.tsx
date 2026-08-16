"use client";

import { useState } from "react";
import Script from "next/script";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PricingSection from "@/components/landing/PricingSection";
import { SNAP_URL } from "@/lib/midtrans";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    snap: any;
  }
}

export default function PricingPage() {
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

      const data = await res.json();

      if (!res.ok || !data.token) {
        if (res.status === 401) {
          window.location.href = "/masuk?redirect=/harga";
          return;
        }
        throw new Error(data.error || "Gagal memproses pembayaran.");
      }

      // Trigger Midtrans Snap Popup
      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function () {
            setMessage("Pembayaran Berhasil! Akun kamu kini telah aktif.");
            setLoadingPlan(null);
          },
          onPending: function () {
            setMessage("Menunggu pembayaran. Silakan selesaikan transaksi.");
            setLoadingPlan(null);
          },
          onError: function () {
            setMessage("Pembayaran gagal. Silakan coba lagi.");
            setLoadingPlan(null);
          },
          onClose: function () {
            setLoadingPlan(null);
          },
        });
      } else {
        // Fallback to redirect URL
        window.location.href = data.redirect_url;
      }
    } catch (err: any) {
      setMessage(err.message || "Terjadi kesalahan.");
      setLoadingPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#120E10] text-[#2D2424] dark:text-[#FDFBF7] flex flex-col w-full">
      {/* Midtrans Snap JS Script */}
      <Script
        src={SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <Navbar />

      {message && (
        <div className="pt-24 px-4 max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] text-sm font-semibold flex items-center justify-center gap-2"
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
