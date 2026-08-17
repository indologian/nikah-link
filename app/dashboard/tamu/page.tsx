"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Search, Copy, Check, Share2,
  MessageSquare, Trash2, UserPlus, Sparkles, Download
} from "lucide-react";
import type { Guest, Invitation } from "@/types";
import UpsellModal from "@/components/dashboard/UpsellModal";
import AlertModal from "@/components/dashboard/AlertModal";
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

  // Alert state
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: "",
    description: ""
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
    if (!selectedInvId) {
      alert("Silakan pilih atau buat undangan terlebih dahulu.");
      return;
    }
    if (!newGuestName.trim()) {
      alert("Nama tamu tidak boleh kosong.");
      return;
    }

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
    } else {
      console.error(error);
      alert("Gagal menambahkan tamu: " + (error?.message || "Kesalahan tidak diketahui"));
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
      setAlertConfig({
        isOpen: true,
        title: "Daftar Tamu Kosong",
        description: "Tidak ada data tamu yang bisa diekspor. Silakan tambahkan tamu terlebih dahulu."
      });
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
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8 md:py-12">
      <UpsellModal 
        isOpen={upsellConfig.isOpen}
        onClose={() => setUpsellConfig(prev => ({ ...prev, isOpen: false }))}
        title={upsellConfig.title}
        description={upsellConfig.description}
        planNeeded={upsellConfig.planNeeded}
      />
      
      <AlertModal
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        description={alertConfig.description}
      />

      {/* Header - Stripped of unnecessary containment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl tracking-tight font-medium text-slate-900 dark:text-white mb-2">
            Manajemen Tamu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Kelola daftar tamu, buat tautan undangan personal, dan kirim pesan manual via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportXLSX}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Ekspor Data</span>
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 border border-transparent rounded-lg shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Tamu
          </button>
        </div>
      </div>

      {/* Main Unified Workspace */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-4">
          
          {invitations.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label htmlFor="inv-selector" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-400" />
                Undangan Aktif
              </label>
              <div className="relative flex-1 max-w-sm">
                <select
                  id="inv-selector"
                  value={selectedInvId}
                  onChange={(e) => setSelectedInvId(e.target.value)}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-md px-3 py-2 pr-8 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                >
                  {invitations.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.bride_name} & {inv.groom_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md shrink-0">
              {["all", "hadir", "tidak_hadir", "pending"].map((st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                      isActive
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {st === "all" ? "Semua" : st.replace("_", " ")}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama..."
                className="w-full pl-9 pr-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                <th className="py-3 px-4 w-1/4">Tamu</th>
                <th className="py-3 px-4 w-1/6">Kontak</th>
                <th className="py-3 px-4 w-1/6">Status RSVP</th>
                <th className="py-3 px-4 w-1/6">Jumlah</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500 dark:text-slate-400">
                    Belum ada tamu terdaftar.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <div className="font-medium text-slate-900 dark:text-white">{guest.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]" title={getPersonalizedUrl(guest.name)}>
                        nikahlink.com/...
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top text-slate-600 dark:text-slate-300">
                      {guest.phone || "—"}
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        guest.rsvp_status === "hadir"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : guest.rsvp_status === "tidak_hadir"
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-amber-700 dark:text-amber-400"
                      }`}>
                        {/* Subtle dot instead of heavy background */}
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          guest.rsvp_status === "hadir" ? "bg-emerald-500" :
                          guest.rsvp_status === "tidak_hadir" ? "bg-slate-400" :
                          "bg-amber-500"
                        }`} />
                        {guest.rsvp_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top text-slate-600 dark:text-slate-300">
                      {guest.guest_count} Orang
                    </td>
                    <td className="py-4 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleCopyLink(guest)}
                          title="Copy Link"
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                        >
                          {copiedId === `link-${guest.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleCopyWaText(guest)}
                          title="Copy WA Text"
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                        >
                          {copiedId === `wa-${guest.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <MessageSquare className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleOpenWa(guest)}
                          title="Send via WhatsApp"
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          title="Delete"
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                Tambah Tamu
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Trash2 className="w-5 h-5 hidden" />
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Contoh: Bapak Ahmad"
                  required
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor WhatsApp (Opsional)</label>
                <input
                  type="tel"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sesi Kehadiran</label>
                  <select
                    value={newGuestSession}
                    onChange={(e) => setNewGuestSession(e.target.value as any)}
                    className="w-full px-3 py-2 appearance-none rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                  >
                    <option value="all">Bebas (All)</option>
                    <option value="pagi">Pagi (Sesi 1)</option>
                    <option value="siang">Siang (Sesi 2)</option>
                    <option value="malam">Malam (Sesi 3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kuota Tamu</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newGuestCount}
                    onChange={(e) => setNewGuestCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-md text-sm font-medium text-slate-700 bg-white border border-slate-300 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-md text-sm font-medium text-white bg-slate-900 border border-transparent shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors disabled:opacity-50"
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
