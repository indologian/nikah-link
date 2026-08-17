"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, CreditCard, Plus, Trash2, Edit3, X, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Plan = "free" | "premium" | "pro";

interface GiftAccount {
  id: string;
  invitation_id: string;
  type: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  invitations?: { bride_name: string; groom_name: string; username: string };
}

interface Invitation {
  id: string;
  bride_name: string;
  groom_name: string;
  username: string;
}

interface GiftClientProps {
  initialAccounts: GiftAccount[];
  invitations: Invitation[];
  plan: Plan;
}

export default function GiftClient({ initialAccounts, invitations, plan }: GiftClientProps) {
  const [accounts, setAccounts] = useState<GiftAccount[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    invitation_id: invitations.length > 0 ? invitations[0].id : "",
    bank_name: "",
    account_number: "",
    account_name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const limits = {
    free: 1,
    premium: 3,
    pro: 999
  };

  const planLimit = limits[plan] || 1;

  const handleOpenModal = (acc?: GiftAccount) => {
    setError("");
    if (acc) {
      setEditingId(acc.id);
      setFormData({
        invitation_id: acc.invitation_id,
        bank_name: acc.bank_name || "",
        account_number: acc.account_number || "",
        account_name: acc.account_name || ""
      });
      setIsModalOpen(true);
    } else {
      if (invitations.length === 0) {
        setError("Kamu belum memiliki undangan. Buat undangan terlebih dahulu.");
        return;
      }
      
      const invId = formData.invitation_id || invitations[0].id;
      const currentCount = accounts.filter(a => a.invitation_id === invId).length;

      if (currentCount >= planLimit) {
        setError(`Batas maksimal rekening untuk paket ${plan.toUpperCase()} adalah ${planLimit} per undangan. Silakan Upgrade Plan untuk menambah lebih banyak rekening.`);
        return;
      }

      setEditingId(null);
      setFormData({
        invitation_id: invId,
        bank_name: "",
        account_number: "",
        account_name: ""
      });
      setIsModalOpen(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invitation_id || !formData.bank_name || !formData.account_number || !formData.account_name) {
      setError("Mohon lengkapi semua data.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("gift_accounts")
          .update({
            bank_name: formData.bank_name,
            account_number: formData.account_number,
            account_name: formData.account_name
          })
          .eq("id", editingId);

        if (updateError) throw updateError;

        setAccounts(accounts.map(acc => acc.id === editingId ? { ...acc, ...formData } as GiftAccount : acc));
      } else {
        const currentCount = accounts.filter(a => a.invitation_id === formData.invitation_id).length;
        if (currentCount >= planLimit) {
          throw new Error(`Batas maksimal rekening tercapai untuk paket ${plan.toUpperCase()}.`);
        }

        const { data, error: insertError } = await supabase
          .from("gift_accounts")
          .insert([{
            invitation_id: formData.invitation_id,
            type: "bank",
            bank_name: formData.bank_name,
            account_number: formData.account_number,
            account_name: formData.account_name
          }])
          .select("*, invitations(bride_name, groom_name, username)")
          .single();

        if (insertError) throw insertError;
        if (data) {
          setAccounts([...accounts, data as any]);
        }
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data rekening.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus rekening ini?")) return;
    
    try {
      const { error } = await supabase.from("gift_accounts").delete().eq("id", id);
      if (error) throw error;
      
      setAccounts(accounts.filter(a => a.id !== id));
      router.refresh();
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-1">
            Rekening Kado
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kelola nomor rekening bank, QRIS, dan e-wallet.
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 dark:text-slate-900 px-6 py-3 rounded-none font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Tambah Rekening
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 rounded-none bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            {error}
            {error.includes("Upgrade") && (
              <Link href="/harga" className="ml-2 underline hover:text-rose-800">Lihat Harga</Link>
            )}
          </div>
        </div>
      )}

      <div>
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-none border border-dashed border-slate-300 dark:border-slate-700 bg-transparent text-center px-4">
            <CreditCard className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-slate-900 dark:text-white font-playfair font-bold text-xl mb-2">Belum ada rekening kado terdaftar</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Klik "Tambah Rekening" di atas untuk mulai menerima amplop digital dari tamu Anda.
            </p>
          </div>
        ) : (
          <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-none overflow-hidden bg-white dark:bg-slate-900">
            {accounts.map((acc, index) => (
              <div 
                key={acc.id} 
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 ${
                  index !== accounts.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
                }`}
              >
                {/* Info block */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                      {acc.bank_name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px]">
                      {acc.invitations?.bride_name} & {acc.invitations?.groom_name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Nomor Rekening / E-Wallet</p>
                    <p className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white tracking-wider">{acc.account_number}</p>
                    <p className="text-sm text-slate-900 dark:text-slate-300 font-bold uppercase">A.N. {acc.account_name}</p>
                  </div>
                </div>
                
                {/* Actions block (Visible on mobile properly, not hover dependent) */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenModal(acc)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-none text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-900 dark:border-white hover:text-slate-900 dark:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-none text-xs font-semibold text-rose-600 dark:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-none border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-playfair">
                  {editingId ? "Edit Rekening" : "Tambah Rekening Baru"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 rounded-none bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pilih Undangan</label>
                  <select
                    value={formData.invitation_id}
                    onChange={(e) => setFormData({ ...formData, invitation_id: e.target.value })}
                    disabled={!!editingId || invitations.length === 1}
                    className="w-full px-4 py-3 rounded-none bg-transparent border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:border-white transition-colors disabled:opacity-50"
                  >
                    {invitations.map((inv) => (
                      <option key={inv.id} value={inv.id} className="text-slate-900">
                        {inv.bride_name} & {inv.groom_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nama Bank / E-Wallet</label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    placeholder="Contoh: BCA / GoPay"
                    className="w-full px-4 py-3 rounded-none bg-transparent border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="Contoh: 1234567890"
                    className="w-full px-4 py-3 rounded-none bg-transparent border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Atas Nama (Pemilik)</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="Contoh: ROMEO MONTAGUE"
                    className="w-full px-4 py-3 rounded-none bg-transparent border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-slate-900 dark:border-white transition-colors"
                  />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-none text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-none text-xs font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center"
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
