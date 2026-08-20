"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  MapPin, Gift, Copy, Check, Music, Calendar, Star, Sparkles, Send
} from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// Fonts
import { Cinzel, Outfit } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "800"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function CosmicStarlightTheme({
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
  
  // Parallax Container Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax transforms
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yStarsSlow = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const yStarsFast = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-12-31";
  
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
    setTimeout(() => setCopiedBank(null), 2000);
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

  // Google Calendar Link Generator
  const generateGCalLink = (date: string, time: string, title: string, location: string) => {
    try {
      const d = parseISO(date); // e.g., "2026-12-31"
      // time e.g. "08:00 WIB". We'll simplify and just use the date for an all-day event if parsing fails,
      // but ideally we'd format it perfectly. We'll use a simple YYYYMMDD string for now.
      const formattedDate = format(d, "yyyyMMdd");
      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.append("action", "TEMPLATE");
      url.searchParams.append("text", `Pernikahan ${invitation.groom_name} & ${invitation.bride_name} - ${title}`);
      url.searchParams.append("dates", `${formattedDate}T010000Z/${formattedDate}T100000Z`);
      url.searchParams.append("details", "Acara pernikahan kami.");
      url.searchParams.append("location", location);
      return url.toString();
    } catch {
      return "#";
    }
  };

  // SVGs
  const ConstellationSVG = () => (
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <circle cx="20" cy="30" r="0.5" fill="#FFF" />
      <circle cx="40" cy="15" r="0.8" fill="#FFF" />
      <circle cx="80" cy="40" r="0.6" fill="#FFF" />
      <circle cx="70" cy="80" r="1" fill="#FFF" />
      <circle cx="30" cy="70" r="0.4" fill="#FFF" />
      <line x1="20" y1="30" x2="40" y2="15" stroke="#FFF" strokeWidth="0.1" />
      <line x1="40" y1="15" x2="80" y2="40" stroke="#FFF" strokeWidth="0.1" />
      <line x1="80" y1="40" x2="70" y2="80" stroke="#FFF" strokeWidth="0.1" />
      <line x1="70" y1="80" x2="30" y2="70" stroke="#FFF" strokeWidth="0.1" />
      <line x1="30" y1="70" x2="20" y2="30" stroke="#FFF" strokeWidth="0.1" />
    </svg>
  );

  return (
    <div ref={containerRef} className={`min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] overflow-hidden ${outfit.className}`}>
      
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
            className="fixed bottom-6 right-6 z-50 p-4 bg-[rgba(var(--theme-background-rgb),0.8)] backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(80,80,255,0.4)] border border-[var(--theme-background)] text-[var(--theme-primary)]"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* COVER SCREEN - FALLING STAR EFFECT */
          <motion.div
            key="cover"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-background)] text-white overflow-hidden"
          >
            {/* Animated Background Stars */}
            <div className="absolute inset-0">
               {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: ["-10vh", "110vh"],
                      x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 5,
                      repeat: Infinity,
                      delay: Math.random() * 5,
                      ease: "linear"
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                    style={{ left: `${Math.random() * 100}%`, top: "-10%" }}
                  />
               ))}
            </div>

            <motion.div
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "anticipate" }}
              className="relative z-30 flex flex-col items-center text-center p-8 max-w-md w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full flex flex-col items-center border border-[var(--theme-background)] bg-[rgba(var(--theme-background-rgb),0.5)] backdrop-blur-xl p-10 rounded-3xl shadow-[0_0_50px_rgba(20,20,80,0.8)] relative overflow-hidden"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 border border-[rgba(var(--theme-primary-rgb),0.3)] rounded-3xl animate-pulse"></div>

                <Sparkles className="w-8 h-8 text-[var(--theme-primary)] mb-6" />
                <p className="uppercase tracking-[0.4em] text-[10px] font-bold text-[var(--theme-accent)] mb-4">You're Invited</p>
                <h1 className={`text-5xl md:text-6xl font-bold uppercase leading-none tracking-tight mb-2 ${cinzel.className} bg-clip-text text-transparent bg-gradient-to-b from-white to-[var(--theme-accent)]`}>
                  {invitation.groom_name?.split(" ")[0]}
                </h1>
                <span className={`text-xl italic ${cinzel.className} text-[var(--theme-primary)] block my-2`}>&amp;</span>
                <h1 className={`text-5xl md:text-6xl font-bold uppercase leading-none tracking-tight mb-8 ${cinzel.className} bg-clip-text text-transparent bg-gradient-to-b from-white to-[var(--theme-accent)]`}>
                  {invitation.bride_name?.split(" ")[0]}
                </h1>

                <div className="w-full border-t border-[var(--theme-background)] my-6"></div>
                
                <p className="text-[10px] uppercase tracking-widest text-[var(--theme-accent)] mb-2">Dear</p>
                <p className={`text-xl font-medium text-white mb-8`}>{guestName}</p>

                <button
                  onClick={handleOpenInvitation}
                  className="group relative overflow-hidden bg-[var(--theme-primary)] text-[var(--theme-background)] px-10 py-4 rounded-full uppercase text-xs font-bold tracking-[0.2em] transition-all hover:scale-105 shadow-[0_0_20px_rgba(160,160,255,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Open Invitation <Star className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN CONTENT WITH PARALLAX */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="w-full max-w-md mx-auto relative bg-[var(--theme-background)] min-h-screen"
          >
            {/* Deep Parallax Layers */}
            <motion.div style={{ y: yBg }} className="fixed inset-0 z-0 pointer-events-none opacity-30">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--theme-background)] via-[var(--theme-background)] to-[var(--theme-background)]"></div>
            </motion.div>
            
            <motion.div style={{ y: yStarsSlow }} className="fixed inset-0 z-0 pointer-events-none">
               <ConstellationSVG />
            </motion.div>

            <motion.div style={{ y: yStarsFast }} className="fixed inset-0 z-0 pointer-events-none opacity-50">
               <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {[...Array(50)].map((_, i) => (
                   <circle key={i} cx={Math.random() * 100} cy={Math.random() * 100} r={Math.random() * 0.3} fill="var(--theme-primary)" />
                 ))}
               </svg>
            </motion.div>

            {/* HERO SECTION */}
            <section className="relative h-screen flex flex-col justify-center items-center p-8 z-10">
              <motion.div style={{ opacity: opacityFade }} className="absolute inset-0">
                {invitation.cover_image_url && (
                  <div className="w-full h-full opacity-40 mix-blend-screen relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-background)] via-transparent to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[var(--theme-background)] via-transparent to-transparent z-10"></div>
                    <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="relative z-20 text-center border border-[var(--theme-background)] p-10 backdrop-blur-sm rounded-[3rem]"
              >
                <Star className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-6 opacity-80" />
                <h2 className={`text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4 ${cinzel.className} text-white`}>
                  {invitation.groom_name} <br/> 
                  <span className="text-xl italic text-[var(--theme-primary)] font-light lowercase">&amp;</span> <br/>
                  {invitation.bride_name}
                </h2>
                <div className="w-12 h-[1px] bg-[var(--theme-primary)] mx-auto mb-6"></div>
                <p className="text-sm font-light text-[var(--theme-primary)] tracking-widest uppercase">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-16 text-center"
              >
                <h3 className={`text-3xl font-bold uppercase tracking-[0.2em] mb-4 ${cinzel.className} text-white`}>
                  The Alignment
                </h3>
                <p className="text-[var(--theme-accent)] text-sm">When two stars align, magic happens.</p>
              </motion.div>

              <div className="space-y-10">
                {/* AKAD CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-[rgba(var(--theme-background-rgb),0.8)] backdrop-blur-xl rounded-3xl p-8 border border-[var(--theme-background)] shadow-[0_0_30px_rgba(10,10,40,0.5)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Star className="w-24 h-24 text-[var(--theme-primary)]" />
                  </div>
                  
                  <h4 className={`text-2xl font-bold text-white mb-2 ${cinzel.className}`}>Akad Nikah</h4>
                  <p className="text-[var(--theme-accent)] text-xs uppercase tracking-widest mb-6">Holy Matrimony</p>
                  
                  <div className="space-y-4 text-sm text-[var(--theme-text)] mb-8">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-primary)]">🗓</div>
                      <div>
                        <p className="font-bold">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-xs text-[var(--theme-accent)]">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-primary)]">📍</div>
                      <div>
                        <p className="font-bold leading-tight">{invitation.akad_venue || "Lokasi Akad"}</p>
                        <p className="text-xs text-[var(--theme-accent)] mt-1">{invitation.akad_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-[var(--theme-background)] py-3 rounded-xl uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors">
                        <MapPin className="w-4 h-4" /> Open Map
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-[var(--theme-background)] text-[var(--theme-primary)] py-3 rounded-xl uppercase text-xs font-bold tracking-widest hover:bg-[var(--theme-background)] transition-colors">
                      <Calendar className="w-4 h-4" /> Save to Calendar
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI CARD */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-[rgba(var(--theme-background-rgb),0.8)] backdrop-blur-xl rounded-3xl p-8 border border-[var(--theme-background)] shadow-[0_0_30px_rgba(10,10,40,0.5)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Sparkles className="w-24 h-24 text-[var(--theme-primary)]" />
                  </div>
                  
                  <h4 className={`text-2xl font-bold text-white mb-2 ${cinzel.className}`}>Resepsi</h4>
                  <p className="text-[var(--theme-accent)] text-xs uppercase tracking-widest mb-6">Wedding Reception</p>
                  
                  <div className="space-y-4 text-sm text-[var(--theme-text)] mb-8">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-primary)]">🗓</div>
                      <div>
                        <p className="font-bold">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-xs text-[var(--theme-accent)]">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-full bg-[var(--theme-background)] flex items-center justify-center text-[var(--theme-primary)]">📍</div>
                      <div>
                        <p className="font-bold leading-tight">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                        <p className="text-xs text-[var(--theme-accent)] mt-1">{invitation.reception_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-[var(--theme-background)] py-3 rounded-xl uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors">
                        <MapPin className="w-4 h-4" /> Open Map
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-[var(--theme-background)] text-[var(--theme-primary)] py-3 rounded-xl uppercase text-xs font-bold tracking-widest hover:bg-[var(--theme-background)] transition-colors">
                      <Calendar className="w-4 h-4" /> Save to Calendar
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="mb-12 text-center"
                >
                  <Gift className="w-8 h-8 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h3 className={`text-3xl font-bold uppercase tracking-[0.2em] mb-4 ${cinzel.className} text-white`}>
                    Wedding Gift
                  </h3>
                  <p className="text-[var(--theme-accent)] text-sm">Doa restu Anda adalah kado terindah.</p>
                </motion.div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, rotateX: 90 }}
                      whileInView={{ opacity: 1, rotateX: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, type: "spring", stiffness: 50 }}
                      className="bg-gradient-to-br from-[var(--theme-background)] to-[var(--theme-background)] p-[1px] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(10,10,40,0.8)] perspective-1000"
                    >
                      <div className="bg-[var(--theme-background)] rounded-2xl p-6 h-full w-full relative">
                        {/* Holographic glare effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                        
                        <p className="text-[var(--theme-primary)] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">{account.bank_name}</p>
                        <p className={`text-2xl font-light tracking-widest mb-1 ${cinzel.className} text-white`}>{account.account_number}</p>
                        <p className="text-[var(--theme-accent)] text-xs uppercase tracking-widest mb-8">A.N {account.account_name}</p>
                        
                        <button
                          onClick={() => handleCopy(account.account_number, account.id)}
                          className="w-full flex items-center justify-center gap-2 bg-[var(--theme-background)] text-white py-3 rounded-xl uppercase text-[10px] font-bold tracking-widest hover:bg-[var(--theme-background)] transition-colors border border-[var(--theme-background)]"
                        >
                          {copiedBank === account.id ? (
                            <>
                              <span className="text-[var(--theme-primary)]">Copied Successfully</span>
                              <Check className="w-3 h-3 text-[var(--theme-primary)]" />
                            </>
                          ) : (
                            <>
                              <span>Copy Account</span>
                              <Copy className="w-3 h-3" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* RSVP & MASONRY GUESTBOOK */}
            <section className="py-24 px-6 relative z-10 bg-[var(--theme-background)]">
              <div className="mb-16 text-center">
                <h3 className={`text-3xl font-bold uppercase tracking-[0.2em] mb-4 ${cinzel.className} text-white`}>RSVP & Wishes</h3>
                <div className="w-12 h-1 bg-[var(--theme-background)] mx-auto"></div>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-[var(--theme-background)] p-8 rounded-3xl border border-[var(--theme-background)] shadow-2xl mb-16"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-[var(--theme-primary)] text-center">Confirm Attendance</p>
                  
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="w-full bg-[var(--theme-background)] border border-[var(--theme-background)] py-3 px-4 rounded-xl text-sm placeholder:text-[var(--theme-accent)] focus:outline-none focus:border-[var(--theme-primary)] text-white transition-colors"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-[var(--theme-background)] border border-[var(--theme-background)] py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
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
                            className="w-full bg-[var(--theme-background)] border border-[var(--theme-background)] py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                          >
                            <option value={1}>1 Person</option>
                            <option value={2}>2 Persons</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-gradient-to-r from-[var(--theme-background)] to-[var(--theme-primary)] text-white py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] font-bold hover:shadow-[0_0_20px_rgba(160,160,255,0.4)] transition-all disabled:opacity-70 mt-4"
                    >
                      {submittingRsvp ? "Sending..." : "Submit RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--theme-background)] p-8 rounded-3xl text-center border border-[var(--theme-background)] mb-16">
                  <Check className="w-12 h-12 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h4 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Thank You</h4>
                  <p className="text-sm text-[var(--theme-accent)]">Your response is written in the stars.</p>
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
                <textarea
                  rows={4}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-[rgba(var(--theme-background-rgb),0.5)] backdrop-blur-md text-sm border border-[var(--theme-background)] rounded-2xl p-5 placeholder:text-[var(--theme-accent)] focus:outline-none focus:border-[var(--theme-primary)] text-white resize-none"
                  placeholder="Send a wish to the couple..."
                  required
                />
                <button
                  type="submit"
                  disabled={sendingWish || !wishText.trim()}
                  className="absolute bottom-4 right-4 bg-[var(--theme-primary)] text-[var(--theme-background)] p-3 rounded-xl hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  <Send className="w-4 h-4" />
                </button>
              </motion.form>

              {/* Masonry Wishes List (Simulated with columns) */}
              <div className="columns-2 gap-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="break-inside-avoid bg-[rgba(var(--theme-background-rgb),0.3)] backdrop-blur-sm p-4 rounded-2xl border border-[rgba(var(--theme-background-rgb),0.5)]"
                  >
                    <p className="font-bold text-[11px] uppercase tracking-widest text-white mb-2 flex items-center gap-2">
                      <Star className="w-2 h-2 text-[var(--theme-primary)]" /> {wish.guest_name}
                    </p>
                    <p className={`text-sm text-[var(--theme-primary)] leading-relaxed mb-3`}>
                      {wish.message}
                    </p>
                    <p className="text-[8px] uppercase tracking-widest text-[var(--theme-accent)]">
                      {format(new Date(wish.created_at), "dd MMM yy", { locale: id })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 text-center px-6 bg-transparent text-white relative z-10">
              <Star className="w-8 h-8 text-[var(--theme-background)] mx-auto mb-8" />
              <h2 className={`text-3xl font-bold uppercase tracking-[0.2em] mb-4 ${cinzel.className}`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="text-[9px] uppercase tracking-[0.4em] text-[var(--theme-accent)] flex flex-col items-center gap-3 mt-12">
                <span>Designed beyond the stars by</span>
                <a href="https://nikahlink.com" className="font-bold text-[var(--theme-primary)] hover:text-white transition-colors border border-[var(--theme-background)] px-4 py-2 rounded-full">NikahLink</a>
              </div>
            </footer>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
