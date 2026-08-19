"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Calendar, MapPin, Music, Volume2, VolumeX,
  Gift, Copy, Check, MessageSquare, Send, CheckCircle2
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

export default function WayangClassicTheme({
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
    background: "#2A1B14", // Dark earthy brown
    text: "#F5E6D3",       // Soft cream/gold
    primary: "#D4AF37",    // Gold
    accent: "#8B4513"      // Saddle brown / dark gold
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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const zoomIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" as const } }
  };

  return (
    <div 
      className="min-h-screen font-playfair relative selection:bg-black/10 overflow-x-hidden"
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {/* Subtle Batik/Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] z-0"></div>

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
            {/* Ornate Gold Border for Cover */}
            <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: themeColors.primary, opacity: 0.3 }}>
              {/* Corner decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4" style={{ borderColor: themeColors.primary }}></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4" style={{ borderColor: themeColors.primary }}></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4" style={{ borderColor: themeColors.primary }}></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4" style={{ borderColor: themeColors.primary }}></div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10 w-full max-w-sm flex flex-col items-center text-center"
            >
              {/* Wayang / Gunungan Silhouette SVG placeholder */}
              <div className="mb-8 opacity-80 flex justify-center">
                <svg width="80" height="100" viewBox="0 0 100 120" fill={themeColors.primary} xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 0 C 70 40, 100 70, 100 110 C 100 120, 0 120, 0 110 C 0 70, 30 40, 50 0 Z" />
                  <path d="M50 15 L 45 40 L 55 40 Z M30 80 A 10 10 0 0 1 50 70 A 10 10 0 0 1 70 80 Z" fill={themeColors.background} />
                </svg>
              </div>
              
              <div className="space-y-4">
                <p className="tracking-widest uppercase text-xs font-semibold" style={{ color: themeColors.primary }}>Pawiwahan Ageng</p>
                <h1 className="font-great-vibes text-5xl md:text-6xl mb-2" style={{ color: themeColors.primary }}>
                  {invitation.bride_nickname} & {invitation.groom_nickname}
                </h1>
                
                <div className="py-6 my-6 border-y" style={{ borderColor: `${themeColors.primary}40` }}>
                  <p className="text-sm italic mb-2 opacity-80">Katur Dumateng Bpk/Ibu/Sdr/i:</p>
                  <p className="text-xl font-bold">{guestName}</p>
                </div>

                <button 
                  onClick={handleOpenInvitation}
                  className="px-8 py-3 text-sm uppercase transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto font-bold tracking-widest"
                  style={{ backgroundColor: themeColors.primary, color: themeColors.background }}
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
              className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-lg transition-transform hover:scale-110"
              style={{ backgroundColor: themeColors.primary, color: themeColors.background }}
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}

          {/* HERO SECTION */}
          <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center p-6 pt-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="w-full max-w-lg mx-auto flex flex-col items-center">
              
              <div className="w-64 h-[400px] md:h-[480px] overflow-hidden mb-8 relative shadow-2xl mx-auto rounded-t-full border-4" style={{ borderColor: themeColors.primary }}>
                <Image src={heroPhoto} alt="Hero" fill className="object-cover" priority />
              </div>

              <h1 className="font-great-vibes text-6xl md:text-7xl mb-4 leading-tight" style={{ color: themeColors.primary }}>
                {invitation.bride_nickname} & {invitation.groom_nickname}
              </h1>
              
              <p className="text-lg md:text-xl italic opacity-90">
                {formatDate(weddingDateStr)}
              </p>
            </motion.div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-20 px-6 text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={zoomIn} className="max-w-2xl mx-auto border-y py-12" style={{ borderColor: `${themeColors.primary}40` }}>
                <p className="text-xl md:text-2xl italic leading-relaxed mb-6">
                  "{customData?.quote || invitation.custom_data?.quote}"
                </p>
              </motion.div>
            </section>
          )}

          {/* PROFILE SECTION */}
          <section className="py-24 px-6 relative overflow-hidden">
             <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-4xl mx-auto text-center">
                <h2 className="font-great-vibes text-5xl mb-16" style={{ color: themeColors.primary }}>Sang Mempelai</h2>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-8">
                  
                  {/* Bride */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 className="text-3xl font-bold mb-4">{invitation.bride_name}</h3>
                    <p className="text-sm tracking-widest uppercase mb-2 opacity-70">Putri Dari</p>
                    <p className="italic text-lg">{invitation.bride_parents}</p>
                  </div>

                  {/* AND */}
                  <div className="w-16 h-16 flex items-center justify-center rounded-full text-4xl font-great-vibes" style={{ color: themeColors.primary }}>
                    &
                  </div>

                  {/* Groom */}
                  <div className="flex-1 flex flex-col items-center">
                    <h3 className="text-3xl font-bold mb-4">{invitation.groom_name}</h3>
                    <p className="text-sm tracking-widest uppercase mb-2 opacity-70">Putra Dari</p>
                    <p className="italic text-lg">{invitation.groom_parents}</p>
                  </div>

                </div>
             </motion.div>
          </section>

          {/* EVENT DETAILS */}
          <section className="py-24 px-6 relative" style={{ backgroundColor: themeColors.primary, color: themeColors.background }}>
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <h2 className="font-great-vibes text-5xl md:text-6xl mb-6">Waktu & Tempat</h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Akad */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="border p-8 flex flex-col items-center text-center relative overflow-hidden" style={{ borderColor: `${themeColors.background}40` }}>
                  <h3 className="tracking-[0.2em] uppercase text-sm mb-6 font-bold">Akad Nikah</h3>
                  <div className="text-2xl font-bold mb-2">{formatDate(invitation.akad_date)}</div>
                  <div className="mb-8 opacity-90">{formatTime(invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.akad_location}</div>
                  <div className="opacity-90 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.akad_address}</div>
                  
                  {invitation.akad_maps_url && (
                    <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-6 py-2 border transition-colors tracking-widest text-xs uppercase flex items-center gap-2 font-bold hover:bg-black/10" style={{ borderColor: themeColors.background }}>
                      <MapPin size={14} /> Lokasi
                    </a>
                  )}
                </motion.div>

                {/* Reception */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="border p-8 flex flex-col items-center text-center relative overflow-hidden" style={{ borderColor: `${themeColors.background}40` }}>
                  <h3 className="tracking-[0.2em] uppercase text-sm mb-6 font-bold">Resepsi</h3>
                  <div className="text-2xl font-bold mb-2">{formatDate(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="mb-8 opacity-90">{formatTime(invitation.reception_date || invitation.akad_date)}</div>
                  <div className="font-bold text-lg mb-2">{invitation.reception_location || invitation.akad_location}</div>
                  <div className="opacity-90 text-sm mb-8 leading-relaxed max-w-[250px]">{invitation.reception_address || invitation.akad_address}</div>
                  
                  {(invitation.reception_maps_url || invitation.akad_maps_url) && (
                    <a href={invitation.reception_maps_url || invitation.akad_maps_url} target="_blank" rel="noreferrer" className="mt-auto px-6 py-2 border transition-colors tracking-widest text-xs uppercase flex items-center gap-2 font-bold hover:bg-black/10" style={{ borderColor: themeColors.background }}>
                      <MapPin size={14} /> Lokasi
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Countdown */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={zoomIn} className="mt-20 border-t pt-12 flex justify-center gap-4 md:gap-12" style={{ borderColor: `${themeColors.background}40` }}>
                {[
                  { label: "Hari", value: timeLeft.days },
                  { label: "Jam", value: timeLeft.hours },
                  { label: "Menit", value: timeLeft.minutes },
                  { label: "Detik", value: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-bold mb-2">{item.value}</span>
                    <span className="text-xs tracking-widest uppercase opacity-80">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* GALLERY */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-6 max-w-5xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
                <h2 className="font-great-vibes text-5xl md:text-6xl mb-6" style={{ color: themeColors.primary }}>Galeri Cinta</h2>
              </motion.div>
              
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative w-full overflow-hidden inline-block border-4"
                    style={{ borderColor: themeColors.primary }}
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      width={500} 
                      height={700} 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* DIGITAL WALLET / GIFT */}
          {invitation.show_gifts && giftAccounts.length > 0 && (
            <section className="py-24 px-6 border-t" style={{ borderColor: `${themeColors.primary}40` }}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={zoomIn} className="max-w-2xl mx-auto text-center">
                <Gift className="w-10 h-10 mx-auto mb-6" style={{ color: themeColors.primary }} />
                <h2 className="font-great-vibes text-5xl mb-6" style={{ color: themeColors.primary }}>Tanda Kasih</h2>
                <p className="opacity-80 mb-12">Doa restu Anda merupakan karunia yang sangat berarti. Namun jika Anda bermaksud memberikan tanda kasih, dapat melalui:</p>
                
                <div className="grid gap-6">
                  {giftAccounts.map((account: any) => (
                    <div key={account.id} className="p-6 border flex flex-col items-center" style={{ borderColor: `${themeColors.primary}40` }}>
                      <div className="font-bold text-lg mb-2">{account.bank_name}</div>
                      <div className="text-2xl font-playfair tracking-wider mb-2">{account.account_number}</div>
                      <div className="opacity-80 mb-6">a.n {account.account_name}</div>
                      
                      <button 
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="px-6 py-2 border transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
                        style={{ 
                          borderColor: themeColors.primary, 
                          color: copiedBank === account.id ? themeColors.background : themeColors.primary,
                          backgroundColor: copiedBank === account.id ? themeColors.primary : "transparent"
                        }}
                      >
                        {copiedBank === account.id ? <><Check size={16} /> Tersalin</> : <><Copy size={16} /> Salin Rekening</>}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6" style={{ backgroundColor: themeColors.primary, color: themeColors.background }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
              
              {/* RSVP Form */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-great-vibes text-5xl mb-8">Konfirmasi Kehadiran</h2>
                
                {rsvpSuccess ? (
                  <div className="p-8 border text-center flex flex-col items-center" style={{ borderColor: `${themeColors.background}40` }}>
                    <CheckCircle2 className="w-16 h-16 mb-4 opacity-80" />
                    <h3 className="text-2xl mb-2 font-bold">Terima Kasih!</h3>
                    <p className="opacity-80">Konfirmasi kehadiran Anda telah kami terima.</p>
                  </div>
                ) : (
                  <form onSubmit={handleRsvpSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Nama Anda</label>
                      <input 
                        type="text" 
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        required
                        className="w-full p-4 border bg-transparent focus:outline-none placeholder:text-black/30"
                        style={{ borderColor: `${themeColors.background}60` }}
                        placeholder="Nama lengkap"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Kehadiran</label>
                      <select 
                        value={rsvpStatus}
                        onChange={(e) => setRsvpStatus(e.target.value as any)}
                        className="w-full p-4 border bg-transparent focus:outline-none"
                        style={{ borderColor: `${themeColors.background}60`, color: themeColors.background }}
                      >
                        <option value="hadir" className="text-black">Hadir</option>
                        <option value="tidak_hadir" className="text-black">Maaf, Tidak Bisa Hadir</option>
                      </select>
                    </div>

                    {rsvpStatus === "hadir" && (
                      <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-widest">Jumlah Kehadiran</label>
                        <select 
                          value={rsvpCount}
                          onChange={(e) => setRsvpCount(Number(e.target.value))}
                          className="w-full p-4 border bg-transparent focus:outline-none"
                          style={{ borderColor: `${themeColors.background}60`, color: themeColors.background }}
                        >
                          <option value="1" className="text-black">1 Orang</option>
                          <option value="2" className="text-black">2 Orang</option>
                        </select>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={submittingRsvp}
                      className="w-full p-4 font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 hover:bg-black/10 border"
                      style={{ borderColor: themeColors.background }}
                    >
                      {submittingRsvp ? "Mengirim..." : "Kirim Konfirmasi"}
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Wishes / Guestbook */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <h2 className="font-great-vibes text-5xl mb-8">Buku Tamu</h2>
                
                <form onSubmit={handleSendWish} className="mb-10 space-y-4">
                  <textarea 
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-4 border bg-transparent focus:outline-none placeholder:text-black/30"
                    style={{ borderColor: `${themeColors.background}60` }}
                    placeholder="Tulis doa dan ucapan..."
                  />
                  <button 
                    type="submit" 
                    disabled={sendingWish}
                    className="px-8 py-3 font-bold uppercase tracking-widest transition-colors flex items-center gap-2 hover:bg-black/10 border"
                    style={{ borderColor: themeColors.background }}
                  >
                    <Send size={16} /> {sendingWish ? "Mengirim..." : "Kirim Ucapan"}
                  </button>
                </form>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {wishes.map((wish: any) => (
                    <div key={wish.id} className="border-b pb-6" style={{ borderColor: `${themeColors.background}20` }}>
                      <div className="font-bold mb-2 text-lg">{wish.guest_name}</div>
                      <div className="opacity-90 leading-relaxed text-sm">"{wish.message}"</div>
                      <div className="text-xs opacity-60 mt-2">{formatDate(wish.created_at)}</div>
                    </div>
                  ))}
                  {wishes.length === 0 && (
                    <p className="opacity-70 italic text-sm">Belum ada ucapan. Jadilah yang pertama!</p>
                  )}
                </div>
              </motion.div>

            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-12 text-center opacity-60 text-sm border-t" style={{ borderColor: `${themeColors.primary}20` }}>
            <p>Made with ❤️ by NikahLink</p>
            {!isFreePlan && <p className="mt-2 text-xs">Premium Invitation</p>}
          </footer>

        </div>
      )}
    </div>
  );
}
