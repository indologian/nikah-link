"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  Plus, Users, Heart, MessageCircle, Eye,
  TrendingUp, Share2, BarChart2, Clock, ExternalLink, Edit3
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";
import type { Invitation } from "@/types";
import DeleteButton from "@/components/dashboard/DeleteButton";

interface Props {
  user: User;
  invitations: Invitation[];
  stats: {
    totalInvitations: number;
    publishedInvitations: number;
  };
  plan: string;
}

const PlanBadge = ({ plan }: { plan: string }) => {
  if (plan === "pro") {
    return (
      <span className="flex items-center gap-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-3 py-1 rounded-none uppercase tracking-widest">
        PRO VIP
      </span>
    );
  }
  
  if (plan === "premium") {
    return (
      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-3 py-1 rounded-none uppercase tracking-widest">
        PREMIUM
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-3 py-1 rounded-none uppercase tracking-widest">
      FREE
    </span>
  );
};

const QUICK_ACTIONS = [
  { icon: Plus, label: "Buat Undangan", href: "/dashboard/undangan/baru" },
  { icon: Users, label: "Kelola Tamu", href: "/dashboard/tamu" },
  { icon: BarChart2, label: "Lihat Analitik", href: "/dashboard/analitik" },
  { icon: Share2, label: "Bagikan", href: "/dashboard/undangan" },
];

function StatCard({ icon: Icon, label, value, change }: {
  icon: typeof Users;
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <div className="p-5 bg-transparent border border-slate-200 dark:border-slate-800 rounded-none flex flex-col justify-between hover:border-slate-900 dark:border-white transition-colors group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 dark:bg-slate-50 transition-colors">
          <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors" />
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
      </div>
      <div>
        <div className="text-3xl font-playfair font-bold text-slate-900 dark:text-white leading-none">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardClient({ user, invitations, stats, plan }: Props) {
  const displayName = (user.user_metadata?.name as string) || user.email?.split("@")[0] || "Pengguna";
  const hasInvitations = invitations.length > 0;

  return (
    <div className="space-y-10 pb-20">
      
      {/* Header F3 Style */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-serif text-lg">
            {getInitials(displayName)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white">{displayName}</h1>
              <PlanBadge plan={plan} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Selamat datang kembali di area panel Anda.</p>
          </div>
        </div>
        <Link
          href="/dashboard/undangan/baru"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-50 text-white px-6 py-3 rounded-none font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Buat Undangan
        </Link>
      </div>

      {/* Stats Grid - Monochromatic Tabular */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Heart} label="Total Undangan" value={stats.totalInvitations} />
        <StatCard icon={Eye} label="Undangan Aktif" value={stats.publishedInvitations} />
        <StatCard icon={Users} label="Total Tamu" value="—" />
        <StatCard icon={MessageCircle} label="Ucapan Masuk" value="—" />
      </div>

      {/* Quick Actions - List Style for Mobile, Grid for Desktop */}
      <div>
        <h2 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-widest mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center gap-3 p-5 rounded-none bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:border-white hover:bg-white dark:hover:bg-slate-900 transition-all text-center group"
              >
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-slate-900 dark:text-white transition-colors" />
                <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider group-hover:text-slate-900 dark:text-white transition-colors">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Invitations Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-widest">
            Undangan Terbaru
          </h2>
          {hasInvitations && (
            <Link href="/dashboard/undangan" className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider hover:underline transition-colors">
              Lihat Semua
            </Link>
          )}
        </div>

        {!hasInvitations ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-none border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-center px-4">
            <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-slate-900 dark:text-white font-playfair font-bold text-xl mb-2">Belum Ada Undangan</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">
              Area ini masih kosong. Mulai buat undangan pertama Anda untuk menampilkan pratinjau.
            </p>
            <Link
              href="/dashboard/undangan/baru"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-50 text-white px-6 py-2.5 rounded-none font-semibold text-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Buat Undangan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.slice(0, 3).map((inv) => (
              <div
                key={inv.id}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden hover:border-slate-900 dark:border-white transition-all"
              >
                <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider border ${
                      inv.is_published
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    }`}>
                      {inv.is_published ? "LIVE" : "DRAFT"}
                    </span>
                    <Heart className="w-5 h-5 text-slate-200 dark:text-slate-700" />
                  </div>
                  
                  <h3 className="font-playfair font-bold text-xl text-slate-900 dark:text-white truncate mb-1">
                    {inv.bride_name} & {inv.groom_name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(inv.reception_date || inv.created_at)}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap sm:flex-nowrap gap-2">
                  <Link
                    href={`/${inv.username}`}
                    target="_blank"
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none hover:border-slate-900 dark:border-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Lihat
                  </Link>
                  <Link
                    href={`/dashboard/undangan/${inv.id}/edit`}
                    className="flex-1 py-2 text-center text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none hover:border-slate-900 dark:border-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <DeleteButton id={inv.id} title={`${inv.bride_name} & ${inv.groom_name}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
