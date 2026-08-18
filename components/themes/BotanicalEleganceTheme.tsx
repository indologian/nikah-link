"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Camera } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { id } from "date-fns/locale";
import { Montserrat, Great_Vibes } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });
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

export default function BotanicalEleganceTheme({
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

  // Smooth scroll progress
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax Values
  const yBg = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const yElement = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);
  
  // States for RSVP & Wishes
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
    const { error } = await supabase.from("guests").insert({
      invitation_id: invitation.id,
      name: wishName || guestName,
      rsvp_status: rsvpStatus,
      session: "all",
      notes: rsvpNotes,
      phone: "",
    });
    if (!error) {
      setRsvpSuccess(true);
    }
    setSubmittingRsvp(false);
  };

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

  // Gallery 3D interaction logic (Mouse Move)
  const xMove = useMotionValue(0);
  const yMove = useMotionValue(0);
  const rotateX = useTransform(yMove, [-100, 100], [15, -15]);
  const rotateY = useTransform(xMove, [-100, 100], [-15, 15]);

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

  // Reusable SVG Component with path drawing animation
  const DrawSVGLeaf = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
    <motion.svg viewBox="0 0 100 200" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <motion.path 
        d="M50,200 C30,150 10,120 50,50 C90,120 70,150 50,200" 
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 2, ease: "easeInOut", delay }}
      />
      <motion.path 
        d="M50,200 Q20,120 50,50 M50,150 Q70,120 50,80" 
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.5 }}
      />
    </motion.svg>
  );

  return (
    <div ref={containerRef} className={`min-h-screen bg-[#FDFDF9] text-[#5A6351] overflow-hidden ${montserrat.className} relative selection:bg-[#E2D2CA] selection:text-[#5A6351]`}>
      
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-[0_5px_15px_rgba(90,99,81,0.1)] border border-[#E2D2CA] text-[#869578] hover:bg-[#F4EBE6] transition-colors"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* PRELOADER COVER (Viding Inspired) */
          <motion.div
            key="cover"
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFDF9] overflow-hidden border-8 border-[#F4EBE6]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#E2D2CA]/10 to-[#869578]/10 pointer-events-none"></div>
            
            {/* SVG Ornaments on Cover */}
            <DrawSVGLeaf className="absolute top-0 left-0 w-64 h-64 text-[#E2D2CA] rotate-[135deg] opacity-60" delay={0.2} />
            <DrawSVGLeaf className="absolute bottom-0 right-0 w-64 h-64 text-[#869578] -rotate-[45deg] opacity-40" delay={0.5} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 1 }}
              className="relative z-30 flex flex-col items-center text-center p-8 max-w-sm w-full bg-white/50 backdrop-blur-sm rounded-t-full rounded-b-3xl border border-[#F4EBE6] shadow-2xl py-12"
            >
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#869578] mb-6">Pernikahan Dari</p>
              
              <h1 className={`text-5xl md:text-6xl text-[#5A6351] mb-2 ${greatVibes.className}`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <span className={`text-2xl text-[#E2D2CA] my-2 ${greatVibes.className}`}>&</span>
              <h1 className={`text-5xl md:text-6xl text-[#5A6351] mb-10 ${greatVibes.className}`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="w-16 h-[1px] bg-[#E2D2CA] mb-6"></div>

              <p className="text-[9px] tracking-[0.2em] uppercase text-[#869578] mb-1">Kepada Yth.</p>
              <p className="text-lg font-medium text-[#5A6351] mb-8">{guestName}</p>

              <button
                onClick={handleOpenInvitation}
                className="group relative overflow-hidden bg-[#5A6351] text-white px-8 py-3 rounded-full uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-[#869578] shadow-lg"
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
            transition={{ duration: 1.5 }}
            className="w-full max-w-lg mx-auto relative z-10 bg-white min-h-screen border-x border-[#F4EBE6] shadow-[0_0_50px_rgba(90,99,81,0.05)]"
          >
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-8 text-center pt-16 overflow-hidden bg-[#FDFDF9]">
              <DrawSVGLeaf className="absolute top-10 left-[-20px] w-48 h-48 text-[#869578]/20 rotate-[110deg]" />
              <DrawSVGLeaf className="absolute bottom-20 right-[-30px] w-56 h-56 text-[#E2D2CA]/30 -rotate-45" />

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="relative z-10"
              >
                <div className="w-48 h-64 mx-auto mb-8 relative rounded-full overflow-hidden border-8 border-white shadow-xl">
                   {invitation.cover_image_url ? (
                      <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
                   ) : (
                      <div className="w-full h-full bg-[#E2D2CA]/30"></div>
                   )}
                </div>
                
                <h4 className={`text-lg tracking-[0.3em] uppercase text-[#869578] mb-4`}>The Wedding Of</h4>
                <h2 className={`text-5xl font-bold mb-2 ${greatVibes.className} text-[#5A6351]`}>
                  {invitation.groom_name}
                </h2>
                <h2 className={`text-3xl text-[#E2D2CA] mb-2 ${greatVibes.className}`}>
                  &
                </h2>
                <h2 className={`text-5xl font-bold mb-6 ${greatVibes.className} text-[#5A6351]`}>
                  {invitation.bride_name}
                </h2>
                
                <p className="text-xs tracking-widest uppercase text-[#869578]">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* QUOTE SECTION WITH SVG DRAWING */}
            <section className="py-24 px-10 text-center relative overflow-hidden bg-white">
              <DrawSVGLeaf className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 text-[#E2D2CA]/40 rotate-90" delay={0.2} />
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5 }}
                className="relative z-10 pt-10"
              >
                <p className={`text-xl leading-loose text-[#869578] italic font-light`}>
                  "Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah."
                </p>
                <p className="mt-6 text-[10px] tracking-widest text-[#E2D2CA] uppercase font-semibold">(QS. Az-Zariyat: 49)</p>
              </motion.div>
            </section>

            {/* LIVE COUNTDOWN & AR FILTER CTA */}
            <section className="py-20 px-6 bg-[#F4EBE6]/30 text-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h3 className={`text-3xl mb-8 ${greatVibes.className} text-[#5A6351]`}>Menghitung Hari</h3>
                
                <div className="flex justify-center gap-4 mb-12">
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-light text-[#869578] shadow-sm border border-[#E2D2CA]/30">
                        {item.value.toString().padStart(2, "0")}
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-[#5A6351] mt-2 font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E2D2CA]/30 mx-auto max-w-sm">
                  <Camera className="w-8 h-8 mx-auto text-[#E2D2CA] mb-3" />
                  <p className="text-sm font-medium text-[#5A6351] mb-2">Abadikan Momen Bersama</p>
                  <p className="text-[10px] text-[#869578] mb-4">Gunakan filter Instagram eksklusif pernikahan kami saat acara berlangsung.</p>
                  <button className="bg-[#E2D2CA]/20 text-[#869578] hover:bg-[#E2D2CA] hover:text-white transition-colors px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 w-full">
                    <Camera className="w-3 h-3" /> Coba Filter IG
                  </button>
                </div>
              </motion.div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 relative bg-white">
              <DrawSVGLeaf className="absolute top-40 -left-10 w-48 h-48 text-[#869578]/10 rotate-[80deg]" delay={0.2} />
              
              <div className="text-center mb-16 relative z-10">
                <h3 className={`text-4xl mb-2 ${greatVibes.className} text-[#5A6351]`}>Rangkaian Acara</h3>
                <p className={`text-[10px] tracking-widest text-[#E2D2CA] uppercase font-bold`}>Save the Date</p>
              </div>

              <div className="space-y-10 relative z-10">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-[#FDFDF9] rounded-t-full rounded-b-3xl p-8 pt-16 shadow-[0_10px_30px_rgba(90,99,81,0.05)] border border-[#F4EBE6] text-center relative"
                >
                  <h4 className={`text-2xl font-bold text-[#869578] mb-2`}>Akad Nikah</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#E2D2CA] mb-8 border-b border-[#F4EBE6] pb-4 mx-4">Janji Suci</p>
                  
                  <div className="space-y-6 text-sm text-[#5A6351] mb-8">
                    <div>
                      <p className="font-bold mb-1">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                      <p className="text-[#869578]">{invitation.akad_time || "08:00 WIB"}</p>
                    </div>
                    <div>
                      <p className="font-bold mb-1">{invitation.akad_venue || "Lokasi Akad"}</p>
                      <p className="text-xs text-[#869578] leading-relaxed px-4">{invitation.akad_address}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#869578] text-white py-3 rounded-full uppercase text-[10px] font-bold tracking-widest hover:bg-[#5A6351] transition-colors">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border border-[#E2D2CA] text-[#869578] py-3 rounded-full uppercase text-[10px] font-bold tracking-widest hover:bg-[#F4EBE6] transition-colors">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-[#FDFDF9] rounded-t-3xl rounded-b-full p-8 pb-16 shadow-[0_10px_30px_rgba(90,99,81,0.05)] border border-[#F4EBE6] text-center relative"
                >
                  <h4 className={`text-2xl font-bold text-[#869578] mb-2`}>Resepsi</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#E2D2CA] mb-8 border-b border-[#F4EBE6] pb-4 mx-4">Syukuran</p>
                  
                  <div className="space-y-6 text-sm text-[#5A6351] mb-8">
                    <div>
                      <p className="font-bold mb-1">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                      <p className="text-[#869578]">{invitation.reception_time || "11:00 WIB"}</p>
                    </div>
                    <div>
                      <p className="font-bold mb-1">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                      <p className="text-xs text-[#869578] leading-relaxed px-4">{invitation.reception_address}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#869578] text-white py-3 rounded-full uppercase text-[10px] font-bold tracking-widest hover:bg-[#5A6351] transition-colors">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white border border-[#E2D2CA] text-[#869578] py-3 rounded-full uppercase text-[10px] font-bold tracking-widest hover:bg-[#F4EBE6] transition-colors">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* FLOATING 3D PHOTO GALLERY */}
            <section className="py-24 px-6 bg-white overflow-hidden relative">
              <div className="text-center mb-16 relative z-10">
                <h3 className={`text-4xl mb-2 ${greatVibes.className} text-[#5A6351]`}>Our Moments</h3>
                <p className={`text-[10px] tracking-widest text-[#E2D2CA] uppercase font-bold`}>Galeri Cinta</p>
              </div>

              {/* 3D Interactive Container */}
              <motion.div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, perspective: 1000 }}
                className="relative w-full h-[400px] flex items-center justify-center"
              >
                {/* Center Image */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute z-30 w-48 h-64 bg-white p-2 shadow-2xl rotate-3 rounded-sm border border-gray-100"
                >
                  <div className="w-full h-full bg-[#E2D2CA]/40 overflow-hidden relative">
                    {(customData?.gallery_1 || invitation.cover_image_url) && <Image src={customData?.gallery_1 || invitation.cover_image_url} alt="Gallery 1" fill className="object-cover" />}
                  </div>
                </motion.div>
                
                {/* Left Image */}
                <motion.div 
                  initial={{ opacity: 0, x: -50, rotate: -15 }}
                  whileInView={{ opacity: 1, x: -80, rotate: -10 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute z-20 w-40 h-56 bg-white p-2 shadow-xl -translate-x-20 rounded-sm border border-gray-100"
                >
                  <div className="w-full h-full bg-[#869578]/40 overflow-hidden relative">
                     {(customData?.gallery_2 || invitation.cover_image_url) && <Image src={customData?.gallery_2 || invitation.cover_image_url} alt="Gallery 2" fill className="object-cover opacity-80" />}
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div 
                  initial={{ opacity: 0, x: 50, rotate: 15 }}
                  whileInView={{ opacity: 1, x: 80, rotate: 10 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute z-10 w-40 h-56 bg-white p-2 shadow-xl translate-x-20 rounded-sm border border-gray-100"
                >
                  <div className="w-full h-full bg-[#E2D2CA]/60 overflow-hidden relative">
                     {(customData?.gallery_3 || invitation.cover_image_url) && <Image src={customData?.gallery_3 || invitation.cover_image_url} alt="Gallery 3" fill className="object-cover opacity-60 mix-blend-multiply" />}
                  </div>
                </motion.div>
              </motion.div>
              
              <p className="text-center text-xs text-[#869578] mt-8 opacity-60 italic">(Sentuh & geser untuk efek 3D)</p>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6 bg-[#FDFDF9] relative z-10 border-t border-[#F4EBE6]">
                <div className="text-center mb-12">
                  <Gift className="w-8 h-8 text-[#E2D2CA] mx-auto mb-4" />
                  <h3 className={`text-4xl mb-2 ${greatVibes.className} text-[#5A6351]`}>Wedding Gift</h3>
                  <p className={`text-[10px] text-[#869578] tracking-widest uppercase`}>Tanda Kasih</p>
                </div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 rounded-3xl shadow-sm border border-[#F4EBE6] text-center"
                    >
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 text-[#869578]">{account.bank_name}</p>
                      <p className={`text-2xl tracking-widest mb-2 text-[#5A6351] font-light`}>{account.account_number}</p>
                      <p className="text-sm text-[#869578] mb-8 font-medium">A.N {account.account_name}</p>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="w-full flex items-center justify-center gap-2 bg-[#FDFDF9] text-[#5A6351] py-3 rounded-full uppercase text-[10px] font-bold tracking-widest border border-[#E2D2CA] hover:bg-[#E2D2CA] hover:text-white transition-colors"
                      >
                        {copiedBank === account.id ? (
                          <>
                            <span>Tersalin!</span>
                            <Check className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Salin Nomor Rekening</span>
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
            <section className="py-24 px-6 bg-white relative z-10">
              <DrawSVGLeaf className="absolute -top-10 right-0 w-32 h-32 text-[#869578]/20 -rotate-90" delay={0.2} />
              <div className="text-center mb-12">
                <h3 className={`text-4xl mb-2 ${greatVibes.className} text-[#5A6351]`}>Buku Tamu</h3>
                <p className={`text-[10px] text-[#869578] tracking-widest uppercase`}>RSVP & Ucapan</p>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-[#FDFDF9] p-8 rounded-3xl border border-[#F4EBE6] mb-16 shadow-sm"
                >
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full bg-transparent border-b border-[#E2D2CA] py-3 text-sm text-[#5A6351] focus:outline-none focus:border-[#869578] transition-colors placeholder:text-[#E2D2CA]"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-transparent border-b border-[#E2D2CA] py-3 text-sm text-[#5A6351] focus:outline-none focus:border-[#869578] transition-colors"
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
                            className="w-full bg-transparent border-b border-[#E2D2CA] py-3 text-sm text-[#5A6351] focus:outline-none focus:border-[#869578] transition-colors"
                          >
                            <option value={1}>1 Orang</option>
                            <option value={2}>2 Orang</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-[#869578] text-white py-4 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#5A6351] transition-colors disabled:opacity-70 mt-4"
                    >
                      {submittingRsvp ? "Mengirim..." : "Kirim RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#FDFDF9] p-10 rounded-3xl text-center border border-[#E2D2CA] mb-16 shadow-sm">
                  <Check className="w-12 h-12 text-[#869578] mx-auto mb-4" />
                  <h4 className={`text-xl font-bold text-[#5A6351] mb-2`}>Terima Kasih</h4>
                  <p className="text-[#869578] text-sm">Konfirmasi Anda telah diterima.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 bg-[#FDFDF9] rounded-3xl p-2 border border-[#F4EBE6] shadow-sm"
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-transparent text-sm p-4 text-[#5A6351] focus:outline-none resize-none placeholder:text-[#E2D2CA]"
                  placeholder="Tuliskan ucapan dan doa..."
                  required
                />
                <div className="flex justify-between items-center px-4 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#869578] font-bold">{wishName || "Tamu"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-[#E2D2CA] text-white p-3 rounded-full hover:bg-[#869578] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>

              {/* Scrollable Wishes List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-5 rounded-2xl border border-[#F4EBE6] shadow-sm flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#FDFDF9] border border-[#E2D2CA] flex items-center justify-center text-[#869578] font-bold text-sm shrink-0">
                      {wish.guest_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-xs text-[#5A6351]">{wish.guest_name}</p>
                        <span className="text-[9px] text-[#E2D2CA]">• {format(new Date(wish.created_at), "dd MMM", { locale: id })}</span>
                      </div>
                      <p className={`text-sm text-[#869578] leading-relaxed`}>
                        {wish.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 text-center px-6 bg-[#FDFDF9] relative z-10">
              <DrawSVGLeaf className="w-16 h-16 text-[#E2D2CA] mx-auto mb-6 opacity-50 rotate-180" />
              <h2 className={`text-4xl mb-6 ${greatVibes.className} text-[#5A6351]`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="text-[9px] tracking-[0.3em] text-[#869578] uppercase flex flex-col items-center gap-2 font-medium">
                <span>Dibuat dengan cinta oleh</span>
                <a href="https://nikahlink.com" className="text-[#5A6351] hover:text-[#869578] transition-colors border-b border-[#E2D2CA]">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
