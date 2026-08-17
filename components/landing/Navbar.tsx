"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_NAV_ITEMS = [
  { label: "Tema Desain", href: "/tema", key: "showThemes" },
  { label: "Pilihan Harga", href: "/harga", key: "showPricing" },
  { label: "Vendor", href: "/vendor", key: "showVendor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState<{label: string; href: string}[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          // If the user was deleted in the database but session still exists locally
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        if (user) {
          setUser({
            name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
            email: user.email || ""
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSettings = async () => {
      try {
        const { data: settings } = await supabase
          .from("site_settings")
          .select("config")
          .eq("id", 1)
          .single();
          
        if (settings?.config) {
          const config = settings.config;
          const filtered = DEFAULT_NAV_ITEMS.filter(item => config[item.key] !== false);
          setNavItems(filtered);
        } else {
          setNavItems(DEFAULT_NAV_ITEMS);
        }
      } catch (err) {
        setNavItems(DEFAULT_NAV_ITEMS);
      }
    };

    fetchUser();
    fetchSettings();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || ""
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 
        Hallmark Pattern: N1b Canonical SaaS
        Edge-to-edge, opaque, sharp bottom border, plain text links.
      */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-6 h-6 bg-slate-900 dark:bg-white flex items-center justify-center transition-transform group-hover:scale-105">
              <Heart size={12} className="text-white dark:text-slate-900 fill-current" strokeWidth={0} />
            </div>
            <span className="font-playfair text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              NikahLink
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-[13px] font-medium tracking-wide transition-colors",
                  isActive(item.href)
                    ? "text-slate-900 dark:text-white underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <ThemeToggle />
            {loading ? (
              <div className="w-20 h-8 animate-pulse bg-slate-100 dark:bg-slate-800" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-slate-900 dark:text-white text-[13px] font-medium hover:underline underline-offset-4 decoration-slate-300 transition-all"
              >
                <span>Dashboard ({user.name})</span>
              </Link>
            ) : (
              <Link
                href="/masuk"
                className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-slate-900 dark:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 w-full shrink-0" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-white dark:bg-slate-950 flex flex-col md:hidden overflow-y-auto"
          >
            <div className="flex flex-col p-6 gap-6">
              <nav className="flex flex-col">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-xl font-medium tracking-tight py-3",
                      isActive(item.href)
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              {loading ? (
                <div className="w-full h-12 animate-pulse bg-slate-100 dark:bg-slate-800" />
              ) : user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-4 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  Dashboard ({user.name})
                </Link>
              ) : (
                <>
                  <Link
                    href="/masuk"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-4 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-wider text-sm transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-4 text-center border border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold uppercase tracking-wider text-sm transition-colors"
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
