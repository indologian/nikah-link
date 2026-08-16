import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Heart, Edit3, ExternalLink, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteButton from "@/components/dashboard/DeleteButton";
import CreateInvitationButton from "@/components/dashboard/CreateInvitationButton";
import CountdownLabel from "@/components/dashboard/CountdownLabel";

export default async function MyInvitationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/masuk");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan = profile?.plan || "free";

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1A1517] p-6 rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-[#221C28] dark:text-[#FDFBF7] font-playfair flex items-center gap-3">
            <Heart className="w-7 h-7 text-[#9E1B54]" /> Undangan Saya
          </h1>
          <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm mt-1">
            Kelola dan pantau undangan digital yang telah Anda buat.
          </p>
        </div>
        <CreateInvitationButton plan={plan as any} currentCount={invitations?.length || 0} />
      </div>

      {!invitations || invitations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1A1517] rounded-2xl border border-dashed border-[#E0D4CC] dark:border-[#423338] p-8">
          <Heart className="w-12 h-12 text-[#9E1B54] fill-[#9E1B54] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#221C28] dark:text-[#FDFBF7] mb-2">Belum ada undangan yang dibuat</h3>
          <p className="text-slate-500 dark:text-[#B39E9E] text-sm mb-6 max-w-sm mx-auto">
            Mulai langkah manismu sekarang dengan membuat undangan digital impian kalian!
          </p>
          <div className="flex justify-center">
            <CreateInvitationButton plan={plan as any} currentCount={0} />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="group bg-white dark:bg-[#1A1517] rounded-3xl border border-[#F0E2DA] dark:border-[#33272B] hover:border-[#9E1B54]/50 dark:hover:border-[#9E1B54]/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Header & Cover */}
              <div className="h-40 bg-slate-100 dark:bg-[#251E21] relative overflow-hidden">
                {inv.cover_image_url ? (
                  <img src={inv.cover_image_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FCEBF2] to-rose-50 dark:from-[#2A1620] dark:to-[#1A0D14]">
                    <Heart className="w-12 h-12 text-[#9E1B54]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <CountdownLabel plan={plan} createdAt={inv.created_at} />
                </div>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    inv.is_published
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  }`}>
                    {inv.is_published ? "LIVE / DIPUBLIKASI" : "DRAFT"}
                  </span>
                </div>

                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#221C28] dark:text-[#FDFBF7] truncate">
                    {inv.bride_name} & {inv.groom_name}
                  </h3>
                  <p className="text-[#9E1B54] text-xs font-semibold mt-1">
                    nikahlink.com/{inv.username}
                  </p>
                </div>

                <div className="text-xs text-slate-500 dark:text-[#B39E9E] space-y-1 pt-3 border-t border-slate-100 dark:border-[#33272B]">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#9E1B54]" />
                    Resepsi: {inv.reception_date ? formatDate(inv.reception_date) : "Belum diatur"}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#251E21]/50 border-t border-slate-100 dark:border-[#33272B] flex gap-2">
                <Link
                  href={`/${inv.username}`}
                  target="_blank"
                  className="flex-1 py-2 text-center text-xs font-bold text-[#9E1B54] dark:text-[#F8D5E3] bg-[#FCEBF2] dark:bg-[#9E1B54]/20 border border-[#F8D5E3] dark:border-[#9E1B54]/30 rounded-xl hover:bg-[#F8D5E3] dark:hover:bg-[#9E1B54]/40 transition-colors flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Lihat
                </Link>
                <Link
                  href={`/dashboard/undangan/${inv.id}/edit`}
                  className="flex-1 py-2 text-center text-xs font-bold text-slate-700 dark:text-[#D1C4C4] bg-white dark:bg-[#1A1517] border border-slate-200 dark:border-[#423338] rounded-xl hover:bg-slate-100 dark:hover:bg-[#251E21] transition-colors flex items-center justify-center gap-1"
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
  );
}
