"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Calendar, MapPin, Music, Volume2, VolumeX,
  Gift, Copy, Check, MessageSquare, Send, CheckCircle2
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

export default function ElegantBlushTheme({
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
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop";
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
    background: "var(--theme-background)", // Very soft blush pink
    text: "var(--theme-text)",       // Dark gray
    primary: "var(--theme-primary)",    // Rose gold / blush
    accent: "var(--theme-accent)"      // Soft pinkish gray for borders
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2022/10/25/audio_24a2f8c5c7.mp3"; 

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

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } }
  };

  return (
    <div 
      className="min-h-screen font-sans relative selection:bg-rose-100 overflow-x-hidden"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Soft gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(circle at top right, ${themeColors.accent}30, transparent 40%)` }}></div>
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: `radial-gradient(circle at bottom left, ${themeColors.accent}30, transparent 40%)` }}></div>

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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden bg-white/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center p-8 bg-white/50 rounded-3xl border border-white shadow-2xl"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-8 relative shadow-lg ring-4 ring-white">
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" />
              </div>
              
              <div className="space-y-3">
                <p className="tracking-[0.3em] uppercase text-xs font-semibold" style={{ color: themeColors.primary }}>The Wedding Of</p>
                <h1 className="font-great-vibes text-5xl mb-2" style={{ color: themeColors.primary }}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h1>
                
                <div className="py-6 mt-6">
                  <p className="text-sm mb-1 opacity-70">Dear,</p>
                  <p className="text-xl font-bold font-playfair">{guestName}</p>
                </div>

                <button 
                  onClick={handleOpenInvitation}
                  className="px-8 py-3 rounded-full text-white text-sm uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 mx-auto tracking-widest"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <Heart size={16} /> Open Invitation
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
              className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-lg text-white transition-transform hover:scale-110"
              style={{ backgroundColor: themeColors.primary }}
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center p-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="w-full max-w-4xl mx-auto flex flex-col items-center">
              
              <div className="relative w-full h-[60vh] md:h-[70vh] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl mb-10">
                <Image src={heroPhoto} alt="Hero" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-8 left-0 w-full text-white text-center">
                   <h1 className="font-great-vibes text-5xl md:text-8xl mb-2 drop-shadow-lg">
                    {invitation.bride_nickname} & {invitation.groom_nickname}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm md:text-base tracking-[0.2em] uppercase font-bold" style={{ color: themeColors.primary }}>
                <span>{new Date(weddingDateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{invitation.reception_location || invitation.akad_location}</span>
              </div>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-20 px-6 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto">
                <p className="text-xl md:text-3xl font-playfair italic leading-relaxed" style={{ color: themeColors.primary }}>
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 bg-white/40 backdrop-blur-sm">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-4xl mx-auto text-center">
                <p className="tracking-[0.3em] uppercase text-xs font-semibold mb-12" style={{ color: themeColors.primary }}>The Bride & Groom</p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                  
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 className="font-great-vibes text-5xl mb-4" style={{ color: themeColors.primary }}>{invitation.bride_name}</h3>
                    <p className="text-xs tracking-widest uppercase mb-2 opacity-70">The Daughter Of</p>
                    <p className="font-playfair text-lg">{invitation.bride_parents}</p>
                  </div>

                  {/* AND */}
                  <div className="text-4xl font-playfair italic opacity-30">
                    and
                  </div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 className="font-great-vibes text-5xl mb-4" style={{ color: themeColors.primary }}>{invitation.groom_name}</h3>
                    <p className="text-xs tracking-widest uppercase mb-2 opacity-70">The Son Of</p>
                    <p className="font-playfair text-lg">{invitation.groom_parents}</p>
                  </div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative">
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <p className="tracking-[0.3em] uppercase text-xs font-semibold mb-4" style={{ color: themeColors.primary }}>Join Us</p>
                <h2 className="font-playfair text-4xl md:text-5xl">Wedding Events</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white rounded-3xl p-10 shadow-xl border border-white/50 text-center relative flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: themeColors.background, color: themeColors.primary }}>
                    <Heart size={20} />
                  </div>
                  <h3 className="tracking-widest uppercase text-sm mb-4 font-bold" style={{ color: themeColors.primary }}>Holy Matrimony</h3>
                  <div className="text-2xl font-playfair mb-2">{formatDate(invitation.akad_date)}</div>
                  <div className="mb-6 opacity-70">{formatTime(invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.akad_location}</div>
                  <div className="opacity-70 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.akad_address}</div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-8 py-3 rounded-full tracking-widest text-xs uppercase flex items-center gap-2 font-bold text-white transition-transform hover:scale-105" style={{ backgroundColor: themeColors.primary }}>
                      Open Map
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white rounded-3xl p-10 shadow-xl border border-white/50 text-center relative flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: themeColors.background, color: themeColors.primary }}>
                    <Heart size={20} />
                  </div>
                  <h3 className="tracking-widest uppercase text-sm mb-4 font-bold" style={{ color: themeColors.primary }}>Wedding Reception</h3>
                  <div className="text-2xl font-playfair mb-2">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="mb-6 opacity-70">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.reception_location || invitation.akad_location}</div>
                  <div className="opacity-70 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.reception_address || invitation.akad_address}</div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-8 py-3 rounded-full tracking-widest text-xs uppercase flex items-center gap-2 font-bold text-white transition-transform hover:scale-105" style={{ backgroundColor: themeColors.primary }}>
                      Open Map
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Countdown */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="mt-20 flex justify-center gap-4 md:gap-12 bg-white rounded-3xl p-8 shadow-sm">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center w-16 md:w-24">
                    <span className="text-3xl md:text-5xl font-playfair mb-2" style={{ color: themeColors.primary }}>{item.value}</span>
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
                <h2 className="font-playfair text-4xl md:text-5xl mb-6">Our Moments</h2>
              </motion.div>
              
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                    className="relative w-full overflow-hidden inline-block rounded-2xl shadow-md group"
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      width={500} 
                      height={700} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* DIGITAL WALLET / GIFT */}
          {invitation.show_gifts && giftAccounts.length > 0 && (
            <section className="py-24 px-6 bg-white/40">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto text-center">
                <Gift className="w-10 h-10 mx-auto mb-6" style={{ color: themeColors.primary }} />
                <h2 className="font-playfair text-4xl mb-6">Wedding Gift</h2>
                <p className="opacity-70 mb-12">Your presence is the greatest gift, but if you wish to bless us with a gift, you may do so through:</p>
                
                <div className="grid gap-6">
                  {giftAccounts.map((account: any) => (
                    <div key={account.id} className="bg-white p-8 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center">
                      <div className="font-bold text-sm tracking-widest uppercase mb-4" style={{ color: themeColors.primary }}>{account.bank_name}</div>
                      <div className="text-2xl font-mono tracking-wider mb-2">{account.account_number}</div>
                      <div className="opacity-70 mb-6">{account.account_name}</div>
                      
                      <button 
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="px-6 py-2 rounded-full transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold"
                        style={{ 
                          backgroundColor: copiedBank === account.id ? "var(--theme-text)" : themeColors.background, 
                          color: copiedBank === account.id ? "white" : themeColors.primary,
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
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24">
              
              {/* RSVP Form */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-playfair text-4xl mb-2">RSVP</h2>
                <p className="opacity-70 mb-8">Please confirm your attendance</p>
                
                {rsvpSuccess ? (
                  <div className="bg-white p-8 rounded-3xl text-center flex flex-col items-center shadow-sm">
                    <CheckCircle2 className="w-16 h-16 mb-4 text-emerald-500" />
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
                        className="w-full p-4 rounded-xl bg-white border-transparent focus:ring-2 outline-none shadow-sm placeholder:opacity-50"
                        style={{ "--tw-ring-color": themeColors.primary } as React.CSSProperties}
                        placeholder="Your Name"
                      />
                    </div>
                    
                    <div>
                      <select 
                        value={rsvpStatus}
                        onChange={(e) => setRsvpStatus(e.target.value as any)}
                        className="w-full p-4 rounded-xl bg-white border-transparent focus:ring-2 outline-none shadow-sm"
                      >
                        <option value="hadir">Joyfully Accept</option>
                        <option value="tidak_hadir">Regretfully Decline</option>
                      </select>
                    </div>

                    {rsvpStatus === "hadir" && (
                      <div>
                        <select 
                          value={rsvpCount}
                          onChange={(e) => setRsvpCount(Number(e.target.value))}
                          className="w-full p-4 rounded-xl bg-white border-transparent focus:ring-2 outline-none shadow-sm"
                        >
                          <option value="1">1 Person</option>
                          <option value="2">2 Persons</option>
                        </select>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={submittingRsvp}
                      className="w-full p-4 rounded-xl font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 shadow-lg"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {submittingRsvp ? "Sending..." : "Send RSVP"}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Wishes / Guestbook */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-playfair text-4xl mb-2">Wishes</h2>
                <p className="opacity-70 mb-8">Leave a message for the couple</p>
                
                <form onSubmit={handleSendWish} className="mb-8 space-y-4">
                  <textarea 
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-4 rounded-xl bg-white border-transparent focus:ring-2 outline-none shadow-sm placeholder:opacity-50"
                    placeholder="Write your wishes..."
                  />
                  <button 
                    type="submit" 
                    disabled={sendingWish}
                    className="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 flex items-center gap-2 shadow-lg"
                    style={{ backgroundColor: themeColors.primary }}
                  >
                    <Send size={16} /> {sendingWish ? "Sending..." : "Send Wish"}
                  </button>
                </form>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {wishes.map((wish: any) => (
                    <div key={wish.id} className="bg-white p-6 rounded-2xl shadow-sm">
                      <div className="font-bold mb-1">{wish.guest_name}</div>
                      <div className="text-xs opacity-50 mb-3">{formatDate(wish.created_at)}</div>
                      <div className="opacity-80 leading-relaxed text-sm">"{wish.message}"</div>
                    </div>
                  ))}
                  {wishes.length === 0 && (
                    <p className="opacity-50 italic text-sm text-center py-8">Be the first to leave a wish!</p>
                  )}
                </div>
              </motion.div>

            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-12 text-center opacity-50 text-sm mt-12 bg-white/30">
            <p>Made with ❤️ by NikahLink</p>
            {!isFreePlan && <p className="mt-2 text-xs">Premium Invitation</p>}
          </footer>

        </div>
      )}
    </div>
  );
}
