"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Camera, Sparkles } from "lucide-react";
import Image from "next/image";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { id } from "date-fns/locale";
import { Cormorant_Garamond, Lato } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700", "900"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function GoldenArchTheme({
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

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Parallax elements
  const yArchBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yContentBg = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

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
  
  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(`${weddingDateStr}T08:00:00`);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(targetDate, now);
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (3600 * 24)),
          hours: Math.floor((diff % (3600 * 24)) / 3600),
          minutes: Math.floor((diff % 3600) / 60),
          seconds: diff % 60,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

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

  // 3D Tilt Logic
  const xMove = useMotionValue(0);
  const yMove = useMotionValue(0);
  const rotateX = useTransform(yMove, [-100, 100], [10, -10]);
  const rotateY = useTransform(xMove, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    xMove.set(x);
    yMove.set(y);
  };
  const handleMouseLeave = () => {
    xMove.set(0);
    yMove.set(0);
  };

  // SVG Drawing Element: Minimalist Geometric Arch
  const ArchDrawSVG = ({ className, delay = 0, isOpen = false }: { className?: string, delay?: number, isOpen?: boolean }) => (
    <motion.svg viewBox="0 0 100 200" className={className} fill="none" stroke="currentColor" strokeWidth="0.5">
      <motion.path 
        d="M20,200 L20,80 A30,30 0 0,1 80,80 L80,200"
        initial={{ pathLength: 0 }}
        animate={isOpen ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay }}
      />
      <motion.path 
        d="M30,200 L30,80 A20,20 0 0,1 70,80 L70,200"
        initial={{ pathLength: 0 }}
        animate={isOpen ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2.5, ease: "easeInOut", delay: delay + 0.5 }}
      />
      {/* Decorative stars */}
      <motion.path d="M50,20 L52,25 L57,25 L53,28 L55,33 L50,30 L45,33 L47,28 L43,25 L48,25 Z" 
        initial={{ scale: 0, opacity: 0 }} 
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }} 
        transition={{ duration: 1, delay: delay + 2 }} 
        fill="currentColor" stroke="none" 
      />
    </motion.svg>
  );

  return (
    <div ref={containerRef} className={`min-h-screen bg-[var(--theme-background)] text-[var(--theme-accent)] overflow-hidden ${lato.className} relative selection:bg-[var(--theme-primary)] selection:text-white`}>
      
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[rgba(var(--theme-accent-rgb),0.9)] backdrop-blur-md rounded-full shadow-[0_5px_15px_rgba(212,175,55,0.3)] border border-[rgba(var(--theme-primary-rgb),0.5)] text-[var(--theme-primary)] hover:bg-[var(--theme-accent)] transition-colors"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* PRELOADER COVER (Golden Arch Drawing) */
          <motion.div
            key="cover"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-accent)] overflow-hidden"
          >
            {/* The Huge Drawing Arch */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 text-[var(--theme-primary)]">
              <ArchDrawSVG className="w-full h-[150%] max-w-2xl" delay={0.2} isOpen={!isOpen} />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 2.5 }}
              className="relative z-30 flex flex-col items-center text-center p-8 max-w-sm w-full"
            >
              <Sparkles className="w-8 h-8 text-[var(--theme-primary)] mb-6" />
              <p className="text-[9px] tracking-[0.4em] uppercase text-[var(--theme-primary)] mb-6 font-bold">The Wedding Celebration</p>
              
              <h1 className={`text-5xl md:text-6xl text-white mb-2 ${cormorant.className} italic`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <span className={`text-xl text-[var(--theme-primary)] my-2 ${lato.className}`}>&amp;</span>
              <h1 className={`text-5xl md:text-6xl text-white mb-10 ${cormorant.className} italic`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="bg-[rgba(var(--theme-primary-rgb),0.1)] border border-[rgba(var(--theme-primary-rgb),0.3)] px-8 py-6 backdrop-blur-sm mb-8 w-full max-w-[250px] mx-auto rounded-sm">
                <p className="text-[8px] tracking-[0.3em] uppercase text-[var(--theme-primary)] mb-2 opacity-80">Dear</p>
                <p className="text-lg text-white font-medium tracking-wide">{guestName}</p>
              </div>

              <button
                onClick={handleOpenInvitation}
                className="group relative overflow-hidden bg-transparent border border-[var(--theme-primary)] text-[var(--theme-primary)] px-10 py-3 rounded-sm uppercase text-[10px] tracking-[0.3em] font-bold transition-all hover:bg-[var(--theme-primary)] hover:text-[var(--theme-accent)] shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
              >
                Open Invitation
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto relative z-10 bg-[var(--theme-background)] min-h-screen border-x border-[var(--theme-background)] shadow-2xl"
          >
            {/* Background Parallax Arch */}
            <motion.div style={{ y: yArchBg }} className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] overflow-hidden flex justify-center">
              <svg viewBox="0 0 100 200" className="w-[200%] h-auto text-black" fill="none" stroke="currentColor" strokeWidth="0.5">
                <path d="M10,200 L10,60 A40,40 0 0,1 90,60 L90,200" />
                <path d="M20,200 L20,60 A30,30 0 0,1 80,60 L80,200" />
                <path d="M30,200 L30,60 A20,20 0 0,1 70,60 L70,200" />
              </svg>
            </motion.div>

            {/* HERO SECTION */}
            <section className="relative min-h-[95vh] flex flex-col items-center justify-center p-8 text-center pt-16 z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="w-full flex flex-col items-center"
              >
                {/* Arch Image Mask */}
                <div className="w-56 h-80 mx-auto mb-10 relative overflow-hidden border-[10px] border-[var(--theme-background)] shadow-2xl" style={{ borderTopLeftRadius: "50% 30%", borderTopRightRadius: "50% 30%" }}>
                   <div className="absolute inset-0 border border-[rgba(var(--theme-primary-rgb),0.3)] z-20 pointer-events-none rounded-t-[10rem]"></div>
                   {invitation.cover_image_url ? (
                      <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover sepia-[0.3]" />
                   ) : (
                      <div className="w-full h-full bg-[var(--theme-accent)]"></div>
                   )}
                </div>
                
                <h4 className={`text-[10px] tracking-[0.4em] uppercase text-[var(--theme-primary)] mb-6 font-bold`}>We Are Getting Married</h4>
                <h2 className={`text-5xl md:text-6xl text-[var(--theme-accent)] mb-2 ${cormorant.className} italic`}>
                  {invitation.groom_name}
                </h2>
                <div className="w-8 h-[1px] bg-[var(--theme-primary)] mx-auto my-4"></div>
                <h2 className={`text-5xl md:text-6xl text-[var(--theme-accent)] mb-8 ${cormorant.className} italic`}>
                  {invitation.bride_name}
                </h2>
                
                <p className="text-[10px] tracking-[0.2em] uppercase text-[rgba(var(--theme-accent-rgb),0.6)] font-bold">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd . MM . yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* QUOTE SECTION */}
            <section className="py-24 px-10 text-center relative z-10 bg-[var(--theme-accent)] text-white">
              <Sparkles className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-8" />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5 }}
              >
                <p className={`text-2xl leading-relaxed text-[var(--theme-background)] italic ${cormorant.className}`}>
                  "I have found the one whom my soul loves."
                </p>
                <p className="mt-8 text-[9px] tracking-[0.3em] text-[var(--theme-primary)] uppercase font-bold">Song of Solomon 3:4</p>
              </motion.div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 relative z-10">
              <div className="text-center mb-20">
                <h3 className={`text-4xl mb-4 ${cormorant.className} italic text-[var(--theme-accent)]`}>Event Details</h3>
                <div className="w-16 h-[1px] bg-[var(--theme-primary)] mx-auto"></div>
              </div>

              <div className="space-y-12">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative p-8 border border-[rgba(var(--theme-primary-rgb),0.3)] text-center bg-white shadow-lg"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--theme-background)] px-4 text-[10px] tracking-[0.3em] font-bold text-[var(--theme-primary)] uppercase">Holy Matrimony</div>
                  
                  <h4 className={`text-3xl text-[var(--theme-accent)] mb-6 mt-4 ${cormorant.className} italic`}>Akad Nikah</h4>
                  
                  <div className="space-y-4 text-xs tracking-widest text-[rgba(var(--theme-accent-rgb),0.8)] mb-10 uppercase">
                    <div>
                      <p className="font-bold text-[var(--theme-accent)] mb-1">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                      <p>{invitation.akad_time || "08:00 WIB"}</p>
                    </div>
                    <div className="pt-4 border-t border-[rgba(var(--theme-background-rgb),0.5)] w-2/3 mx-auto">
                      <p className="font-bold text-[var(--theme-accent)] mb-1">{invitation.akad_venue || "Lokasi Akad"}</p>
                      <p className="normal-case tracking-normal">{invitation.akad_address}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-w-[250px] mx-auto">
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[var(--theme-accent)] text-[var(--theme-primary)] py-3 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors border border-[var(--theme-accent)]">
                         Open Maps
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-transparent border border-[rgba(var(--theme-accent-rgb),0.2)] text-[var(--theme-accent)] py-3 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[rgba(var(--theme-accent-rgb),0.05)] transition-colors">
                       Save to Calendar
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="relative p-8 border border-[rgba(var(--theme-primary-rgb),0.3)] text-center bg-white shadow-lg"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--theme-background)] px-4 text-[10px] tracking-[0.3em] font-bold text-[var(--theme-primary)] uppercase">Wedding Reception</div>
                  
                  <h4 className={`text-3xl text-[var(--theme-accent)] mb-6 mt-4 ${cormorant.className} italic`}>Resepsi</h4>
                  
                  <div className="space-y-4 text-xs tracking-widest text-[rgba(var(--theme-accent-rgb),0.8)] mb-10 uppercase">
                    <div>
                      <p className="font-bold text-[var(--theme-accent)] mb-1">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                      <p>{invitation.reception_time || "11:00 WIB"}</p>
                    </div>
                    <div className="pt-4 border-t border-[rgba(var(--theme-background-rgb),0.5)] w-2/3 mx-auto">
                      <p className="font-bold text-[var(--theme-accent)] mb-1">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                      <p className="normal-case tracking-normal">{invitation.reception_address}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 max-w-[250px] mx-auto">
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[var(--theme-accent)] text-[var(--theme-primary)] py-3 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors border border-[var(--theme-accent)]">
                         Open Maps
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-transparent border border-[rgba(var(--theme-accent-rgb),0.2)] text-[var(--theme-accent)] py-3 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[rgba(var(--theme-accent-rgb),0.05)] transition-colors">
                       Save to Calendar
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* LIVE COUNTDOWN & AR FILTER CTA */}
            <section className="py-24 px-6 bg-[var(--theme-accent)] text-center relative overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <h3 className={`text-4xl mb-4 ${cormorant.className} italic text-white`}>Counting Down</h3>
                <div className="w-12 h-[1px] bg-[var(--theme-primary)] mx-auto mb-12"></div>
                
                <div className="flex justify-center gap-6 mb-16">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hrs", value: timeLeft.hours },
                    { label: "Min", value: timeLeft.minutes },
                    { label: "Sec", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`text-4xl text-[var(--theme-primary)] mb-2 ${cormorant.className} italic font-bold`}>
                        {item.value.toString().padStart(2, "0")}
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="border border-[rgba(var(--theme-primary-rgb),0.3)] p-8 mx-auto max-w-xs relative bg-white/5 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--theme-primary)]"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--theme-primary)]"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--theme-primary)]"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--theme-primary)]"></div>
                  
                  <Camera className="w-6 h-6 mx-auto text-[var(--theme-primary)] mb-4" />
                  <p className="text-xs tracking-widest uppercase font-bold text-white mb-2">AR Filter</p>
                  <p className="text-[10px] text-white/60 mb-6 leading-relaxed">Share your moments with our exclusive Instagram filter.</p>
                  <button className="bg-transparent border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] w-full">
                    Try Filter
                  </button>
                </div>
              </motion.div>
            </section>

            {/* FLOATING 3D PHOTO GALLERY */}
            <section className="py-24 px-6 bg-[var(--theme-background)] overflow-hidden relative z-10">
              <div className="text-center mb-20">
                <h3 className={`text-4xl mb-4 ${cormorant.className} italic text-[var(--theme-accent)]`}>Gallery</h3>
                <div className="w-16 h-[1px] bg-[var(--theme-primary)] mx-auto"></div>
              </div>

              {/* 3D Interactive Container */}
              <motion.div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, perspective: 1200 }}
                className="relative w-full h-[450px] flex items-center justify-center cursor-crosshair"
              >
                {/* Center Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute z-30 w-56 h-72 p-2 bg-white shadow-2xl border border-[rgba(var(--theme-primary-rgb),0.2)]"
                >
                  <div className="w-full h-full bg-[var(--theme-background)] overflow-hidden relative">
                    {(customData?.gallery_1 || invitation.cover_image_url) && <Image src={customData?.gallery_1 || invitation.cover_image_url} alt="Gallery 1" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />}
                  </div>
                </motion.div>
                
                {/* Left Image */}
                <motion.div 
                  initial={{ opacity: 0, x: -60, rotateY: 30 }}
                  whileInView={{ opacity: 1, x: -100, rotateY: 15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute z-20 w-44 h-64 p-2 bg-white shadow-xl -translate-x-24 -translate-y-8 border border-[var(--theme-background)]"
                >
                  <div className="w-full h-full bg-[rgba(var(--theme-background-rgb),0.3)] overflow-hidden relative rounded-bl-[40px]">
                     {(customData?.gallery_2 || invitation.cover_image_url) && <Image src={customData?.gallery_2 || invitation.cover_image_url} alt="Gallery 2" fill className="object-cover sepia opacity-80 hover:opacity-100 transition-opacity" />}
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div 
                  initial={{ opacity: 0, x: 60, rotateY: -30 }}
                  whileInView={{ opacity: 1, x: 100, rotateY: -15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute z-10 w-44 h-64 p-2 bg-white shadow-xl translate-x-24 translate-y-8 border border-[var(--theme-background)]"
                >
                  <div className="w-full h-full bg-[rgba(var(--theme-primary-rgb),0.3)] overflow-hidden relative rounded-br-[40px]">
                     {(customData?.gallery_3 || invitation.cover_image_url) && <Image src={customData?.gallery_3 || invitation.cover_image_url} alt="Gallery 3" fill className="object-cover opacity-60 mix-blend-overlay hover:mix-blend-normal hover:opacity-100 transition-all" />}
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6 bg-white relative z-10 border-y border-[var(--theme-background)]">
                <div className="text-center mb-16">
                  <Gift className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-6" />
                  <h3 className={`text-4xl mb-4 ${cormorant.className} italic text-[var(--theme-accent)]`}>Wedding Gift</h3>
                  <div className="w-16 h-[1px] bg-[var(--theme-primary)] mx-auto"></div>
                </div>

                <div className="space-y-8 max-w-sm mx-auto">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-[rgba(var(--theme-primary-rgb),0.3)] p-8 text-center relative group hover:border-[var(--theme-primary)] transition-colors"
                    >
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--theme-primary)]"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--theme-primary)]"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--theme-primary)]"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--theme-primary)]"></div>

                      <p className="text-[9px] uppercase tracking-[0.3em] font-bold mb-4 text-[rgba(var(--theme-accent-rgb),0.6)]">{account.bank_name}</p>
                      <p className={`text-2xl tracking-widest mb-3 text-[var(--theme-accent)] font-medium ${cormorant.className} italic`}>{account.account_number}</p>
                      <p className="text-xs text-[rgba(var(--theme-accent-rgb),0.8)] mb-8 uppercase tracking-widest">A.N {account.account_name}</p>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="flex items-center justify-center gap-2 bg-[var(--theme-accent)] text-[var(--theme-primary)] py-3 text-[9px] font-bold tracking-[0.2em] uppercase hover:bg-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors w-full"
                      >
                        {copiedBank === account.id ? (
                          <>
                            <span>Copied!</span>
                            <Check className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Copy Account</span>
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
            <section className="py-24 px-6 bg-[var(--theme-background)] relative z-10">
              <div className="text-center mb-16">
                <h3 className={`text-4xl mb-4 ${cormorant.className} italic text-[var(--theme-accent)]`}>RSVP & Wishes</h3>
                <div className="w-16 h-[1px] bg-[var(--theme-primary)] mx-auto"></div>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-white p-8 border border-[var(--theme-background)] shadow-lg mb-16 max-w-sm mx-auto"
                >
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-transparent border-b border-[var(--theme-background)] py-3 text-xs tracking-widest text-[var(--theme-accent)] focus:outline-none focus:border-[var(--theme-primary)] transition-colors uppercase placeholder:normal-case placeholder:tracking-normal"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-transparent border-b border-[var(--theme-background)] py-3 text-xs tracking-widest text-[var(--theme-accent)] focus:outline-none focus:border-[var(--theme-primary)] transition-colors uppercase"
                      >
                        <option value="hadir">Will Attend</option>
                        <option value="tidak_hadir">Cannot Attend</option>
                      </select>
                    </div>
                    {rsvpStatus === "hadir" && (
                       <div>
                          <select
                            value={rsvpCount}
                            onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                            className="w-full bg-transparent border-b border-[var(--theme-background)] py-3 text-xs tracking-widest text-[var(--theme-accent)] focus:outline-none focus:border-[var(--theme-primary)] transition-colors uppercase"
                          >
                            <option value={1}>1 Person</option>
                            <option value={2}>2 Persons</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-[var(--theme-accent)] text-[var(--theme-primary)] py-4 uppercase tracking-[0.2em] text-[9px] font-bold hover:bg-[var(--theme-primary)] hover:text-[var(--theme-accent)] transition-colors disabled:opacity-70 mt-6"
                    >
                      {submittingRsvp ? "Sending..." : "Send RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 text-center border border-[var(--theme-background)] shadow-lg mb-16 max-w-sm mx-auto">
                  <Check className="w-8 h-8 text-[var(--theme-primary)] mx-auto mb-4" />
                  <h4 className={`text-2xl text-[var(--theme-accent)] mb-2 ${cormorant.className} italic`}>Thank You</h4>
                  <p className="text-[rgba(var(--theme-accent-rgb),0.6)] text-xs tracking-widest uppercase">Your confirmation has been received.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 bg-white border border-[var(--theme-background)] shadow-sm max-w-md mx-auto"
              >
                <textarea
                  rows={4}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-transparent text-sm p-6 text-[var(--theme-accent)] focus:outline-none resize-none placeholder:text-[rgba(var(--theme-accent-rgb),0.3)]"
                  placeholder="Write your wishes here..."
                  required
                />
                <div className="flex justify-between items-center px-6 pb-4 border-t border-[rgba(var(--theme-background-rgb),0.5)] pt-4 bg-[rgba(var(--theme-background-rgb),0.5)]">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--theme-accent)] font-bold">{wishName || "Guest"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-transparent text-[var(--theme-primary)] p-2 hover:text-[var(--theme-accent)] transition-colors disabled:opacity-50 flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </motion.form>

              {/* Scrollable Wishes List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar max-w-md mx-auto">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 border border-[var(--theme-background)] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[rgba(var(--theme-background-rgb),0.5)]">
                      <p className="font-bold text-[10px] tracking-[0.2em] uppercase text-[var(--theme-accent)]">{wish.guest_name}</p>
                      <span className="text-[9px] tracking-widest text-[rgba(var(--theme-accent-rgb),0.4)] uppercase">{format(new Date(wish.created_at), "dd.MM.yy", { locale: id })}</span>
                    </div>
                    <p className={`text-sm text-[rgba(var(--theme-accent-rgb),0.8)] leading-loose italic ${cormorant.className}`}>
                      "{wish.message}"
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 text-center px-6 bg-[var(--theme-accent)] text-white relative z-10">
              <Sparkles className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-8" />
              <h2 className={`text-3xl mb-8 ${cormorant.className} italic text-[var(--theme-background)]`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="w-8 h-[1px] bg-[var(--theme-primary)] mx-auto mb-8"></div>
              <div className="text-[8px] tracking-[0.3em] text-white/50 uppercase flex flex-col items-center gap-2">
                <span>Created with love by</span>
                <a href="https://nikahlink.com" className="text-[var(--theme-primary)] hover:text-white transition-colors font-bold">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
