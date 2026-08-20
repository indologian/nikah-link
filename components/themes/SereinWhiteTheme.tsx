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

export default function SereinWhiteTheme({
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
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";
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
    background: "var(--theme-background)",
    text: "var(--theme-text)",       
    primary: "var(--theme-primary)",    // Gray-400
    accent: "var(--theme-background)"      // Gray-100
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58be.mp3"; 

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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const } as any }
  };

  const fadeReveal = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1.5, ease: "easeInOut" as const } as any }
  };

  return (
    <div 
      className="min-h-screen font-sans font-light relative selection:bg-gray-200 overflow-x-hidden"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden bg-white"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center"
            >
              <div className="w-full aspect-[3/4] overflow-hidden mb-12 relative">
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" priority />
              </div>
              
              <div className="space-y-6 w-full">
                <h1 className="text-4xl md:text-5xl uppercase tracking-[0.2em] font-light text-black">
                  {invitation.bride_nickname} <br/>&<br/> {invitation.groom_nickname}
                </h1>
                
                <div className="w-full h-px bg-gray-200 my-8"></div>
                
                <div className="py-2">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">To our beloved</p>
                  <p className="text-xl font-normal">{guestName}</p>
                </div>

                <button 
                  onClick={handleOpenInvitation}
                  className="mt-8 px-10 py-4 text-xs uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white border border-black text-black w-full"
                >
                  Enter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {isOpen && (
        <div className="relative z-10 bg-white">
          
          {/* Floating Audio Button */}
          {musicUrl && (
            <button 
              onClick={toggleAudio}
              className="fixed bottom-8 right-8 w-12 h-12 flex items-center justify-center z-50 transition-transform hover:scale-105 border border-gray-200 bg-white shadow-sm rounded-full mix-blend-difference text-white"
            >
              {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center p-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeReveal} className="w-full h-full flex flex-col justify-center">
              
              <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto w-full">
                <div className="flex-1 order-2 md:order-1 text-center md:text-left">
                  <p className="tracking-[0.4em] uppercase text-xs text-gray-500 mb-6">We are getting married</p>
                  <h1 className="text-5xl md:text-8xl uppercase tracking-widest font-light mb-8 leading-[1.1]">
                    {invitation.bride_nickname} <br/>&<br/> {invitation.groom_nickname}
                  </h1>
                  <p className="text-lg md:text-xl tracking-[0.2em] text-gray-600">
                    {new Date(weddingDateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                
                <div className="flex-1 order-1 md:order-2 w-full max-w-md aspect-[3/4] relative overflow-hidden">
                  <Image src={heroPhoto} alt="Hero" fill className="object-cover" priority />
                </div>
              </div>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-32 px-8 text-center bg-gray-50">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto">
                <p className="text-2xl md:text-4xl font-light leading-relaxed text-gray-800">
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-32 px-8 relative bg-white">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-6xl mx-auto">
                <div className="flex items-center gap-6 mb-24">
                  <p className="tracking-[0.3em] uppercase text-xs text-gray-500">01. The Couple</p>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-16 md:gap-8">
                  
                  {/* Bride */}
                  <div className="flex-1 border border-gray-100 p-12 hover:border-gray-300 transition-colors">
                    <h3 className="text-3xl uppercase tracking-widest font-light mb-6">{invitation.bride_name}</h3>
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Daughter of</p>
                    <p className="text-sm tracking-widest uppercase">{invitation.bride_parents}</p>
                  </div>

                  {/* Groom */}
                  <div className="flex-1 border border-gray-100 p-12 hover:border-gray-300 transition-colors">
                    <h3 className="text-3xl uppercase tracking-widest font-light mb-6">{invitation.groom_name}</h3>
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Son of</p>
                    <p className="text-sm tracking-widest uppercase">{invitation.groom_parents}</p>
                  </div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-32 px-8 relative bg-gray-50">
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex items-center gap-6 mb-24">
                <p className="tracking-[0.3em] uppercase text-xs text-gray-500">02. The Events</p>
                <div className="h-px bg-gray-200 flex-1"></div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col">
                  <h3 className="text-2xl uppercase tracking-widest font-light mb-8 pb-4 border-b border-gray-200">Holy Matrimony</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Date</div>
                      <div className="text-lg">{formatDate(invitation.akad_date)}</div>
                    </div>
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Time</div>
                      <div className="text-lg">{formatTime(invitation.akad_date)}</div>
                    </div>
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Venue</div>
                      <div className="text-lg font-medium">{invitation.akad_location}</div>
                      <div className="text-sm text-gray-500 mt-1">{invitation.akad_address}</div>
                    </div>
                  </div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-12 w-fit pb-1 border-b border-black text-xs uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
                      View Map
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col">
                  <h3 className="text-2xl uppercase tracking-widest font-light mb-8 pb-4 border-b border-gray-200">Reception</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Date</div>
                      <div className="text-lg">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                    </div>
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Time</div>
                      <div className="text-lg">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                    </div>
                    <div>
                      <div className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Venue</div>
                      <div className="text-lg font-medium">{invitation.reception_location || invitation.akad_location}</div>
                      <div className="text-sm text-gray-500 mt-1">{invitation.reception_address || invitation.akad_address}</div>
                    </div>
                  </div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-12 w-fit pb-1 border-b border-black text-xs uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
                      View Map
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Countdown */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeReveal} className="mt-32 pt-16 border-t border-gray-200 flex justify-between max-w-2xl mx-auto">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Mins", value: timeLeft.minutes },
                  { label: "Secs", value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-light mb-4">{item.value}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-32 px-8 bg-white max-w-6xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex items-center gap-6 mb-24">
                <p className="tracking-[0.3em] uppercase text-xs text-gray-500">03. Gallery</p>
                <div className="h-px bg-gray-200 flex-1"></div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: (idx % 2) * 0.2 }}
                    className={`relative w-full overflow-hidden ${idx % 3 === 0 ? "aspect-square" : "aspect-[3/4]"}`}
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      fill 
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* DIGITAL WALLET / GIFT */}
          {invitation.show_gifts && giftAccounts.length > 0 && (
            <section className="py-32 px-8 bg-gray-50">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto">
                <div className="text-center mb-16">
                  <p className="tracking-[0.3em] uppercase text-xs text-gray-500 mb-4">04. Wedding Gift</p>
                  <p className="text-gray-600 font-light">Your blessing is a gift itself. If you wish to give more, you may transfer to:</p>
                </div>
                
                <div className="space-y-4">
                  {giftAccounts.map((account: any) => (
                    <div key={account.id} className="bg-white p-8 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="text-xs tracking-widest uppercase text-gray-400 mb-2">{account.bank_name}</div>
                        <div className="text-2xl font-light mb-1">{account.account_number}</div>
                        <div className="text-sm uppercase tracking-widest">{account.account_name}</div>
                      </div>
                      
                      <button 
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="px-6 py-3 border border-black text-xs uppercase tracking-widest transition-colors w-full md:w-auto text-center"
                        style={{ 
                          backgroundColor: copiedBank === account.id ? "black" : "transparent", 
                          color: copiedBank === account.id ? "white" : "black",
                        }}
                      >
                        {copiedBank === account.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-32 px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex items-center gap-6 mb-24">
                <p className="tracking-[0.3em] uppercase text-xs text-gray-500">05. Attendance & Wishes</p>
                <div className="h-px bg-gray-200 flex-1"></div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-24">
                
                {/* RSVP Form */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                  <h3 className="text-2xl uppercase tracking-widest font-light mb-10">RSVP</h3>
                  
                  {rsvpSuccess ? (
                    <div className="p-8 border border-gray-200 text-center">
                      <p className="text-lg mb-2">Thank You.</p>
                      <p className="text-gray-500 text-sm">Your confirmation has been received.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-8">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4">Name</label>
                        <input 
                          type="text" 
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          required
                          className="w-full pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-black transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4">Attendance</label>
                        <select 
                          value={rsvpStatus}
                          onChange={(e) => setRsvpStatus(e.target.value as any)}
                          className="w-full pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-black transition-colors"
                        >
                          <option value="hadir">Will Attend</option>
                          <option value="tidak_hadir">Unable to Attend</option>
                        </select>
                      </div>

                      {rsvpStatus === "hadir" && (
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-gray-400 mb-4">Number of Guests</label>
                          <select 
                            value={rsvpCount}
                            onChange={(e) => setRsvpCount(Number(e.target.value))}
                            className="w-full pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-black transition-colors"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 Persons</option>
                          </select>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={submittingRsvp}
                        className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors mt-8"
                      >
                        {submittingRsvp ? "Sending..." : "Submit RSVP"}
                      </button>
                    </form>
                  )}
                </motion.div>

                {/* Wishes / Guestbook */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                  <h3 className="text-2xl uppercase tracking-widest font-light mb-10">Wishes</h3>
                  
                  <form onSubmit={handleSendWish} className="mb-12 space-y-6">
                    <div>
                      <textarea 
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        required
                        rows={3}
                        className="w-full p-4 border border-gray-200 bg-transparent outline-none focus:border-black transition-colors resize-none"
                        placeholder="Write your message..."
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={sendingWish}
                      className="px-8 py-3 border border-black text-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                    >
                      {sendingWish ? "Sending..." : "Send Wish"}
                    </button>
                  </form>

                  <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {wishes.map((wish: any) => (
                      <div key={wish.id} className="pb-8 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-medium text-sm uppercase tracking-widest">{wish.guest_name}</span>
                          <span className="text-xs text-gray-400">{formatDate(wish.created_at)}</span>
                        </div>
                        <div className="text-gray-600 font-light text-sm leading-relaxed">"{wish.message}"</div>
                      </div>
                    ))}
                    {wishes.length === 0 && (
                      <p className="text-gray-400 text-sm">No wishes yet.</p>
                    )}
                  </div>
                </motion.div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-24 text-center bg-gray-50 border-t border-gray-100">
            <h2 className="text-4xl uppercase tracking-[0.3em] font-light mb-8">
              {invitation.bride_nickname} & {invitation.groom_nickname}
            </h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mb-8"></div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Thank You</p>
            {!isFreePlan && <p className="mt-12 text-[10px] text-gray-300 tracking-widest uppercase">Powered by NikahLink</p>}
          </footer>

        </div>
      )}
    </div>
  );
}
