"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Calendar, MapPin, Music, Volume2, VolumeX,
  Gift, Copy, Check, MessageSquare, Send, CheckCircle2,
  Sparkles
} from "lucide-react";
import Image from "next/image";
interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function MidnightSparkleTheme({
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

  // Safe fallbacks for data
  const photos = invitation.photos || [];
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop";
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
    background: "var(--theme-background)", // Very dark navy blue
    text: "var(--theme-text)",       
    primary: "var(--theme-primary)",    // Gold
    accent: "var(--theme-accent)"      // Slightly lighter dark blue
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2022/11/22/audio_d1718ab41b.mp3"; 

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const glowPulse = {
    hidden: { opacity: 0.5, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const } }
  };

  return (
    <div 
      className="min-h-screen font-playfair relative selection:bg-yellow-500/30 overflow-x-hidden"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Sparkle Background effect (CSS dots) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40" 
        style={{ 
          backgroundImage: `radial-gradient(${themeColors.primary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Large glowing orbs */}
      <motion.div 
        initial="hidden" animate="visible" variants={glowPulse} 
        className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none blur-[100px] z-0 opacity-20"
        style={{ backgroundColor: themeColors.primary }}
      ></motion.div>
      <motion.div 
        initial="hidden" animate="visible" variants={glowPulse} transition={{ delay: 1, duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none blur-[100px] z-0 opacity-20"
        style={{ backgroundColor: themeColors.primary }}
      ></motion.div>

      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden"
            style={{ backgroundColor: themeColors.background }}
          >
             <div 
              className="absolute inset-0 pointer-events-none z-0 opacity-50" 
              style={{ 
                backgroundImage: `radial-gradient(${themeColors.primary} 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }}
            ></div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center p-8 bg-black/40 backdrop-blur-md rounded-2xl border"
              style={{ borderColor: `${themeColors.primary}30` }}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden mb-8 relative shadow-[0_0_30px_rgba(255,215,0,0.3)] ring-2" style={{ "--tw-ring-color": themeColors.primary } as React.CSSProperties}>
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: themeColors.primary }} />
                  <p className="tracking-[0.2em] uppercase text-xs font-semibold" style={{ color: themeColors.primary }}>The Wedding</p>
                  <Sparkles size={14} style={{ color: themeColors.primary }} />
                </div>

                <h1 className="font-great-vibes text-5xl mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" style={{ color: themeColors.primary }}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h1>
                
                <div className="py-6 mt-6 border-t" style={{ borderColor: `${themeColors.primary}30` }}>
                  <p className="text-sm mb-1 opacity-70">Dear,</p>
                  <p className="text-xl font-bold">{guestName}</p>
                </div>

                <button 
                  onClick={handleOpenInvitation}
                  className="px-8 py-3 rounded-full text-black text-sm uppercase transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center gap-2 mx-auto tracking-widest font-bold"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Open Invitation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {isOpen && (
        <div className="relative z-10">
          
          {/* Floating Audio Button */}
          {musicUrl && (
            <button 
              onClick={toggleAudio}
              className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-[0_0_15px_rgba(255,215,0,0.3)] text-black transition-transform hover:scale-110"
              style={{ backgroundColor: themeColors.primary }}
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center p-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
              
              <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-16 h-px" style={{ backgroundColor: themeColors.primary }}></div>
                  <Sparkles size={20} style={{ color: themeColors.primary }} />
                  <div className="w-16 h-px" style={{ backgroundColor: themeColors.primary }}></div>
              </div>

              <h1 className="font-great-vibes text-7xl md:text-9xl mb-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] leading-tight" style={{ color: themeColors.primary }}>
                {invitation.bride_nickname} <br className="md:hidden"/>&<br className="md:hidden"/> {invitation.groom_nickname}
              </h1>
              
              <p className="text-xl md:text-2xl tracking-[0.3em] uppercase mb-12">
                {new Date(weddingDateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, '.')}
              </p>

              <div className="relative w-full max-w-lg h-[400px] rounded-t-full overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.2)] border-2 border-b-0" style={{ borderColor: themeColors.primary }}>
                <Image src={heroPhoto} alt="Hero" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-24 px-6 text-center relative">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto">
                <Sparkles size={30} className="mx-auto mb-8 opacity-50" style={{ color: themeColors.primary }} />
                <p className="text-xl md:text-3xl font-playfair italic leading-relaxed font-light">
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-5xl mx-auto text-center bg-black/20 backdrop-blur-lg p-12 rounded-3xl border" style={{ borderColor: `${themeColors.primary}20` }}>
                <p className="tracking-[0.4em] uppercase text-xs font-semibold mb-16" style={{ color: themeColors.primary }}>The Bride & Groom</p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                  
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 className="font-great-vibes text-6xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" style={{ color: themeColors.primary }}>{invitation.bride_name}</h3>
                    <p className="text-xs tracking-widest uppercase mb-2 opacity-60">The Daughter Of</p>
                    <p className="font-playfair text-lg opacity-90">{invitation.bride_parents}</p>
                  </div>

                  {/* AND */}
                  <div className="w-px h-24 md:w-24 md:h-px opacity-30" style={{ backgroundColor: themeColors.primary }}></div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 className="font-great-vibes text-6xl mb-4 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" style={{ color: themeColors.primary }}>{invitation.groom_name}</h3>
                    <p className="text-xs tracking-widest uppercase mb-2 opacity-60">The Son Of</p>
                    <p className="font-playfair text-lg opacity-90">{invitation.groom_parents}</p>
                  </div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <h2 className="font-great-vibes text-6xl md:text-7xl mb-6" style={{ color: themeColors.primary }}>Save The Date</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border text-center flex flex-col items-center transition-transform hover:-translate-y-2" style={{ borderColor: `${themeColors.primary}40` }}>
                  <h3 className="tracking-widest uppercase text-sm mb-6 font-bold" style={{ color: themeColors.primary }}>Holy Matrimony</h3>
                  <div className="text-3xl font-playfair mb-2">{formatDate(invitation.akad_date)}</div>
                  <div className="mb-6 opacity-70">{formatTime(invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.akad_location}</div>
                  <div className="opacity-70 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.akad_address}</div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-8 py-3 rounded-full tracking-widest text-xs uppercase flex items-center gap-2 font-bold text-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.2)]" style={{ backgroundColor: themeColors.primary }}>
                      Open Map
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border text-center flex flex-col items-center transition-transform hover:-translate-y-2" style={{ borderColor: `${themeColors.primary}40` }}>
                  <h3 className="tracking-widest uppercase text-sm mb-6 font-bold" style={{ color: themeColors.primary }}>Wedding Reception</h3>
                  <div className="text-3xl font-playfair mb-2">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="mb-6 opacity-70">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.reception_location || invitation.akad_location}</div>
                  <div className="opacity-70 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.reception_address || invitation.akad_address}</div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-8 py-3 rounded-full tracking-widest text-xs uppercase flex items-center gap-2 font-bold text-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.2)]" style={{ backgroundColor: themeColors.primary }}>
                      Open Map
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Countdown */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mt-20 flex justify-center gap-4 md:gap-12 p-8 border-y" style={{ borderColor: `${themeColors.primary}30` }}>
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center w-16 md:w-24">
                    <span className="text-4xl md:text-6xl font-playfair mb-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]" style={{ color: themeColors.primary }}>{item.value}</span>
                    <span className="text-[10px] md:text-xs tracking-widest uppercase opacity-60">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-6 max-w-6xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <h2 className="font-great-vibes text-5xl md:text-6xl mb-6" style={{ color: themeColors.primary }}>Captured Moments</h2>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                    className={`relative w-full overflow-hidden rounded-xl border border-white/10 group ${idx === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/5]"}`}
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* DIGITAL WALLET / GIFT */}
          {invitation.show_gifts && giftAccounts.length > 0 && (
            <section className="py-24 px-6 bg-black/30 backdrop-blur-sm">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto text-center">
                <Gift className="w-10 h-10 mx-auto mb-6 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" style={{ color: themeColors.primary }} />
                <h2 className="font-great-vibes text-5xl mb-6" style={{ color: themeColors.primary }}>Wedding Gift</h2>
                <p className="opacity-70 mb-12 font-light">Your presence is the greatest gift, but if you wish to bless us with a gift, you may do so through:</p>
                
                <div className="grid gap-6">
                  {giftAccounts.map((account: any) => (
                    <div key={account.id} className="bg-white/5 p-8 rounded-2xl border flex flex-col items-center" style={{ borderColor: `${themeColors.primary}40` }}>
                      <div className="font-bold text-sm tracking-widest uppercase mb-4" style={{ color: themeColors.primary }}>{account.bank_name}</div>
                      <div className="text-2xl font-mono tracking-wider mb-2">{account.account_number}</div>
                      <div className="opacity-70 mb-6">{account.account_name}</div>
                      
                      <button 
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="px-6 py-2 rounded-full transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
                        style={{ 
                          backgroundColor: copiedBank === account.id ? themeColors.primary : "transparent", 
                          color: copiedBank === account.id ? "black" : themeColors.primary,
                          border: `1px solid ${themeColors.primary}`
                        }}
                      >
                        {copiedBank === account.id ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Number</>}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24">
              
              {/* RSVP Form */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-great-vibes text-6xl mb-2" style={{ color: themeColors.primary }}>RSVP</h2>
                <p className="opacity-70 mb-8 font-light">Please confirm your attendance</p>
                
                {rsvpSuccess ? (
                  <div className="bg-white/5 p-8 rounded-3xl text-center flex flex-col items-center border" style={{ borderColor: `${themeColors.primary}40` }}>
                    <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: themeColors.primary }} />
                    <h3 className="text-2xl mb-2 font-playfair font-bold">Thank You!</h3>
                    <p className="opacity-70">Your confirmation has been received.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-6">
                    <div>
                      <input 
                        type="text" 
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        required
                        className="w-full p-4 bg-transparent border-b outline-none placeholder:opacity-50 transition-colors focus:border-yellow-500"
                        style={{ borderColor: `${themeColors.primary}50` }}
                        placeholder="Your Name"
                      />
                    </div>
                    
                    <div>
                      <select 
                        value={rsvpStatus}
                        onChange={(e) => setRsvpStatus(e.target.value as any)}
                        className="w-full p-4 bg-transparent border-b outline-none transition-colors focus:border-yellow-500"
                        style={{ borderColor: `${themeColors.primary}50` }}
                      >
                        <option value="hadir" className="bg-[var(--theme-background)]">Joyfully Accept</option>
                        <option value="tidak_hadir" className="bg-[var(--theme-background)]">Regretfully Decline</option>
                      </select>
                    </div>

                    {rsvpStatus === "hadir" && (
                      <div>
                        <select 
                          value={rsvpCount}
                          onChange={(e) => setRsvpCount(Number(e.target.value))}
                          className="w-full p-4 bg-transparent border-b outline-none transition-colors focus:border-yellow-500"
                          style={{ borderColor: `${themeColors.primary}50` }}
                        >
                          <option value="1" className="bg-[var(--theme-background)]">1 Person</option>
                          <option value="2" className="bg-[var(--theme-background)]">2 Persons</option>
                        </select>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={submittingRsvp}
                      className="w-full p-4 rounded-full font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 shadow-[0_0_15px_rgba(255,215,0,0.3)] mt-4"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {submittingRsvp ? "Sending..." : "Send RSVP"}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Wishes / Guestbook */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-great-vibes text-6xl mb-2" style={{ color: themeColors.primary }}>Wishes</h2>
                <p className="opacity-70 mb-8 font-light">Leave a message for the couple</p>
                
                <form onSubmit={handleSendWish} className="mb-8 space-y-4">
                  <textarea 
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-4 bg-transparent border-b outline-none placeholder:opacity-50 transition-colors focus:border-yellow-500 resize-none"
                    style={{ borderColor: `${themeColors.primary}50` }}
                    placeholder="Write your wishes..."
                  />
                  <button 
                    type="submit" 
                    disabled={sendingWish}
                    className="px-8 py-3 rounded-full font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <Send size={16} /> {sendingWish ? "Sending..." : "Send Wish"}
                  </button>
                </form>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {wishes.map((wish: any) => (
                    <div key={wish.id} className="bg-white/5 p-6 rounded-2xl border" style={{ borderColor: `${themeColors.primary}20` }}>
                      <div className="font-bold mb-1" style={{ color: themeColors.primary }}>{wish.guest_name}</div>
                      <div className="text-xs opacity-50 mb-3">{formatDate(wish.created_at)}</div>
                      <div className="opacity-90 leading-relaxed text-sm font-light">"{wish.message}"</div>
                    </div>
                  ))}
                  {wishes.length === 0 && (
                    <p className="opacity-50 italic text-sm text-center py-8 font-light">Be the first to leave a wish!</p>
                  )}
                </div>
              </motion.div>

            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-12 text-center opacity-50 text-sm mt-12 bg-black/40">
            <p>Made with ❤️ by NikahLink</p>
            {!isFreePlan && <p className="mt-2 text-xs">Premium Invitation</p>}
          </footer>

        </div>
      )}
    </div>
  );
}
