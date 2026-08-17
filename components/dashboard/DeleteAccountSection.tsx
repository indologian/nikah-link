"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteAccountSection() {
  const router = useRouter();
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "HAPUS AKUN SAYA") return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus akun");
      }

      // Sign out locally and redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-transparent rounded-2xl p-6 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 shrink-0 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
            <Trash2 className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] dark:text-white uppercase tracking-wider text-sm mb-1">Zona Bahaya</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              Menghapus akun akan memusnahkan secara permanen seluruh data Anda, termasuk undangan, tamu, ucapan, kado digital, dan galeri yang terhubung.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 px-6 py-2.5 rounded-full bg-transparent border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs uppercase tracking-widest font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          Hapus Akun
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!loading) setShowModal(false); }}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1517] rounded-2xl border border-red-200 dark:border-red-900/40 shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#221C28] dark:text-[#FDFBF7]">Konfirmasi Penghapusan</h3>
                <p className="text-xs text-slate-500 dark:text-[#B39E9E]">Akun akan dihapus secara permanen</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                Semua undangan, data tamu, ucapan, galeri foto, kado digital, dan data pembayaran Anda akan <strong>dihapus permanen</strong> dan tidak bisa dikembalikan.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-[#D1C4C4]">
                Ketik <span className="font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded">HAPUS AKUN SAYA</span> untuk konfirmasi:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={loading}
                placeholder="HAPUS AKUN SAYA"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#423338] bg-slate-50 dark:bg-[#251E21] text-[#221C28] dark:text-[#FDFBF7] text-sm font-mono placeholder:text-slate-300 dark:placeholder:text-[#5A4A50] focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowModal(false); setConfirmText(""); setError(""); }}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-[#423338] text-sm font-bold text-slate-600 dark:text-[#B39E9E] hover:bg-slate-50 dark:hover:bg-[#251E21] transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmText !== "HAPUS AKUN SAYA"}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Hapus Permanen
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
