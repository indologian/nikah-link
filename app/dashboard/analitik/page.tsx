import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BarChart3, Eye, Users, MessageSquare, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/masuk");

  // 1. Dapatkan daftar invitation ID milik user ini
  const { data: invitations } = await supabase
    .from("invitations")
    .select("id")
    .eq("user_id", user.id);

  const invitationIds = invitations?.map((inv) => inv.id) || [];

  let totalGuests = 0;
  let totalWishes = 0;
  let totalViews = 0; // Karena kolom views belum ada di skema, kita buat default 0

  // 2. Fetch counts (hanya row count, head: true menghemat bandwidth/cost) berdasarkan invitationIds
  if (invitationIds.length > 0) {
    const [guestsRes, wishesRes] = await Promise.all([
      supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .in("invitation_id", invitationIds)
        .eq("rsvp_status", "hadir"), // Menghitung hanya yang hadir
      supabase
        .from("wishes")
        .select("*", { count: "exact", head: true })
        .in("invitation_id", invitationIds),
    ]);

    totalGuests = guestsRes.count || 0;
    totalWishes = wishesRes.count || 0;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1517] p-6 rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] shadow-xs">
        <h1 className="text-2xl font-bold text-[#221C28] dark:text-[#FDFBF7] font-playfair flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-[#9E1B54]" /> Analitik & Statistik Visitors
        </h1>
        <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm mt-1">Pantau interaksi tamu, total kunjungan, dan respon RSVP secara real-time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl p-6 border border-[#F0E2DA] dark:border-[#33272B] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FCEBF2] dark:bg-[#9E1B54]/20 border border-[#F8D5E3] dark:border-[#9E1B54]/30 text-[#9E1B54] flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-[#221C28] dark:text-[#FDFBF7]">{totalViews}</div>
          <p className="text-slate-500 dark:text-[#B39E9E] text-xs font-semibold">Total Pengunjung Undangan</p>
        </div>

        <div className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl p-6 border border-[#F0E2DA] dark:border-[#33272B] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-[#221C28] dark:text-[#FDFBF7]">{totalGuests || 0}</div>
          <p className="text-slate-500 dark:text-[#B39E9E] text-xs font-semibold">Tamu Mengonfirmasi RSVP</p>
        </div>

        <div className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl p-6 border border-[#F0E2DA] dark:border-[#33272B] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-[#221C28] dark:text-[#FDFBF7]">{totalWishes || 0}</div>
          <p className="text-slate-500 dark:text-[#B39E9E] text-xs font-semibold">Ucapan & Doa Masuk</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1517] rounded-2xl p-8 border border-dashed border-[#E0D4CC] text-center py-16">
        <TrendingUp className="w-12 h-12 text-[#9E1B54] mx-auto mb-4 animate-bounce" />
        <h3 className="text-[#221C28] dark:text-[#FDFBF7] font-bold text-lg mb-2">Grafik Traffic Kunjungan Realtime</h3>
        <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Grafik interaktif akan diperbarui secara otomatis setiap kali tamu baru membuka link undangan digital kamu!
        </p>
      </div>
    </div>
  );
}
