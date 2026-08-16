"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  Plus, Users, Heart, MessageCircle, Eye,
  TrendingUp, Share2, BarChart2, Clock
} from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";
import type { Invitation } from "@/types";

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
      <span className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-amber-400 dark:from-amber-700 dark:to-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-amber-300 dark:border-amber-600">
        <span className="text-[10px]">👑</span> PRO VIP
      </span>
    );
  }
  
  if (plan === "premium") {
    return (
      <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-emerald-200 dark:border-emerald-800">
        PREMIUM
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
      FREE
    </span>
  );
};

const QUICK_ACTIONS = [
  { icon: Plus, label: "Buat Undangan Baru", href: "/dashboard/undangan/baru", color: "bg-[#FCEBF2] dark:bg-[#9E1B54]/20 text-[#9E1B54]" },
  { icon: Users, label: "Kelola Tamu", href: "/dashboard/tamu", color: "bg-purple-50 text-purple-700" },
  { icon: BarChart2, label: "Lihat Analitik", href: "/dashboard/analitik", color: "bg-teal-50 text-teal-700" },
  { icon: Share2, label: "Bagikan Undangan", href: "/dashboard/undangan", color: "bg-amber-50 dark:bg-amber-950/30 text-amber-700" },
];

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: typeof Users;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-wevitation rounded-2xl p-5 bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] shadow-xs relative overflow-hidden group hover:border-[#9E1B54] transition-all"
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-extrabold text-[#221C28] dark:text-[#FDFBF7] mb-0.5">{value}</div>
      <div className="text-slate-500 dark:text-[#B39E9E] text-xs font-medium">{label}</div>
      {change && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-700 text-xs font-semibold">{change}</span>
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardClient({ user, invitations, stats, plan }: Props) {
  const displayName = (user.user_metadata?.name as string) || user.email?.split("@")[0] || "Pengguna";
  const hasInvitations = invitations.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between bg-white dark:bg-[#1A1517] p-6 rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] shadow-xs"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-[#9E1B54] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {getInitials(displayName)}
            </div>
            <div>
              <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm">Selamat datang kembali,</p>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#221C28] dark:text-[#FDFBF7]">{displayName} 👋</h1>
                <PlanBadge plan={plan} />
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/undangan/baru"
          className="hidden sm:flex items-center gap-2 btn-wevitation px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Buat Undangan
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Heart}
          label="Total Undangan"
          value={stats.totalInvitations}
          color="bg-[#FCEBF2] dark:bg-[#9E1B54]/20 text-[#9E1B54]"
        />
        <StatCard
          icon={Eye}
          label="Undangan Aktif"
          value={stats.publishedInvitations}
          color="bg-purple-50 text-purple-700"
        />
        <StatCard
          icon={Users}
          label="Total Tamu"
          value="—"
          color="bg-teal-50 text-teal-700"
        />
        <StatCard
          icon={MessageCircle}
          label="Ucapan Masuk"
          value="—"
          color="bg-amber-50 dark:bg-amber-950/30 text-amber-700"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-slate-500 dark:text-[#B39E9E] text-xs font-bold uppercase tracking-wider mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="card-wevitation flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] hover:border-[#9E1B54] shadow-xs transition-all text-center group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 dark:text-[#D1C4C4] text-xs font-bold group-hover:text-[#9E1B54] transition-colors leading-tight">
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Invitations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-500 dark:text-[#B39E9E] text-xs font-bold uppercase tracking-wider">
            Undangan Saya
          </h2>
          {hasInvitations && (
            <Link href="/dashboard/undangan" className="text-[#9E1B54] text-xs font-bold hover:underline transition-colors">
              Lihat Semua →
            </Link>
          )}
        </div>

        {!hasInvitations ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed border-[#E0D4CC] bg-white dark:bg-[#1A1517] text-center p-6"
          >
            <div className="w-14 h-14 rounded-full bg-[#FCEBF2] dark:bg-[#9E1B54]/20 border border-[#F8D5E3] dark:border-[#9E1B54]/30 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-[#9E1B54] fill-[#9E1B54]" />
            </div>
            <h3 className="text-[#221C28] dark:text-[#FDFBF7] font-bold text-base mb-1">Belum Ada Undangan</h3>
            <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm mb-6 max-w-xs leading-relaxed">
              Buat undangan digital pertamamu dan bagikan kisah cinta kalian kepada dunia!
            </p>
            <Link
              href="/dashboard/undangan/baru"
              className="btn-wevitation px-6 py-2.5 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Buat Undangan Sekarang
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invitations.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card-wevitation rounded-2xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] shadow-xs overflow-hidden group hover:border-[#9E1B54] transition-all"
              >
                {/* Cover */}
                <div className="h-36 bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 relative flex items-center justify-center border-b border-slate-100 dark:border-[#33272B]">
                  <div className="text-center">
                    <Heart className="w-7 h-7 text-[#9E1B54] fill-[#9E1B54] mx-auto mb-1" />
                    <p className="font-playfair text-[#221C28] dark:text-[#FDFBF7] font-bold text-sm">
                      {inv.bride_name} & {inv.groom_name}
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    inv.is_published
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 border border-amber-200"
                  }`}>
                    {inv.is_published ? "LIVE" : "DRAFT"}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-[#221C28] dark:text-[#FDFBF7] text-sm mb-1 truncate">
                    {inv.bride_name} & {inv.groom_name}
                  </h3>
                  <p className="text-slate-500 dark:text-[#B39E9E] text-xs mb-3 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#9E1B54]" />
                    {formatDate(inv.reception_date || inv.created_at)}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/undangan/${inv.id}/edit`}
                      className="flex-1 py-1.5 text-center text-xs font-bold text-slate-700 dark:text-[#D1C4C4] bg-slate-50 border border-slate-200 dark:border-[#423338] rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/${inv.username}`}
                      target="_blank"
                      className="flex-1 py-1.5 text-center text-xs font-bold text-[#9E1B54] bg-[#FCEBF2] dark:bg-[#9E1B54]/20 border border-[#F8D5E3] dark:border-[#9E1B54]/30 rounded-xl hover:bg-[#F8D5E3] transition-colors"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
