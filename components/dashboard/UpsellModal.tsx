"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  planNeeded?: "premium" | "pro";
}

export default function UpsellModal({
  isOpen,
  onClose,
  title = "Akses Terbatas",
  description = "Kamu telah mencapai batas untuk fitur ini. Tingkatkan paketmu untuk mendapatkan akses tanpa batas.",
  planNeeded = "premium",
}: UpsellModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const targetPlanName = planNeeded === "premium" ? "Premium" : "Pro VIP";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#221C28]/60 dark:bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#1A1517] rounded-3xl shadow-2xl border border-[#C58F78]/30 dark:border-[#C58F78]/20 overflow-hidden"
          >
            {/* Header Pattern */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-[#F7EDE8] to-[#FDFBF7] dark:from-[#251E21] dark:to-[#1A1517] opacity-80 pointer-events-none" />
            
            <div className="relative p-6 sm:p-8 text-center pt-10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#C58F78] to-[#A3735E] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#C58F78]/30 mb-6 rotate-3">
                <Crown className="w-8 h-8 -rotate-3" />
              </div>

              <h3 className="text-2xl font-bold font-playfair text-[#2D2424] dark:text-[#FDFBF7] mb-3">
                {title}
              </h3>
              
              <p className="text-slate-600 dark:text-[#B39E9E] text-sm leading-relaxed mb-8">
                {description}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/harga?plan=${planNeeded}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 btn-wevitation text-white py-3.5 rounded-xl font-bold text-sm shadow-md"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade ke {targetPlanName}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-sm font-bold text-slate-500 dark:text-[#8D7575] hover:bg-slate-50 dark:hover:bg-[#251E21] transition-colors"
                >
                  Mungkin Nanti
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
