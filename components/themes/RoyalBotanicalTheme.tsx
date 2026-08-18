"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, MapPin, Volume2, VolumeX,
  Copy, Check, Send, CheckCircle2,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function RoyalBotanicalTheme({
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
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop";
  const galleryPhotos = photos.slice(1);
  const themeColors = invitation.theme_colors || {
    background: "#064E3B", // deep green
    text: "#F3F4F6", // light gray
    primary: "#D4AF37", // gold
    accent: "#FCD34D" // lighter gold
  };

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

  // Staggered Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div 
      className="min-h-screen font-playfair relative selection:bg-white/20 overflow-x-hidden"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Botanical Overlay - A subtle texture or noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay z-0"></div>

      {invitation.music_url && (
        <audio ref={audioRef} src={invitation.music_url} loop />
      )}

      {/* Floating Particles Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30 blur-[1px]"
            style={{ 
              backgroundColor: themeColors.primary,
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%"
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), ${themeColors.background}), url(${heroPhoto})`
            }}
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center"
            >
              <motion.div variants={itemVariants} className="mb-4">
                <Sparkles className="w-8 h-8 mx-auto" style={{ color: themeColors.primary }} />
              </motion.div>
              
              <motion.p variants={itemVariants} className="tracking-[0.3em] uppercase text-xs font-semibold font-jakarta mb-6" style={{ color: themeColors.primary }}>
                The Wedding Of
              </motion.p>
              
              <motion.h1 variants={itemVariants} className="font-playfair font-bold text-5xl md:text-6xl mb-4 text-white">
                {invitation.bride_nickname} <br/> <span className="font-great-vibes font-normal lowercase italic text-4xl" style={{ color: themeColors.primary }}>&</span> <br/> {invitation.groom_nickname}
              </motion.h1>
              
              <motion.div variants={itemVariants} className="w-px h-16 my-6" style={{ backgroundColor: themeColors.primary }}></motion.div>
              
              <motion.div variants={itemVariants} className="mb-10 text-white">
                <p className="text-sm italic font-cormorant mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="text-2xl font-bold font-playfair tracking-wide">{guestName}</p>
              </motion.div>

              <motion.button 
                variants={itemVariants}
                onClick={handleOpenInvitation}
                className="px-10 py-4 font-jakarta rounded-sm text-sm uppercase transition-all hover:bg-white hover:text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-3 mx-auto font-bold tracking-[0.2em]"
                style={{ backgroundColor: themeColors.primary, color: themeColors.background }}
              >
                Buka Undangan
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {isOpen && (
        <div className="relative z-10">
          
          {/* Floating Audio Button */}
          {invitation.music_url && (
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
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full max-w-lg mx-auto flex flex-col items-center">
              <motion.div variants={itemVariants} className="mb-8">
                <div className="w-48 h-64 md:w-56 md:h-72 overflow-hidden rounded-t-[100px] rounded-b-[100px] border-4 p-1 shadow-2xl" style={{ borderColor: themeColors.primary }}>
                  <div className="w-full h-full rounded-t-[96px] rounded-b-[96px] overflow-hidden relative">
                     <Image src={heroPhoto} alt="Hero" fill className="object-cover" priority />
                  </div>
                </div>
              </motion.div>

              <motion.p variants={itemVariants} className="tracking-[0.3em] uppercase text-xs font-semibold font-jakarta mb-4" style={{ color: themeColors.primary }}>
                Pernikahan
              </motion.p>
              
              <motion.h1 variants={itemVariants} className="font-playfair font-bold text-5xl md:text-7xl mb-6 leading-tight">
                {invitation.bride_nickname} <span className="text-4xl md:text-5xl italic font-normal font-great-vibes" style={{ color: themeColors.primary }}>&</span> {invitation.groom_nickname}
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-xl md:text-2xl font-cormorant italic tracking-wide">
                {formatDate(weddingDateStr)}
              </motion.p>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-24 px-6 text-center bg-black/20">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={itemVariants} className="max-w-3xl mx-auto">
                <div className="mb-8 flex justify-center">
                  <Sparkles className="w-8 h-8" style={{ color: themeColors.primary }} />
                </div>
                <p className="text-2xl md:text-3xl font-cormorant italic leading-relaxed mb-6">
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative overflow-hidden">
             <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="max-w-5xl mx-auto text-center">
                <motion.h2 variants={itemVariants} className="font-playfair font-bold text-4xl md:text-5xl mb-16 uppercase tracking-wider" style={{ color: themeColors.primary }}>Mempelai</motion.h2>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-12">
                  
                  {/* Bride */}
                  <motion.div variants={itemVariants} className="flex-1 flex flex-col items-center">
                    <h3 className="font-great-vibes text-6xl mb-6">{invitation.bride_name}</h3>
                    <div className="w-12 h-px mb-6" style={{ backgroundColor: themeColors.primary }}></div>
                    <p className="text-xs tracking-[0.2em] uppercase font-jakarta mb-3">Putri Dari</p>
                    <p className="font-cormorant text-xl opacity-80">{invitation.bride_parents}</p>
                  </motion.div>

                  {/* AND */}
                  <motion.div variants={itemVariants} className="w-12 h-12 flex items-center justify-center rounded-sm rotate-45 border" style={{ borderColor: themeColors.primary }}>
                    <span className="-rotate-45 font-great-vibes text-3xl" style={{ color: themeColors.primary }}>&</span>
                  </motion.div>

                  {/* Groom */}
                  <motion.div variants={itemVariants} className="flex-1 flex flex-col items-center">
                    <h3 className="font-great-vibes text-6xl mb-6">{invitation.groom_name}</h3>
                    <div className="w-12 h-px mb-6" style={{ backgroundColor: themeColors.primary }}></div>
                    <p className="text-xs tracking-[0.2em] uppercase font-jakarta mb-3">Putra Dari</p>
                    <p className="font-cormorant text-xl opacity-80">{invitation.groom_parents}</p>
                  </motion.div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-32 px-6 relative bg-black/40 border-y border-white/5 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="text-center mb-20">
                <h2 className="font-playfair font-bold text-4xl md:text-5xl mb-6 uppercase tracking-widest" style={{ color: themeColors.primary }}>Akad & Resepsi</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16 md:gap-8">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="border p-10 flex flex-col items-center text-center relative bg-black/20" style={{ borderColor: themeColors.primary + "40" }}>
                  <div className="absolute -top-4 bg-inherit px-4 text-2xl font-great-vibes" style={{ color: themeColors.primary, backgroundColor: themeColors.background }}>Akad Nikah</div>
                  
                  <div className="text-3xl font-playfair mb-4 mt-4">{formatDate(invitation.akad_date)}</div>
                  <div className="mb-10 font-jakarta text-sm tracking-widest uppercase opacity-70">{formatTime(invitation.akad_date)}</div>
                  
                  <div className="font-bold text-xl mb-4 font-playfair">{invitation.akad_location}</div>
                  <div className="opacity-70 font-cormorant text-lg mb-10 leading-relaxed max-w-[280px]">{invitation.akad_address}</div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-8 py-3 bg-transparent border transition-all hover:bg-white hover:text-black tracking-[0.2em] text-xs font-bold uppercase font-jakarta" style={{ borderColor: themeColors.primary }}>
                      Buka Peta Lokasi
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="border p-10 flex flex-col items-center text-center relative bg-black/20" style={{ borderColor: themeColors.primary + "40" }}>
                  <div className="absolute -top-4 bg-inherit px-4 text-2xl font-great-vibes" style={{ color: themeColors.primary, backgroundColor: themeColors.background }}>Resepsi</div>
                  
                  <div className="text-3xl font-playfair mb-4 mt-4">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="mb-10 font-jakarta text-sm tracking-widest uppercase opacity-70">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                  
                  <div className="font-bold text-xl mb-4 font-playfair">{invitation.reception_location || invitation.akad_location}</div>
                  <div className="opacity-70 font-cormorant text-lg mb-10 leading-relaxed max-w-[280px]">{invitation.reception_address || invitation.akad_address}</div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-8 py-3 bg-transparent border transition-all hover:bg-white hover:text-black tracking-[0.2em] text-xs font-bold uppercase font-jakarta" style={{ borderColor: themeColors.primary }}>
                      Buka Peta Lokasi
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-32 px-6 max-w-6xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="text-center mb-16">
                <h2 className="font-playfair font-bold text-4xl md:text-5xl uppercase tracking-widest mb-4" style={{ color: themeColors.primary }}>Galeri Momen</h2>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1, duration: 0.8 }}
                    className={`relative overflow-hidden group cursor-pointer aspect-[3/4] ${idx === 0 ? "col-span-2 row-span-2 aspect-auto" : ""}`}
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6 border-t border-white/10 relative">
             <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
                {/* RSVP */}
                {invitation.show_rsvp && (
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                    <h2 className="font-playfair font-bold text-3xl mb-8 uppercase tracking-widest" style={{ color: themeColors.primary }}>Kehadiran</h2>
                    
                    {rsvpSuccess ? (
                      <div className="p-10 border border-white/10 text-center bg-black/20">
                        <CheckCircle2 className="w-16 h-16 mx-auto mb-6" style={{ color: themeColors.primary }} />
                        <h3 className="font-playfair text-3xl mb-4">Terima Kasih!</h3>
                        <p className="opacity-70 font-cormorant text-xl">Konfirmasi kehadiran Anda telah kami terima dengan penuh syukur.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRsvpSubmit} className="space-y-8">
                        <div>
                          <label className="block text-xs font-jakarta tracking-[0.2em] uppercase mb-4 opacity-70">Status Kehadiran</label>
                          <div className="flex gap-4">
                            <label className={`flex-1 border p-4 text-center cursor-pointer transition-colors font-cormorant text-lg ${rsvpStatus === "hadir" ? "bg-white/10 border-white/50" : "border-white/10 hover:bg-white/5"}`}>
                              <input type="radio" name="status" value="hadir" checked={rsvpStatus === "hadir"} onChange={() => setRsvpStatus("hadir")} className="hidden" />
                              <span>Hadir</span>
                            </label>
                            <label className={`flex-1 border p-4 text-center cursor-pointer transition-colors font-cormorant text-lg ${rsvpStatus === "tidak_hadir" ? "bg-white/10 border-white/50" : "border-white/10 hover:bg-white/5"}`}>
                              <input type="radio" name="status" value="tidak_hadir" checked={rsvpStatus === "tidak_hadir"} onChange={() => setRsvpStatus("tidak_hadir")} className="hidden" />
                              <span>Tidak Hadir</span>
                            </label>
                          </div>
                        </div>

                        {rsvpStatus === "hadir" && (
                          <div>
                            <label className="block text-xs font-jakarta tracking-[0.2em] uppercase mb-4 opacity-70">Jumlah Orang</label>
                            <select value={rsvpCount} onChange={(e) => setRsvpCount(Number(e.target.value))} className="w-full border-b border-white/20 py-3 bg-transparent focus:outline-none focus:border-white transition-colors font-cormorant text-xl" required>
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-slate-900">{n} Orang</option>)}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-jakarta tracking-[0.2em] uppercase mb-4 opacity-70">Pesan Tambahan (Opsional)</label>
                          <textarea value={rsvpNotes} onChange={(e) => setRsvpNotes(e.target.value)} rows={3} className="w-full border border-white/20 p-4 bg-black/20 focus:outline-none focus:border-white transition-colors font-cormorant text-lg" placeholder="Tuliskan catatan..."></textarea>
                        </div>

                        <button type="submit" disabled={submittingRsvp} className="w-full py-4 text-background tracking-[0.2em] text-xs font-bold uppercase font-jakarta transition-opacity hover:opacity-90" style={{ backgroundColor: themeColors.primary }}>
                          {submittingRsvp ? "Memproses..." : "Kirim Konfirmasi"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* WISHES */}
                {invitation.show_wishes && (
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                    <h2 className="font-playfair font-bold text-3xl mb-8 uppercase tracking-widest" style={{ color: themeColors.primary }}>Ucapan</h2>
                    
                    <form onSubmit={handleSendWish} className="mb-10 space-y-6">
                       <input type="text" value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder="Nama Anda" required className="w-full border-b border-white/20 py-3 bg-transparent focus:outline-none focus:border-white transition-colors font-cormorant text-xl" />
                       <textarea value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder="Tuliskan doa untuk kedua mempelai..." required rows={3} className="w-full border border-white/20 p-4 bg-black/20 focus:outline-none focus:border-white transition-colors font-cormorant text-lg"></textarea>
                       <button type="submit" disabled={sendingWish} className="px-8 py-3 border border-white/20 hover:bg-white/10 text-xs tracking-[0.2em] font-bold uppercase font-jakarta transition-colors flex items-center justify-center gap-3 w-full">
                         <Send size={14} /> {sendingWish ? "Mengirim..." : "Kirim Ucapan"}
                       </button>
                    </form>

                    <div className="h-[400px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                      {wishes.length > 0 ? (
                        wishes.map((w: any, idx) => (
                          <div key={idx} className="p-6 bg-black/20 border border-white/10 relative">
                            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: themeColors.primary }}></div>
                            <h4 className="font-bold font-playfair text-lg mb-2">{w.guest_name}</h4>
                            <p className="font-cormorant text-lg opacity-80 leading-relaxed">"{w.message}"</p>
                            <span className="text-[10px] font-jakarta opacity-50 uppercase tracking-[0.2em] mt-4 block">
                              {new Date(w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center opacity-50 font-cormorant text-xl italic">Jadilah yang pertama memberikan ucapan.</p>
                      )}
                    </div>
                  </motion.div>
                )}
             </div>
          </section>

          {/* GIFT */}
          {invitation.show_gift && giftAccounts.length > 0 && (
            <section className="py-32 px-6 text-center border-t border-white/10 bg-black/20">
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants} className="max-w-2xl mx-auto">
                  <h2 className="font-playfair font-bold text-4xl mb-6 uppercase tracking-widest" style={{ color: themeColors.primary }}>Wedding Gift</h2>
                  <p className="mb-16 font-cormorant text-xl opacity-80 leading-relaxed">Kehadiran dan doa restu Anda adalah anugerah terindah bagi kami. Namun, apabila Anda bermaksud memberikan tanda kasih, Anda dapat melalui fitur di bawah ini.</p>
                  
                  <div className="flex flex-col gap-8 items-center">
                    {giftAccounts.map((account, idx) => (
                      <div key={idx} className="w-full max-w-sm p-8 border border-white/20 bg-black/40 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: themeColors.primary }}></div>
                        <h3 className="font-bold tracking-[0.2em] uppercase font-jakarta text-sm mb-2 text-white">{account.bank_name}</h3>
                        <p className="opacity-70 font-cormorant text-lg mb-6">a/n {account.account_name}</p>
                        <div className="text-3xl font-playfair tracking-widest mb-8 text-white">{account.account_number}</div>
                        <button 
                          onClick={() => handleCopy(account.account_number, account.id)}
                          className="px-6 py-3 border text-xs tracking-[0.2em] font-bold uppercase font-jakarta transition-colors flex items-center justify-center gap-3 mx-auto w-full"
                          style={{ borderColor: themeColors.primary, color: themeColors.primary }}
                        >
                          {copiedBank === account.id ? <><Check size={14} /> Berhasil Disalin</> : <><Copy size={14} /> Salin Nomor Rekening</>}
                        </button>
                      </div>
                    ))}
                  </div>
               </motion.div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="py-20 px-6 text-center relative border-t border-white/10">
            <div className="max-w-md mx-auto">
              <h2 className="font-playfair font-bold text-3xl mb-4 uppercase tracking-widest" style={{ color: themeColors.primary }}>{invitation.bride_nickname} & {invitation.groom_nickname}</h2>
              <p className="opacity-70 font-cormorant text-lg mb-12">Atas doa & restunya, kami ucapkan terima kasih.</p>
              
              <div className="text-[10px] tracking-[0.3em] font-jakarta uppercase opacity-40 flex items-center justify-center gap-2">
                Designed by <span className="text-white font-bold">NikahLink</span>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Global custom scrollbar style */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      `}} />
    </div>
  );
}
