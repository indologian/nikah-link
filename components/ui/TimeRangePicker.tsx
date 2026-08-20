"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

function parseTimeValue(value: string) {
  const lower = value.toLowerCase();
  const timezone = lower.includes("wita") ? "WITA" : lower.includes("wit") ? "WIT" : "WIB";
  const isSelesai = lower.includes("selesai");
  const times = value.match(/\d{2}:\d{2}/g) ?? [];

  return {
    startTime: times[0] ?? "08:00",
    endTime: times[1] ?? "10:00",
    isSelesai: times.length < 2 ? isSelesai || Boolean(value) : false,
    timezone,
  };
}

export default function TimeRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [startTime, setStartTime] = useState(() => parseTimeValue(value).startTime);
  const [endTime, setEndTime] = useState(() => parseTimeValue(value).endTime);
  const [isSelesai, setIsSelesai] = useState(() => parseTimeValue(value).isSelesai);
  const [timezone, setTimezone] = useState(() => parseTimeValue(value).timezone);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(Boolean(value));

  useEffect(() => {
    if (!hasInitialized.current && isOpen) {
      hasInitialized.current = true;
    }

    if (!hasInitialized.current) return;

    const result = isSelesai
      ? `${startTime} ${timezone} - Selesai`
      : `${startTime} - ${endTime} ${timezone}`;

    if (value !== result) {
      onChange(result);
    }
  }, [startTime, endTime, isSelesai, timezone, isOpen, value, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
      >
        <span className={value ? "text-slate-900 dark:text-white" : "text-slate-400"}>
          {value || "Pilih Waktu..."}
        </span>
        <Clock className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-[calc(100vw-3rem)] max-w-[320px] -left-2 sm:left-0 mt-1 p-5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 space-y-5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Mulai</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white transition-colors"
              />
            </div>
            <div className="pt-6 text-slate-400 font-bold">-</div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">Berakhir</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isSelesai}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelesai}
                onChange={(e) => setIsSelesai(e.target.checked)}
                className="w-4 h-4 text-slate-900 bg-white border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:ring-slate-900 dark:focus:ring-white accent-slate-900 dark:accent-white cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sampai Selesai</span>
            </label>

            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-slate-900 dark:focus:border-white"
            >
              <option value="WIB">WIB</option>
              <option value="WITA">WITA</option>
              <option value="WIT">WIT</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-3 text-xs uppercase tracking-widest font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Terapkan
          </button>
        </div>
      )}
    </div>
  );
}
