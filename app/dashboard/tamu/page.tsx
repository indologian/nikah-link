"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Users, UserPlus, Search, Copy, Check, Share2,
  MessageSquare, Trash2, CheckCircle2, XCircle,
  HelpCircle, Sparkles, Download
} from "lucide-react";
import type { Guest, Invitation } from "@/types";
import UpsellModal from "@/components/dashboard/UpsellModal";
import * as XLSX from "xlsx";

export default function GuestManagementPage() {
  const supabase = createClient();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string>("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Add Guest Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestSession, setNewGuestSession] = useState<"all" | "pagi" | "siang" | "malam">("all");
  const [newGuestCount, setNewGuestCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Copied state indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Paywall states
  const [userPlan, setUserPlan] = useState<"free" | "premium" | "pro">("free");
  const [upsellConfig, setUpsellConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    planNeeded: "premium" | "pro";
  }>({
    isOpen: false,
    title: "",
    description: "",
    planNeeded: "premium"
  });

  // Fetch user's invitations
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: invs } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (invs && invs.length > 0) {
        setInvitations(invs);
        setSelectedInvId(invs[0].id);
      }

      const { data: profile } = await supabase.from("profiles").select("plan").eq("user_id", user.id).single();
      if (profile && profile.plan) {
        setUserPlan(profile.plan);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  // Fetch guests for selected invitation
  useEffect(() => {
    if (!selectedInvId) return;

    async function loadGuests() {
      const { data } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_id", selectedInvId)
        .order("created_at", { ascending: false });

      setGuests(data || []);
    }
    loadGuests();
  }, [selectedInvId]);

  const selectedInv = invitations.find((i) => i.id === selectedInvId);

  // Add Guest Handler
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvId || !newGuestName.trim()) return;

    setSubmitting(true);
    const { data, error } = await supabase
      .from("guests")
      .insert({
        invitation_id: selectedInvId,
        name: newGuestName.trim(),
        phone: newGuestPhone.trim() || null,
        session: newGuestSession,
        guest_count: newGuestCount,
        rsvp_status: "pending",
      })
      .select()
      .single();

    if (!error && data) {
      setGuests([data, ...guests]);
      setNewGuestName("");
      setNewGuestPhone("");
      setShowAddModal(false);
    }
    setSubmitting(false);
  };

  // Delete Guest
  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Hapus tamu ini dari daftar?")) return;
    await supabase.from("guests").delete().eq("id", id);
    setGuests(guests.filter((g) => g.id !== id));
  };

  // Generate Personalized URL & WA Message (Share Link Manual)
  const getPersonalizedUrl = (guestName: string) => {
    const slug = selectedInv?.username || "demo";
    const encodedName = encodeURIComponent(guestName);
    return `https://nikahlink.com/${slug}?to=${encodedName}`;
  };

  const getWaMessage = (guestName: string) => {
    const bride = selectedInv?.bride_name || "Mempelai";
    const groom = selectedInv?.groom_name || "Mempelai";
    const link = getPersonalizedUrl(guestName);

    return `Kepada Yth. Bpk/Ibu/Saudara/i ${guestName},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara pernikahan kami:

*${bride} & ${groom}*

Berikut tautan undangan digital kami untuk informasi selengkapnya:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih.
Salam hangat,
*${bride} & ${groom}*`;
  };

  // Manual Share Actions
  const handleCopyLink = (guest: Guest) => {
    const link = getPersonalizedUrl(guest.name);
    navigator.clipboard.writeText(link);
    setCopiedId(`link-${guest.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyWaText = (guest: Guest) => {
    const text = getWaMessage(guest.name);
    navigator.clipboard.writeText(text);
    setCopiedId(`wa-${guest.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenWa = (guest: Guest) => {
    const text = getWaMessage(guest.name);
    const cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, "") : "";
    const phoneWithCountry = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
    const waUrl = cleanPhone
      ? `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleExportXLSX = () => {
    if (userPlan !== "pro") {
      setUpsellConfig({
        isOpen: true,
        title: "Ekspor Data Eksklusif",
        description: "Fitur Ekspor Data Tamu (XLSX) ditujukan khusus untuk paket Pro VIP. Upgrade paketmu untuk manajemen data tamu tingkat lanjut!",
        planNeeded: "pro"
      });
      return;
    }
    
    if (guests.length === 0) {
      alert("Tidak ada data tamu yang bisa diekspor.");
      return;
    }

    const dataToExport = guests.map((g, index) => ({
      "No": index + 1,
      "Nama Tamu": g.name,
      "Nomor Telepon/WA": g.phone || "-",
      "Sesi Kehadiran": g.session === "all" ? "Semua Sesi" : g.session,
      "Status RSVP": g.rsvp_status === "hadir" ? "Hadir" : g.rsvp_status === "tidak_hadir" ? "Tidak Hadir" : "Pending",
      "Jumlah Orang": g.guest_count,
      "Catatan Tambahan": g.notes || "-",
      "Link Undangan Pribadi": getPersonalizedUrl(g.name)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    const colWidths = [
      { wch: 5 }, // No
      { wch: 25 }, // Nama Tamu
      { wch: 20 }, // Nomor Telepon
      { wch: 15 }, // Sesi
      { wch: 15 }, // Status RSVP
      { wch: 15 }, // Jumlah
      { wch: 30 }, // Catatan
      { wch: 50 }, // Link
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Tamu");

    const bride = selectedInv?.bride_name || "Mempelai";
    const groom = selectedInv?.groom_name || "Mempelai";
    const fileName = `Daftar_Tamu_${bride}_${groom}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || (g.phone && g.phone.includes(search));
    const matchesStatus = statusFilter === "all" || g.rsvp_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <UpsellModal 
        isOpen={upsellConfig.isOpen}
        onClose={() => setUpsellConfig(prev => ({ ...prev, isOpen: false }))}
        title={upsellConfig.title}
        description={upsellConfig.description}
        planNeeded={upsellConfig.planNeeded}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1A1517] p-6 rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-[#221C28] dark:text-[#FDFBF7] font-playfair flex items-center gap-3">
            <Users className="w-7 h-7 text-[#9E1B54]" />
            Manajemen Tamu & Share Link Manual
          </h1>
          <p className="text-slate-500 dark:text-[#B39E9E] text-xs sm:text-sm mt-1">
            Personalisasi nama tamu pada link undangan & bagikan teks sapaan manis secara manual via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportXLSX}
            className="hidden sm:flex bg-white dark:bg-[#1A1517] text-slate-700 dark:text-[#D1C4C4] hover:bg-slate-50 dark:hover:bg-[#251E21] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold items-center gap-2 border border-slate-200 dark:border-[#423338] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Ekspor XLSX
          </button>
          
          <button
            onClick={() => {
              if (userPlan === "free" && guests.length >= 50) {
                setUpsellConfig({
                  isOpen: true,
                  title: "Batas Tamu Tercapai",
                  description: "Paket Free membatasi maksimal 50 tamu. Upgrade ke Premium untuk mendapatkan kapasitas tamu TANPA BATAS!",
                  planNeeded: "premium"
                });
                return;
              }
              setShowAddModal(true);
            }}
            className="btn-wevitation px-5 py-2.5 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Tamu Baru
          </button>
        </div>
      </div>

      {/* Select Invitation Selector */}
      {invitations.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] shadow-xs">
          <Sparkles className="w-5 h-5 text-[#9E1B54]" />
          <span className="text-sm text-slate-700 dark:text-[#D1C4C4] font-semibold">Pilih Undangan:</span>
          <select
            value={selectedInvId}
            onChange={(e) => setSelectedInvId(e.target.value)}
            className="bg-slate-50 dark:bg-[#251E21] text-slate-800 dark:text-[#E8E1E1] rounded-xl px-4 py-2 border border-slate-200 dark:border-[#423338] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#9E1B54]"
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id} className="bg-white dark:bg-[#1A1517] text-slate-800 dark:text-[#E8E1E1]">
                {inv.bride_name} & {inv.groom_name} (nikahlink.com/{inv.username})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor telepon..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1517] border border-[#F0E2DA] dark:border-[#33272B] text-slate-800 dark:text-[#E8E1E1] placeholder:text-slate-400 dark:placeholder:text-[#8D7575] text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54] shadow-xs"
          />
        </div>

        <div className="flex gap-2">
          {["all", "hadir", "tidak_hadir", "pending"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? "btn-wevitation text-white shadow-sm"
                  : "bg-white dark:bg-[#1A1517] text-slate-600 dark:text-[#D1C4C4] hover:bg-slate-50 dark:hover:bg-[#251E21] border border-[#F0E2DA] dark:border-[#33272B]"
              }`}
            >
              {st === "all" ? "Semua" : st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table / List */}
      <div className="card-wevitation bg-white dark:bg-[#1A1517] rounded-2xl border border-[#F0E2DA] dark:border-[#33272B] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#33272B] bg-slate-50 dark:bg-[#251E21] text-slate-500 dark:text-[#B39E9E] text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Nama Tamu</th>
                <th className="py-4 px-4">Kontak</th>
                <th className="py-4 px-4">RSVP Status</th>
                <th className="py-4 px-4">Jumlah</th>
                <th className="py-4 px-6 text-right">Aksi Share Link Manual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#33272B] text-xs sm:text-sm">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                    Belum ada tamu terdaftar. Klik <strong>Tambah Tamu Baru</strong> untuk memulai.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-6 font-bold text-[#221C28] dark:text-[#FDFBF7]">
                      <div>{guest.name}</div>
                      <div className="text-[11px] font-mono text-[#9E1B54] truncate max-w-xs font-normal">
                        {getPersonalizedUrl(guest.name)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-[#D1C4C4] text-xs">
                      {guest.phone || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                        guest.rsvp_status === "hadir"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : guest.rsvp_status === "tidak_hadir"
                          ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 border-rose-200"
                          : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 border-amber-200"
                      }`}>
                        {guest.rsvp_status === "hadir" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {guest.rsvp_status === "tidak_hadir" && <XCircle className="w-3.5 h-3.5" />}
                        {guest.rsvp_status === "pending" && <HelpCircle className="w-3.5 h-3.5" />}
                        {guest.rsvp_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-[#D1C4C4] font-medium">
                      {guest.guest_count} Orang
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(guest)}
                          title="Salin Link Khusus"
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:border-[#423338] text-slate-700 dark:text-[#D1C4C4] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === `link-${guest.id}` ? (
                            <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Tersalin</span>
                          ) : (
                            <><Copy className="w-3.5 h-3.5 text-[#9E1B54]" /> Link</>
                          )}
                        </button>

                        {/* Copy WA Teks Button */}
                        <button
                          onClick={() => handleCopyWaText(guest)}
                          title="Salin Teks Undangan WA"
                          className="px-3 py-1.5 rounded-xl bg-[#FCEBF2] dark:bg-[#9E1B54]/20 hover:bg-[#F8D5E3] border border-[#F8D5E3] dark:border-[#9E1B54]/30 text-[#9E1B54] text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          {copiedId === `wa-${guest.id}` ? (
                            <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Teks Tersalin</span>
                          ) : (
                            <><MessageSquare className="w-3.5 h-3.5" /> Teks WA</>
                          )}
                        </button>

                        {/* Open WA Direct */}
                        <button
                          onClick={() => handleOpenWa(guest)}
                          title="Kirim Manual via WhatsApp"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Share WA
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Guest */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#1A1517] rounded-2xl p-6 border border-[#F0E2DA] dark:border-[#33272B] shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-[#221C28] dark:text-[#FDFBF7] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#9E1B54]" /> Tambah Tamu Undangan
            </h3>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1">Nama Tamu / Pasangan *</label>
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Contoh: Bapak Ahmad & Keluarga"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:border-[#423338] text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1">Nomor WhatsApp (Opsional)</label>
                <input
                  type="tel"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:border-[#423338] text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#9E1B54]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1">Sesi Kehadiran</label>
                  <select
                    value={newGuestSession}
                    onChange={(e) => setNewGuestSession(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:border-[#423338] text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="all">Bebas / All</option>
                    <option value="pagi">Pagi (Sesi 1)</option>
                    <option value="siang">Siang (Sesi 2)</option>
                    <option value="malam">Malam (Sesi 3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#D1C4C4] mb-1">Perkiraan Kuota Tamu</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 dark:border-[#423338] text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-[#33272B]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#D1C4C4] hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-wevitation py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Tamu"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
