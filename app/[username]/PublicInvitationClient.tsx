"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Calendar, MapPin, Music, Volume2, VolumeX,
  Gift, Copy, Check, MessageSquare, Send, Clock,
  ChevronUp, User, Sparkles, Navigation, CheckCircle2,
  Share2, Camera, Compass
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Props {
  invitation: any;
  guestName: string;
  initialWishes: any[];
  giftAccounts: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
}

export default function PublicInvitationClient({
  invitation,
  guestName,
  initialWishes,
  giftAccounts,
  isFreePlan,
  expiresAt,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Wishes state
  const [wishes, setWishes] = useState(initialWishes);
  const [wishName, setWishName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [wishText, setWishText] = useState("");
  const [sendingWish, setSendingWish] = useState(false);

  // RSVP state
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "tidak_hadir">("hadir");
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpNotes, setRsvpNotes] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-10-24";

  useEffect(() => {
    const target = new Date(weddingDateStr).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

  // Free Plan Expiry Logic
  const [isExpired, setIsExpired] = useState(false);
  const [freeTimeLeftStr, setFreeTimeLeftStr] = useState("");

  useEffect(() => {
    if (!isFreePlan || !expiresAt) return;

    const expiresAtMs = new Date(expiresAt).getTime();

    const updateFreeCountdown = () => {
      const now = Date.now();
      const diff = expiresAtMs - now;

      if (diff <= 0) {
        setIsExpired(true);
        setFreeTimeLeftStr("00:00:00");
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
        setFreeTimeLeftStr(`${h}:${m}:${s}`);
      }
    };

    updateFreeCountdown();
    const timer = setInterval(updateFreeCountdown, 1000);
    return () => clearInterval(timer);
  }, [isFreePlan, expiresAt]);

  // Audio toggle
  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Copy Bank Account
  const handleCopy = (accNumber: string, id: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // Submit Wish
  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    setSendingWish(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("wishes")
      .insert({
        invitation_id: invitation.id,
        guest_name: wishName.trim() || "Anonim",
        message: wishText.trim(),
        is_approved: true,
      })
      .select()
      .single();

    if (data) {
      setWishes([data, ...wishes]);
      setWishText("");
    }
    setSendingWish(false);
  };

  // Submit RSVP
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRsvp(true);
    const supabase = createClient();

    if (isFreePlan) {
      const { count } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true })
        .eq("invitation_id", invitation.id);

      if (count !== null && count >= 50) {
        alert("Mohon maaf, kuota tamu undangan telah mencapai batas maksimal (50 tamu).");
        setSubmittingRsvp(false);
        return;
      }
    }

    await supabase.from("guests").insert({
      invitation_id: invitation.id,
      name: wishName.trim() || guestName || "Tamu Undangan",
      rsvp_status: rsvpStatus,
      guest_count: rsvpCount,
      notes: rsvpNotes,
    });

    setSubmittingRsvp(false);
    setRsvpSuccess(true);
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#0d0914] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-gold-500/20 mb-6 border border-rose-gold-500/30">
            <Clock className="w-8 h-8 text-rose-gold-400" />
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-4">Undangan Kedaluwarsa</h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Waktu tayang undangan versi Gratis (24 jam) telah berakhir. Jika Anda adalah pemilik undangan ini, silakan masuk ke Dasbor dan lakukan Upgrade ke Premium atau Pro VIP untuk mengaktifkannya kembali selamanya.
          </p>
          <a href="/login" className="inline-block btn-gradient px-8 py-3 rounded-full font-bold text-white text-sm tracking-wider shadow-xl hover:scale-105 transition-transform">
            Masuk ke Dasbor
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0914] text-white selection:bg-rose-gold-500 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Free Plan Floating Banner */}
      {isFreePlan && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-rose-gold-500/90 backdrop-blur-md border-b border-rose-gold-400/30 px-4 py-2 pt-[max(8px,env(safe-area-inset-top))] flex items-center justify-center gap-2 text-xs sm:text-sm text-white font-medium shadow-lg">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Undangan Gratis berakhir dalam: <strong className="font-bold tracking-wider">{freeTimeLeftStr}</strong></span>
        </div>
      )}

      {/* Background Audio */}
      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop preload="auto" />
      )}

      {/* Floating Audio Controller */}
      {isOpen && invitation.music_url && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={toggleAudio}
          className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass-dark border border-white/20 flex items-center justify-center shadow-2xl transition-all ${
            isPlaying ? "animate-spin-slow ring-2 ring-rose-gold-400" : ""
          }`}
          title={isPlaying ? "Matikan Musik" : "Putar Musik"}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-rose-gold-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-white/40" />
          )}
        </motion.button>
      )}

      {/* ============================================================ */}
      {/* 1. INTERACTIVE ENVELOPE COVER (OPEN MODAL) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#180e29] via-[#0d0914] to-[#1a1226] text-center"
          >
            {/* Ambient glows */}
            <div className="absolute w-96 h-96 rounded-full bg-rose-gold-500/10 blur-[120px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-md w-full glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl relative"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 mb-6 shadow-xl animate-pulse-glow">
                <Heart className="w-7 h-7 text-white fill-white" strokeWidth={0} />
              </div>

              <span className="text-xs uppercase tracking-[0.3em] text-rose-gold-400 font-semibold block mb-2">
                The Wedding of
              </span>

              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gradient mb-6 leading-tight">
                {invitation.bride_name} <br />
                <span className="text-2xl font-serif text-white/60">&</span> <br />
                {invitation.groom_name}
              </h1>

              {/* Guest name badge */}
              <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                <p className="font-playfair text-lg font-bold text-rose-gold-300 capitalize">
                  {guestName}
                </p>
              </div>

              <button
                onClick={handleOpenInvitation}
                className="w-full btn-gradient py-4 rounded-2xl font-bold text-white text-sm tracking-wider flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-transform"
              >
                <Sparkles className="w-4 h-4" /> Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* 2. MAIN INVITATION CONTENT */}
      {/* ============================================================ */}
      {isOpen && (
        <main className="max-w-2xl mx-auto px-4 pb-24 space-y-16">
          {/* Hero Section */}
          <section className="pt-16 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-rose-gold-400/40 shadow-2xl"
            >
              {invitation.cover_image_url ? (
                <img
                  src={invitation.cover_image_url}
                  alt="Couple Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-rose-gold-800 to-plum-900 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-rose-gold-400" />
                </div>
              )}
            </motion.div>

            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-rose-gold-400 font-semibold">
                Undangan Pernikahan
              </span>
              <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gradient mt-2 mb-3">
                {invitation.bride_name} & {invitation.groom_name}
              </h2>
              <p className="text-white/60 text-sm font-light">
                {weddingDateStr}
              </p>
            </div>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto pt-4">
              {[
                { label: "Hari", val: timeLeft.days },
                { label: "Jam", val: timeLeft.hours },
                { label: "Menit", val: timeLeft.minutes },
                { label: "Detik", val: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-2xl glass-dark border border-white/10 text-center">
                  <div className="font-mono text-2xl font-bold text-rose-gold-300">{item.val}</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Quote Section */}
          <section className="text-center p-8 rounded-3xl glass-dark border border-white/10 space-y-4">
            <p className="text-rose-gold-400 text-xs uppercase tracking-widest font-semibold">
              — QS. Ar-Rum: 21 —
            </p>
            <p className="font-serif italic text-white/80 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
            </p>
          </section>

          {/* Bride & Groom Profile */}
          <section className="space-y-8">
            <div className="text-center">
              <h3 className="font-playfair text-2xl font-bold text-white mb-2">Mempelai Pernikahan</h3>
              <div className="w-12 h-0.5 bg-rose-gold-500 mx-auto" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Groom */}
              <div className="p-6 rounded-3xl glass-dark border border-white/10 text-center space-y-4">
                {invitation.groom_photo_url && (
                  <img
                    src={invitation.groom_photo_url}
                    alt={invitation.groom_name}
                    className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-rose-gold-400"
                  />
                )}
                <h4 className="font-playfair text-xl font-bold text-rose-gold-300">{invitation.groom_name}</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Putra tercinta dari <br />
                  <strong className="text-white">Bpk. H. Montague & Ibu Hj. Montague</strong>
                </p>
              </div>

              {/* Bride */}
              <div className="p-6 rounded-3xl glass-dark border border-white/10 text-center space-y-4">
                {invitation.bride_photo_url && (
                  <img
                    src={invitation.bride_photo_url}
                    alt={invitation.bride_name}
                    className="w-28 h-28 rounded-full object-cover mx-auto border-2 border-rose-gold-400"
                  />
                )}
                <h4 className="font-playfair text-xl font-bold text-rose-gold-300">{invitation.bride_name}</h4>
                <p className="text-white/60 text-xs leading-relaxed">
                  Putri tercinta dari <br />
                  <strong className="text-white">Bpk. H. Capulet & Ibu Hj. Capulet</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Events Section (Akad & Resepsi) */}
          <section className="space-y-6">
            <div className="text-center">
              <h3 className="font-playfair text-2xl font-bold text-white mb-2">Rangkaian Acara</h3>
              <div className="w-12 h-0.5 bg-rose-gold-500 mx-auto" />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Akad */}
              <div className="p-6 rounded-3xl glass-dark border border-white/10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20">
                  <Calendar className="w-3.5 h-3.5" /> Akad Nikah
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{invitation.akad_venue || "Lokasi Akad"}</h4>
                  <p className="text-white/60 text-xs mt-1">{invitation.akad_address || "Alamat lokasi akad nikah"}</p>
                </div>
                <div className="text-xs text-white/70 space-y-1">
                  <p>🗓 {invitation.akad_date || weddingDateStr}</p>
                  <p>⏰ {invitation.akad_time || "08:00 WIB - Selesai"}</p>
                </div>
                {invitation.akad_maps_url && (
                  <a
                    href={invitation.akad_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-rose-gold-400 font-semibold hover:underline"
                  >
                    <Compass className="w-4 h-4" /> Buka Google Maps
                  </a>
                )}
              </div>

              {/* Resepsi */}
              <div className="p-6 rounded-3xl glass-dark border border-white/10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-gold-500/10 text-rose-gold-300 text-xs font-bold border border-rose-gold-500/20">
                  <Calendar className="w-3.5 h-3.5" /> Resepsi Pernikahan
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">{invitation.reception_venue || "Lokasi Resepsi"}</h4>
                  <p className="text-white/60 text-xs mt-1">{invitation.reception_address || "Alamat lokasi resepsi"}</p>
                </div>
                <div className="text-xs text-white/70 space-y-1">
                  <p>🗓 {invitation.reception_date || weddingDateStr}</p>
                  <p>⏰ {invitation.reception_time || "11:00 WIB - Selesai"}</p>
                </div>
                {invitation.reception_maps_url && (
                  <a
                    href={invitation.reception_maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-rose-gold-400 font-semibold hover:underline"
                  >
                    <Compass className="w-4 h-4" /> Buka Google Maps
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* RSVP Form Section */}
          {invitation.show_rsvp && (
            <section className="p-8 rounded-3xl glass-dark border border-white/10 space-y-6">
              <div className="text-center">
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">Konfirmasi Kehadiran (RSVP)</h3>
                <p className="text-white/50 text-xs">Mohon isi konfirmasi kehadiran Anda sebelum hari bahagia kami.</p>
              </div>

              {rsvpSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Terima Kasih!</h4>
                  <p className="text-white/60 text-xs">Konfirmasi kehadiran Anda telah berhasil tersimpan.</p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Nama Anda *</label>
                    <input
                      type="text"
                      value={wishName}
                      onChange={(e) => setWishName(e.target.value)}
                      required
                      placeholder="Masukkan nama Anda"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Konfirmasi Kehadiran *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRsvpStatus("hadir")}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          rsvpStatus === "hadir"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-white/5 text-white/50 border-white/10"
                        }`}
                      >
                        ✓ Saya Akan Hadir
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpStatus("tidak_hadir")}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          rsvpStatus === "tidak_hadir"
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            : "bg-white/5 text-white/50 border-white/10"
                        }`}
                      >
                        ✕ Maaf, Belum Bisa Hadir
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-1">Jumlah Tamu</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={rsvpCount}
                      onChange={(e) => setRsvpCount(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-gold-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRsvp}
                    className="w-full btn-gradient py-3 rounded-xl font-semibold text-white text-sm shadow-lg disabled:opacity-50"
                  >
                    {submittingRsvp ? "Mengirim..." : "Kirim Konfirmasi RSVP"}
                  </button>
                </form>
              )}
            </section>
          )}

          {/* Gift / Amplop Digital Section */}
          {invitation.show_gift && giftAccounts.length > 0 && (
            <section className="p-8 rounded-3xl glass-dark border border-white/10 space-y-6">
              <div className="text-center">
                <Gift className="w-8 h-8 text-rose-gold-400 mx-auto mb-2" />
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">Amplop Digital & Kado</h3>
                <p className="text-white/50 text-xs">
                  Doa restu Anda merupakan hadiah terindah. Namun jika ingin memberikan tanda kasih secara digital:
                </p>
              </div>

              <div className="space-y-4">
                {giftAccounts.map((gift) => (
                  <div key={gift.id} className="p-4 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-rose-gold-400 font-bold uppercase">{gift.bank_name}</span>
                      <p className="font-mono text-base font-bold text-white">{gift.account_number}</p>
                      <p className="text-xs text-white/50">A.N. {gift.account_name}</p>
                    </div>

                    <button
                      onClick={() => handleCopy(gift.account_number, gift.id)}
                      className="px-4 py-2 rounded-xl bg-rose-gold-500/20 hover:bg-rose-gold-500/30 text-rose-gold-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      {copiedBank === gift.id ? (
                        <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Tersalin</span>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Salin No. Rek</>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Wishes Wall Section */}
          {invitation.show_wishes && (
            <section className="p-8 rounded-3xl glass-dark border border-white/10 space-y-6">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-rose-gold-400 mx-auto mb-2" />
                <h3 className="font-playfair text-2xl font-bold text-white mb-2">Ucapan & Doa Restu</h3>
                <p className="text-white/50 text-xs">Tuliskan pesan dan doa terbaik Anda untuk kedua mempelai.</p>
              </div>

              {/* Wish Input Form */}
              <form onSubmit={handleSendWish} className="space-y-3">
                <input
                  type="text"
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Nama Anda"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-rose-gold-400"
                />
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder="Tulis ucapan selamat & doa restu di sini..."
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-rose-gold-400"
                />
                <button
                  type="submit"
                  disabled={sendingWish}
                  className="w-full btn-gradient py-2.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Kirim Ucapan
                </button>
              </form>

              {/* Wishes List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {wishes.length === 0 ? (
                  <p className="text-center text-white/30 text-xs py-4">Jadilah yang pertama mengirim ucapan!</p>
                ) : (
                  wishes.map((w) => (
                    <div key={w.id} className="p-4 rounded-2xl bg-white/3 border border-white/8 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-gold-300 text-xs">{w.guest_name}</span>
                        <span className="text-[10px] text-white/30">
                          {new Date(w.created_at || Date.now()).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="text-white/80 text-xs leading-relaxed">{w.message}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Footer watermark */}
          <footer className="text-center text-white/30 text-xs pt-8 border-t border-white/5 space-y-2">
            <p>Dibuat dengan penuh cinta menggunakan</p>
            <p className="font-playfair text-sm text-gradient font-bold">NikahLink.com</p>
          </footer>
        </main>
      )}
    </div>
  );
}
