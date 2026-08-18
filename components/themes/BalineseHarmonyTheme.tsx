"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Volume2, VolumeX,
  Gift, Copy, CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

// Import Google Fonts
import { Cormorant_Garamond, Playfair_Display } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function BalineseHarmonyTheme({
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
    const supabase = createClient();
    const { data } = await supabase
      .from("wishes")
      .insert({
        invitation_id: invitation.id,
        guest_name: wishName.trim() || "Anonim",
        message: wishText.trim(),
        is_approved: true,
      })
      .select()
      .single();

    if (data) {
      setWishes([data, ...wishes]);
      setWishText("");
    }
    setSendingWish(false);
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRsvp(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("guests")
      .upsert({
        invitation_id: invitation.id,
        name: wishName.trim() || guestName || "Anonim",
        status: rsvpStatus,
        headcount: rsvpStatus === "hadir" ? rsvpCount : 0,
        notes: rsvpNotes.trim(),
      });
    
    if (!error) {
      setRsvpSuccess(true);
    }
    setSubmittingRsvp(false);
  };

  // Safe fallbacks for data
  const photos = invitation.photos || [];
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1543956690-333e387f3b60?q=80&w=2070&auto=format&fit=crop"; // Balinese generic
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
    background: "#F4F4F0",
    text: "#4B4642",       
    primary: "#D4AF37",    
    accent: "#8B7355"      
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
    }) + " WITA"; // Bali time
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } as any }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } as any }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-x-hidden ${cormorant.className}`}
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* Decorative Top Pattern (Simulated Balinese edge) */}
      <div 
        className="fixed top-0 left-0 w-full h-4 z-40 bg-[url('/img/balinese-border.png')] bg-repeat-x opacity-20"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm10 17L3 10l7-7 7 7-7 7z' fill='%23D4AF37' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
      ></div>

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden"
            style={{ backgroundColor: themeColors.background }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-full max-w-sm flex flex-col items-center text-center p-8 bg-white/50 backdrop-blur-sm shadow-xl rounded-t-full border-t-8 border-x-4 border-b-2"
              style={{ borderColor: themeColors.primary }}
            >
              <h3 className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-8 mt-12">Pawiwahan</h3>
              
              <div className="w-40 h-40 rounded-full overflow-hidden mb-8 relative border-4" style={{ borderColor: themeColors.primary }}>
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" priority />
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold text-center mb-6 ${playfair.className}`} style={{ color: themeColors.accent }}>
                {invitation.bride_nickname} <br/><span className="text-2xl font-normal text-gray-400">&</span><br/> {invitation.groom_nickname}
              </h1>
              
              <div className="w-16 h-px bg-gray-300 my-6"></div>
              
              <div className="py-2">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Pecalang & Tamu Kehormatan</p>
                <p className="text-xl font-medium" style={{ color: themeColors.text }}>{guestName}</p>
              </div>

              <button 
                onClick={handleOpenInvitation}
                className="mt-8 px-8 py-3 rounded-full text-sm uppercase tracking-widest transition-all shadow-md text-white font-medium hover:opacity-90"
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
        <div className="relative z-10">
          
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
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center p-6 text-center">
            {/* Background Texture image */}
            <div className="absolute inset-0 z-0 opacity-10">
               <Image src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=2000&auto=format&fit=crop" alt="Bali Pattern" fill className="object-cover" />
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-sm p-10 shadow-2xl rounded-tr-[100px] rounded-bl-[100px] border" style={{ borderColor: `${themeColors.primary}50` }}>
              <div className="w-16 h-16 mx-auto mb-6 opacity-60">
                 {/* Om Swastiastu SVG Icon Placeholder */}
                 <svg viewBox="0 0 24 24" fill="none" stroke={themeColors.accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <p className="tracking-[0.3em] uppercase text-sm mb-6 font-medium" style={{ color: themeColors.accent }}>Om Swastyastu</p>
              <h1 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${playfair.className}`}>
                {invitation.bride_nickname} <span className="text-3xl font-light text-gray-400 mx-2">&</span> {invitation.groom_nickname}
              </h1>
              <p className="text-lg tracking-widest text-gray-600 mb-8 font-medium">
                {new Date(weddingDateStr).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-24 px-6 text-center relative">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-2xl mx-auto">
                <p className="text-2xl md:text-3xl italic leading-relaxed" style={{ color: themeColors.accent }}>
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className={`text-4xl font-bold mb-4 ${playfair.className}`} style={{ color: themeColors.accent }}>Sang Pengantin</h2>
                  <div className="w-24 h-1 mx-auto" style={{ backgroundColor: themeColors.primary }}></div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  
                  {/* Bride */}
                  <div className="flex-1 text-center md:text-right">
                    <div className="w-32 h-32 md:hidden mx-auto rounded-full overflow-hidden mb-6 border-4 shadow-lg" style={{ borderColor: themeColors.primary }}>
                       <Image src={heroPhoto} alt="Bride" fill className="object-cover" />
                    </div>
                    <h3 className={`text-3xl font-bold mb-4 ${playfair.className}`}>{invitation.bride_name}</h3>
                    <p className="text-sm text-gray-500 mb-2 font-sans uppercase tracking-widest">Putri dari</p>
                    <p className="text-lg font-medium">{invitation.bride_parents}</p>
                  </div>

                  {/* Center Ornament */}
                  <div className="hidden md:flex flex-col items-center justify-center w-48 h-64 rounded-full overflow-hidden border-8 shadow-2xl relative" style={{ borderColor: themeColors.primary }}>
                     <Image src={heroPhoto} alt="Couple" fill className="object-cover" />
                  </div>

                  {/* Groom */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="w-32 h-32 md:hidden mx-auto rounded-full overflow-hidden mb-6 border-4 shadow-lg" style={{ borderColor: themeColors.primary }}>
                       <Image src={heroPhoto} alt="Groom" fill className="object-cover" />
                    </div>
                    <h3 className={`text-3xl font-bold mb-4 ${playfair.className}`}>{invitation.groom_name}</h3>
                    <p className="text-sm text-gray-500 mb-2 font-sans uppercase tracking-widest">Putra dari</p>
                    <p className="text-lg font-medium">{invitation.groom_parents}</p>
                  </div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative bg-white/60">
            <div className="max-w-5xl mx-auto relative z-10 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-16">
                <h2 className={`text-4xl font-bold mb-4 ${playfair.className}`} style={{ color: themeColors.accent }}>Dudonan Karya</h2>
                <div className="w-24 h-1 mx-auto" style={{ backgroundColor: themeColors.primary }}></div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Akad / Pawiwahan */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white p-10 rounded-2xl shadow-xl border-t-8" style={{ borderColor: themeColors.primary }}>
                  <h3 className={`text-3xl font-bold mb-6 ${playfair.className}`}>Pawiwahan</h3>
                  
                  <div className="space-y-4 font-sans mb-8">
                    <div className="text-lg font-medium text-gray-800">{formatDate(invitation.akad_date)}</div>
                    <div className="text-md text-gray-600">{formatTime(invitation.akad_date)}</div>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <div className="text-lg font-bold mb-2">{invitation.akad_location}</div>
                      <div className="text-sm text-gray-500">{invitation.akad_address}</div>
                    </div>
                  </div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 w-full" style={{ backgroundColor: themeColors.accent }}>
                      <MapPin size={16} /> Lihat Peta Lokasi
                    </a>
                  )}
                </motion.div>

                {/* Reception / Resepsi */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="bg-white p-10 rounded-2xl shadow-xl border-t-8" style={{ borderColor: themeColors.primary }}>
                  <h3 className={`text-3xl font-bold mb-6 ${playfair.className}`}>Resepsi</h3>
                  
                  <div className="space-y-4 font-sans mb-8">
                    <div className="text-lg font-medium text-gray-800">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="text-md text-gray-600">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <div className="text-lg font-bold mb-2">{invitation.reception_location || invitation.akad_location}</div>
                      <div className="text-sm text-gray-500">{invitation.reception_address || invitation.akad_address}</div>
                    </div>
                  </div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium text-sm transition-opacity hover:opacity-90 w-full" style={{ backgroundColor: themeColors.accent }}>
                      <MapPin size={16} /> Lihat Peta Lokasi
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-4 max-w-6xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                <h2 className={`text-4xl font-bold mb-4 ${playfair.className}`} style={{ color: themeColors.accent }}>Galeri Memori</h2>
                <div className="w-24 h-1 mx-auto" style={{ backgroundColor: themeColors.primary }}></div>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
                    className={`relative w-full overflow-hidden rounded-xl shadow-md ${idx === 0 || idx === 3 ? "col-span-2 row-span-2 aspect-square" : "aspect-[3/4]"}`}
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
          <section className="py-24 px-6 bg-white/80">
            <div className="max-w-4xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-16">
                <h2 className={`text-4xl font-bold mb-4 ${playfair.className}`} style={{ color: themeColors.accent }}>Kehadiran & Ucapan</h2>
                <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: themeColors.primary }}></div>
                <p className="text-gray-600 font-sans">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.</p>
              </motion.div>

              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 font-sans border" style={{ borderColor: `${themeColors.primary}30` }}>
                
                {/* RSVP Form */}
                <div className="mb-16 border-b border-gray-100 pb-16">
                  <h3 className={`text-2xl font-bold mb-8 ${playfair.className}`} style={{ color: themeColors.accent }}>Konfirmasi Kehadiran</h3>
                  
                  {rsvpSuccess ? (
                    <div className="p-6 rounded-xl text-center bg-green-50 text-green-800 border border-green-200">
                      <CheckCircle2 size={32} className="mx-auto mb-2 text-green-600" />
                      <p className="font-medium">Terima kasih atas konfirmasi Anda.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <input 
                          type="text" 
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          required
                          className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 bg-gray-50"
                          style={{ "--tw-ring-color": themeColors.primary } as React.CSSProperties}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Kehadiran</label>
                          <select 
                            value={rsvpStatus}
                            onChange={(e) => setRsvpStatus(e.target.value as any)}
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 bg-gray-50"
                            style={{ "--tw-ring-color": themeColors.primary } as React.CSSProperties}
                          >
                            <option value="hadir">Hadir</option>
                            <option value="tidak_hadir">Tidak Hadir</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Tamu</label>
                          <select 
                            value={rsvpCount}
                            onChange={(e) => setRsvpCount(Number(e.target.value))}
                            disabled={rsvpStatus === "tidak_hadir"}
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 bg-gray-50 disabled:opacity-50"
                            style={{ "--tw-ring-color": themeColors.primary } as React.CSSProperties}
                          >
                            <option value="1">1 Orang</option>
                            <option value="2">2 Orang</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={submittingRsvp}
                        className="w-full py-4 rounded-xl text-white font-medium hover:opacity-90 transition-opacity mt-4 shadow-lg"
                        style={{ backgroundColor: themeColors.accent }}
                      >
                        {submittingRsvp ? "Menyimpan..." : "Kirim Konfirmasi RSVP"}
                      </button>
                    </form>
                  )}
                </div>

                {/* Wishes / Guestbook */}
                <div>
                  <h3 className={`text-2xl font-bold mb-8 ${playfair.className}`} style={{ color: themeColors.accent }}>Buku Tamu</h3>
                  
                  <form onSubmit={handleSendWish} className="mb-10 space-y-4">
                    <textarea 
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      required
                      rows={3}
                      className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 bg-gray-50 resize-none"
                      style={{ "--tw-ring-color": themeColors.primary } as React.CSSProperties}
                      placeholder="Tuliskan doa dan harapan untuk pengantin..."
                    />
                    <button 
                      type="submit" 
                      disabled={sendingWish}
                      className="px-8 py-3 rounded-full text-white font-medium text-sm transition-colors shadow-md"
                      style={{ backgroundColor: themeColors.accent }}
                    >
                      {sendingWish ? "Mengirim..." : "Kirim Ucapan"}
                    </button>
                  </form>

                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {wishes.map((wish: any) => (
                      <div key={wish.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative">
                        <div className="absolute -left-2 -top-2 text-6xl opacity-10" style={{ color: themeColors.primary, fontFamily: "serif" }}>"</div>
                        <div className="flex flex-col mb-3">
                          <span className="font-bold text-gray-800">{wish.guest_name}</span>
                          <span className="text-xs text-gray-400">{formatDate(wish.created_at)}</span>
                        </div>
                        <div className="text-gray-600 text-sm leading-relaxed relative z-10">{wish.message}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* DIGITAL WALLET / GIFT */}
          {invitation.show_gifts && giftAccounts.length > 0 && (
            <section className="py-24 px-6 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border" style={{ borderColor: `${themeColors.primary}40` }}>
                <Gift size={40} className="mx-auto mb-6" style={{ color: themeColors.accent }} />
                <h2 className={`text-3xl font-bold mb-4 ${playfair.className}`} style={{ color: themeColors.accent }}>Tanda Kasih</h2>
                <p className="text-gray-600 font-sans mb-10">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara less cash.</p>
                
                <div className="space-y-6 font-sans">
                  {giftAccounts.map((account: any) => (
                    <div key={account.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <div className="text-sm font-bold text-gray-500 mb-1">{account.bank_name}</div>
                      <div className="text-2xl font-bold tracking-widest text-gray-800 mb-1">{account.account_number}</div>
                      <div className="text-md text-gray-600 mb-4">a.n. {account.account_name}</div>
                      
                      <button 
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors text-white"
                        style={{ backgroundColor: copiedBank === account.id ? "#10B981" : themeColors.accent }}
                      >
                        {copiedBank === account.id ? <><CheckCircle2 size={16}/> Tersalin</> : <><Copy size={16}/> Salin No. Rekening</>}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="py-16 text-center bg-[#4B4642] text-white">
            <h2 className={`text-3xl mb-4 ${playfair.className}`}>
              {invitation.bride_nickname} & {invitation.groom_nickname}
            </h2>
            <p className="text-sm text-gray-400 font-sans tracking-widest uppercase">Om Shanti Shanti Shanti Om</p>
            {!isFreePlan && <p className="mt-8 text-xs text-gray-500 tracking-widest uppercase">Powered by NikahLink</p>}
          </footer>

        </div>
      )}
    </div>
  );
}
