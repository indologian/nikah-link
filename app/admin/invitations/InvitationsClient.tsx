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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Cari URL username atau nama mempelai..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Link (Username)</th>
              <th className="px-6 py-4">Mempelai</th>
              <th className="px-6 py-4">Pemilik (Plan)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Dibuat</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Tidak ada undangan ditemukan.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-rose-400">
                    <Link href={`/${inv.username}`} target="_blank" className="flex items-center gap-2 hover:underline">
                      /{inv.username} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {inv.bride_name} & {inv.groom_name}
                  </td>
                  <td className="px-6 py-4">
                    {inv.profiles?.name || "Unknown"} <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full ml-1 uppercase">{inv.profiles?.plan || "free"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <CountdownStatus 
                      createdAt={inv.created_at} 
                      isPublished={inv.is_published} 
                      plan={inv.profiles?.plan || "free"} 
                    />
                  </td>
                  <td className="px-6 py-4">{new Date(inv.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={loadingId === inv.id}
                      className="text-slate-400 hover:text-rose-500 disabled:opacity-50 transition-colors"
                      title="Hapus Undangan"
                    >
                      <Trash2 className="w-5 h-5" />
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
