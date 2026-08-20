"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Gift, Copy, Check, Music, ChevronRight
} from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Fonts
import { Montserrat, Cormorant_Garamond } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["200", "400", "700", "900"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function ModernMonochromeTheme({
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

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-11-20";
  
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

  return (
    <div className={`min-h-screen text-[var(--theme-background)] bg-white overflow-hidden ${montserrat.className}`}>
      
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
            className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-black text-white shadow-xl hover:bg-neutral-800 transition-colors"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* COVER SCREEN - CINEMATIC FADE */
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-background)] text-white`}
          >
            {/* Split Screen Animation Divs */}
            <motion.div
               exit={{ y: "-100%" }}
               transition={{ duration: 1.5, ease: [0.77, 0, 0.17, 1] }}
               className="absolute top-0 left-0 w-full h-1/2 bg-[var(--theme-background)] border-b border-white/10 z-20"
            />
            <motion.div
               exit={{ y: "100%" }}
               transition={{ duration: 1.5, ease: [0.77, 0, 0.17, 1] }}
               className="absolute bottom-0 left-0 w-full h-1/2 bg-[var(--theme-background)] border-t border-white/10 z-20"
            />
            
            <div className="relative z-30 flex flex-col items-center text-center w-full max-w-md px-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="w-full flex flex-col items-center"
              >
                <div className="flex items-center gap-4 w-full mb-8">
                  <div className="h-[1px] bg-white/30 flex-1"></div>
                  <span className="uppercase tracking-[0.4em] text-[10px] font-bold">The Wedding</span>
                  <div className="h-[1px] bg-white/30 flex-1"></div>
                </div>

                <h1 className={`text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter mb-2`}>
                  {invitation.groom_name?.split(" ")[0] || "Groom"}
                </h1>
                <span className={`text-3xl italic ${cormorant.className} text-white/50 block my-2`}>and</span>
                <h1 className={`text-6xl md:text-7xl font-black uppercase leading-none tracking-tighter mb-8`}>
                  {invitation.bride_name?.split(" ")[0] || "Bride"}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="w-full border border-white/20 p-6 mb-12 flex flex-col items-center"
              >
                <p className="text-[10px] uppercase tracking-widest text-white/50 mb-3">Dear</p>
                <p className={`text-xl ${cormorant.className} italic text-white`}>{guestName}</p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
                onClick={handleOpenInvitation}
                className="group flex items-center gap-4 bg-white text-black px-8 py-4 uppercase text-xs font-bold tracking-[0.2em] hover:bg-neutral-200 transition-colors w-full justify-center"
              >
                Open Invitation
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* MAIN INVITATION CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className={`w-full max-w-md mx-auto bg-[var(--theme-primary)] relative shadow-2xl`}
          >
            
            {/* HERO SECTION */}
            <section className="relative h-[90vh] flex flex-col justify-end p-8 bg-[var(--theme-background)] text-white">
              {invitation.cover_image_url && (
                <div className="absolute inset-0 grayscale opacity-60 mix-blend-screen">
                  <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-background)] via-[rgba(var(--theme-background-rgb),0.5)] to-transparent"></div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <p className="uppercase tracking-[0.3em] text-[10px] mb-2 font-bold text-white/50">Celebration of Love</p>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                  {invitation.groom_name?.split(" ")[0]} <br/> 
                  <span className="text-white/30">&</span> <br/>
                  {invitation.bride_name?.split(" ")[0]}
                </h2>
                <div className="w-full h-[1px] bg-white/20 mb-6"></div>
                <p className={`${cormorant.className} italic text-lg leading-relaxed text-white/80`}>
                  "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them."
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-4 text-white/50">Ar-Rum: 21</p>
              </motion.div>
            </section>

            {/* EVENT DETAILS (BENTO GRID) */}
            <section className="py-20 px-6 bg-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">The<br/>Details</h3>
                <div className="w-12 h-1 bg-black"></div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {/* AKAD CARD */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="col-span-2 bg-[var(--theme-background)] text-white p-6 relative overflow-hidden"
                >
                   <h4 className="uppercase text-[10px] tracking-[0.2em] font-bold text-white/50 mb-4">01. Akad Nikah</h4>
                   <div className="mb-6">
                      <p className={`text-2xl ${cormorant.className} italic mb-1`}>
                        {invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE", { locale: id })}
                      </p>
                      <p className="text-3xl font-black uppercase tracking-tighter">
                        {invitation.akad_date && format(parseISO(invitation.akad_date), "dd MMM yy", { locale: id })}
                      </p>
                   </div>
                   <div className="flex gap-4 border-t border-white/20 pt-4">
                      <div className="flex-1">
                         <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Time</p>
                         <p className="font-bold text-sm">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Venue</p>
                         <p className="font-bold text-sm leading-tight">{invitation.akad_venue || "Lokasi Akad"}</p>
                      </div>
                   </div>
                   {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-between w-full bg-white text-black px-4 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-neutral-200 transition-colors">
                      Open Map <MapPin className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>

                {/* RESEPSI CARD */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="col-span-2 bg-[var(--theme-primary)] text-[var(--theme-background)] p-6 relative overflow-hidden"
                >
                   <h4 className="uppercase text-[10px] tracking-[0.2em] font-bold text-black/50 mb-4">02. Resepsi</h4>
                   <div className="mb-6">
                      <p className={`text-2xl ${cormorant.className} italic mb-1`}>
                        {invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE", { locale: id })}
                      </p>
                      <p className="text-3xl font-black uppercase tracking-tighter">
                        {invitation.reception_date && format(parseISO(invitation.reception_date), "dd MMM yy", { locale: id })}
                      </p>
                   </div>
                   <div className="flex gap-4 border-t border-black/10 pt-4">
                      <div className="flex-1">
                         <p className="text-[10px] uppercase tracking-widest text-black/50 mb-1">Time</p>
                         <p className="font-bold text-sm">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] uppercase tracking-widest text-black/50 mb-1">Venue</p>
                         <p className="font-bold text-sm leading-tight">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                      </div>
                   </div>
                   {invitation.reception_maps_url && (
                    <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-between w-full bg-[var(--theme-background)] text-white px-4 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-neutral-800 transition-colors">
                      Open Map <MapPin className="w-3 h-3" />
                    </a>
                  )}
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className={`py-20 px-6 bg-[var(--theme-background)] text-white relative`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-right">Wedding<br/>Gift</h3>
                  <div className="w-12 h-1 bg-white ml-auto"></div>
                </motion.div>

                <div className="space-y-4">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-white/20 p-6 relative flex flex-col justify-between"
                    >
                      <Gift className="absolute top-6 right-6 w-16 h-16 text-white/5" />
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">{account.bank_name}</p>
                        <p className={`text-2xl font-light tracking-widest mb-1 ${cormorant.className} italic`}>{account.account_number}</p>
                        <p className="text-white text-xs uppercase font-bold tracking-widest">{account.account_name}</p>
                      </div>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold w-max"
                      >
                        {copiedBank === account.id ? (
                          <>
                            <span className="text-white">Copied</span>
                            <Check className="w-3 h-3 text-white" />
                          </>
                        ) : (
                          <>
                            <span className="text-white/70 hover:text-white transition-colors">Copy Number</span>
                            <Copy className="w-3 h-3 text-white/70" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* RSVP & WISHES */}
            <section className="py-20 px-6 bg-[var(--theme-primary)]">
              <div className="mb-12">
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">RSVP &<br/>Wishes</h3>
                <div className="w-12 h-1 bg-black mb-6"></div>
                <p className={`text-lg ${cormorant.className} italic text-black/60`}>We would love to hear from you.</p>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-white p-6 border border-black/10 mb-12"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-black/50 border-b border-black/10 pb-4">Attendance</p>
                  
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="w-full bg-transparent border-b border-black/20 py-3 text-sm placeholder:text-black/30 focus:outline-none focus:border-black transition-colors rounded-none"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-none appearance-none"
                      >
                        <option value="hadir">Will Attend</option>
                        <option value="tidak_hadir">Cannot Attend</option>
                      </select>
                    </div>
                    {rsvpStatus === "hadir" && (
                       <div>
                          <select
                            value={rsvpCount}
                            onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                            className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors rounded-none appearance-none"
                          >
                            <option value={1}>1 Person</option>
                            <option value={2}>2 Persons</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-black text-white py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                      {submittingRsvp ? "Sending..." : "Confirm RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 text-center border border-black/10 mb-12">
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-2">Thank You</h4>
                  <p className={`text-lg ${cormorant.className} italic text-black/60`}>Your attendance has been confirmed.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 bg-white p-6 border border-black/10"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-black/50 border-b border-black/10 pb-4">Guestbook</p>
                <textarea
                  rows={4}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-[var(--theme-primary)] text-sm border border-black/10 p-4 placeholder:text-black/30 focus:outline-none focus:border-black resize-none"
                  placeholder="Write a message..."
                  required
                />
                <button
                  type="submit"
                  disabled={sendingWish || !wishText.trim()}
                  className="mt-4 w-full bg-white text-black border border-black py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                >
                  {sendingWish ? "Sending..." : "Send Message"}
                </button>
              </motion.form>

              {/* Wishes List */}
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-black/10 pb-6"
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <p className="font-bold text-sm uppercase tracking-widest">{wish.guest_name}</p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                        {format(new Date(wish.created_at), "dd MMM yy", { locale: id })}
                      </p>
                    </div>
                    <p className={`text-base ${cormorant.className} italic text-black/80 leading-relaxed`}>
                      "{wish.message}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 text-center px-6 bg-[var(--theme-background)] text-white">
              <p className="uppercase tracking-[0.4em] text-[10px] font-bold text-white/50 mb-8">End of Invitation</p>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="w-8 h-[1px] bg-white/30 mx-auto my-8"></div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/40 flex flex-col items-center gap-2">
                <span>Made by</span>
                <a href="https://nikahlink.com" className="font-bold text-white hover:text-white/70 transition-colors">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
