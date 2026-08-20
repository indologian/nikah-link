"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Snowflake } from "lucide-react";
import Image from "next/image";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { id } from "date-fns/locale";
import { Cormorant_Garamond, Montserrat } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

// Particle System Component for Snow
const ParticleSystem = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    setWindowSize({ width: window.innerWidth > 500 ? 500 : window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth > 500 ? 500 : window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: Math.random() * -100, // start above screen
      size: Math.random() * 3 + 1, // 1 to 4px
      duration: Math.random() * 10 + 10, // 10 to 20s
      delay: Math.random() * -20, // negative delay so they start already falling
    }));
  }, []);

  if (windowSize.width === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
          }}
          animate={{
            y: [p.y, windowSize.height + 100],
            x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default function EtherealSnowTheme({
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Cross-fade slider images (mocked from cover if only 1 image exists, normally would use gallery_images array)
  const sliderImages = [
    customData?.gallery_1,
    customData?.gallery_2,
    customData?.gallery_3,
  ].filter(Boolean);

  if (sliderImages.length === 0) {
    if (invitation.cover_image_url) sliderImages.push(invitation.cover_image_url);
    if (invitation.groom_photo_url) sliderImages.push(invitation.groom_photo_url);
    if (invitation.bride_photo_url) sliderImages.push(invitation.bride_photo_url);
  }

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, sliderImages.length]);

  // RSVP / Wishes state
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

  const generateGCalLink = (date: string, time: string, title: string, location: string) => {
    try {
      const d = parseISO(date);
      const formattedDate = format(d, "yyyyMMdd");
      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.append("action", "TEMPLATE");
      url.searchParams.append("text", `Pernikahan ${invitation.groom_name} & ${invitation.bride_name} - ${title}`);
      url.searchParams.append("dates", `${formattedDate}T010000Z/${formattedDate}T100000Z`);
      url.searchParams.append("details", "Kehadiran dan doa restu Bapak/Ibu/Saudara/i sangat kami harapkan.");
      url.searchParams.append("location", location);
      return url.toString();
    } catch {
      return "#";
    }
  };

  return (
    <div ref={containerRef} className={`min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] overflow-hidden relative selection:bg-[var(--theme-primary)] selection:text-[var(--theme-background)]`}>
      
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      {/* Global Particle System */}
      <ParticleSystem />

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-white/10 backdrop-blur-md rounded-full shadow-2xl text-white hover:bg-white/20 transition-colors border border-white/20"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* PRELOADER COVER (Split Screen) */
          <motion.div
            key="cover"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--theme-background)]"
          >
            {/* Top Door */}
            <motion.div 
              exit={{ y: "-100%" }} 
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }} 
              className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--theme-accent)] pointer-events-none origin-top border-b border-white/10"
            />
            {/* Bottom Door */}
            <motion.div 
              exit={{ y: "100%" }} 
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }} 
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--theme-accent)] pointer-events-none origin-bottom border-t border-white/10"
            />
            
            <motion.div
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="relative z-30 flex flex-col items-center text-center p-8 w-full"
            >
              <Snowflake className="w-8 h-8 text-[var(--theme-primary)] mb-8 animate-[spin_10s_linear_infinite]" />
              
              <h1 className={`text-4xl md:text-5xl text-white mb-2 ${cormorant.className} italic font-bold tracking-wider`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <span className={`text-xl text-[var(--theme-primary)] my-2 ${cormorant.className}`}>&</span>
              <h1 className={`text-4xl md:text-5xl text-white mb-10 ${cormorant.className} italic font-bold tracking-wider`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="w-full max-w-[250px] mb-12">
                <p className={`text-[10px] tracking-[0.2em] uppercase text-[var(--theme-primary)] mb-2 ${montserrat.className}`}>Untuk Yth.</p>
                <div className="border-b border-[rgba(var(--theme-primary-rgb),0.3)] pb-3">
                  <p className={`text-lg font-medium text-white ${montserrat.className}`}>{guestName}</p>
                </div>
              </div>

              <button
                onClick={handleOpenInvitation}
                className={`group relative overflow-hidden bg-transparent border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-background)] px-10 py-3 rounded-full uppercase text-[10px] tracking-[0.3em] font-medium transition-all duration-500 ${montserrat.className}`}
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
            className="w-full max-w-md mx-auto relative z-10 bg-[rgba(var(--theme-accent-rgb),0.5)] backdrop-blur-sm min-h-screen border-x border-white/10 shadow-2xl"
          >
            {/* HERO CROSS-FADE SLIDER */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-end p-8 text-center overflow-hidden rounded-b-[40px]">
              {/* Image Slider */}
              <div className="absolute inset-0 z-0">
                {sliderImages.map((src, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentSlide === idx ? 1 : 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                  >
                    <Image src={src} alt="Prewedding" fill className="object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-accent)] via-[rgba(var(--theme-accent-rgb),0.6)] to-transparent"></div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="relative z-10 w-full flex flex-col items-center mb-10"
              >
                <h4 className={`text-[10px] tracking-[0.5em] uppercase text-[var(--theme-primary)] mb-6 ${montserrat.className}`}>The Wedding Of</h4>
                <h2 className={`text-5xl font-bold mb-1 ${cormorant.className} italic text-white drop-shadow-lg`}>
                  {invitation.groom_name}
                </h2>
                <h2 className={`text-3xl text-[var(--theme-primary)] my-1 ${cormorant.className}`}>&</h2>
                <h2 className={`text-5xl font-bold mb-8 ${cormorant.className} italic text-white drop-shadow-lg`}>
                  {invitation.bride_name}
                </h2>
                
                <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--theme-primary)] to-transparent mb-6"></div>

                <p className={`text-xs tracking-widest uppercase text-[var(--theme-primary)] ${montserrat.className}`}>
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 relative">
              <div className="text-center mb-16 relative z-10">
                <Snowflake className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-4 opacity-50" />
                <h3 className={`text-3xl mb-2 ${cormorant.className} italic text-white font-bold`}>Momen Sakral</h3>
                <p className={`text-[9px] tracking-[0.4em] text-[var(--theme-primary)] uppercase ${montserrat.className}`}>Informasi Acara</p>
              </div>

              <div className="space-y-12 relative z-10">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Snowflake className="w-24 h-24 text-white" />
                  </div>
                  <h4 className={`text-2xl font-bold text-white mb-6 ${cormorant.className} italic`}>Akad Nikah</h4>
                  
                  <div className={`space-y-4 text-sm text-[var(--theme-text)] mb-8 ${montserrat.className} font-light`}>
                    <div className="flex gap-4">
                      <Calendar className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[var(--theme-primary)] text-xs mt-1">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{invitation.akad_venue || "Lokasi Akad"}</p>
                        <p className="text-[var(--theme-primary)] mt-1 text-xs leading-relaxed">{invitation.akad_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-3 ${montserrat.className}`}>
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white text-[var(--theme-background)] py-3 uppercase text-[9px] font-bold tracking-[0.2em] hover:bg-[var(--theme-primary)] transition-colors rounded-full">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white py-3 uppercase text-[9px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors rounded-full">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Snowflake className="w-24 h-24 text-white" />
                  </div>
                  <h4 className={`text-2xl font-bold text-white mb-6 ${cormorant.className} italic`}>Resepsi</h4>
                  
                  <div className={`space-y-4 text-sm text-[var(--theme-text)] mb-8 ${montserrat.className} font-light`}>
                    <div className="flex gap-4">
                      <Calendar className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[var(--theme-primary)] text-xs mt-1">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-4 h-4 text-[var(--theme-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                        <p className="text-[var(--theme-primary)] mt-1 text-xs leading-relaxed">{invitation.reception_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-3 ${montserrat.className}`}>
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-primary)] text-[var(--theme-background)] py-3 uppercase text-[9px] font-bold tracking-[0.2em] hover:bg-white transition-colors rounded-full">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white py-3 uppercase text-[9px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors rounded-full">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6 relative z-10 border-t border-white/10">
                <div className="text-center mb-12">
                  <Gift className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-4 opacity-80" />
                  <h3 className={`text-3xl mb-2 ${cormorant.className} italic font-bold text-white`}>Tanda Kasih</h3>
                </div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[rgba(var(--theme-background-rgb),0.8)] backdrop-blur-md p-8 border border-white/10 text-center rounded-3xl relative overflow-hidden"
                    >
                      <p className={`text-[10px] uppercase tracking-[0.3em] font-medium mb-4 text-[var(--theme-primary)] ${montserrat.className}`}>{account.bank_name}</p>
                      <p className={`text-2xl tracking-widest mb-2 text-white font-bold ${montserrat.className}`}>{account.account_number}</p>
                      <p className={`text-sm text-[var(--theme-primary)] mb-8 font-light ${montserrat.className}`}>A.N {account.account_name}</p>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className={`w-full flex items-center justify-center gap-2 bg-transparent text-white py-3 uppercase text-[9px] font-bold tracking-[0.2em] border border-[rgba(var(--theme-primary-rgb),0.5)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-background)] transition-colors rounded-full ${montserrat.className}`}
                      >
                        {copiedBank === account.id ? (
                          <>
                            <span>Tersalin!</span>
                            <Check className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Salin Rekening</span>
                            <Copy className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* RSVP & WISHES */}
            <section className="py-24 px-6 relative z-10 bg-gradient-to-t from-[var(--theme-accent)] to-transparent">
              <div className="text-center mb-12 relative z-10">
                <h3 className={`text-3xl mb-2 ${cormorant.className} italic font-bold text-white`}>Kehadiran & Ucapan</h3>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className={`bg-white/5 backdrop-blur-md p-8 border border-white/10 mb-16 rounded-3xl ${montserrat.className}`}
                >
                  <div className="space-y-5">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full bg-[rgba(var(--theme-background-rgb),0.5)] border border-white/20 py-4 px-5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--theme-primary)] transition-colors rounded-2xl"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-[rgba(var(--theme-background-rgb),0.5)] border border-white/20 py-4 px-5 text-xs text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors rounded-2xl appearance-none"
                      >
                        <option value="hadir">Akan Hadir</option>
                        <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                      </select>
                    </div>
                    {rsvpStatus === "hadir" && (
                       <div>
                          <select
                            value={rsvpCount}
                            onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                            className="w-full bg-[rgba(var(--theme-background-rgb),0.5)] border border-white/20 py-4 px-5 text-xs text-white focus:outline-none focus:border-[var(--theme-primary)] transition-colors rounded-2xl appearance-none"
                          >
                            <option value={1}>1 Orang</option>
                            <option value={2}>2 Orang</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-white text-[var(--theme-background)] py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[var(--theme-primary)] transition-colors disabled:opacity-70 mt-4 rounded-full"
                    >
                      {submittingRsvp ? "Mengirim..." : "Kirim RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 backdrop-blur-md p-10 text-center border border-white/10 mb-16 rounded-3xl">
                  <Check className="w-12 h-12 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h4 className={`text-xl font-bold text-white mb-2 ${montserrat.className}`}>Terima Kasih</h4>
                  <p className={`text-[var(--theme-primary)] text-sm ${montserrat.className}`}>Konfirmasi Anda telah diterima.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className={`mb-10 bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-3xl ${montserrat.className}`}
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-transparent text-xs p-4 text-white focus:outline-none resize-none placeholder:text-white/40"
                  placeholder="Tuliskan ucapan dan doa..."
                  required
                />
                <div className="flex justify-between items-center px-4 py-2 border-t border-white/10">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--theme-primary)] font-medium">{wishName || "Tamu"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-white text-[var(--theme-background)] p-3 hover:bg-[var(--theme-primary)] transition-colors disabled:opacity-50 rounded-full"
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10"
                  >
                    <p className={`text-sm text-white leading-relaxed mb-4 italic ${cormorant.className}`}>
                      "{wish.message}"
                    </p>
                    <div className={`flex items-center justify-between ${montserrat.className}`}>
                      <p className="font-bold text-[9px] text-[var(--theme-primary)] uppercase tracking-[0.2em]">{wish.guest_name}</p>
                      <span className="text-[9px] text-white/40">{format(new Date(wish.created_at), "dd MMM yy", { locale: id })}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 text-center px-6 bg-[var(--theme-accent)] text-white relative z-10 rounded-t-[40px] border-t border-white/10">
              <h2 className={`text-4xl mb-6 ${cormorant.className} italic font-bold text-white`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className={`text-[9px] tracking-[0.3em] text-white/50 uppercase flex flex-col items-center gap-2 font-medium ${montserrat.className}`}>
                <span>Dibuat dengan cinta oleh</span>
                <a href="https://nikahlink.com" className="text-white hover:text-white/50 transition-colors">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
