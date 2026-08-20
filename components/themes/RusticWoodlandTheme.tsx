"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Gift, Copy, CheckCircle2, Music
} from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Fonts
import { Playfair_Display, Lora } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function RusticWoodlandTheme({
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

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-10-15";
  
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

  // Rustic Colors
  const bgWood = "bg-[var(--theme-background)]"; // Deep Emerald/Forest Green
  const bgParchment = "bg-[var(--theme-text)]"; // Cream/Parchment
  const textBrown = "text-[var(--theme-accent)]"; // Wood brown
  const accentGold = "text-[var(--theme-primary)]"; // Soft Gold / Ochre

  // Leaf SVG Ornament
  const LeafOrnament = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 0 C70 0, 90 20, 90 50 C90 80, 70 100, 50 100 C30 100, 10 80, 10 50 C10 20, 30 0, 50 0 Z" opacity="0.1"/>
      <path d="M50 10 C65 10, 80 25, 80 50 C80 75, 65 90, 50 90 C35 90, 20 75, 20 50 C20 25, 35 10, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5"/>
      <path d="M50 20 C60 20, 70 30, 70 50 C70 70, 60 80, 50 80 C40 80, 30 70, 30 50 C30 30, 40 20, 50 20 Z" fill="currentColor" opacity="0.2"/>
      <path d="M50 100 Q 55 50 50 0 M50 100 Q 45 50 50 0" fill="none" stroke="currentColor" strokeWidth="1"/>
      <path d="M50 80 Q 70 70 90 50 M50 60 Q 65 50 80 30 M50 40 Q 60 30 70 10 M50 80 Q 30 70 10 50 M50 60 Q 35 50 20 30 M50 40 Q 40 30 30 10" fill="none" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );

  return (
    <div className={`min-h-screen text-[var(--theme-accent)] overflow-hidden ${lora.className}`}>
      
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
            className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--theme-background)] rounded-full shadow-2xl border-2 border-[var(--theme-primary)] text-[var(--theme-primary)]"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* COVER SCREEN - WOODLAND GATE */
          <motion.div
            key="cover"
            className={`fixed inset-0 z-50 flex items-center justify-center ${bgWood} text-[var(--theme-text)] overflow-hidden`}
          >
            {/* Left Gate */}
            <motion.div
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 bg-[var(--theme-background)] border-r border-[rgba(var(--theme-primary-rgb),0.3)] flex flex-col items-end justify-center overflow-hidden z-20"
            >
               <LeafOrnament className="absolute left-[-100px] top-1/4 w-[300px] h-[300px] text-[rgba(var(--theme-primary-rgb),0.2)] -rotate-45" />
            </motion.div>
            
            {/* Right Gate */}
            <motion.div
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 bg-[var(--theme-background)] border-l border-[rgba(var(--theme-primary-rgb),0.3)] flex flex-col items-start justify-center overflow-hidden z-20"
            >
               <LeafOrnament className="absolute right-[-100px] bottom-1/4 w-[300px] h-[300px] text-[rgba(var(--theme-primary-rgb),0.2)] rotate-45" />
            </motion.div>

            {/* Central Content */}
            <motion.div
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 1 }}
              className="relative z-30 flex flex-col items-center text-center p-8 max-w-md bg-[var(--theme-background)]"
            >
              <div className="w-12 h-12 rounded-full border border-[var(--theme-primary)] flex items-center justify-center mb-6 text-[var(--theme-primary)]">
                 <LeafOrnament className="w-8 h-8" />
              </div>
              <p className="text-sm tracking-[0.2em] uppercase mb-4 text-[var(--theme-primary)]">The Wedding Of</p>
              <h1 className={`text-6xl md:text-7xl ${playfair.className} mb-6 leading-none`}>
                {invitation.groom_name} <br/> 
                <span className="text-4xl italic text-[var(--theme-primary)] font-light block my-2">&amp;</span>
                {invitation.bride_name}
              </h1>
              
              <p className="text-lg mb-8 text-[rgba(var(--theme-text-rgb),0.8)] border-t border-b border-[rgba(var(--theme-primary-rgb),0.3)] py-2">
                {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
              </p>

              <div className="bg-[var(--theme-background)] p-6 rounded-lg border border-[rgba(var(--theme-primary-rgb),0.2)] w-full mb-8 shadow-inner">
                <p className="text-sm text-[rgba(var(--theme-text-rgb),0.7)] mb-2 italic">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className={`text-xl ${playfair.className} font-bold text-[var(--theme-primary)]`}>{guestName}</p>
              </div>

              <button
                onClick={handleOpenInvitation}
                className="bg-[var(--theme-primary)] text-[var(--theme-background)] px-8 py-3 rounded-sm uppercase tracking-widest text-sm font-bold transition-all hover:bg-[var(--theme-text)] hover:shadow-[0_0_20px_rgba(193,154,107,0.5)]"
              >
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN INVITATION CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`w-full max-w-md mx-auto ${bgParchment} shadow-2xl relative`}
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none z-0"></div>

            {/* HERO SECTION */}
            <section className={`relative h-screen flex flex-col items-center justify-center ${bgWood} text-[var(--theme-text)] overflow-hidden z-10`}>
              {invitation.cover_image_url && (
                <div className="absolute inset-0 opacity-50 mix-blend-luminosity">
                  <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--theme-background-rgb),0.8)] via-transparent to-[var(--theme-background)]"></div>
              
              {/* Corner Ornaments */}
              <LeafOrnament className="absolute top-0 left-0 w-32 h-32 text-[var(--theme-primary)] -translate-x-1/4 -translate-y-1/4 opacity-40 rotate-[135deg]" />
              <LeafOrnament className="absolute top-0 right-0 w-32 h-32 text-[var(--theme-primary)] translate-x-1/4 -translate-y-1/4 opacity-40 rotate-[-135deg]" />
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 text-center p-8 mt-20"
              >
                <div className="w-16 h-16 mx-auto mb-6 opacity-80 border-b border-[var(--theme-primary)] pb-4">
                  <LeafOrnament className="w-full h-full text-[var(--theme-primary)]" />
                </div>
                <p className="tracking-[0.3em] uppercase text-xs mb-4 text-[var(--theme-primary)]">Pernikahan</p>
                <h2 className={`text-5xl ${playfair.className} mb-6 leading-tight`}>
                  {invitation.groom_name} <br/>&<br/> {invitation.bride_name}
                </h2>
                <p className="italic text-[rgba(var(--theme-text-rgb),0.7)] mt-8 max-w-xs mx-auto text-sm leading-relaxed border-l-2 border-r-2 border-[rgba(var(--theme-primary-rgb),0.5)] px-4 py-2">
                  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
                </p>
                <p className="text-xs mt-4 font-bold tracking-widest uppercase text-[var(--theme-primary)]">— Ar-Rum: 21 —</p>
              </motion.div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-20 px-8 relative z-10">
              <LeafOrnament className="absolute right-0 top-10 w-48 h-48 text-[var(--theme-background)] opacity-5 translate-x-1/2" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h3 className={`text-4xl ${playfair.className} ${textBrown} mb-4 flex items-center justify-center gap-4`}>
                  <span className="h-[1px] w-8 bg-[var(--theme-primary)]"></span>
                  Save The Date
                  <span className="h-[1px] w-8 bg-[var(--theme-primary)]"></span>
                </h3>
                <p className="text-[rgba(var(--theme-accent-rgb),0.7)] italic max-w-xs mx-auto">Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.</p>
              </motion.div>

              <div className="space-y-12 relative">
                {/* Vertical Line Connector */}
                <div className="absolute left-8 top-10 bottom-10 w-[1px] bg-[rgba(var(--theme-primary-rgb),0.3)] hidden md:block"></div>

                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-[var(--theme-text)] rounded-sm p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-[rgba(var(--theme-primary-rgb),0.2)] relative"
                >
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-[var(--theme-primary)] text-[var(--theme-text)] flex items-center justify-center font-bold font-serif rotate-[-10deg] shadow-lg">1</div>
                  
                  <h4 className={`text-3xl ${playfair.className} text-[var(--theme-background)] mb-6 text-center`}>Akad Nikah</h4>
                  
                  <div className="space-y-4 text-sm text-[var(--theme-accent)]">
                    <div className="flex flex-col items-center text-center border-b border-[rgba(var(--theme-primary-rgb),0.2)] pb-4">
                      <span className="font-bold text-[var(--theme-primary)] uppercase tracking-widest text-xs mb-1">Tanggal</span>
                      <span className="text-lg font-serif">
                        {invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center border-b border-[rgba(var(--theme-primary-rgb),0.2)] pb-4">
                      <span className="font-bold text-[var(--theme-primary)] uppercase tracking-widest text-xs mb-1">Waktu</span>
                      <span className="text-lg font-serif">{invitation.akad_time || "08:00 WIB"} - Selesai</span>
                    </div>
                    <div className="flex flex-col items-center text-center pt-2">
                      <span className="font-bold text-[var(--theme-primary)] uppercase tracking-widest text-xs mb-1">Tempat</span>
                      <strong className="text-lg mb-1">{invitation.akad_venue || "Lokasi Akad"}</strong>
                      <span className="text-xs text-[rgba(var(--theme-accent-rgb),0.7)]">{invitation.akad_address}</span>
                    </div>
                  </div>

                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="mt-8 w-full flex items-center justify-center gap-2 bg-[var(--theme-background)] text-[var(--theme-text)] py-3 uppercase tracking-widest text-xs font-bold hover:bg-[var(--theme-background)] transition-colors group border border-[var(--theme-background)]">
                      <MapPin className="w-4 h-4 group-hover:text-[var(--theme-primary)] transition-colors" />
                      <span>Buka Peta Lokasi</span>
                    </a>
                  )}
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-[var(--theme-text)] rounded-sm p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-[rgba(var(--theme-primary-rgb),0.2)] relative"
                >
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--theme-primary)] text-[var(--theme-text)] flex items-center justify-center font-bold font-serif rotate-[10deg] shadow-lg">2</div>
                  
                  <h4 className={`text-3xl ${playfair.className} text-[var(--theme-background)] mb-6 text-center`}>Resepsi</h4>
                  
                  <div className="space-y-4 text-sm text-[var(--theme-accent)]">
                    <div className="flex flex-col items-center text-center border-b border-[rgba(var(--theme-primary-rgb),0.2)] pb-4">
                      <span className="font-bold text-[var(--theme-primary)] uppercase tracking-widest text-xs mb-1">Tanggal</span>
                      <span className="text-lg font-serif">
                        {invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}
                      </span>
                    </div>
                    <div className="flex flex-col items-center text-center border-b border-[rgba(var(--theme-primary-rgb),0.2)] pb-4">
                      <span className="font-bold text-[var(--theme-primary)] uppercase tracking-widest text-xs mb-1">Waktu</span>
                      <span className="text-lg font-serif">{invitation.reception_time || "11:00 WIB"} - Selesai</span>
                    </div>
                    <div className="flex flex-col items-center text-center pt-2">
                      <span className="font-bold text-[var(--theme-primary)] uppercase tracking-widest text-xs mb-1">Tempat</span>
                      <strong className="text-lg mb-1">{invitation.reception_venue || "Lokasi Resepsi"}</strong>
                      <span className="text-xs text-[rgba(var(--theme-accent-rgb),0.7)]">{invitation.reception_address}</span>
                    </div>
                  </div>

                  {invitation.reception_maps_url && (
                    <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="mt-8 w-full flex items-center justify-center gap-2 bg-[var(--theme-text)] text-[var(--theme-background)] py-3 uppercase tracking-widest text-xs font-bold hover:bg-[var(--theme-text)] transition-colors group border border-[var(--theme-background)]">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)]" />
                      <span>Buka Peta Lokasi</span>
                    </a>
                  )}
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className={`py-20 px-8 relative z-10 ${bgWood} text-[var(--theme-text)]`}>
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-full">
                  <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-[var(--theme-text)]"></path>
                  </svg>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <Gift className="w-8 h-8 mx-auto text-[var(--theme-primary)] mb-4" />
                  <h3 className={`text-4xl ${playfair.className} mb-4`}>Wedding Gift</h3>
                  <p className="text-[rgba(var(--theme-text-rgb),0.7)] text-sm leading-relaxed max-w-sm mx-auto italic">
                    Kehadiran serta doa restu Bapak/Ibu/Saudara/i merupakan kado yang paling bermakna. Namun jika ingin memberikan tanda kasih, dapat melalui fitur di bawah ini.
                  </p>
                </motion.div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[var(--theme-text)] text-[var(--theme-background)] p-6 relative shadow-lg text-center border-4 border-double border-[rgba(var(--theme-primary-rgb),0.5)]"
                    >
                      <LeafOrnament className="absolute top-2 left-2 w-8 h-8 text-[rgba(var(--theme-primary-rgb),0.2)]" />
                      <LeafOrnament className="absolute bottom-2 right-2 w-8 h-8 text-[rgba(var(--theme-primary-rgb),0.2)] rotate-180" />
                      
                      <div className="relative z-10">
                        <p className="text-[var(--theme-primary)] text-xs uppercase tracking-widest font-bold mb-3">{account.bank_name}</p>
                        <p className={`text-2xl font-bold tracking-widest mb-2 font-serif`}>{account.account_number}</p>
                        <p className="text-[var(--theme-accent)] text-sm uppercase">A.N {account.account_name}</p>
                        
                        <button
                          onClick={() => handleCopy(account.account_number, account.id)}
                          className="mt-6 mx-auto flex items-center justify-center gap-2 bg-[var(--theme-background)] hover:bg-[var(--theme-background)] text-[var(--theme-text)] py-2 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          {copiedBank === account.id ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[var(--theme-primary)]" />
                              <span className="text-[var(--theme-primary)]">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Salin Rekening</span>
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
            <section className="py-20 px-8 relative z-10 bg-[var(--theme-text)]">
              <LeafOrnament className="absolute left-0 top-20 w-64 h-64 text-[var(--theme-background)] opacity-5 -translate-x-1/2" />
              
              <div className="text-center mb-12">
                <h3 className={`text-4xl ${playfair.className} ${textBrown} mb-4`}>RSVP & Ucapan</h3>
                <p className="text-[rgba(var(--theme-accent-rgb),0.7)] text-sm italic">Konfirmasi kehadiran dan tinggalkan pesan manis untuk kedua mempelai.</p>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-[var(--theme-text)] p-8 mb-12 border border-[rgba(var(--theme-primary-rgb),0.3)] shadow-sm relative"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--theme-text)] px-4 text-[var(--theme-primary)] text-xs font-bold tracking-widest uppercase">
                    Kehadiran
                  </div>

                  <div className="mb-5 mt-4">
                    <input
                      type="text"
                      value={wishName}
                      onChange={(e) => setWishName(e.target.value)}
                      className="w-full bg-transparent border-b border-[rgba(var(--theme-primary-rgb),0.5)] py-3 text-[var(--theme-background)] placeholder:text-[rgba(var(--theme-primary-rgb),0.7)] focus:outline-none focus:border-[var(--theme-background)] transition-colors rounded-none"
                      placeholder="Nama Lengkap Anda"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <select
                      value={rsvpStatus}
                      onChange={(e: any) => setRsvpStatus(e.target.value)}
                      className="w-full bg-transparent border-b border-[rgba(var(--theme-primary-rgb),0.5)] py-3 text-[var(--theme-background)] focus:outline-none focus:border-[var(--theme-background)] transition-colors rounded-none appearance-none"
                    >
                      <option value="hadir">Ya, Saya akan hadir</option>
                      <option value="tidak_hadir">Maaf, saya tidak bisa hadir</option>
                    </select>
                  </div>
                  {rsvpStatus === "hadir" && (
                     <div className="mb-8">
                        <select
                          value={rsvpCount}
                          onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                          className="w-full bg-transparent border-b border-[rgba(var(--theme-primary-rgb),0.5)] py-3 text-[var(--theme-background)] focus:outline-none focus:border-[var(--theme-background)] transition-colors rounded-none appearance-none"
                        >
                          <option value={1}>1 Orang</option>
                          <option value={2}>2 Orang</option>
                        </select>
                     </div>
                  )}
                  <button
                    disabled={submittingRsvp}
                    type="submit"
                    className="w-full bg-[var(--theme-background)] hover:bg-[var(--theme-background)] text-[var(--theme-text)] py-3 font-serif italic text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-[var(--theme-background)]"
                  >
                    {submittingRsvp ? "Mengirim..." : "Konfirmasi"}
                  </button>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--theme-text)] p-8 text-center border border-[rgba(var(--theme-primary-rgb),0.3)] mb-12">
                  <CheckCircle2 className="w-12 h-12 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h4 className={`text-2xl ${playfair.className} text-[var(--theme-background)] mb-2`}>Terima Kasih!</h4>
                  <p className="text-sm text-[rgba(var(--theme-accent-rgb),0.8)]">Konfirmasi kehadiran Anda sangat berarti bagi kami.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--theme-text)] px-4 text-[var(--theme-primary)] text-xs font-bold tracking-widest uppercase z-10">
                  Buku Tamu
                </div>
                <textarea
                  rows={4}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-[var(--theme-text)] text-[var(--theme-background)] border border-[rgba(var(--theme-primary-rgb),0.3)] p-6 placeholder:text-[rgba(var(--theme-primary-rgb),0.7)] focus:outline-none focus:border-[var(--theme-background)] resize-none"
                  placeholder="Tuliskan ucapan dan doa restu di sini..."
                  required
                />
                <button
                  type="submit"
                  disabled={sendingWish || !wishText.trim()}
                  className="mt-4 w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary)] text-[var(--theme-text)] py-3 font-serif italic text-lg transition-all disabled:opacity-50"
                >
                  {sendingWish ? "Mengirim..." : "Kirim Ucapan"}
                </button>
              </motion.form>

              {/* Wishes List */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-transparent border-l-2 border-[var(--theme-primary)] pl-4 py-2"
                  >
                    <p className={`font-bold ${playfair.className} text-lg text-[var(--theme-background)]`}>{wish.guest_name}</p>
                    <p className="text-sm text-[var(--theme-accent)] mt-1 italic">"{wish.message}"</p>
                    <p className="text-[10px] text-[rgba(var(--theme-accent-rgb),0.5)] mt-2 uppercase tracking-widest">
                      {format(new Date(wish.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className={`py-12 text-center relative px-8 ${bgWood} text-[var(--theme-text)]`}>
              <LeafOrnament className="w-12 h-12 mx-auto text-[var(--theme-primary)] mb-6 opacity-80" />
              <p className={`text-4xl ${playfair.className} mb-2`}>
                {invitation.groom_name} & {invitation.bride_name}
              </p>
              <p className="text-sm text-[rgba(var(--theme-text-rgb),0.7)] italic">Terima kasih atas doa dan restu Anda.</p>
              <div className="mt-12 pt-8 border-t border-[rgba(var(--theme-primary-rgb),0.3)] text-xs text-[rgba(var(--theme-text-rgb),0.5)] flex justify-center items-center gap-1">
                <span>Created with ❤️ by</span>
                <a href="https://nikahlink.com" className="font-bold text-[var(--theme-primary)] hover:text-[var(--theme-text)] transition-colors uppercase tracking-widest">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
