"use client";

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
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/invitations", label: "Undangan", icon: LinkIcon },
  { href: "/admin/themes", label: "Tema", icon: Palette },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2 font-black text-xl text-white">
            <ShieldAlert className="w-6 h-6 text-rose-500" />
            <span>SuperAdmin</span>
          </Link>
        )}
        {isCollapsed && (
          <ShieldAlert className="w-6 h-6 text-rose-500 mx-auto" />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 absolute -right-3 top-5 bg-slate-900 border border-slate-800"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? "bg-rose-500/10 text-rose-500 font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? "text-rose-500" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Kembali ke Dashboard User" : undefined}
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-semibold">User Dashboard</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Keluar" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-bold">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
