"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Sparkles } from "lucide-react";
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
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
          >
            <div className="relative p-8 text-center pt-12">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 mb-6">
                <Crown className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-medium tracking-tight text-slate-900 dark:text-white mb-3">
                {title}
              </h3>
              
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                {description}
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/harga?plan=${planNeeded}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white dark:bg-amber-500 dark:text-amber-950 py-4 font-bold uppercase tracking-widest text-sm hover:bg-amber-700 dark:hover:bg-amber-400 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Upgrade ke {targetPlanName}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 border border-slate-200 dark:border-slate-800 text-sm font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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
