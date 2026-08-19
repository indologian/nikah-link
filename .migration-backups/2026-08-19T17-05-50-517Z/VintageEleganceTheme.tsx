"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Calendar, MapPin, Music, Volume2, VolumeX,
  Gift, Copy, Check, MessageSquare, Send, Clock, CheckCircle2
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

export default function VintageEleganceTheme({
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
    background: "#F9F6F0",
    text: "#4A4036",
    primary: "#8B7355",
    accent: "#C1A57B"
  };

  const musicUrl = invitation.music_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const zoomIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } }
  };

  return (
    <div 
      className="min-h-screen font-cormorant relative selection:bg-black/10 overflow-x-hidden"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Background Texture/Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply z-0"></div>

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
            {/* Decorative Arch Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <svg viewBox="0 0 400 600" className="w-full max-w-lg h-auto" style={{ fill: "none", stroke: themeColors.primary, strokeWidth: 1 }}>
                <path d="M50 600 V 250 A 150 150 0 0 1 350 250 V 600" />
                <path d="M70 600 V 250 A 130 130 0 0 1 330 250 V 600" />
              </svg>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center"
            >
              {/* Image in Arch Frame */}
              <div className="w-64 h-80 overflow-hidden rounded-t-full mb-8 relative shadow-xl border-4 border-white/50">
                <Image src={heroPhoto} alt="Cover" fill className="object-cover" />
              </div>
              
              <div className="space-y-4">
                <p className="tracking-widest uppercase text-xs font-semibold" style={{ color: themeColors.primary }}>The Wedding Of</p>
                <h1 className="font-great-vibes text-5xl md:text-6xl mb-2" style={{ color: themeColors.text }}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h1>
                
                <div className="py-6 border-y border-dashed border-black/20 my-6">
                  <p className="text-sm italic mb-2">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                  <p className="text-xl font-bold font-playfair">{guestName}</p>
                </div>

                <button 
                  onClick={handleOpenInvitation}
                  className="px-8 py-3 rounded-full text-white tracking-widest text-sm uppercase transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Buka Undangan
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
              style={{ backgroundColor: themeColors.accent }}
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center p-6 pt-20">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full max-w-lg mx-auto flex flex-col items-center">
              <p className="tracking-[0.2em] uppercase text-sm mb-6 font-semibold" style={{ color: themeColors.primary }}>Pernikahan</p>
              
              <div className="w-72 h-[400px] md:h-[480px] overflow-hidden rounded-t-full mb-10 relative shadow-2xl mx-auto ring-8 ring-white/30">
                <Image src={heroPhoto} alt="Hero" fill className="object-cover" priority />
              </div>

              <h1 className="font-great-vibes text-6xl md:text-7xl mb-4 leading-tight">
                {invitation.bride_nickname} & {invitation.groom_nickname}
              </h1>
              
              <div className="w-px h-16 bg-black/20 mx-auto my-6"></div>
              
              <p className="text-lg md:text-xl font-playfair italic">
                {formatDate(weddingDateStr)}
              </p>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-20 px-6 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={zoomIn} className="max-w-2xl mx-auto">
                <div className="mb-6 flex justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ stroke: themeColors.accent }}>
                    <path d="M10 11H6V7H10V11ZM10 11C10 14.3137 7.31371 17 4 17V15C6.20914 15 8 13.2091 8 11M20 11H16V7H20V11ZM20 11C20 14.3137 17.3137 17 14 17V15C16.2091 15 18 13.2091 18 11" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-xl md:text-2xl font-playfair italic leading-relaxed mb-6" style={{ color: themeColors.primary }}>
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
             
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="max-w-4xl mx-auto text-center">
                <p className="tracking-widest uppercase text-sm font-semibold mb-16" style={{ color: themeColors.primary }}>Mempelai</p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-8">
                  
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <h2 className="font-great-vibes text-5xl mb-4">{invitation.bride_name}</h2>
                    <p className="text-sm tracking-wider uppercase mb-2">Putri Dari</p>
                    <p className="font-playfair italic text-lg">{invitation.bride_parents}</p>
                  </div>

                  {/* AND */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full border border-dashed border-black/30 text-2xl font-great-vibes" style={{ color: themeColors.accent }}>
                    &
                  </div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <h2 className="font-great-vibes text-5xl mb-4">{invitation.groom_name}</h2>
                    <p className="text-sm tracking-wider uppercase mb-2">Putra Dari</p>
                    <p className="font-playfair italic text-lg">{invitation.groom_parents}</p>
                  </div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative" style={{ backgroundColor: themeColors.primary }}>
            {/* Inverted colors for this section */}
            <div className="max-w-4xl mx-auto text-white">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <h2 className="font-great-vibes text-5xl md:text-6xl mb-6">Waktu & Tempat</h2>
                <div className="w-24 h-px bg-white/30 mx-auto"></div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="border border-white/20 p-8 rounded-t-[100px] flex flex-col items-center text-center relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
                  <h3 className="tracking-[0.2em] uppercase text-sm mb-6 font-semibold">Akad Nikah</h3>
                  <div className="text-3xl font-playfair mb-2">{formatDate(invitation.akad_date)}</div>
                  <div className="mb-8 opacity-80">{formatTime(invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.akad_location}</div>
                  <div className="opacity-80 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.akad_address}</div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors rounded-full tracking-widest text-xs uppercase flex items-center gap-2">
                      <MapPin size={14} /> Lihat Lokasi
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="border border-white/20 p-8 rounded-t-[100px] flex flex-col items-center text-center relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
                  <h3 className="tracking-[0.2em] uppercase text-sm mb-6 font-semibold">Resepsi</h3>
                  <div className="text-3xl font-playfair mb-2">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="mb-8 opacity-80">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.reception_location || invitation.akad_location}</div>
                  <div className="opacity-80 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.reception_address || invitation.akad_address}</div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors rounded-full tracking-widest text-xs uppercase flex items-center gap-2">
                      <MapPin size={14} /> Lihat Lokasi
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Countdown */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={zoomIn} className="mt-20 border-y border-white/20 py-12 flex justify-center gap-4 md:gap-12">
                {[
                  { label: "Hari", value: timeLeft.days },
                  { label: "Jam", value: timeLeft.hours },
                  { label: "Menit", value: timeLeft.minutes },
                  { label: "Detik", value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-playfair mb-2">{item.value}</span>
                    <span className="text-xs tracking-widest uppercase opacity-70">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-6 max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <p className="tracking-widest uppercase text-sm font-semibold mb-4" style={{ color: themeColors.primary }}>Momen</p>
                <h2 className="font-great-vibes text-5xl md:text-6xl mb-6">Galeri Bahagia</h2>
              </motion.div>
              
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                    className="break-inside-avoid relative overflow-hidden rounded-t-[50px] rounded-b-md shadow-md group cursor-pointer"
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      width={600} 
                      height={800} 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6 border-t border-black/10 relative overflow-hidden">
             <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 relative z-10">
                {/* RSVP */}
                {invitation.show_rsvp && (
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="font-great-vibes text-5xl mb-8">Konfirmasi Kehadiran</h2>
                    
                    {rsvpSuccess ? (
                      <div className="p-8 border border-black/10 text-center rounded-lg bg-white/50 backdrop-blur-sm">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: themeColors.primary }} />
                        <h3 className="font-playfair text-2xl mb-2">Terima Kasih!</h3>
                        <p className="opacity-80">Konfirmasi kehadiran Anda telah kami terima.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRsvpSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold tracking-wide uppercase mb-2">Status Kehadiran</label>
                          <div className="flex gap-4">
                            <label className="flex-1 border border-black/20 p-3 text-center rounded cursor-pointer hover:bg-black/5 transition-colors">
                              <input type="radio" name="status" value="hadir" checked={rsvpStatus === "hadir"} onChange={() => setRsvpStatus("hadir")} className="hidden" />
                              <span className={rsvpStatus === "hadir" ? "font-bold" : ""}>Hadir</span>
                            </label>
                            <label className="flex-1 border border-black/20 p-3 text-center rounded cursor-pointer hover:bg-black/5 transition-colors">
                              <input type="radio" name="status" value="tidak_hadir" checked={rsvpStatus === "tidak_hadir"} onChange={() => setRsvpStatus("tidak_hadir")} className="hidden" />
                              <span className={rsvpStatus === "tidak_hadir" ? "font-bold" : ""}>Tidak Hadir</span>
                            </label>
                          </div>
                        </div>

                        {rsvpStatus === "hadir" && (
                          <div>
                            <label className="block text-sm font-semibold tracking-wide uppercase mb-2">Jumlah Orang</label>
                            <select value={rsvpCount} onChange={(e) => setRsvpCount(Number(e.target.value))} className="w-full border-b border-black/20 p-2 bg-transparent focus:outline-none focus:border-black transition-colors" required>
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Orang</option>)}
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold tracking-wide uppercase mb-2">Catatan Tambahan (Opsional)</label>
                          <textarea value={rsvpNotes} onChange={(e) => setRsvpNotes(e.target.value)} rows={3} className="w-full border border-black/20 p-3 rounded bg-transparent focus:outline-none focus:border-black transition-colors" placeholder="Tuliskan ucapan atau catatan..."></textarea>
                        </div>

                        <button type="submit" disabled={submittingRsvp} className="w-full py-3 rounded text-white tracking-widest text-sm uppercase transition-colors" style={{ backgroundColor: themeColors.primary }}>
                          {submittingRsvp ? "Mengirim..." : "Kirim Konfirmasi"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* WISHES */}
                {invitation.show_wishes && (
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                    <h2 className="font-great-vibes text-5xl mb-8">Pesan & Doa</h2>
                    
                    <form onSubmit={handleSendWish} className="mb-8 space-y-4">
                       <input type="text" value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder="Nama Anda" required className="w-full border-b border-black/20 p-2 bg-transparent focus:outline-none focus:border-black transition-colors" />
                       <textarea value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder="Berikan doa & ucapan untuk pengantin..." required rows={3} className="w-full border border-black/20 p-3 rounded bg-transparent focus:outline-none focus:border-black transition-colors"></textarea>
                       <button type="submit" disabled={sendingWish} className="px-6 py-2 border border-black/20 hover:bg-black/5 rounded text-sm tracking-widest uppercase transition-colors flex items-center gap-2">
                         <Send size={14} /> {sendingWish ? "Mengirim..." : "Kirim Pesan"}
                       </button>
                    </form>

                    <div className="h-[400px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                      {wishes.length > 0 ? (
                        wishes.map((w: any, idx) => (
                          <div key={idx} className="p-4 bg-white/40 backdrop-blur-sm border border-black/10 rounded-lg">
                            <h4 className="font-bold text-sm mb-1">{w.guest_name}</h4>
                            <p className="text-sm opacity-80 font-serif italic">{w.message}</p>
                            <span className="text-[10px] opacity-50 uppercase tracking-widest mt-2 block">
                              {new Date(w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center opacity-50 italic font-serif">Belum ada ucapan. Jadilah yang pertama!</p>
                      )}
                    </div>
                  </motion.div>
                )}
             </div>
          </section>

          {/* GIFT */}
          {invitation.show_gift && giftAccounts.length > 0 && (
            <section className="py-24 px-6 text-center border-t border-black/10">
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto">
                  <h2 className="font-great-vibes text-5xl mb-6">Tanda Kasih</h2>
                  <p className="mb-12 font-playfair text-lg opacity-80">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda ingin memberikan tanda kasih, kami menyediakan fitur di bawah ini.</p>
                  
                  <div className="flex flex-col gap-6 items-center">
                    {giftAccounts.map((account, idx) => (
                      <div key={idx} className="w-full max-w-sm p-6 border border-black/20 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: themeColors.accent }}></div>
                        <h3 className="font-bold tracking-widest uppercase mb-1">{account.bank_name}</h3>
                        <p className="opacity-70 text-sm mb-4">a/n {account.account_name}</p>
                        <div className="text-2xl font-serif tracking-widest mb-6">{account.account_number}</div>
                        <button 
                          onClick={() => handleCopy(account.account_number, account.id)}
                          className="px-6 py-2 rounded-full border border-black/20 text-xs tracking-widest uppercase hover:bg-black/5 transition-colors flex items-center justify-center gap-2 mx-auto w-full"
                        >
                          {copiedBank === account.id ? <><Check size={14} /> Berhasil Disalin</> : <><Copy size={14} /> Salin No. Rekening</>}
                        </button>
                      </div>
                    ))}
                  </div>
               </motion.div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="py-12 px-6 text-center relative" style={{ backgroundColor: themeColors.primary }}>
            <div className="max-w-md mx-auto text-white">
              <h2 className="font-great-vibes text-4xl mb-4">{invitation.bride_nickname} & {invitation.groom_nickname}</h2>
              <p className="opacity-70 text-sm font-playfair italic mb-8">Terima kasih atas doa & restu Anda.</p>
              
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-50 flex items-center justify-center gap-2">
                Created with <Heart size={10} className="inline" /> by NikahLink
              </div>
            </div>
          </footer>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${themeColors.primary}40; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${themeColors.primary}; }
      `}} />
    </div>
  );
}
