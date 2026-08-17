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
        supabase.from("profiles").select("plan, role, has_used_free_trial, plan_expires_at").eq("user_id", user.id).single(),
        supabase.from("invitations").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      ]);
      if (profile && profile.plan) setUserPlan(profile.plan);
      if (profile && profile.role) setUserRole(profile.role);
      // Determine if they can still create
      const hasUsedTrial = profile?.has_used_free_trial || false;
      const planExpiresAt = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
      const limits = { free: 1, premium: 1, pro: 2 };
      const planLimit = limits[(profile?.plan as "free" | "premium" | "pro") || "free"];
      
      // If plan is free and trial is used OR premium is expired, force it to look full
      if (profile?.plan === "free" && hasUsedTrial) {
        setInvCount(planLimit); 
      } else if (profile?.plan === "premium" && planExpiresAt && planExpiresAt < new Date()) {
        setInvCount(planLimit);
      } else if (count !== null) {
        setInvCount(count);
      }
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
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-slate-900 dark:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-slate-900 dark:bg-white flex-shrink-0">
              <Heart className="w-3 h-3 text-white dark:text-slate-900 fill-current" strokeWidth={0} />
            </div>
            <span className="font-playfair text-base font-bold text-slate-900 dark:text-white">
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
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          "fixed md:relative top-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
          mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px] md:translate-x-0",
          collapsed ? "md:w-[70px]" : "md:w-[240px]"
        )}
      >
        {/* Logo (Desktop Only / Drawer Header on Mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-slate-900 dark:bg-white flex-shrink-0">
              <Heart className="w-4 h-4 text-white dark:text-slate-900 fill-current" strokeWidth={0} />
            </div>
            <AnimatePresence>
              {(!collapsed || mobileOpen) && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-playfair text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap"
                >
                  NikahLink
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          {/* Close button for Mobile */}
          <button 
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
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
              "w-full flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 font-bold uppercase tracking-wider text-xs transition-colors hover:bg-slate-800 dark:hover:bg-slate-200",
              (collapsed && !mobileOpen) ? "justify-center px-2" : "px-4"
            )}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Buat Undangan</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto flex flex-col gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
            const isActive = href === "/dashboard"
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2",
                  isActive
                    ? "bg-slate-50 dark:bg-slate-900 border-slate-900 dark:border-white text-slate-900 dark:text-white"
                    : "border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white",
                  (collapsed && !mobileOpen) && "justify-center px-0"
                )}
                title={(collapsed && !mobileOpen) ? label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
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
        <div className="py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium border-l-2 border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors",
              (collapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(collapsed && !mobileOpen) ? "Beranda Utama" : undefined}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Beranda Utama</span>}
          </Link>

          {userRole === "super_admin" && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-bold border-l-2 border-transparent text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors",
                (collapsed && !mobileOpen) && "justify-center px-0"
              )}
              title={(collapsed && !mobileOpen) ? "Super Admin" : undefined}
            >
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              {(!collapsed || mobileOpen) && <span>Super Admin</span>}
            </Link>
          )}

          <Link
            href="/harga"
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium border-l-2 border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors",
              (collapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(collapsed && !mobileOpen) ? "Upgrade Plan" : undefined}
          >
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Upgrade Plan</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium border-l-2 border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-rose-600 dark:hover:text-rose-400 transition-colors",
              (collapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(collapsed && !mobileOpen) ? "Keluar" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {(!collapsed || mobileOpen) && <span>Keluar</span>}
          </button>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute top-1/2 -right-3.5 z-20 w-7 h-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
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
