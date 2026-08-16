"use client";

import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

export default function TimeRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isSelesai, setIsSelesai] = useState(true);
  const [timezone, setTimezone] = useState("WIB");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Basic parser for initial value
    if (value && !hasInitialized.current) {
      hasInitialized.current = true;
      const lower = value.toLowerCase();
      if (lower.includes("wita")) setTimezone("WITA");
      else if (lower.includes("wit")) setTimezone("WIT");
      else setTimezone("WIB");

      if (lower.includes("selesai")) {
        setIsSelesai(true);
      } else {
        setIsSelesai(false);
      }

      // Extract times using regex
      const times = value.match(/\d{2}:\d{2}/g);
      if (times && times.length > 0) {
        setStartTime(times[0]);
        if (times.length > 1) {
          setEndTime(times[1]);
          setIsSelesai(false);
        }
      }
    }
  }, [value]);

  // Update parent whenever our internal state changes
  useEffect(() => {
    if (!hasInitialized.current) {
        // If not initialized by a prop value yet, let's initialize it so it sets a default when opened for the first time
        if (isOpen) {
            hasInitialized.current = true;
        } else {
            return;
        }
    }
    
    let result = "";
    if (isSelesai) {
      result = `${startTime} ${timezone} - Selesai`;
    } else {
      result = `${startTime} - ${endTime} ${timezone}`;
    }
    
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
        className="w-full px-4 py-2.5 flex items-center justify-between rounded-xl bg-white dark:bg-[#1A1517] border border-slate-200 dark:border-[#423338] text-slate-800 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54] transition-colors"
      >
        <span className={value ? "text-slate-800 dark:text-[#FDFBF7]" : "text-slate-400"}>
          {value || "Pilih Waktu..."}
        </span>
        <Clock className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full md:w-80 mt-2 p-4 bg-white dark:bg-[#1A1517] border border-slate-200 dark:border-[#423338] rounded-xl shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mulai</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#251E21] border border-slate-200 dark:border-[#423338] text-sm focus:outline-none focus:border-[#9E1B54] dark:text-slate-200"
              />
            </div>
            <div className="pt-5 text-slate-400 font-bold">-</div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Berakhir</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isSelesai}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#251E21] border border-slate-200 dark:border-[#423338] text-sm focus:outline-none focus:border-[#9E1B54] disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-200"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#33272B]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelesai}
                onChange={(e) => setIsSelesai(e.target.checked)}
                className="w-4 h-4 rounded text-[#9E1B54] focus:ring-[#9E1B54] cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-[#D1C4C4]">Sampai Selesai</span>
            </label>
            
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-[#251E21] border border-slate-200 dark:border-[#423338] rounded-md text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#9E1B54]"
            >
              <option value="WIB">WIB</option>
              <option value="WITA">WITA</option>
              <option value="WIT">WIT</option>
            </select>
          </div>
          
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-2 bg-[#9E1B54] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#8A1548] transition-colors"
          >
            Terapkan
          </button>
        </div>
      )}
    </div>
  );
}
