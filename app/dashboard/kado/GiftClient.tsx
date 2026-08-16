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
      // Create new
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
        // Enforce limit again on server side ideally, but doing it here
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1517] p-6 rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-[#221C28] dark:text-[#FDFBF7] font-playfair flex items-center gap-3">
            <Gift className="w-7 h-7 text-[#9E1B54]" /> Rekening Kado & Amplop Cashless
          </h1>
          <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm mt-1">
            Kelola nomor rekening bank, QRIS, dan e-wallet tempat tamu mengirimkan tanda kasih.
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="btn-wevitation px-5 py-2.5 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Rekening
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            {error}
            {error.includes("Upgrade") && (
              <Link href="/harga" className="ml-2 underline hover:text-rose-800 dark:hover:text-rose-300">Lihat Harga</Link>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-[#1A1517] rounded-2xl p-8 border border-dashed border-[#E0D4CC] text-center py-16">
            <CreditCard className="w-12 h-12 text-[#9E1B54] mx-auto mb-4" />
            <h3 className="text-[#221C28] dark:text-[#FDFBF7] font-bold text-lg mb-2">Belum ada rekening kado terdaftar</h3>
            <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Klik "Tambah Rekening" di atas untuk mulai menerima amplop digital dari tamu Anda.
            </p>
          </div>
        ) : (
          accounts.map((acc) => (
            <div key={acc.id} className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl p-6 border border-[#F0E2DA] dark:border-[#33272B] shadow-xs space-y-4 hover:border-[#9E1B54] transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#FCEBF2] dark:bg-[#9E1B54]/20 border border-[#F8D5E3] dark:border-[#9E1B54]/30 text-[#9E1B54] text-xs font-bold uppercase">
                    {acc.bank_name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-[#B39E9E] font-medium bg-slate-50 dark:bg-[#251E21] px-2 py-1 rounded-md border border-slate-100 dark:border-[#33272B] truncate max-w-[150px]">
                    {acc.invitations?.bride_name} & {acc.invitations?.groom_name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(acc)}
                    className="p-1.5 text-slate-400 hover:text-[#9E1B54] hover:bg-[#FCEBF2] dark:hover:bg-[#9E1B54]/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider font-bold mb-1">Nomor Rekening / E-Wallet</p>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-[#221C28] dark:text-[#FDFBF7] tracking-wider">{acc.account_number}</p>
                <p className="text-xs text-slate-600 dark:text-[#D1C4C4] font-bold mt-1.5">A.N. {acc.account_name}</p>
              </div>
            </div>
          ))
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
              className="absolute inset-0 bg-[#221C28]/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#1A1517] rounded-3xl shadow-2xl border border-[#F0E2DA] dark:border-[#33272B] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#F0E2DA] dark:border-[#33272B]">
                <h3 className="text-lg font-bold text-[#221C28] dark:text-[#FDFBF7] font-playfair">
                  {editingId ? "Edit Rekening" : "Tambah Rekening Baru"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1.5">Pilih Undangan</label>
                  <select
                    value={formData.invitation_id}
                    onChange={(e) => setFormData({ ...formData, invitation_id: e.target.value })}
                    disabled={!!editingId || invitations.length === 1}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#251E21] border border-slate-200 dark:border-[#423338] text-slate-800 dark:text-[#E8E1E1] text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54] disabled:opacity-60"
                  >
                    {invitations.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.bride_name} & {inv.groom_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1.5">Nama Bank / E-Wallet</label>
                  <input
                    type="text"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    placeholder="Contoh: BCA / GoPay"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] text-slate-800 dark:text-[#E8E1E1] text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1.5">Nomor Rekening</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="Contoh: 1234567890"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] text-slate-800 dark:text-[#E8E1E1] text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1.5">Atas Nama (Pemilik)</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="Contoh: A.N. Romeo"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] text-slate-800 dark:text-[#E8E1E1] text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-[#251E21] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-wevitation px-6 py-2.5 rounded-xl font-bold text-white text-xs flex items-center gap-2 disabled:opacity-50 shadow-sm"
                  >
                    {loading ? "Menyimpan..." : "Simpan Rekening"}
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
