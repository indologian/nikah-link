"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

export default function LocationAutocomplete({ 
  value, 
  onChange, 
  onSelect,
  placeholder 
}: { 
  value: string; 
  onChange: (val: string) => void;
  onSelect: (location: any) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync value from parent
  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPlaces = async () => {
      // Don't search if less than 3 chars or matches exactly the bound value
      if (!query || query.length < 3 || query === value) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id&addressdetails=1&limit=5`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchPlaces();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, value]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          placeholder={placeholder || "Cari nama tempat / gedung..."}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1517] border border-slate-200 dark:border-[#423338] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54]"
        />
        <div className="absolute left-3 text-slate-400">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1A1517] border border-slate-200 dark:border-[#423338] rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {results.map((place) => {
            const placeName = place.name || place.display_name.split(",")[0];
            return (
              <button
                key={place.place_id}
                type="button"
                onClick={() => {
                  setQuery(placeName);
                  setShowDropdown(false);
                  onSelect(place);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#251E21] border-b border-slate-100 dark:border-[#33272B] last:border-0 flex items-start gap-3 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#9E1B54] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#FDFBF7]">
                    {placeName}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-[#B39E9E] mt-0.5 line-clamp-2">
                    {place.display_name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
