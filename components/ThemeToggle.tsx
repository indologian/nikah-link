"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-xl bg-white/50 border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#E8E1E1] flex items-center justify-center w-[36px] h-[36px]">
        <span className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#E8E1E1] hover:bg-[#F8F3EC] dark:hover:bg-[#251E21] flex items-center justify-center transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
