"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FileText, Users, BarChart3, Gift,
  Settings, Heart, LogOut, ChevronLeft, ChevronRight,
  Plus, CreditCard, Menu, X, Home, ShieldAlert
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import UpsellModal from "./UpsellModal";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Undangan Saya", href: "/dashboard/undangan" },
  { icon: Users, label: "Manajemen Tamu", href: "/dashboard/tamu" },
  { icon: BarChart3, label: "Analitik", href: "/dashboard/analitik" },
  { icon: Gift, label: "Kado & Amplop", href: "/dashboard/kado" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/pengaturan" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Paywall states
  const [userPlan, setUserPlan] = useState<"free" | "premium" | "pro">("free");
  const [userRole, setUserRole] = useState<string>("user");
  const [invCount, setInvCount] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    async function fetchPlanAndCount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: profile }, { count }] = await Promise.all([
        supabase.from("profiles").select("plan, role").eq("user_id", user.id).single(),
        supabase.from("invitations").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      ]);
      if (profile && profile.plan) setUserPlan(profile.plan);
      if (profile && profile.role) setUserRole(profile.role);
      if (count !== null) setInvCount(count);
    }
    fetchPlanAndCount();
  }, [supabase]);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#120E10]/80 dark:backdrop-blur-xl border-b border-[#F0E2DA] dark:border-[#33272B] flex items-center justify-between px-4 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-[#D1C4C4] hover:text-[#9E1B54] transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#9E1B54]" />
              <Heart className="absolute inset-0 m-auto w-3 h-3 text-white fill-white" strokeWidth={0} />
            </div>
            <span className="font-playfair text-base font-bold text-[#221C28] dark:text-[#FDFBF7]">
              NikahLink
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 scale-90">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#221C28]/20 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed md:relative top-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-[#120E10]/90 md:dark:bg-[#120E10]/80 dark:backdrop-blur-2xl md:dark:backdrop-blur-xl border-r border-[#F0E2DA] dark:border-[#33272B] shadow-2xl md:shadow-xs transition-all duration-300 ease-in-out",
          mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px] md:translate-x-0",
          collapsed ? "md:w-[70px]" : "md:w-[240px]"
        )}
      >
        {/* Logo (Desktop Only / Drawer Header on Mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-[#F0E2DA] dark:border-[#33272B] h-16">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-[#9E1B54]" />
              <Heart className="absolute inset-0 m-auto w-4 h-4 text-white fill-white" strokeWidth={0} />
            </div>
            <AnimatePresence>
              {(!collapsed || mobileOpen) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-playfair text-lg font-bold text-[#221C28] dark:text-[#FDFBF7] whitespace-nowrap"
                >
                  NikahLink
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Close button for Mobile */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:text-rose-500"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Theme Toggle (Desktop Only since mobile has it in topbar) */}
          <div className="hidden md:block flex-shrink-0 scale-90">
            {!collapsed && <ThemeToggle />}
          </div>
        </div>

        {/* New invitation CTA */}
        <div className="p-3">
          <button
            onClick={() => {
              const limits = { free: 1, premium: 1, pro: 2 };
              const planLimit = limits[userPlan] || 1;
              if (invCount >= planLimit) {
                setShowUpsell(true);
              } else {
                router.push("/dashboard/undangan/baru");
                setMobileOpen(false);
              }
            }}
            className={cn(
              "w-full flex items-center gap-2 btn-wevitation rounded-xl py-2.5 font-bold text-white text-xs sm:text-sm transition-all shadow-sm",
              (collapsed && !mobileOpen) ? "justify-center px-2" : "px-4"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Buat Undangan</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = href === "/dashboard"
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-[#FCEBF2] dark:bg-[#9E1B54]/20 text-[#9E1B54] border border-[#F8D5E3] dark:border-[#9E1B54]/30"
                    : "text-slate-600 dark:text-[#D1C4C4] hover:text-[#9E1B54] hover:bg-[#FAF4F0] dark:hover:bg-[#251E21] dark:bg-[#120E10]",
                  (collapsed && !mobileOpen) && "justify-center px-0"
                )}
                title={(collapsed && !mobileOpen) ? label : undefined}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-[#9E1B54]" : "text-slate-400 group-hover:text-[#9E1B54]"
                )} />
                <AnimatePresence>
                  {(!collapsed || mobileOpen) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[#F0E2DA] dark:border-[#33272B] space-y-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-[#B39E9E] hover:text-[#9E1B54] hover:bg-[#FAF4F0] dark:hover:bg-[#251E21] transition-all",
              (collapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(collapsed && !mobileOpen) ? "Beranda Utama" : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Beranda Utama</span>}
          </Link>

          {userRole === "super_admin" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-all border border-rose-100 dark:border-rose-900/30",
                (collapsed && !mobileOpen) && "justify-center px-0"
              )}
              title={(collapsed && !mobileOpen) ? "Super Admin" : undefined}
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || mobileOpen) && <span>Super Admin</span>}
            </Link>
          )}

          <Link
            href="/harga"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 dark:bg-amber-950/30 transition-all",
              (collapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(collapsed && !mobileOpen) ? "Upgrade Plan" : undefined}
          >
            <CreditCard className="w-5 h-5 flex-shrink-0 text-amber-600" />
            {(!collapsed || mobileOpen) && <span>Upgrade Plan</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-[#B39E9E] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:bg-rose-950/30 transition-all",
              (collapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(collapsed && !mobileOpen) ? "Keluar" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Keluar</span>}
          </button>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute top-1/2 -right-3 z-20 w-6 h-6 rounded-full bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] items-center justify-center text-slate-500 dark:text-[#B39E9E] hover:text-[#9E1B54] transition-all shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        title="Batas Undangan Tercapai"
        description={`Paket ${userPlan.toUpperCase()} kamu membatasi maksimal pembuatan undangan. Tingkatkan paketmu untuk membuat undangan lebih banyak!`}
        planNeeded={userPlan === "free" ? "premium" : "pro"}
      />
    </>
  );
}
