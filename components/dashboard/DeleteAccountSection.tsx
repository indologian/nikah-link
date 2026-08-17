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
      <div className="bg-red-50/50 dark:bg-red-950/20 p-6 sm:p-8 border border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 shrink-0 bg-red-100 dark:bg-red-900/50 flex items-center justify-center border border-red-200 dark:border-red-800">
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-mono text-red-700 dark:text-red-400 font-bold uppercase tracking-widest text-sm mb-2">Zona Bahaya</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Menghapus akun akan memusnahkan secara permanen seluruh data Anda, termasuk undangan, tamu, ucapan, kado digital, dan galeri yang terhubung.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-widest font-bold transition-colors"
        >
          Hapus Akun
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => { if (!loading) setShowModal(false); }}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0 border border-red-200 dark:border-red-900">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">Konfirmasi Penghapusan</h3>
                <p className="text-sm font-mono text-slate-500 mt-1">PROSES TIDAK DAPAT DIBATALKAN</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                Semua undangan, data tamu, ucapan, galeri foto, kado digital, dan data pembayaran Anda akan <strong>dihapus permanen</strong> dan tidak bisa dikembalikan.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Ketik <span className="font-mono text-red-600 dark:text-red-400 font-bold">HAPUS AKUN SAYA</span> untuk konfirmasi:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={loading}
                placeholder="HAPUS AKUN SAYA"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            )}

            <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => { setShowModal(false); setConfirmText(""); setError(""); }}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || confirmText !== "HAPUS AKUN SAYA"}
                className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
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
