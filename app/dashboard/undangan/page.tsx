import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Heart, Edit3, ExternalLink, Calendar, Link2 } from "lucide-react";
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
    <div className="space-y-8 pb-20">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-3 mb-1">
             Undangan Saya
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kelola dan pantau undangan digital yang telah Anda buat.
          </p>
        </div>
        <CreateInvitationButton plan={plan as any} currentCount={invitations?.length || 0} />
      </div>

      {!invitations || invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center px-4">
          <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-[var(--text-primary)] dark:text-white font-playfair font-bold text-xl mb-2">Belum Ada Undangan</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">
            Mulai langkah manismu sekarang dengan membuat undangan digital impian kalian!
          </p>
          <CreateInvitationButton plan={plan as any} currentCount={0} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 transition-colors hover:border-[var(--accent-rosegold)] flex flex-col lg:flex-row lg:items-center gap-6"
            >
              {/* Thumbnail Area */}
              <div className="w-full lg:w-48 h-32 lg:h-28 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                {inv.cover_image_url ? (
                  <img src={inv.cover_image_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                )}
                
                {/* Status Badge floating on image for mobile, absolute for desktop */}
                <span className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${
                  inv.is_published
                    ? "bg-emerald-500/90 text-white"
                    : "bg-slate-900/80 text-white"
                }`}>
                  {inv.is_published ? "LIVE" : "DRAFT"}
                </span>
              </div>

              {/* Info Area */}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <h3 className="font-playfair text-2xl font-bold text-[var(--text-primary)] dark:text-white truncate">
                    {inv.bride_name} & {inv.groom_name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[var(--accent-rosegold)] text-xs font-semibold">
                    <Link2 className="w-3.5 h-3.5" />
                    <span>nikahlink.com/{inv.username}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 mt-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Resepsi: <span className="text-slate-700 dark:text-slate-300">{inv.reception_date ? formatDate(inv.reception_date) : "Belum diatur"}</span>
                  </div>
                  <CountdownLabel plan={plan} createdAt={inv.created_at} />
                </div>
              </div>

              {/* Action Area */}
              <div className="flex sm:flex-col gap-2 shrink-0 border-t border-slate-100 dark:border-slate-800 lg:border-t-0 pt-4 lg:pt-0">
                <Link
                  href={`/${inv.username}`}
                  target="_blank"
                  className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[var(--text-primary)] dark:text-white text-xs font-semibold rounded-xl hover:border-[var(--accent-rosegold)] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Lihat Undangan
                </Link>
                <div className="flex-1 lg:flex-none flex gap-2">
                  <Link
                    href={`/dashboard/undangan/${inv.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[var(--text-primary)] dark:text-white text-xs font-semibold rounded-xl hover:border-[var(--accent-rosegold)] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <DeleteButton id={inv.id} title={`${inv.bride_name} & ${inv.groom_name}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
