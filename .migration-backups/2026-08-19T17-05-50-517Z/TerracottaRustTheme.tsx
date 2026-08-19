"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Camera, Wind } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { id } from "date-fns/locale";
import { Lora, Playfair_Display } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700", "800"], style: ["normal", "italic"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function TerracottaRustTheme({
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
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

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

  // 3D Tilt Logic
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

  // SVG Drawing Element: Bohemian Palm Leaf (Swaying + Drawing)
  const PalmLeafSVG = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
    <motion.svg 
      viewBox="0 0 200 200" 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Stem */}
      <motion.path 
        d="M100,200 Q100,100 100,20"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay }}
      />
      {/* Left Fronds */}
      {[160, 140, 120, 100, 80, 60, 40].map((y, i) => (
        <motion.path 
          key={`l-${i}`}
          d={`M100,${y} Q50,${y-30} 20,${y-10}`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 1 + (i * 0.1) }}
        />
      ))}
      {/* Right Fronds */}
      {[160, 140, 120, 100, 80, 60, 40].map((y, i) => (
        <motion.path 
          key={`r-${i}`}
          d={`M100,${y} Q150,${y-30} 180,${y-10}`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 1 + (i * 0.1) }}
        />
      ))}
    </motion.svg>
  );

  return (
    <div ref={containerRef} className={`min-h-screen bg-[#F7F3EE] text-[#4A3B32] overflow-hidden ${lora.className} relative selection:bg-[#C87963] selection:text-white`}>
      
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#C87963] rounded-full shadow-2xl text-white hover:bg-[#A65E49] transition-colors border-2 border-white/20"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* PRELOADER COVER */
          <motion.div
            key="cover"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F7F3EE] overflow-hidden"
          >
            {/* Split Screen Cover Effect */}
            <motion.div exit={{ y: "-100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute top-0 left-0 right-0 h-1/2 bg-[#C87963] pointer-events-none origin-top"></motion.div>
            <motion.div exit={{ y: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#C87963] pointer-events-none origin-bottom"></motion.div>
            
            <PalmLeafSVG className="absolute top-0 left-0 w-64 h-64 text-[#F7F3EE]/30 rotate-[135deg]" delay={0.2} />
            <PalmLeafSVG className="absolute bottom-0 right-0 w-64 h-64 text-[#F7F3EE]/30 -rotate-[45deg]" delay={0.5} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 1.5 }}
              className="relative z-30 flex flex-col items-center text-center p-8 max-w-sm w-full bg-[#F7F3EE] rounded-t-full rounded-b-md shadow-2xl py-12 border-4 border-[#C87963]"
            >
              <Wind className="w-6 h-6 text-[#C87963] mb-6" />
              
              <h1 className={`text-4xl md:text-5xl text-[#C87963] mb-2 ${playfair.className} italic font-bold`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <span className={`text-xl text-[#A65E49] my-2 ${playfair.className}`}>&amp;</span>
              <h1 className={`text-4xl md:text-5xl text-[#C87963] mb-10 ${playfair.className} italic font-bold`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="w-full max-w-[200px] mb-8">
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#A65E49] mb-1">Kpd Yth.</p>
                <div className="border-b border-[#C87963]/50 pb-2">
                  <p className="text-lg font-bold text-[#4A3B32]">{guestName}</p>
                </div>
              </div>

              <button
                onClick={handleOpenInvitation}
                className="group relative overflow-hidden bg-[#C87963] text-white px-8 py-3 rounded-md uppercase text-[10px] tracking-[0.2em] font-bold transition-all hover:bg-[#A65E49] shadow-lg"
              >
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full max-w-md mx-auto relative z-10 bg-[#F7F3EE] min-h-screen border-x border-[#EADCCC] shadow-2xl"
          >
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center pt-16 overflow-hidden">
              <PalmLeafSVG className="absolute top-10 -left-10 w-56 h-56 text-[#C87963]/20 rotate-[120deg]" />
              <PalmLeafSVG className="absolute bottom-20 -right-10 w-64 h-64 text-[#A65E49]/15 -rotate-[30deg]" />

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="relative z-10 w-full flex flex-col items-center"
              >
                {/* Torn Paper / Artistic Mask */}
                <div className="w-56 h-80 mx-auto mb-10 relative overflow-hidden rounded-t-[100px] rounded-bl-[50px] rounded-br-[100px] shadow-[10px_10px_0px_#C87963]">
                   {invitation.cover_image_url ? (
                      <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover sepia-[0.4]" />
                   ) : (
                      <div className="w-full h-full bg-[#EADCCC]"></div>
                   )}
                </div>
                
                <h4 className={`text-[9px] tracking-[0.4em] uppercase text-[#A65E49] mb-4 font-bold`}>Pernikahan</h4>
                <h2 className={`text-5xl font-bold mb-0 ${playfair.className} italic text-[#C87963]`}>
                  {invitation.groom_name}
                </h2>
                <h2 className={`text-2xl text-[#4A3B32] my-2 ${playfair.className}`}>&</h2>
                <h2 className={`text-5xl font-bold mb-8 ${playfair.className} italic text-[#C87963]`}>
                  {invitation.bride_name}
                </h2>
                
                <p className="text-xs tracking-widest uppercase text-[#4A3B32] font-semibold">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* QUOTE SECTION */}
            <section className="py-24 px-10 text-center relative overflow-hidden bg-[#EADCCC]/40">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5 }}
                className="relative z-10"
              >
                <Wind className="w-6 h-6 text-[#C87963] mx-auto mb-6" />
                <p className={`text-xl leading-loose text-[#4A3B32] italic ${playfair.className}`}>
                  "Cinta sejati tidak datang kepada Anda. Itu harus tumbuh dari dalam hati dan menemukan pasangannya."
                </p>
              </motion.div>
            </section>

            {/* LIVE COUNTDOWN & AR FILTER CTA */}
            <section className="py-20 px-6 bg-[#C87963] text-center text-white relative">
              <PalmLeafSVG className="absolute -top-20 right-0 w-48 h-48 text-[#A65E49]/30 -rotate-90" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <h3 className={`text-3xl mb-8 ${playfair.className} italic font-bold`}>Menuju Hari H</h3>
                
                <div className="flex justify-center gap-4 mb-12">
                  {[
                    { label: "Hari", value: timeLeft.days },
                    { label: "Jam", value: timeLeft.hours },
                    { label: "Menit", value: timeLeft.minutes },
                    { label: "Detik", value: timeLeft.seconds },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-[#A65E49]/50 w-16 h-20 justify-center rounded-sm">
                      <div className={`text-2xl font-bold mb-1 ${playfair.className}`}>{item.value.toString().padStart(2, "0")}</div>
                      <span className="text-[9px] uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#F7F3EE] p-6 mx-auto max-w-sm rounded-sm text-[#4A3B32] shadow-xl relative">
                  <Camera className="w-8 h-8 mx-auto text-[#C87963] mb-3" />
                  <p className="text-sm font-bold mb-1">Filter Instagram Kami</p>
                  <p className="text-[10px] text-[#A65E49] mb-4">Gunakan filter khusus kami saat mengabadikan momen di acara.</p>
                  <button className="bg-[#C87963] text-white hover:bg-[#A65E49] transition-colors px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 w-full rounded-sm">
                    Coba Filter
                  </button>
                </div>
              </motion.div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 relative bg-[#F7F3EE]">
              <div className="text-center mb-16 relative z-10">
                <h3 className={`text-4xl mb-2 ${playfair.className} italic text-[#C87963] font-bold`}>Detail Acara</h3>
                <p className={`text-[10px] tracking-[0.3em] text-[#A65E49] uppercase font-bold`}>Save the Date</p>
              </div>

              <div className="space-y-8 relative z-10">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-white p-8 shadow-sm border-l-[10px] border-[#C87963] relative"
                >
                  <h4 className={`text-2xl font-bold text-[#4A3B32] mb-6 ${playfair.className} italic`}>Akad Nikah</h4>
                  
                  <div className="space-y-4 text-sm text-[#4A3B32] mb-8">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-[#C87963] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[#A65E49]">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[#C87963] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.akad_venue || "Lokasi Akad"}</p>
                        <p className="text-[#A65E49] mt-1 text-xs">{invitation.akad_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#C87963] text-white py-3 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#A65E49] transition-colors rounded-sm">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-[#C87963] text-[#C87963] py-3 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#C87963]/10 transition-colors rounded-sm">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-white p-8 shadow-sm border-r-[10px] border-[#A65E49] relative"
                >
                  <h4 className={`text-2xl font-bold text-[#4A3B32] mb-6 ${playfair.className} italic`}>Resepsi</h4>
                  
                  <div className="space-y-4 text-sm text-[#4A3B32] mb-8">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-[#A65E49] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[#A65E49]">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[#A65E49] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                        <p className="text-[#A65E49] mt-1 text-xs">{invitation.reception_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#A65E49] text-white py-3 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#4A3B32] transition-colors rounded-sm">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-[#A65E49] text-[#A65E49] py-3 uppercase text-[10px] font-bold tracking-[0.2em] hover:bg-[#A65E49]/10 transition-colors rounded-sm">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* FLOATING 3D PHOTO GALLERY */}
            <section className="py-24 px-6 bg-[#EADCCC]/30 overflow-hidden relative">
              <div className="text-center mb-16 relative z-10">
                <h3 className={`text-4xl mb-2 ${playfair.className} italic text-[#C87963] font-bold`}>Galeri Cinta</h3>
              </div>

              {/* 3D Interactive Container */}
              <motion.div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, perspective: 800 }}
                className="relative w-full h-[400px] flex items-center justify-center"
              >
                {/* Center Image */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="absolute z-30 w-52 h-64 bg-white p-3 shadow-2xl rotate-2"
                >
                  <div className="w-full h-full bg-[#EADCCC] overflow-hidden relative">
                    {(customData?.gallery_1 || invitation.cover_image_url) && <Image src={customData?.gallery_1 || invitation.cover_image_url} alt="Gallery 1" fill className="object-cover sepia-[0.2]" />}
                  </div>
                </motion.div>
                
                {/* Left Image */}
                <motion.div 
                  initial={{ opacity: 0, x: -50, rotate: -20 }}
                  whileInView={{ opacity: 1, x: -90, rotate: -15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute z-20 w-40 h-52 bg-white p-3 shadow-xl -translate-x-24"
                >
                  <div className="w-full h-full bg-[#C87963]/30 overflow-hidden relative">
                     {(customData?.gallery_2 || invitation.cover_image_url) && <Image src={customData?.gallery_2 || invitation.cover_image_url} alt="Gallery 2" fill className="object-cover" />}
                  </div>
                </motion.div>

                {/* Right Image */}
                <motion.div 
                  initial={{ opacity: 0, x: 50, rotate: 20 }}
                  whileInView={{ opacity: 1, x: 90, rotate: 15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute z-10 w-40 h-52 bg-white p-3 shadow-xl translate-x-24"
                >
                  <div className="w-full h-full bg-[#A65E49]/30 overflow-hidden relative">
                     {(customData?.gallery_3 || invitation.cover_image_url) && <Image src={customData?.gallery_3 || invitation.cover_image_url} alt="Gallery 3" fill className="object-cover" />}
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6 bg-[#F7F3EE] relative z-10 border-t border-[#EADCCC]">
                <div className="text-center mb-12">
                  <Gift className="w-8 h-8 text-[#C87963] mx-auto mb-4" />
                  <h3 className={`text-4xl mb-2 ${playfair.className} italic font-bold text-[#4A3B32]`}>Tanda Kasih</h3>
                  <p className={`text-[10px] text-[#A65E49] tracking-widest uppercase`}>Doa & Restu</p>
                </div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 shadow-sm border border-[#EADCCC] text-center rounded-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#C87963]"></div>
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 text-[#A65E49]">{account.bank_name}</p>
                      <p className={`text-2xl tracking-widest mb-2 text-[#4A3B32] font-bold ${playfair.className}`}>{account.account_number}</p>
                      <p className="text-sm text-[#4A3B32] mb-8 font-medium">A.N {account.account_name}</p>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="w-full flex items-center justify-center gap-2 bg-[#F7F3EE] text-[#C87963] py-3 uppercase text-[10px] font-bold tracking-[0.2em] border border-[#C87963] hover:bg-[#C87963] hover:text-white transition-colors rounded-sm"
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
            <section className="py-24 px-6 bg-white relative z-10 border-t border-[#EADCCC]">
              <PalmLeafSVG className="absolute -top-16 -left-10 w-40 h-40 text-[#C87963]/20 rotate-45" />
              <div className="text-center mb-12 relative z-10">
                <h3 className={`text-4xl mb-2 ${playfair.className} italic font-bold text-[#4A3B32]`}>RSVP</h3>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-[#F7F3EE] p-8 border border-[#EADCCC] mb-16 shadow-sm rounded-sm"
                >
                  <div className="space-y-6">
                    <div>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full bg-white border border-[#EADCCC] py-3 px-4 text-sm text-[#4A3B32] focus:outline-none focus:border-[#C87963] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-white border border-[#EADCCC] py-3 px-4 text-sm text-[#4A3B32] focus:outline-none focus:border-[#C87963] transition-colors"
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
                            className="w-full bg-white border border-[#EADCCC] py-3 px-4 text-sm text-[#4A3B32] focus:outline-none focus:border-[#C87963] transition-colors"
                          >
                            <option value={1}>1 Orang</option>
                            <option value={2}>2 Orang</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-[#C87963] text-white py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-[#A65E49] transition-colors disabled:opacity-70 mt-4 rounded-sm"
                    >
                      {submittingRsvp ? "Mengirim..." : "Kirim RSVP"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#F7F3EE] p-10 text-center border border-[#EADCCC] mb-16 shadow-sm rounded-sm">
                  <Check className="w-12 h-12 text-[#C87963] mx-auto mb-4" />
                  <h4 className={`text-xl font-bold text-[#4A3B32] mb-2`}>Terima Kasih</h4>
                  <p className="text-[#A65E49] text-sm">Konfirmasi Anda telah diterima.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 bg-white border border-[#C87963] p-1"
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-[#F7F3EE] text-sm p-4 text-[#4A3B32] focus:outline-none resize-none placeholder:text-[#A65E49]/50"
                  placeholder="Tuliskan ucapan dan doa..."
                  required
                />
                <div className="flex justify-between items-center px-4 py-2 bg-[#F7F3EE]">
                  <span className="text-[10px] uppercase tracking-widest text-[#A65E49] font-bold">{wishName || "Tamu"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-[#C87963] text-white p-3 hover:bg-[#A65E49] transition-colors disabled:opacity-50"
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#F7F3EE] p-6 border-l-4 border-[#C87963]"
                  >
                    <p className={`text-sm text-[#4A3B32] leading-relaxed mb-4 italic`}>
                      "{wish.message}"
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[10px] text-[#A65E49] uppercase tracking-[0.2em]">{wish.guest_name}</p>
                      <span className="text-[9px] text-[#A65E49]/60">{format(new Date(wish.created_at), "dd MMM yy", { locale: id })}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 text-center px-6 bg-[#C87963] text-white relative z-10">
              <PalmLeafSVG className="w-16 h-16 text-white/50 mx-auto mb-6 opacity-50" />
              <h2 className={`text-4xl mb-6 ${playfair.className} italic font-bold`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="text-[9px] tracking-[0.3em] text-white/70 uppercase flex flex-col items-center gap-2 font-medium">
                <span>Dibuat dengan cinta oleh</span>
                <a href="https://nikahlink.com" className="text-white hover:text-white/50 transition-colors border-b border-white/30">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
