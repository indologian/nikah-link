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
  { label: "Beranda", href: "/" },
  { label: "Tema Desain", href: "/tema" },
  { label: "Fitur Unggulan", href: "/#fitur" },
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
  const [scrolled, setScrolled] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    // Inisialisasi hash saat komponen dimuat
    setCurrentHash(window.location.hash);
    
    const handleScroll = () => setScrolled(window.scrollY > 15);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Sinkronisasi ulang hash jika pathname berubah
  useEffect(() => {
    setCurrentHash(window.location.hash);
  }, [pathname]);

  const isActive = (href: string) => {
    // Jika link memiliki hash (seperti "/#fitur")
    if (href.includes("#")) {
      const hashPart = href.substring(href.indexOf("#"));
      const pathPart = href.substring(0, href.indexOf("#")) || "/";
      return pathname === pathPart && currentHash === hashPart;
    }
    
    // Jika link adalah beranda utama
    if (href === "/") {
      return pathname === "/" && currentHash === "";
    }
    
    // Untuk rute lain (seperti "/tema", "/harga")
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.includes("#")) {
      const hashPart = href.substring(href.indexOf("#"));
      setCurrentHash(hashPart);
    } else if (href === "/") {
      setCurrentHash("");
    } else {
      setCurrentHash("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-center transition-all duration-300 border-b box-border",
          scrolled
            ? "bg-[#FDFBF7]/95 dark:bg-[#1A1517]/80 backdrop-blur-xl dark:backdrop-blur-xl border-[#EBE4DD] dark:border-[#33272B] shadow-md py-3"
            : "bg-[#FDFBF7] dark:bg-[#120E10] border-[#EBE4DD] dark:border-[#33272B] py-4"
        )}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          width: "100%",
          boxSizing: "border-box",
          paddingLeft: "clamp(20px, 5vw, 40px)",
          paddingRight: "clamp(20px, 5vw, 40px)",
        }}
      >
        <div className="w-full max-w-4xl lg:max-w-5xl flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div
              className="rounded-full bg-[#C58F78] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
              style={{ width: "36px", height: "36px", minWidth: "36px", minHeight: "36px" }}
            >
              <Heart size={18} className="text-white fill-white" strokeWidth={0} />
            </div>
            <span className="font-playfair text-2xl font-bold text-[#2D2424] dark:text-[#FDFBF7] tracking-tight">
              NikahLink
            </span>
          </Link>

          {/* Desktop Nav Links with Active State Highlight */}
          <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-4">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all flex items-center justify-center",
                    active
                      ? "bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] dark:text-[#E8E1E1] font-bold shadow-xs"
                      : "text-[#756767] dark:text-[#B39E9E] hover:text-[#C58F78] hover:bg-white/60 dark:hover:bg-[#251E21]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#FDFBF7] font-semibold text-sm hover:bg-[#F8F3EC] dark:hover:bg-[#251E21] transition-colors shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] flex items-center justify-center">
                  <User size={14} className="text-[#C58F78]" />
                </div>
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                href="/masuk"
                className="btn-wevitation px-5 py-2 text-xs font-bold shadow-sm"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Right Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#FDFBF7] dark:text-[#E8E1E1] hover:bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] dark:hover:bg-[#251E21] flex items-center justify-center transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to preserve vertical layout height under fixed header */}
      <div className="h-16 sm:h-20 w-full flex-shrink-0" />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-white dark:bg-[#1A1517] border-l border-[#EBE4DD] dark:border-[#33272B] shadow-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#33272B] pb-4 mb-6">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div
                    className="rounded-full bg-[#C58F78] flex items-center justify-center"
                    style={{ width: "32px", height: "32px", minWidth: "32px", minHeight: "32px" }}
                  >
                    <Heart size={16} className="text-white fill-white" strokeWidth={0} />
                  </div>
                  <span className="font-playfair text-xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">NikahLink</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-between border",
                        active
                          ? "bg-[#F7EDE8] dark:bg-[#251E21] border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] font-bold shadow-xs"
                          : "bg-transparent border-transparent text-[#2D2424] dark:text-[#FDFBF7] dark:text-[#D1C4C4] hover:bg-[#F8F3EC] dark:bg-[#251E21]/50 dark:bg-[#1A1517] dark:hover:bg-[#251E21]"
                      )}
                    >
                      <span>{item.label}</span>
                      {active && <span className="w-2 h-2 rounded-full bg-[#C58F78]" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-[#33272B]">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] text-[#C58F78] dark:text-[#E8BAA6] font-bold text-sm shadow-sm"
                >
                  <User size={16} />
                  <span>Dashboard ({user.name})</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/masuk"
                    onClick={() => setMobileOpen(false)}
                    className="w-full block py-2.5 text-center btn-wevitation font-bold text-sm shadow-sm"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/daftar"
                    onClick={() => setMobileOpen(false)}
                    className="w-full block py-2.5 text-center btn-demo-outline font-semibold text-sm"
                  >
                    Buat Undangan Gratis
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs"
        />
      )}
    </>
  );
}
