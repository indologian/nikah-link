"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

function CountdownStatus({ createdAt, isPublished, plan }: { createdAt: string, isPublished: boolean, plan: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (plan !== "free" || !isPublished) return;

    const expiresAt = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;
    
    const update = () => {
      const now = Date.now();
      const diff = expiresAt - now;
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("00:00:00");
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
        setTimeLeft(`${h}:${m}:${s}`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt, plan, isPublished]);

  if (!isPublished) {
    return <span className="px-2 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-400">Draft</span>;
  }

  if (plan !== "free") {
    return <span className="px-2 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500">Published (Selamanya)</span>;
  }

  if (isExpired) {
    return <span className="px-2 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-500">Kedaluwarsa</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="w-max px-2 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500">Published</span>
      <span className="w-max text-[10px] text-amber-500 font-mono tracking-wider">Sisa: {timeLeft}</span>
    </div>
  );
}

export default function InvitationsClient({ initialInvitations }: { initialInvitations: any[] }) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = invitations.filter((inv) => 
    inv.username.toLowerCase().includes(search.toLowerCase()) || 
    inv.bride_name.toLowerCase().includes(search.toLowerCase()) ||
    inv.groom_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Peringatan: Anda akan menghapus undangan ini secara permanen. Yakin?")) return;
    setLoadingId(id);
    try {
      const { error } = await supabase.from("invitations").delete().eq("id", id);
      if (!error) {
        setInvitations(invitations.filter(i => i.id !== id));
      } else {
        alert("Gagal menghapus: " + error.message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="pb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Cari URL username atau nama mempelai..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent border-b border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-100 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-0 top-2.5" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <th className="py-3 font-medium whitespace-nowrap">Link (Username)</th>
              <th className="px-4 py-3 font-medium">Mempelai</th>
              <th className="px-4 py-3 font-medium">Pemilik (Plan)</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Dibuat</th>
              <th className="py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Tidak ada undangan ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="py-4 font-medium text-slate-900 dark:text-slate-200">
                    <Link href={`/${inv.username}`} target="_blank" className="inline-flex items-center gap-1.5 hover:underline decoration-slate-300 underline-offset-4">
                      /{inv.username} <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                    {inv.bride_name} & {inv.groom_name}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-slate-900 dark:text-slate-200">{inv.profiles?.name || "Unknown"}</span>
                    <span className="block mt-0.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">{inv.profiles?.plan || "free"}</span>
                  </td>
                  <td className="px-4 py-4">
                    <CountdownStatus 
                      createdAt={inv.created_at} 
                      isPublished={inv.is_published} 
                      plan={inv.profiles?.plan || "free"} 
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{new Date(inv.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={loadingId === inv.id}
                      className="inline-flex p-2 text-slate-400 hover:text-rose-600 disabled:opacity-50 transition-colors"
                      title="Hapus Undangan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
