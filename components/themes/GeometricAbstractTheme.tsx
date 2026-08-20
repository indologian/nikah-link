"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Compass } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

// SVG Polygon Mask Component with Drop Shadow Support
const SvgPolygonMaskImage = ({ src, alt, shape }: { src: string, alt: string, shape: "arch" | "diamond" | "hexagon" | "blob" }) => {
  let clipPathData = "";
  if (shape === "arch") {
    clipPathData = "polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%)";
  } else if (shape === "diamond") {
    clipPathData = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
  } else if (shape === "hexagon") {
    clipPathData = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
  } else if (shape === "blob") {
    clipPathData = "path('M45.7,-76.3C58.9,-69.3,69.5,-55.8,76.5,-41.2C83.5,-26.5,86.9,-10.8,84.6,4.2C82.3,19.2,74.2,33.5,63.9,45C53.5,56.5,41.1,65.2,27.1,72.2C13.1,79.2,-2.5,84.4,-17.4,81.3C-32.2,78.2,-46.3,66.8,-57.1,53.8C-68,40.8,-75.6,26.2,-78.9,10.7C-82.2,-4.8,-81.2,-21.2,-74,-34.5C-66.8,-47.8,-53.4,-57.9,-39.7,-64.7C-26,-71.5,-13,-75,-0.1,-74.8C12.8,-74.6,25.6,-70.7,32.5,-83.3Z')";
  }

  return (
    <div className="relative w-full h-full filter drop-shadow-[0_15px_30px_rgba(183,110,121,0.3)]">
       {/* CSS drop-shadow works perfectly around clip-paths */}
       <div 
         className="w-full h-full relative overflow-hidden bg-[rgba(var(--theme-primary-rgb),0.2)]"
         style={{ clipPath: clipPathData }}
       >
         <Image src={src} alt={alt} fill className="object-cover" />
         <div className="absolute inset-0 bg-[rgba(var(--theme-background-rgb),0.2)] mix-blend-overlay"></div>
       </div>
    </div>
  );
};

