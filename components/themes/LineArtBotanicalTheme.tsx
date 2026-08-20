"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Volume2, VolumeX, Copy, CheckCircle2 } from "lucide-react";
import Image from "next/image";
// Google Fonts
import { Italiana, Lato } from "next/font/google";
const italiana = Italiana({ subsets: ["latin"], weight: ["400"] });
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

export default function LineArtBotanicalTheme({
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
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop";
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
    background: "var(--theme-background)", // Off-white/Beige
    text: "var(--theme-text)",       // Dark Green
    primary: "var(--theme-primary)",    // Olive Drab
    accent: "var(--theme-accent)"      // Soft Peach
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2021/09/24/audio_33bc2ddfb3.mp3"; 

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

  // Botanical Line Art SVGs
  const LeafBranch = () => (
    <svg viewBox="0 0 200 400" fill="none" stroke={themeColors.text} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full opacity-30">
      <path d="M100 400 Q120 200 50 50" />
      <path d="M110 300 Q160 280 180 220 Q150 210 115 270" />
      <path d="M105 200 Q150 180 160 120 Q120 120 95 170" />
      <path d="M90 250 Q40 230 20 170 Q50 160 85 220" />
      <path d="M80 120 Q30 100 10 40 Q40 30 75 90" />
    </svg>
  );

  const AbstractFaces = () => (
    <svg viewBox="0 0 500 500" fill="none" stroke={themeColors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full opacity-20">
      {/* Continuous line art face profiles kissing/close */}
      <path d="M 200 400 C 180 300 250 250 250 200 C 250 150 220 120 200 100 C 180 120 150 150 150 200 C 150 250 180 300 200 400 Z" />
      <path d="M 300 400 C 320 300 250 250 250 200 C 250 150 280 120 300 100 C 320 120 350 150 350 200 C 350 250 320 300 300 400 Z" />
      <path d="M 220 220 Q 250 260 280 220" />
    </svg>
  );

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut" } as any }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } as any }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-x-hidden ${lato.className}`}
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden"
            style={{ backgroundColor: themeColors.background }}
          >
            {/* Background Abstract Line Art */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <AbstractFaces />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-24 h-32 -mt-10 -mr-10">
                 <LeafBranch />
              </div>
              
              <h3 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-gray-500">The Wedding Of</h3>
              
              <div className="w-48 h-64 overflow-hidden mb-8 relative rounded-t-full shadow-md">
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" priority />
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-normal text-center mb-6 ${italiana.className}`} style={{ color: themeColors.text }}>
                {invitation.bride_nickname} & {invitation.groom_nickname}
              </h1>
              
              <div className="w-12 h-px my-4" style={{ backgroundColor: themeColors.text }}></div>
              
              <div className="py-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Dear</p>
                <p className="text-lg font-light" style={{ color: themeColors.text }}>{guestName}</p>
              </div>

              <button 
                onClick={handleOpenInvitation}
                className="mt-8 px-10 py-3 rounded-full text-xs uppercase tracking-[0.2em] transition-all hover:opacity-80 shadow-md text-white font-light"
                style={{ backgroundColor: themeColors.text }}
              >
                Open Invitation
              </button>
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
              className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center z-50 transition-transform hover:scale-105 shadow-md rounded-full bg-white"
              style={{ color: themeColors.text }}
            >
              {isPlaying ? <Volume2 size={16} strokeWidth={1.5} /> : <VolumeX size={16} strokeWidth={1.5} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center p-6 text-center">
            {/* Corner Decorative SVGs */}
            <div className="absolute top-0 left-0 w-48 h-96 pointer-events-none transform -scale-x-100">
               <LeafBranch />
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-96 pointer-events-none">
               <LeafBranch />
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="relative z-10 w-full max-w-2xl px-6 py-16 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl">
              <h1 className={`text-6xl md:text-8xl mb-6 leading-none ${italiana.className}`} style={{ color: themeColors.text }}>
                {invitation.bride_nickname}
                <span className="block text-4xl my-4 italic text-gray-400 font-light">&</span>
                {invitation.groom_nickname}
              </h1>
              <p className="text-sm tracking-[0.3em] font-light uppercase mt-12 mb-2" style={{ color: themeColors.text }}>
                {new Date(weddingDateStr).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-24 px-6 text-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <AbstractFaces />
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-2xl mx-auto relative z-10 bg-white/70 p-8 rounded-2xl backdrop-blur-sm">
                <p className={`text-2xl md:text-3xl font-light ${italiana.className}`} style={{ color: themeColors.text }}>
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-5xl mx-auto text-center">
                <h2 className={`text-5xl mb-16 ${italiana.className}`} style={{ color: themeColors.text }}>The Couple</h2>
                
                <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-56 h-72 relative mb-8 rounded-t-full overflow-hidden shadow-lg border-2 border-white">
                       <Image src={heroPhoto} alt="Bride" fill className="object-cover" />
                    </div>
                    <h3 className={`text-3xl mb-3 ${italiana.className}`}>{invitation.bride_name}</h3>
                    <p className="text-[10px] font-light uppercase tracking-widest text-gray-500 mb-1">Daughter of</p>
                    <p className="font-light text-sm text-gray-700">{invitation.bride_parents}</p>
                  </div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-56 h-72 relative mb-8 rounded-t-full overflow-hidden shadow-lg border-2 border-white">
                       <Image src={heroPhoto} alt="Groom" fill className="object-cover" />
                    </div>
                    <h3 className={`text-3xl mb-3 ${italiana.className}`}>{invitation.groom_name}</h3>
                    <p className="text-[10px] font-light uppercase tracking-widest text-gray-500 mb-1">Son of</p>
                    <p className="font-light text-sm text-gray-700">{invitation.groom_parents}</p>
                  </div>
                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-32 px-6 relative bg-white/60">
            <div className="absolute top-0 right-0 w-64 h-96 pointer-events-none opacity-40">
               <LeafBranch />
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-20">
                <h2 className={`text-5xl mb-4 ${italiana.className}`} style={{ color: themeColors.text }}>The Celebration</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16 relative">
                {/* Center dividing line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 transform -translate-x-1/2"></div>

                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col items-center">
                  <h3 className="text-xl font-light mb-8 uppercase tracking-[0.2em]" style={{ color: themeColors.text }}>Holy Matrimony</h3>
                  
                  <div className="space-y-4 mb-8 text-center font-light">
                    <div className="text-lg">{formatDate(invitation.akad_date)}</div>
                    <div className="text-sm text-gray-600">{formatTime(invitation.akad_date)}</div>
                    <div className="pt-6 mt-6 border-t border-gray-200 w-32 mx-auto"></div>
                    <div className="text-lg uppercase tracking-wider">{invitation.akad_location}</div>
                    <div className="text-sm text-gray-500">{invitation.akad_address}</div>
                  </div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-full text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                      <MapPin size={14} strokeWidth={1.5} /> View Map
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-col items-center">
                  <h3 className="text-xl font-light mb-8 uppercase tracking-[0.2em]" style={{ color: themeColors.text }}>Reception</h3>
                  
                  <div className="space-y-4 mb-8 text-center font-light">
                    <div className="text-lg">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="text-sm text-gray-600">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="pt-6 mt-6 border-t border-gray-200 w-32 mx-auto"></div>
                    <div className="text-lg uppercase tracking-wider">{invitation.reception_location || invitation.akad_location}</div>
                    <div className="text-sm text-gray-500">{invitation.reception_address || invitation.akad_address}</div>
                  </div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-full text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">
                      <MapPin size={14} strokeWidth={1.5} /> View Map
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-4 max-w-6xl mx-auto text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
                <h2 className={`text-5xl mb-6 ${italiana.className}`} style={{ color: themeColors.text }}>Moments</h2>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                    className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-sm border border-gray-100"
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

          {/* RSVP & WISHES */}
          <section className="py-24 px-6 bg-white/80 border-y border-gray-100">
            <div className="max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                <h2 className={`text-5xl mb-6 ${italiana.className}`} style={{ color: themeColors.text }}>RSVP & Guestbook</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                
                {/* RSVP Form */}
                <div className="p-8 border border-gray-200 rounded-3xl bg-white/50 shadow-sm font-light">
                  <h3 className="text-lg mb-8 uppercase tracking-widest text-center">RSVP</h3>
                  
                  {rsvpSuccess ? (
                    <div className="p-6 text-center text-green-800 border border-green-200 bg-green-50 rounded-xl">
                      <CheckCircle2 size={32} strokeWidth={1.5} className="mx-auto mb-4 text-green-600" />
                      <p>Thank you for your confirmation.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          required
                          className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Attendance</label>
                        <select 
                          value={rsvpStatus}
                          onChange={(e) => setRsvpStatus(e.target.value as any)}
                          className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-transparent"
                        >
                          <option value="hadir">Joyfully Accept</option>
                          <option value="tidak_hadir">Regretfully Decline</option>
                        </select>
                      </div>

                      {rsvpStatus === "hadir" && (
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Guests Count</label>
                          <select 
                            value={rsvpCount}
                            onChange={(e) => setRsvpCount(Number(e.target.value))}
                            className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-transparent"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 Persons</option>
                          </select>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={submittingRsvp}
                        className="w-full py-4 text-white text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity mt-4"
                        style={{ backgroundColor: themeColors.text }}
                      >
                        {submittingRsvp ? "Sending..." : "Send RSVP"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Wishes */}
                <div className="font-light">
                  <h3 className="text-lg mb-8 uppercase tracking-widest text-center">Wishes</h3>
                  
                  <form onSubmit={handleSendWish} className="mb-10 space-y-4">
                    <textarea 
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      required
                      rows={4}
                      className="w-full p-4 border border-gray-200 rounded-xl outline-none focus:border-gray-400 bg-white/50 resize-none shadow-sm"
                      placeholder="Write a message for the couple..."
                    />
                    <button 
                      type="submit" 
                      disabled={sendingWish}
                      className="w-full py-4 text-white text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity shadow-md"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {sendingWish ? "Sending..." : "Publish Wish"}
                    </button>
                  </form>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {wishes.map((wish: any) => (
                      <div key={wish.id} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                        <div className="flex flex-col mb-2">
                          <span className="font-medium tracking-wide text-sm">{wish.guest_name}</span>
                          <span className="text-[10px] text-gray-400 mt-1">{formatDate(wish.created_at)}</span>
                        </div>
                        <div className="text-gray-600 text-sm leading-relaxed">"{wish.message}"</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-20 text-center relative overflow-hidden bg-[var(--theme-background)]">
             {/* Background Line Art for Footer */}
             <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20">
               <AbstractFaces />
             </div>
             
             <div className="relative z-10">
                <h2 className={`text-4xl mb-4 ${italiana.className}`} style={{ color: themeColors.text }}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h2>
                <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase">Thank You</p>
                {!isFreePlan && <p className="mt-12 text-[9px] text-gray-400 tracking-widest uppercase">Powered by NikahLink</p>}
             </div>
          </footer>

        </div>
      )}
    </div>
  );
}
