"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Link as LinkIcon,
  Palette,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Settings,
  Inbox,
  Menu,
  X,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/invitations", label: "Undangan", icon: LinkIcon },
  { href: "/admin/themes", label: "Tema", icon: Palette },
  { href: "/admin/leads", label: "Data Leads", icon: Inbox },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/masuk");
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
            <ShieldAlert className="w-5 h-5 text-slate-900 dark:text-white flex-shrink-0" />
            <span className="font-black text-base text-slate-900 dark:text-white tracking-tight">
              SuperAdmin
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
          isCollapsed ? "md:w-[70px]" : "md:w-[240px]"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-900 dark:text-white flex-shrink-0" />
            {(!isCollapsed || mobileOpen) && (
              <Link href="/admin" className="font-black text-lg text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                SuperAdmin
              </Link>
            )}
          </div>

          {/* Close button for Mobile */}
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Theme Toggle (Desktop Only) */}
          <div className="hidden md:block flex-shrink-0 scale-75 origin-right">
            {!isCollapsed && <ThemeToggle />}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors border-l-2",
                  isActive
                    ? "bg-slate-50 dark:bg-slate-900 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold"
                    : "border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white",
                  (isCollapsed && !mobileOpen) && "justify-center px-0"
                )}
                title={(isCollapsed && !mobileOpen) ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {(!isCollapsed || mobileOpen) && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-sm font-medium border-l-2 border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors",
              (isCollapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(isCollapsed && !mobileOpen) ? "User Dashboard" : undefined}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>User Dashboard</span>}
          </Link>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium border-l-2 border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-rose-600 dark:hover:text-rose-400 transition-colors",
              (isCollapsed && !mobileOpen) && "justify-center px-0"
            )}
            title={(isCollapsed && !mobileOpen) ? "Keluar" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Keluar</span>}
          </button>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute top-1/2 -right-3.5 z-20 w-7 h-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 items-center justify-center text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