export default function GeometricAbstractTheme({
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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [wishes, setWishes] = useState(initialWishes);
  const [wishName, setWishName] = useState(guestName !== "Tamu Undangan" ? guestName : "");
  const [wishText, setWishText] = useState("");
  const [sendingWish, setSendingWish] = useState(false);

  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "tidak_hadir">("hadir");
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpNotes, setRsvpNotes] = useState("");
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  const weddingDateStr = invitation.reception_date || invitation.akad_date || "2026-12-31";
  const coverImg = invitation.cover_image_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc";
  const groomImg = invitation.groom_photo_url || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d";
  const brideImg = invitation.bride_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2";

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
    setTimeout(() => setCopiedBank(null), 2000);
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

  return (
    <div ref={containerRef} className={`min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] overflow-hidden relative selection:bg-[var(--theme-primary)] selection:text-white`}>
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full border border-[var(--theme-primary)]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full border border-[var(--theme-primary)]"></div>
         <div className="absolute top-[40%] left-[20%] w-[20vw] h-[20vw] rotate-45 border border-[var(--theme-primary)]"></div>
      </div>

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[var(--theme-primary)] text-white rounded-none rotate-45 shadow-[0_0_15px_rgba(183,110,121,0.5)] hover:scale-110 transition-transform"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="-rotate-45">
              <Music className="w-4 h-4" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* PRELOADER COVER (Geometric Split) */
          <motion.div
            key="cover"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--theme-background)]"
          >
            <motion.div 
              exit={{ scale: 20, opacity: 0 }} 
              transition={{ duration: 1.5, ease: "easeInOut" }} 
              className="absolute inset-0 border-[50px] border-[var(--theme-accent)] pointer-events-none z-10"
            />
            
            <motion.div
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1 }}
              className="relative z-30 flex flex-col items-center text-center p-8 w-full max-w-sm"
            >
              <div className="w-32 h-32 mb-8 rotate-45 border border-[var(--theme-primary)] flex items-center justify-center overflow-hidden">
                <div className="-rotate-45 font-bold text-3xl text-[var(--theme-primary)] flex gap-2">
                   <span>{invitation.groom_name?.charAt(0)}</span>
                   <span className="opacity-50">+</span>
                   <span>{invitation.bride_name?.charAt(0)}</span>
                </div>
              </div>
              
              <h1 className={`text-4xl text-white mb-2 ${playfair.className} font-bold uppercase tracking-[0.2em]`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <h1 className={`text-4xl text-white mb-10 ${playfair.className} font-bold uppercase tracking-[0.2em]`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="w-full mb-12 border-l-2 border-[var(--theme-primary)] pl-4 text-left">
                <p className={`text-[9px] tracking-[0.3em] uppercase text-[#888] mb-1 ${inter.className}`}>Kepada Yth.</p>
                <p className={`text-lg font-bold text-white uppercase tracking-wider ${inter.className}`}>{guestName}</p>
              </div>

              <button
                onClick={handleOpenInvitation}
                className={`group relative overflow-hidden bg-transparent border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white px-12 py-4 uppercase text-[10px] tracking-[0.4em] font-bold transition-all duration-500 ${inter.className}`}
              >
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-full max-w-md mx-auto relative z-10 bg-[var(--theme-background)] min-h-screen shadow-2xl"
          >
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden">
               
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 1 }}
                className="w-64 h-80 mb-10"
              >
                <SvgPolygonMaskImage src={coverImg} alt="Cover" shape="arch" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="relative z-10 w-full flex flex-col items-center"
              >
                <h4 className={`text-[9px] tracking-[0.4em] uppercase text-[var(--theme-primary)] mb-4 ${inter.className} font-bold`}>The Wedding Of</h4>
                <h2 className={`text-5xl mb-2 ${playfair.className} font-bold text-white uppercase tracking-widest`}>
                  {invitation.groom_name}
                </h2>
                <h2 className={`text-xl text-[var(--theme-primary)] my-1 ${playfair.className} italic`}>&</h2>
                <h2 className={`text-5xl mb-8 ${playfair.className} font-bold text-white uppercase tracking-widest`}>
                  {invitation.bride_name}
                </h2>
                
                <p className={`text-[10px] tracking-widest uppercase text-[#888] ${inter.className} mt-4`}>
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd . MM . yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* COUPLE PROFILES */}
            <section className="py-24 px-6 relative z-10">
               <div className="flex flex-col gap-20">
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="flex flex-col items-center text-center"
                  >
                     <div className="w-48 h-48 mb-6 rotate-12">
                        <SvgPolygonMaskImage src={groomImg} alt="Groom" shape="hexagon" />
                     </div>
                     <h3 className={`text-3xl font-bold text-white uppercase tracking-widest mb-2 ${playfair.className}`}>{invitation.groom_name}</h3>
                     <p className={`text-xs text-[#888] ${inter.className}`}>Putra dari Bapak {invitation.groom_father} & Ibu {invitation.groom_mother}</p>
                  </motion.div>

                  <div className="w-full flex justify-center">
                     <span className={`text-5xl text-[var(--theme-primary)] ${playfair.className} italic`}>&</span>
                  </div>

                  <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="flex flex-col items-center text-center"
                  >
                     <div className="w-48 h-48 mb-6 -rotate-12">
                        <SvgPolygonMaskImage src={brideImg} alt="Bride" shape="hexagon" />
                     </div>
                     <h3 className={`text-3xl font-bold text-white uppercase tracking-widest mb-2 ${playfair.className}`}>{invitation.bride_name}</h3>
                     <p className={`text-xs text-[#888] ${inter.className}`}>Putri dari Bapak {invitation.bride_father} & Ibu {invitation.bride_mother}</p>
                  </motion.div>
               </div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 relative z-10 border-t border-[var(--theme-accent)]">
              <div className="text-center mb-16 relative z-10">
                <Compass className="w-8 h-8 text-[var(--theme-primary)] mx-auto mb-6" />
                <h3 className={`text-4xl mb-2 ${playfair.className} font-bold text-white uppercase tracking-widest`}>Acara</h3>
              </div>

              <div className="space-y-16">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-[var(--theme-accent)] p-8 border border-[#333] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[rgba(var(--theme-primary-rgb),0.1)] rotate-45 transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-150"></div>
                  
                  <h4 className={`text-2xl font-bold text-white mb-6 uppercase tracking-widest ${playfair.className}`}>Akad Nikah</h4>
                  
                  <div className={`space-y-4 text-sm text-[var(--theme-text)] mb-8 ${inter.className} font-light`}>
                    <div className="flex gap-4 items-start">
                      <Calendar className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[#888] text-xs mt-1">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">{invitation.akad_venue || "Lokasi Akad"}</p>
                        <p className="text-[#888] mt-1 text-xs leading-relaxed">{invitation.akad_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-3 ${inter.className}`}>
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-white py-3 uppercase text-[9px] font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-colors">
                         Buka Peta Lokasi
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-[var(--theme-accent)] p-8 border border-[#333] relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-16 h-16 bg-[rgba(var(--theme-primary-rgb),0.1)] rotate-45 transform -translate-x-8 -translate-y-8 transition-transform group-hover:scale-150"></div>
                  
                  <h4 className={`text-2xl font-bold text-white mb-6 uppercase tracking-widest ${playfair.className} text-right`}>Resepsi</h4>
                  
                  <div className={`space-y-4 text-sm text-[var(--theme-text)] mb-8 ${inter.className} font-light text-right`}>
                    <div className="flex gap-4 items-start justify-end flex-row-reverse">
                      <Calendar className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[#888] text-xs mt-1">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start justify-end flex-row-reverse">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider text-[11px]">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                        <p className="text-[#888] mt-1 text-xs leading-relaxed">{invitation.reception_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-3 ${inter.className}`}>
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-white py-3 uppercase text-[9px] font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-colors">
                         Buka Peta Lokasi
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </section>

            {/* RSVP & WISHES */}
            <section className="py-24 px-6 relative z-10 bg-[var(--theme-accent)]">
              <div className="text-center mb-12 relative z-10">
                <h3 className={`text-4xl mb-2 ${playfair.className} font-bold text-white uppercase tracking-widest`}>Kehadiran</h3>
              </div>

              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className={`border border-[#333] p-8 mb-16 relative overflow-hidden ${inter.className}`}
                >
                  <div className="absolute inset-0 bg-[var(--theme-background)] clip-path-polygon-[0_0,_100%_0,_100%_100%,_0_90%] -z-10"></div>
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        placeholder="NAMA LENGKAP"
                        className="w-full bg-transparent border-b border-[#333] py-4 text-xs text-white placeholder:text-[#555] uppercase tracking-widest focus:outline-none focus:border-[var(--theme-primary)] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-transparent border-b border-[#333] py-4 text-xs text-white uppercase tracking-widest focus:outline-none focus:border-[var(--theme-primary)] transition-colors appearance-none"
                      >
                        <option value="hadir" className="bg-[#111]">AKAN HADIR</option>
                        <option value="tidak_hadir" className="bg-[#111]">TIDAK HADIR</option>
                      </select>
                    </div>
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-[var(--theme-primary)] text-white py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-70 mt-4"
                    >
                      {submittingRsvp ? "MENGIRIM..." : "KIRIM RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--theme-accent)] border border-[#333] p-10 text-center mb-16">
                  <Check className="w-12 h-12 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h4 className={`text-xl font-bold text-white mb-2 uppercase tracking-widest ${playfair.className}`}>Terima Kasih</h4>
                  <p className={`text-[#888] text-xs uppercase tracking-wider ${inter.className}`}>Konfirmasi diterima.</p>
                </motion.div>
              )}

              {/* Wishes */}
              <div className="text-center mb-12 relative z-10 mt-20">
                <h3 className={`text-4xl mb-2 ${playfair.className} font-bold text-white uppercase tracking-widest`}>Ucapan</h3>
              </div>
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className={`mb-10 border border-[#333] p-2 bg-[var(--theme-accent)] ${inter.className}`}
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-transparent text-xs p-4 text-white focus:outline-none resize-none placeholder:text-[#555] uppercase tracking-wider"
                  placeholder="TULISKAN UCAPAN DAN DOA..."
                  required
                />
                <div className="flex justify-between items-center px-4 py-2 border-t border-[#333]">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--theme-primary)] font-bold">{wishName || "TAMU"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-[var(--theme-primary)] text-white p-3 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>

              {/* Scrollable Wishes List */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#111] p-6 border-l-2 border-[var(--theme-primary)]"
                  >
                    <p className={`text-sm text-white leading-relaxed mb-4 ${playfair.className} italic`}>
                      "{wish.message}"
                    </p>
                    <div className={`flex items-center justify-between ${inter.className}`}>
                      <p className="font-bold text-[9px] text-[var(--theme-primary)] uppercase tracking-[0.2em]">{wish.guest_name}</p>
                      <span className="text-[9px] text-[#555] tracking-wider">{format(new Date(wish.created_at), "dd MMM yy", { locale: id })}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 text-center px-6 bg-[var(--theme-background)] text-[#888] relative z-10 border-t border-[#333]">
              <h2 className={`text-3xl mb-6 ${playfair.className} font-bold text-white uppercase tracking-widest`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className={`text-[9px] tracking-[0.4em] uppercase flex flex-col items-center gap-2 font-bold ${inter.className}`}>
                <span>BUILT BY</span>
                <a href="https://nikahlink.com" className="text-[var(--theme-primary)] hover:text-white transition-colors">NIKAHLINK</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
