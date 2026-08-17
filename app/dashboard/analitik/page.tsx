import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BarChart3, Eye, Users, MessageSquare, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/masuk");

  const { data: invitations } = await supabase
    .from("invitations")
    .select("id")
    .eq("user_id", user.id);

  const invitationIds = invitations?.map((inv) => inv.id) || [];

  let totalGuests = 0;
  let totalWishes = 0;
  let totalViews = 0;

  if (invitationIds.length > 0) {
    const [guestsRes, wishesRes] = await Promise.all([
      supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .in("invitation_id", invitationIds)
        .eq("rsvp_status", "hadir"),
      supabase
        .from("wishes")
        .select("*", { count: "exact", head: true })
        .in("invitation_id", invitationIds),
    ]);

    totalGuests = guestsRes.count || 0;
    totalWishes = wishesRes.count || 0;
  }

  return (
    <div className="space-y-10 pb-20">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-1">
            Analisis Kinerja
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Pantau interaksi tamu, total kunjungan, dan respons RSVP secara langsung.
          </p>
        </div>
      </div>

      {/* Monochromatic Tabular Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-transparent border border-slate-200 dark:border-slate-800 rounded-none flex flex-col justify-between hover:border-slate-900 dark:border-white transition-colors group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 dark:bg-slate-50 transition-colors">
              <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors" />
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Kunjungan</div>
          </div>
          <div>
            <div className="text-4xl font-playfair font-bold text-slate-900 dark:text-white leading-none">{totalViews}</div>
          </div>
        </div>

        <div className="p-6 bg-transparent border border-slate-200 dark:border-slate-800 rounded-none flex flex-col justify-between hover:border-slate-900 dark:border-white transition-colors group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 dark:bg-slate-50 transition-colors">
              <Users className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors" />
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tamu Mengonfirmasi</div>
          </div>
          <div>
            <div className="text-4xl font-playfair font-bold text-slate-900 dark:text-white leading-none">{totalGuests || 0}</div>
          </div>
        </div>

        <div className="p-6 bg-transparent border border-slate-200 dark:border-slate-800 rounded-none flex flex-col justify-between hover:border-slate-900 dark:border-white transition-colors group">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-slate-900 dark:bg-slate-50 transition-colors">
              <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-white transition-colors" />
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ucapan Masuk</div>
          </div>
          <div>
            <div className="text-4xl font-playfair font-bold text-slate-900 dark:text-white leading-none">{totalWishes || 0}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 rounded-none border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-center px-4">
        <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-slate-900 dark:text-white font-playfair font-bold text-xl mb-2">Grafik Lalu Lintas Situs</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Grafik garis interaktif yang melacak lonjakan penayangan akan ditampilkan di sini setelah Anda menerima kunjungan yang cukup.
        </p>
      </div>
    </div>
  );
}
