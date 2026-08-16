"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  plan: string;
  createdAt: string;
}

export default function CountdownLabel({ plan, createdAt }: Props) {
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (plan !== "free") return;

    const expiresAt = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeftStr("Kedaluwarsa");
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
        setTimeLeftStr(`${h}:${m}:${s}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [plan, createdAt]);

  if (plan !== "free") return null;

  if (isExpired) {
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
        <Clock className="w-3 h-3" /> Kedaluwarsa
      </span>
    );
  }

  if (!timeLeftStr) return null;

  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> {timeLeftStr}
    </span>
  );
}
