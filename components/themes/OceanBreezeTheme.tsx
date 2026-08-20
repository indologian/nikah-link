"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Volume2, VolumeX,
  Gift, Copy, CheckCircle2, Music
} from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Fonts
import { Playfair_Display, Lato } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function OceanBreezeTheme({
  invitation = {},
  guestName = "Tamu Undangan",
  initialWishes = [],
  giftAccounts = [],
  isFreePlan,
  expiresAt,
  customData,
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

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-12-12";
  
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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleSendWish = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!wishText.trim()) return;

  setSendingWish(true);

  try {
    const response = await fetch("/api/public/wishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitationId: invitation.id,
        guestName: wishName.trim() || "Anonim",
        message: wishText.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Gagal mengirim ucapan.");
      return;
    }

    if (result.data) {
      setWishes((current) => [result.data, ...current]);
    }

    setWishText("");
  } catch (error) {
    console.error("Wish submit error:", error);
    alert("Gagal mengirim ucapan. Silakan coba lagi.");
  } finally {
    setSendingWish(false);
  }
};;

  const handleRsvpSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setSubmittingRsvp(true);

  try {
    const response = await fetch("/api/public/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invitationId: invitation.id,
        name: wishName.trim() || guestName || "Tamu Undangan",
        status: rsvpStatus,
        guestCount: rsvpStatus === "hadir" ? rsvpCount : 0,
        notes: rsvpNotes.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Gagal mengirim RSVP.");
      return;
    }

    setRsvpSuccess(true);
  } catch (error) {
    console.error("RSVP submit error:", error);
    alert("Gagal mengirim RSVP. Silakan coba lagi.");
  } finally {
    setSubmittingRsvp(false);
  }
};;

  const bgGradient = "bg-gradient-to-br from-[var(--theme-text)] to-[var(--theme-accent)]";
  const goldText = "text-[var(--theme-primary)]";
  const lightBlueBg = "bg-[var(--theme-background)]";

  // SVG Wave Divider
  const WaveDividerTop = () => (
    <svg className="absolute top-0 w-full h-auto -translate-y-[99%] fill-[var(--theme-background)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,170.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  );

  const WaveDividerBottom = () => (
    <svg className="absolute bottom-0 w-full h-auto translate-y-[99%] fill-[var(--theme-background)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,133.3C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
    </svg>
  );

  return (
    <div className={`min-h-screen text-[var(--theme-text)] overflow-hidden ${lato.className}`}>
      
      {/* Audio Element */}
      {invitation.music_url && (
        <audio ref={audioRef} loop src={invitation.music_url} />
      )}

      {/* Floating Audio Control */}
      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[rgba(var(--theme-accent-rgb),0.1)] text-[var(--theme-accent)]"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className={`w-5 h-5 ${!isPlaying && "opacity-50"}`} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* COVER SCREEN */
          <motion.div
            key="cover"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100vh" }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgGradient} text-white`}
          >
            {/* Subtle background particles */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
               <motion.div animate={{ y: [-20, 20], x: [-10, 10] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", repeatType: "mirror" }} className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
               <motion.div animate={{ y: [20, -20], x: [10, -10] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", repeatType: "mirror" }} className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-[rgba(var(--theme-background-rgb),0.3)] blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <p className="text-sm tracking-[0.3em] uppercase mb-4 text-[var(--theme-background)]">The Wedding Of</p>
                <h1 className={`text-6xl md:text-7xl font-bold ${playfair.className} mb-6 leading-tight`}>
                  {invitation.groom_name} <br/> <span className="text-3xl italic text-[var(--theme-primary)]">&amp;</span> <br/> {invitation.bride_name}
                </h1>
                
                <div className="w-16 h-[1px] bg-white/30 mx-auto mb-6"></div>
                
                <p className="text-lg">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full mb-8"
              >
                <p className="text-sm text-white/80 mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="text-xl font-bold">{guestName}</p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                onClick={handleOpenInvitation}
                className="relative overflow-hidden group bg-white text-[var(--theme-text)] px-8 py-3 rounded-full uppercase tracking-widest text-sm font-semibold transition-all hover:scale-105"
              >
                <span className="relative z-10">Buka Undangan</span>
                <div className="absolute inset-0 h-full w-0 bg-[var(--theme-background)] transition-all duration-300 ease-out group-hover:w-full opacity-20"></div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* MAIN INVITATION CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`w-full max-w-md mx-auto bg-white shadow-2xl relative`}
          >
            
            {/* HERO SECTION */}
            <section className={`relative h-screen flex flex-col items-center justify-center ${bgGradient} text-white overflow-hidden`}>
              {invitation.cover_image_url && (
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                  <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-text)] via-transparent to-transparent"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 text-center p-8 mt-20"
              >
                <p className="tracking-widest uppercase text-xs mb-2 text-[var(--theme-background)]">Pernikahan</p>
                <h2 className={`text-5xl ${playfair.className} mb-4`}>
                  {invitation.groom_name} & {invitation.bride_name}
                </h2>
                <div className="w-12 h-1 bg-[var(--theme-primary)] mx-auto mb-6 rounded-full"></div>
                <p className="italic text-white/80">"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."</p>
                <p className="text-sm mt-4 font-bold tracking-wide">— Ar-Rum: 21 —</p>
              </motion.div>
              
              <WaveDividerBottom />
            </section>

            {/* EVENT DETAILS */}
            <section className={`${lightBlueBg} py-20 px-8 relative`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h3 className={`text-4xl ${playfair.className} text-[var(--theme-text)] mb-4`}>Save The Date</h3>
                <p className="text-[var(--theme-accent)]">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.</p>
              </motion.div>

              <div className="space-y-8">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 shadow-xl shadow-[rgba(var(--theme-accent-rgb),0.05)] border border-[rgba(var(--theme-background-rgb),0.2)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[rgba(var(--theme-primary-rgb),0.1)] to-transparent rounded-bl-full"></div>
                  <h4 className={`text-2xl ${playfair.className} font-bold text-[var(--theme-accent)] mb-2`}>Akad Nikah</h4>
                  <div className="w-8 h-[2px] bg-[var(--theme-primary)] mb-4"></div>
                  
                  <div className="space-y-3 text-sm text-[rgba(var(--theme-text-rgb),0.8)]">
                    <p className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-accent)]">🗓️</span>
                      {invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-accent)]">⏰</span>
                      {invitation.akad_time || "08:00 WIB"}
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-accent)] shrink-0">📍</span>
                      <span>
                        <strong>{invitation.akad_venue || "Lokasi Akad"}</strong><br/>
                        {invitation.akad_address}
                      </span>
                    </p>
                  </div>

                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--theme-text)] text-white py-3 rounded-xl hover:bg-[var(--theme-accent)] transition-colors group">
                      <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                      <span>Google Maps (Akad)</span>
                    </a>
                  )}
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl p-6 shadow-xl shadow-[rgba(var(--theme-accent-rgb),0.05)] border border-[rgba(var(--theme-background-rgb),0.2)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[rgba(var(--theme-primary-rgb),0.1)] to-transparent rounded-bl-full"></div>
                  <h4 className={`text-2xl ${playfair.className} font-bold text-[var(--theme-accent)] mb-2`}>Resepsi</h4>
                  <div className="w-8 h-[2px] bg-[var(--theme-primary)] mb-4"></div>
                  
                  <div className="space-y-3 text-sm text-[rgba(var(--theme-text-rgb),0.8)]">
                    <p className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-accent)]">🗓️</span>
                      {invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-accent)]">⏰</span>
                      {invitation.reception_time || "11:00 WIB"}
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-accent)] shrink-0">📍</span>
                      <span>
                        <strong>{invitation.reception_venue || "Lokasi Resepsi"}</strong><br/>
                        {invitation.reception_address}
                      </span>
                    </p>
                  </div>

                  {invitation.reception_maps_url && (
                    <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-white py-3 rounded-xl hover:bg-[var(--theme-primary)] transition-colors group shadow-lg shadow-[rgba(var(--theme-primary-rgb),0.3)]">
                      <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                      <span className="font-semibold">Buka Google Maps</span>
                    </a>
                  )}
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-20 px-8 relative bg-white">
                <WaveDividerTop />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-10 mt-10"
                >
                  <Gift className="w-10 h-10 mx-auto text-[var(--theme-primary)] mb-4" />
                  <h3 className={`text-4xl ${playfair.className} text-[var(--theme-text)] mb-4`}>Wedding Gift</h3>
                  <p className="text-[var(--theme-accent)] text-sm leading-relaxed">Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kado yang paling bermakna bagi kami. Namun jika ingin memberikan tanda kasih, dapat melalui fitur di bawah ini.</p>
                </motion.div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[var(--theme-text)] text-white rounded-2xl p-6 relative overflow-hidden shadow-2xl"
                    >
                      {/* Decorative Background for Card */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10"></div>
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--theme-accent)] rounded-full blur-3xl opacity-50"></div>
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          <p className="text-[var(--theme-background)] text-sm uppercase tracking-wider font-bold mb-1">{account.bank_name}</p>
                          <p className={`text-3xl font-mono tracking-widest ${playfair.className}`}>{account.account_number}</p>
                          <p className="text-white/80 mt-2 uppercase">A.N {account.account_name}</p>
                        </div>
                        
                        <button
                          onClick={() => handleCopy(account.account_number, account.id)}
                          className="mt-6 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition backdrop-blur-sm py-2 px-4 rounded-lg w-full font-medium"
                        >
                          {copiedBank === account.id ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)]" />
                              <span className="text-[var(--theme-primary)]">Berhasil Disalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Salin No. Rekening</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* RSVP & WISHES */}
            <section className={`${bgGradient} text-white py-20 px-8 relative`}>
              <WaveDividerTop />
              
              <div className="mt-12 text-center mb-10">
                <h3 className={`text-4xl ${playfair.className} mb-4`}>RSVP & Buku Tamu</h3>
                <p className="text-white/80 text-sm">Konfirmasi kehadiran dan tinggalkan pesan manis untuk kedua mempelai.</p>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-12 border border-white/20"
                >
                  <div className="mb-4">
                    <label className="block text-sm mb-2 text-white/90">Nama Tamu</label>
                    <input
                      type="text"
                      value={wishName}
                      onChange={(e) => setWishName(e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
                      placeholder="Nama Anda"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm mb-2 text-white/90">Kehadiran</label>
                    <select
                      value={rsvpStatus}
                      onChange={(e: any) => setRsvpStatus(e.target.value)}
                      className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] [&>option]:text-black"
                    >
                      <option value="hadir">Ya, Saya akan hadir</option>
                      <option value="tidak_hadir">Maaf, saya tidak bisa hadir</option>
                    </select>
                  </div>
                  {rsvpStatus === "hadir" && (
                     <div className="mb-4">
                        <label className="block text-sm mb-2 text-white/90">Jumlah Kehadiran</label>
                        <select
                          value={rsvpCount}
                          onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                          className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] [&>option]:text-black"
                        >
                          <option value={1}>1 Orang</option>
                          <option value={2}>2 Orang</option>
                        </select>
                     </div>
                  )}
                  <button
                    disabled={submittingRsvp}
                    type="submit"
                    className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submittingRsvp ? "Mengirim..." : "Kirim Konfirmasi"}
                  </button>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 mb-12">
                  <CheckCircle2 className="w-12 h-12 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Terima Kasih!</h4>
                  <p className="text-sm text-white/80">Konfirmasi kehadiran Anda telah kami terima.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10"
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-white text-[var(--theme-text)] border border-transparent rounded-2xl p-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] resize-none shadow-lg"
                  placeholder="Tuliskan ucapan dan doa restu..."
                  required
                />
                <button
                  type="submit"
                  disabled={sendingWish || !wishText.trim()}
                  className="mt-4 w-full bg-[var(--theme-accent)] hover:bg-[var(--theme-text)] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {sendingWish ? "Mengirim..." : "Kirim Ucapan"}
                </button>
              </motion.form>

              {/* Wishes List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                  >
                    <p className="font-bold text-[var(--theme-primary)] mb-1">{wish.guest_name}</p>
                    <p className="text-sm text-white/90 leading-relaxed">{wish.message}</p>
                    <p className="text-xs text-white/40 mt-3 text-right">
                      {format(new Date(wish.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className={`${lightBlueBg} py-12 text-center relative px-8`}>
              <WaveDividerTop />
              <div className="mt-8">
                <p className={`text-3xl ${playfair.className} text-[var(--theme-text)] mb-2`}>
                  {invitation.groom_name} & {invitation.bride_name}
                </p>
                <p className="text-sm text-[var(--theme-accent)]">Terima kasih atas doa dan restu Anda.</p>
                <div className="mt-8 pt-8 border-t border-[rgba(var(--theme-text-rgb),0.1)] text-xs text-[rgba(var(--theme-text-rgb),0.5)] flex justify-center items-center gap-1">
                  <span>Made with ❤️ by</span>
                  <a href="https://nikahlink.com" className="font-bold text-[var(--theme-accent)] hover:underline">NikahLink</a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
