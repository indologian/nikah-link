"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Tema Desain", href: "/tema" },
  { label: "Pilihan Harga", href: "/harga" },
  { label: "Vendor", href: "/vendor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || ""
        });
      }
    };
    fetchUser();
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 
        Hallmark Pattern: N5 Floating Pill
        Detached from edges, blurred background, max-width bounded.
      */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-[800px] pointer-events-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md saturate-150 border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-full px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-rosegold)] flex items-center justify-center transition-transform group-hover:scale-105">
              <Heart size={14} className="text-white fill-white" strokeWidth={0} />
            </div>
            <span className="font-playfair text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              NikahLink
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                  isActive(item.href)
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-900 dark:text-white text-[13px] font-medium transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--accent-rosegold)]/10 flex items-center justify-center">
                  <User size={12} className="text-[var(--accent-rosegold)]" />
                </div>
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/masuk"
                className="px-4 py-1.5 rounded-full bg-[var(--accent-rosegold)] text-white text-[13px] font-semibold hover:bg-[var(--accent-rosegold-hover)] transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for content underneath the floating nav */}
      <div className="h-24 w-full shrink-0" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-x-4 top-20 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-2xl p-4 flex flex-col md:hidden origin-top"
          >
            <div className="flex flex-col gap-1 mb-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm transition-colors"
                >
                  <User size={16} className="text-[var(--accent-rosegold)]" />
                  <span>Dashboard ({user.name})</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/masuk"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 text-center rounded-xl bg-[var(--accent-rosegold)] text-white font-semibold text-sm transition-colors hover:bg-[var(--accent-rosegold-hover)]"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Daftar Gratis
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
