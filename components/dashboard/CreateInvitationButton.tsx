"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import UpsellModal from "./UpsellModal";

interface CreateInvitationButtonProps {
  plan: "free" | "premium" | "pro";
  currentCount: number;
}

export default function CreateInvitationButton({ plan, currentCount }: CreateInvitationButtonProps) {
  const router = useRouter();
  const [showUpsell, setShowUpsell] = useState(false);

  const limits = {
    free: 1,
    premium: 1,
    pro: 2
  };

  const planLimit = limits[plan] || 1;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentCount >= planLimit) {
      setShowUpsell(true);
    } else {
      router.push("/dashboard/undangan/baru");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-6 py-3 font-bold uppercase tracking-widest text-[11px] flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
      >
        <Plus className="w-4 h-4" /> Buat Undangan Baru
      </button>

      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        title="Batas Undangan Tercapai"
        description={`Paket ${plan.toUpperCase()} kamu membatasi maksimal ${planLimit} undangan. Tingkatkan paketmu untuk membuat undangan lebih banyak!`}
        planNeeded={plan === "free" ? "premium" : "pro"}
      />
    </>
  );
}
