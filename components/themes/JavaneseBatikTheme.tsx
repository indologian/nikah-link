"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Volume2, VolumeX, Copy, CheckCircle2 } from "lucide-react";
import Image from "next/image";
// Google Fonts
import { PT_Serif, Great_Vibes } from "next/font/google";
const ptSerif = PT_Serif({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function JavaneseBatikTheme({
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
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1583939000140-5242502690d7?q=80&w=2000&auto=format&fit=crop";
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
    primary: "var(--theme-primary)",    // Muted Gold
    accent: "var(--theme-accent)"      // Brown
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2022/10/26/audio_1ab7ec6a0f.mp3"; 

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

  // Batik Kawung SVG background pattern encoded
  const batikPatternSVG = `data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0c27.614 0 50 22.386 50 50s-22.386 50-50 50S0 77.614 0 50 22.386 0 50 0zm0 10c22.091 0 40 17.909 40 40s-17.909 40-40 40S10 72.091 10 50 27.909 10 50 10zm0 15c13.807 0 25 11.193 25 25s-11.193 25-25 25S25 63.807 25 50 36.193 25 50 25z' fill='%23B48B3D' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E`;

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
      className={`min-h-screen relative overflow-x-hidden ${ptSerif.className}`}
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Background Pattern SVG Layer */}
      <div 
        className="fixed inset-0 z-0 opacity-80"
        style={{ backgroundImage: `url("${batikPatternSVG}")` }}
      ></div>

      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* Decorative Ornaments - SVG */}
      <div className="fixed top-0 left-0 w-32 h-32 z-40 opacity-70 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h100C100 55.228 55.228 100 0 100V0z" fill={themeColors.primary} fillOpacity="0.2"/>
          <path d="M0 0h80C80 44.183 44.183 80 0 80V0z" fill={themeColors.primary} fillOpacity="0.4"/>
          <path d="M0 0h60C60 33.137 33.137 60 0 60V0z" fill={themeColors.accent} fillOpacity="0.8"/>
          <path d="M0 0h40C40 22.091 22.091 40 0 40V0z" fill={themeColors.primary}/>
        </svg>
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 z-40 opacity-70 pointer-events-none transform rotate-180">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h100C100 55.228 55.228 100 0 100V0z" fill={themeColors.primary} fillOpacity="0.2"/>
          <path d="M0 0h80C80 44.183 44.183 80 0 80V0z" fill={themeColors.primary} fillOpacity="0.4"/>
          <path d="M0 0h60C60 33.137 33.137 60 0 60V0z" fill={themeColors.accent} fillOpacity="0.8"/>
          <path d="M0 0h40C40 22.091 22.091 40 0 40V0z" fill={themeColors.primary}/>
        </svg>
      </div>

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden bg-[var(--theme-background)]"
            style={{ backgroundImage: `url("${batikPatternSVG}")` }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="relative w-full max-w-sm flex flex-col items-center text-center p-10 bg-white/95 backdrop-blur-md shadow-2xl border border-amber-200/50"
              style={{ borderRadius: "100px 100px 0 0" }}
            >
              {/* SVG Gunungan Ornament */}
              <div className="w-16 h-16 mb-6">
                <svg viewBox="0 0 100 100" fill={themeColors.primary}>
                  <path d="M50 0L80 40C80 65 65 90 50 100C35 90 20 65 20 40L50 0Z" opacity="0.8"/>
                  <circle cx="50" cy="50" r="10" fill="white" opacity="0.9"/>
                </svg>
              </div>
              
              <h3 className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: themeColors.accent }}>Pawiwahan Ageng</h3>
              
              <div className="w-40 h-48 overflow-hidden mb-8 relative" style={{ borderRadius: "100px 100px 0 0", border: `2px solid ${themeColors.primary}` }}>
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" priority />
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold text-center mb-6 ${greatVibes.className}`} style={{ color: themeColors.accent }}>
                {invitation.bride_nickname} & {invitation.groom_nickname}
              </h1>
              
              <div className="py-4 mt-4 border-t border-b w-full" style={{ borderColor: `${themeColors.primary}40` }}>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Katur Dumateng</p>
                <p className="text-xl font-bold" style={{ color: themeColors.text }}>{guestName}</p>
              </div>

              <button 
                onClick={handleOpenInvitation}
                className="mt-10 px-8 py-3 rounded-none text-xs uppercase tracking-[0.3em] transition-all shadow-md text-white font-bold hover:scale-105"
                style={{ backgroundColor: themeColors.accent }}
              >
                Buka Undangan
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
              className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center z-50 transition-transform hover:scale-105 shadow-lg rounded-full text-white"
              style={{ backgroundColor: themeColors.accent }}
            >
              {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[90svh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="relative z-10 w-full max-w-2xl bg-white/95 p-12 shadow-xl border-8" style={{ borderColor: `${themeColors.primary}20` }}>
              <div className="w-24 h-24 mx-auto mb-8">
                 {/* Center SVG Motif */}
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="50" y="0" width="70.71" height="70.71" transform="rotate(45 50 0)" stroke={themeColors.primary} strokeWidth="2"/>
                    <circle cx="50" cy="50" r="30" stroke={themeColors.accent} strokeWidth="1" strokeDasharray="4 4"/>
                    <path d="M50 30L60 50L50 70L40 50L50 30Z" fill={themeColors.primary}/>
                 </svg>
              </div>
              <h1 className={`text-6xl md:text-8xl mb-8 leading-tight ${greatVibes.className}`} style={{ color: themeColors.accent }}>
                {invitation.bride_nickname} & {invitation.groom_nickname}
              </h1>
              <p className="text-xl tracking-[0.2em] font-medium uppercase mb-4" style={{ color: themeColors.text }}>
                {new Date(weddingDateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <div className="w-16 h-px mx-auto" style={{ backgroundColor: themeColors.primary }}></div>
            </motion.div>
          </section>

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-4xl mx-auto text-center">
                <h2 className={`text-5xl font-bold mb-6 ${greatVibes.className}`} style={{ color: themeColors.accent }}>Mempelai</h2>
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-16">Sang Pencipta telah menyatukan dua insan</p>
                
                <div className="flex flex-col md:flex-row gap-16 justify-center items-center">
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-48 h-64 relative mb-6 p-2 bg-white shadow-lg border" style={{ borderColor: themeColors.primary }}>
                       <Image src={heroPhoto} alt="Bride" fill className="object-cover p-2" />
                    </div>
                    <h3 className={`text-4xl font-bold mb-2 ${greatVibes.className}`}>{invitation.bride_name}</h3>
                    <p className="text-sm font-sans uppercase tracking-widest text-gray-500">Putri dari</p>
                    <p className="font-bold mt-1 text-lg">{invitation.bride_parents}</p>
                  </div>

                  {/* Dan */}
                  <div className={`text-4xl ${greatVibes.className}`} style={{ color: themeColors.primary }}>&</div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-48 h-64 relative mb-6 p-2 bg-white shadow-lg border" style={{ borderColor: themeColors.primary }}>
                       <Image src={heroPhoto} alt="Groom" fill className="object-cover p-2" />
                    </div>
                    <h3 className={`text-4xl font-bold mb-2 ${greatVibes.className}`}>{invitation.groom_name}</h3>
                    <p className="text-sm font-sans uppercase tracking-widest text-gray-500">Putra dari</p>
                    <p className="font-bold mt-1 text-lg">{invitation.groom_parents}</p>
                  </div>
                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative bg-white/90 my-16 border-y border-gray-200 shadow-xl">
            <div className="max-w-5xl mx-auto relative z-10 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
                <h2 className={`text-5xl font-bold mb-6 ${greatVibes.className}`} style={{ color: themeColors.accent }}>Rangkaian Acara</h2>
                {/* SVG Divider */}
                <div className="w-32 h-6 mx-auto">
                   <svg viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 10L40 10" stroke={themeColors.primary} strokeWidth="2"/>
                      <circle cx="50" cy="10" r="6" fill={themeColors.accent}/>
                      <path d="M60 10L100 10" stroke={themeColors.primary} strokeWidth="2"/>
                   </svg>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-[var(--theme-background)] p-10 shadow-lg border relative">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: themeColors.primary }}></div>
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-[0.2em]" style={{ color: themeColors.accent }}>Akad Nikah</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="text-xl font-bold">{formatDate(invitation.akad_date)}</div>
                    <div className="text-md text-gray-600">{formatTime(invitation.akad_date)}</div>
                    <div className="pt-6 mt-6 border-t border-gray-300">
                      <div className="text-lg font-bold mb-2 uppercase">{invitation.akad_location}</div>
                      <div className="text-sm text-gray-600">{invitation.akad_address}</div>
                    </div>
                  </div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-90 w-full" style={{ backgroundColor: themeColors.accent }}>
                      <MapPin size={16} /> Buka Google Maps
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-[var(--theme-background)] p-10 shadow-lg border relative">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: themeColors.primary }}></div>
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-[0.2em]" style={{ color: themeColors.accent }}>Resepsi</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="text-xl font-bold">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="text-md text-gray-600">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="pt-6 mt-6 border-t border-gray-300">
                      <div className="text-lg font-bold mb-2 uppercase">{invitation.reception_location || invitation.akad_location}</div>
                      <div className="text-sm text-gray-600">{invitation.reception_address || invitation.akad_address}</div>
                    </div>
                  </div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-90 w-full" style={{ backgroundColor: themeColors.accent }}>
                      <MapPin size={16} /> Buka Google Maps
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
                <h2 className={`text-5xl font-bold mb-6 ${greatVibes.className}`} style={{ color: themeColors.accent }}>Galeri Bahagia</h2>
                <div className="w-32 h-6 mx-auto">
                   <svg viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 10L40 10" stroke={themeColors.primary} strokeWidth="2"/>
                      <circle cx="50" cy="10" r="6" fill={themeColors.accent}/>
                      <path d="M60 10L100 10" stroke={themeColors.primary} strokeWidth="2"/>
                   </svg>
                </div>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/50 border shadow-lg" style={{ borderColor: themeColors.primary }}>
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
                    className={`relative w-full overflow-hidden ${idx === 0 || idx === 3 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      fill 
                      className="object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6 bg-white/95 mt-16 shadow-2xl">
            <div className="max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                <h2 className={`text-5xl font-bold mb-6 ${greatVibes.className}`} style={{ color: themeColors.accent }}>RSVP & Ucapan</h2>
                <div className="w-32 h-6 mx-auto mb-6">
                   <svg viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 10L40 10" stroke={themeColors.primary} strokeWidth="2"/>
                      <circle cx="50" cy="10" r="6" fill={themeColors.accent}/>
                      <path d="M60 10L100 10" stroke={themeColors.primary} strokeWidth="2"/>
                   </svg>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                
                {/* RSVP Form */}
                <div className="bg-[var(--theme-background)] p-8 border border-amber-200/50 shadow-inner">
                  <h3 className="text-xl font-bold mb-8 uppercase tracking-[0.2em] text-center" style={{ color: themeColors.accent }}>Konfirmasi Kehadiran</h3>
                  
                  {rsvpSuccess ? (
                    <div className="p-6 text-center text-green-800 border-2 border-green-200 bg-green-50/50">
                      <CheckCircle2 size={32} className="mx-auto mb-4 text-green-600" />
                      <p className="font-bold">Terima kasih atas konfirmasi Anda.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          required
                          className="w-full p-4 border border-gray-300 outline-none focus:border-amber-700 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Kehadiran</label>
                        <select 
                          value={rsvpStatus}
                          onChange={(e) => setRsvpStatus(e.target.value as any)}
                          className="w-full p-4 border border-gray-300 outline-none focus:border-amber-700 bg-white"
                        >
                          <option value="hadir">Bersedia Hadir</option>
                          <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                        </select>
                      </div>

                      {rsvpStatus === "hadir" && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Jumlah Tamu</label>
                          <select 
                            value={rsvpCount}
                            onChange={(e) => setRsvpCount(Number(e.target.value))}
                            className="w-full p-4 border border-gray-300 outline-none focus:border-amber-700 bg-white"
                          >
                            <option value="1">1 Orang</option>
                            <option value="2">2 Orang</option>
                          </select>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={submittingRsvp}
                        className="w-full py-4 text-white font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity mt-4"
                        style={{ backgroundColor: themeColors.accent }}
                      >
                        {submittingRsvp ? "Mengirim..." : "Kirim Konfirmasi"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Wishes / Guestbook */}
                <div>
                  <h3 className="text-xl font-bold mb-8 uppercase tracking-[0.2em] text-center" style={{ color: themeColors.accent }}>Buku Tamu</h3>
                  
                  <form onSubmit={handleSendWish} className="mb-10 space-y-4">
                    <textarea 
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      required
                      rows={3}
                      className="w-full p-4 border border-gray-300 outline-none focus:border-amber-700 bg-white resize-none"
                      placeholder="Tuliskan doa restu untuk kedua mempelai..."
                    />
                    <button 
                      type="submit" 
                      disabled={sendingWish}
                      className="w-full py-4 text-white font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: themeColors.primary }}
                    >
                      {sendingWish ? "Mengirim..." : "Kirim Ucapan"}
                    </button>
                  </form>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {wishes.map((wish: any) => (
                      <div key={wish.id} className="p-6 bg-white border border-gray-200">
                        <div className="flex flex-col mb-3">
                          <span className="font-bold text-gray-800 uppercase tracking-widest text-sm">{wish.guest_name}</span>
                          <span className="text-xs text-gray-400 mt-1">{formatDate(wish.created_at)}</span>
                        </div>
                        <div className="text-gray-600 text-sm leading-relaxed italic">"{wish.message}"</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-16 text-center text-white relative bg-[var(--theme-text)] overflow-hidden">
             {/* Background Batik for Footer */}
             <div 
               className="absolute inset-0 opacity-10"
               style={{ backgroundImage: `url("${batikPatternSVG}")` }}
             ></div>
             <div className="relative z-10">
                <h2 className={`text-4xl mb-4 text-amber-200 ${greatVibes.className}`}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h2>
                <p className="text-xs text-gray-300 tracking-[0.3em] uppercase">Terima Kasih</p>
                {!isFreePlan && <p className="mt-8 text-[10px] text-gray-500 tracking-widest uppercase font-sans">Powered by NikahLink</p>}
             </div>
          </footer>

        </div>
      )}
    </div>
  );
}
