"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Volume2, VolumeX, Copy, CheckCircle2 } from "lucide-react";
import Image from "next/image";
// Google Fonts
import { Cinzel, Montserrat } from "next/font/google";
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "600"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function RoyalGoldTheme({
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

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-10-24";

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

  const photos = invitation.photos || [];
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2000&auto=format&fit=crop";
  const galleryPhotos = [
    customData?.gallery_1,
    customData?.gallery_2,
    customData?.gallery_3,
  ].filter(Boolean);

  if (galleryPhotos.length === 0) {
    if (invitation.cover_image_url) galleryPhotos.push(invitation.cover_image_url);
    if (invitation.groom_photo_url) galleryPhotos.push(invitation.groom_photo_url);
    if (invitation.bride_photo_url) galleryPhotos.push(invitation.bride_photo_url);
  }
  const themeColors = invitation.theme_colors || {
    background: "var(--theme-background)", // Deep Royal Navy Blue
    text: "var(--theme-text)",       
    primary: "var(--theme-primary)",    // Gold
    accent: "var(--theme-accent)"      // Light Gold
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3"; 

  // Formatter helpers
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  };
  
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit"
    }) + " WIB";
  };

  // SVGs
  const OrnateCorner = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5 H 40 M 5 5 V 40" stroke={themeColors.primary} strokeWidth="2" />
      <path d="M10 10 H 30 M 10 10 V 30" stroke={themeColors.primary} strokeWidth="1" />
      <circle cx="20" cy="20" r="15" stroke={themeColors.primary} strokeWidth="1" strokeDasharray="2 2" />
      <path d="M 5 30 Q 30 30 30 5" stroke={themeColors.primary} strokeWidth="1.5" />
      <path d="M 15 40 Q 40 40 40 15" stroke={themeColors.accent} strokeWidth="0.5" />
    </svg>
  );

  const OrnateDivider = () => (
    <svg viewBox="0 0 300 30" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M 0 15 H 120" stroke={themeColors.primary} strokeWidth="1" />
      <path d="M 180 15 H 300" stroke={themeColors.primary} strokeWidth="1" />
      <rect x="145" y="10" width="10" height="10" transform="rotate(45 150 15)" stroke={themeColors.primary} strokeWidth="1.5" />
      <circle cx="130" cy="15" r="3" fill={themeColors.primary} />
      <circle cx="170" cy="15" r="3" fill={themeColors.primary} />
    </svg>
  );

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } as any }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } as any }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-x-hidden ${montserrat.className}`}
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* Decorative Border Layer */}
      <div className="fixed inset-4 border border-opacity-30 z-0 pointer-events-none" style={{ borderColor: themeColors.primary }}></div>
      <div className="fixed inset-6 border border-opacity-10 z-0 pointer-events-none" style={{ borderColor: themeColors.primary }}></div>

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden"
            style={{ backgroundColor: themeColors.background }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative w-full max-w-sm flex flex-col items-center text-center p-10 bg-black/40 backdrop-blur-md border"
              style={{ borderColor: themeColors.primary }}
            >
              {/* Corners */}
              <OrnateCorner className="absolute top-2 left-2 w-16 h-16" />
              <OrnateCorner className="absolute top-2 right-2 w-16 h-16 transform scale-x-[-1]" />
              <OrnateCorner className="absolute bottom-2 left-2 w-16 h-16 transform scale-y-[-1]" />
              <OrnateCorner className="absolute bottom-2 right-2 w-16 h-16 transform scale-[-1]" />
              
              <h3 className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: themeColors.primary }}>The Royal Wedding</h3>
              
              <div className="w-40 h-56 overflow-hidden mb-8 relative border-2 p-1" style={{ borderColor: themeColors.primary }}>
                <div className="w-full h-full relative">
                  <Image src={heroPhoto} alt="Cover" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" priority />
                </div>
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold text-center mb-6 leading-tight ${cinzel.className}`} style={{ color: themeColors.primary }}>
                {invitation.bride_nickname}
                <span className="block text-xl my-2 italic font-normal text-white">&</span>
                {invitation.groom_nickname}
              </h1>
              
              <div className="w-48 h-8 mb-4">
                 <OrnateDivider />
              </div>
              
              <div className="py-2 w-full">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Exclusive Invitation For</p>
                <p className="text-lg font-semibold text-white">{guestName}</p>
              </div>

              <button 
                onClick={handleOpenInvitation}
                className="mt-8 px-10 py-3 text-xs uppercase tracking-[0.2em] transition-all shadow-md text-black font-bold hover:bg-white"
                style={{ backgroundColor: themeColors.primary }}
              >
                Enter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {isOpen && (
        <div className="relative z-10 pt-16 pb-24">
          
          {/* Floating Audio Button */}
          {musicUrl && (
            <button 
              onClick={toggleAudio}
              className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center z-50 transition-transform hover:scale-105 rounded-full bg-black/50 backdrop-blur-md border"
              style={{ color: themeColors.primary, borderColor: themeColors.primary }}
            >
              {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[90svh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="relative z-10 w-full max-w-2xl">
              <h1 className={`text-6xl md:text-8xl mb-8 leading-tight ${cinzel.className}`} style={{ color: themeColors.primary }}>
                {invitation.bride_nickname} & {invitation.groom_nickname}
              </h1>
              <p className="text-sm tracking-[0.4em] uppercase mb-8 text-gray-300">
                {new Date(weddingDateStr).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <div className="w-64 h-8 mx-auto">
                 <OrnateDivider />
              </div>
            </motion.div>
          </section>

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-4xl mx-auto text-center">
                <h2 className={`text-4xl md:text-5xl font-bold mb-16 ${cinzel.className}`} style={{ color: themeColors.primary }}>The Bride & Groom</h2>
                
                <div className="flex flex-col md:flex-row gap-16 justify-center items-center">
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-56 h-72 relative mb-8 p-2 border" style={{ borderColor: themeColors.primary }}>
                       <OrnateCorner className="absolute top-0 left-0 w-8 h-8" />
                       <OrnateCorner className="absolute top-0 right-0 w-8 h-8 transform scale-x-[-1]" />
                       <OrnateCorner className="absolute bottom-0 left-0 w-8 h-8 transform scale-y-[-1]" />
                       <OrnateCorner className="absolute bottom-0 right-0 w-8 h-8 transform scale-[-1]" />
                       <div className="relative w-full h-full overflow-hidden">
                          <Image src={heroPhoto} alt="Bride" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                       </div>
                    </div>
                    <h3 className={`text-3xl font-bold mb-2 ${cinzel.className}`} style={{ color: themeColors.accent }}>{invitation.bride_name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Daughter of</p>
                    <p className="font-semibold mt-1 text-sm">{invitation.bride_parents}</p>
                  </div>

                  <div className="w-px h-32 bg-gradient-to-b from-transparent via-yellow-600 to-transparent hidden md:block"></div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-56 h-72 relative mb-8 p-2 border" style={{ borderColor: themeColors.primary }}>
                       <OrnateCorner className="absolute top-0 left-0 w-8 h-8" />
                       <OrnateCorner className="absolute top-0 right-0 w-8 h-8 transform scale-x-[-1]" />
                       <OrnateCorner className="absolute bottom-0 left-0 w-8 h-8 transform scale-y-[-1]" />
                       <OrnateCorner className="absolute bottom-0 right-0 w-8 h-8 transform scale-[-1]" />
                       <div className="relative w-full h-full overflow-hidden">
                          <Image src={heroPhoto} alt="Groom" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                       </div>
                    </div>
                    <h3 className={`text-3xl font-bold mb-2 ${cinzel.className}`} style={{ color: themeColors.accent }}>{invitation.groom_name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">Son of</p>
                    <p className="font-semibold mt-1 text-sm">{invitation.groom_parents}</p>
                  </div>
                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative bg-black/30 border-y my-16" style={{ borderColor: `${themeColors.primary}40` }}>
            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${cinzel.className}`} style={{ color: themeColors.primary }}>The Grand Events</h2>
                <div className="w-48 h-8 mx-auto">
                   <OrnateDivider />
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-[var(--theme-background)] p-10 border relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
                  <OrnateCorner className="absolute top-0 left-0 w-12 h-12 opacity-50" />
                  <OrnateCorner className="absolute bottom-0 right-0 w-12 h-12 transform scale-[-1] opacity-50" />
                  
                  <h3 className={`text-2xl font-bold mb-6 tracking-widest ${cinzel.className}`} style={{ color: themeColors.accent }}>Holy Matrimony</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="text-lg font-semibold">{formatDate(invitation.akad_date)}</div>
                    <div className="text-sm text-gray-400">{formatTime(invitation.akad_date)}</div>
                    <div className="pt-6 mt-6 border-t w-16 mx-auto" style={{ borderColor: themeColors.primary }}></div>
                    <div className="text-md font-bold mb-2 uppercase tracking-wide">{invitation.akad_location}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{invitation.akad_address}</div>
                  </div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10" style={{ borderColor: themeColors.primary, color: themeColors.primary }}>
                      <MapPin size={14} /> Open Maps
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-[var(--theme-background)] p-10 border relative overflow-hidden" style={{ borderColor: themeColors.primary }}>
                  <OrnateCorner className="absolute top-0 left-0 w-12 h-12 opacity-50" />
                  <OrnateCorner className="absolute bottom-0 right-0 w-12 h-12 transform scale-[-1] opacity-50" />
                  
                  <h3 className={`text-2xl font-bold mb-6 tracking-widest ${cinzel.className}`} style={{ color: themeColors.accent }}>Wedding Reception</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="text-lg font-semibold">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="text-sm text-gray-400">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="pt-6 mt-6 border-t w-16 mx-auto" style={{ borderColor: themeColors.primary }}></div>
                    <div className="text-md font-bold mb-2 uppercase tracking-wide">{invitation.reception_location || invitation.akad_location}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{invitation.reception_address || invitation.akad_address}</div>
                  </div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10" style={{ borderColor: themeColors.primary, color: themeColors.primary }}>
                      <MapPin size={14} /> Open Maps
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-4 max-w-5xl mx-auto text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${cinzel.className}`} style={{ color: themeColors.primary }}>The Royal Gallery</h2>
                <div className="w-48 h-8 mx-auto">
                   <OrnateDivider />
                </div>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 border" style={{ borderColor: `${themeColors.primary}40` }}>
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                    className="relative w-full aspect-square border p-1"
                    style={{ borderColor: themeColors.primary }}
                  >
                    <div className="w-full h-full relative overflow-hidden">
                      <Image 
                        src={photo} 
                        alt={`Gallery ${idx+1}`} 
                        fill 
                        className="object-cover grayscale hover:grayscale-0 hover:scale-110 transition-all duration-700"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6 mt-16 bg-[var(--theme-background)] border-t border-b" style={{ borderColor: themeColors.primary }}>
            <div className="max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${cinzel.className}`} style={{ color: themeColors.primary }}>RSVP & Guestbook</h2>
                <div className="w-48 h-8 mx-auto mb-6">
                   <OrnateDivider />
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                
                {/* RSVP Form */}
                <div className="bg-transparent border p-8" style={{ borderColor: themeColors.primary }}>
                  <h3 className={`text-xl font-bold mb-8 uppercase tracking-[0.2em] text-center ${cinzel.className}`} style={{ color: themeColors.accent }}>Reservation</h3>
                  
                  {rsvpSuccess ? (
                    <div className="p-6 text-center border bg-green-900/20 text-green-400" style={{ borderColor: "rgb(74 222 128 / 0.3)" }}>
                      <CheckCircle2 size={32} className="mx-auto mb-4 text-green-400" />
                      <p className="font-semibold">Your presence is highly appreciated.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Guest Name</label>
                        <input 
                          type="text" 
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          required
                          className="w-full p-4 border bg-transparent outline-none focus:border-white text-white"
                          style={{ borderColor: `${themeColors.primary}60` }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Attendance</label>
                        <select 
                          value={rsvpStatus}
                          onChange={(e) => setRsvpStatus(e.target.value as any)}
                          className="w-full p-4 border bg-[var(--theme-background)] outline-none focus:border-white text-white appearance-none"
                          style={{ borderColor: `${themeColors.primary}60` }}
                        >
                          <option value="hadir">Joyfully Accept</option>
                          <option value="tidak_hadir">Regretfully Decline</option>
                        </select>
                      </div>

                      {rsvpStatus === "hadir" && (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Number of Guests</label>
                          <select 
                            value={rsvpCount}
                            onChange={(e) => setRsvpCount(Number(e.target.value))}
                            className="w-full p-4 border bg-[var(--theme-background)] outline-none focus:border-white text-white appearance-none"
                            style={{ borderColor: `${themeColors.primary}60` }}
                          >
                            <option value="1">1 Seat</option>
                            <option value="2">2 Seats</option>
                          </select>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={submittingRsvp}
                        className="w-full py-4 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-white transition-colors mt-4"
                        style={{ backgroundColor: themeColors.primary }}
                      >
                        {submittingRsvp ? "Sending..." : "Confirm RSVP"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Wishes / Guestbook */}
                <div>
                  <h3 className={`text-xl font-bold mb-8 uppercase tracking-[0.2em] text-center ${cinzel.className}`} style={{ color: themeColors.accent }}>Well Wishes</h3>
                  
                  <form onSubmit={handleSendWish} className="mb-10 space-y-4">
                    <textarea 
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      required
                      rows={3}
                      className="w-full p-4 border bg-transparent outline-none focus:border-white text-white resize-none"
                      style={{ borderColor: `${themeColors.primary}60` }}
                      placeholder="Leave your blessings here..."
                    />
                    <button 
                      type="submit" 
                      disabled={sendingWish}
                      className="w-full py-4 bg-transparent border text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                      style={{ borderColor: themeColors.primary }}
                    >
                      {sendingWish ? "Sending..." : "Send Wishes"}
                    </button>
                  </form>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {wishes.map((wish: any) => (
                      <div key={wish.id} className="p-6 bg-black/40 border" style={{ borderColor: `${themeColors.primary}30` }}>
                        <div className="flex flex-col mb-3">
                          <span className="font-bold text-white uppercase tracking-widest text-sm">{wish.guest_name}</span>
                          <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{formatDate(wish.created_at)}</span>
                        </div>
                        <div className="text-gray-300 text-sm leading-relaxed font-light">"{wish.message}"</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-24 text-center relative overflow-hidden">
             <div className="relative z-10">
                <OrnateDivider />
                <h2 className={`text-4xl mt-8 mb-4 ${cinzel.className}`} style={{ color: themeColors.primary }}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h2>
                <p className="text-[10px] text-gray-400 tracking-[0.4em] uppercase">With Gratitude</p>
                {!isFreePlan && <p className="mt-12 text-[9px] text-gray-600 tracking-widest uppercase">Powered by NikahLink</p>}
             </div>
          </footer>

        </div>
      )}
    </div>
  );
}
