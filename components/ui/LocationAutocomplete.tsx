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
  const skipSearch = useRef(true);

  // Sync value from parent if changed externally
  useEffect(() => {
    if (value !== query) {
      skipSearch.current = true;
      setQuery(value);
    }
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
      if (!query || query.length < 3) {
        setResults([]);
        return;
      }
      if (skipSearch.current) {
        skipSearch.current = false;
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
  }, [query]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            skipSearch.current = false;
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          placeholder={placeholder || "Cari nama tempat / gedung..."}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
        />
        <div className="absolute left-4 text-slate-400">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 max-h-60 overflow-y-auto">
          {results.map((place) => {
            const placeName = place.name || place.display_name.split(",")[0];
            return (
              <button
                key={place.place_id}
                type="button"
                onClick={() => {
                  skipSearch.current = true;
                  setQuery(placeName);
                  setShowDropdown(false);
                  onSelect(place);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 border-b border-slate-200 dark:border-slate-800 last:border-0 flex items-start gap-3 transition-colors"
              >
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium tracking-tight text-slate-900 dark:text-white">
                    {placeName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
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
