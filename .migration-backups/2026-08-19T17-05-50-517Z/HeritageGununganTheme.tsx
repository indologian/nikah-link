"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Lora, Playfair_Display } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "800"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function HeritageGununganTheme({
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Deep Parallax values for multi-layered batik
  const yBatikBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yBatikMg = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yBatikFg = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const rotateOrnaments = useTransform(scrollYProgress, [0, 1], [0, 180]);

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

  const timeline = customData?.timeline || [
    { year: "2018", title: "Pertama Bertemu", desc: "Sebuah pertemuan sederhana yang menumbuhkan rasa simpati." },
    { year: "2021", title: "Merajut Kasih", desc: "Komitmen terucap untuk melangkah bersama mengarungi waktu." },
    { year: "2025", title: "Lamaran", desc: "Pertemuan dua keluarga besar untuk menyatukan niat baik." },
    { year: "2026", title: "Pernikahan", desc: "Puncak kebahagiaan kami dalam ikatan suci pernikahan." }
  ];

  // Gunungan SVG Shape Helper
  const GununganPath = "M50,5 C60,40 95,60 95,95 C95,95 5,95 5,95 C5,60 40,40 50,5 Z";
  
  return (
    <div ref={containerRef} className={`min-h-screen bg-[#1F1010] text-[#F3E5D8] overflow-hidden ${lora.className} relative`}>
      
      {/* DEEP PARALLAX BATIK BACKGROUNDS */}
      {/* Layer 1: Background - Large and slow */}
      <motion.div style={{ y: yBatikBg }} className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
        <svg className="w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4" viewBox="0 0 100 100">
           <pattern id="batik1" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
             <path d="M10,0 C15,5 15,15 10,20 C5,15 5,5 10,0 Z" fill="#D4AF37" />
             <circle cx="10" cy="10" r="2" fill="#D4AF37" />
           </pattern>
           <rect width="100%" height="100%" fill="url(#batik1)" />
        </svg>
      </motion.div>

      {/* Layer 2: Midground - Medium speed */}
      <motion.div style={{ y: yBatikMg }} className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]">
        <svg className="w-[150%] h-[150%] -translate-x-1/4" viewBox="0 0 100 100">
           <pattern id="batik2" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M20,5 C30,15 30,25 20,35 C10,25 10,15 20,5 Z" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
             <path d="M5,20 C15,30 25,30 35,20 C25,10 15,10 5,20 Z" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
           </pattern>
           <rect width="100%" height="100%" fill="url(#batik2)" />
        </svg>
      </motion.div>

      {/* Audio Element */}
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#2A1515]/80 backdrop-blur-md rounded-full shadow-2xl border border-[#D4AF37]/50 text-[#D4AF37]"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* SPLITTING GUNUNGAN COVER */
          <motion.div
            key="cover"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#180C0C] text-[#D4AF37] overflow-hidden"
          >
            {/* Left Gunungan Half */}
            <motion.div
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
              className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden flex items-center justify-end pr-[1px]"
            >
              <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] absolute right-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[5px_0_15px_rgba(212,175,55,0.3)]">
                  <path d={GununganPath} className="fill-[#2A1515] stroke-[#D4AF37] stroke-[0.5]" />
                  {/* Internal ornaments */}
                  <path d="M50,20 Q65,40 50,60" className="stroke-[#D4AF37] stroke-[0.3] fill-none" />
                </svg>
              </div>
            </motion.div>

            {/* Right Gunungan Half */}
            <motion.div
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.7, 0, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden flex items-center justify-start pl-[1px]"
            >
              <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] absolute left-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[-5px_0_15px_rgba(212,175,55,0.3)]">
                  <path d={GununganPath} className="fill-[#2A1515] stroke-[#D4AF37] stroke-[0.5]" />
                  <path d="M50,20 Q35,40 50,60" className="stroke-[#D4AF37] stroke-[0.3] fill-none" />
                </svg>
              </div>
            </motion.div>

            {/* Center Content */}
            <motion.div
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1.2, ease: "anticipate" }}
              className="relative z-30 flex flex-col items-center text-center p-8 max-w-sm w-full"
            >
              <h4 className="text-xs tracking-[0.4em] uppercase text-[#D4AF37] mb-6 border-b border-[#D4AF37]/30 pb-2">
                Pawiwahan Ageng
              </h4>
              
              <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${playfair.className} text-[#F3E5D8]`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <span className={`text-xl text-[#D4AF37] font-style: italic my-2 ${playfair.className}`}>&amp;</span>
              <h1 className={`text-4xl md:text-5xl font-bold mb-10 ${playfair.className} text-[#F3E5D8]`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="bg-[#2A1515]/80 backdrop-blur-md p-6 rounded-lg border border-[#D4AF37]/30 w-full mb-8 shadow-2xl">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#A88B4B] mb-2">Katur Dumateng</p>
                <p className={`text-lg font-bold text-[#F3E5D8]`}>{guestName}</p>
              </div>

              <button
                onClick={handleOpenInvitation}
                className="group relative overflow-hidden bg-[#D4AF37] text-[#1F1010] px-10 py-3 rounded uppercase text-[10px] font-bold tracking-[0.2em] transition-all hover:bg-[#F2D26D] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <span className="relative z-10">Buka Undangan</span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* MAIN CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="w-full max-w-md mx-auto relative z-10 bg-[#180C0C]/90 backdrop-blur-md min-h-screen border-x border-[#D4AF37]/20 shadow-2xl"
          >
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-8 text-center pt-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 1 }}
              >
                <div className="w-48 h-64 mx-auto mb-10 relative overflow-hidden rounded-t-full border-4 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                   <div className="absolute inset-0 bg-[#2A1515] z-0"></div>
                   {invitation.cover_image_url && (
                      <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover z-10 opacity-80 mix-blend-luminosity" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#180C0C] via-transparent to-transparent z-20"></div>
                </div>
                
                <h4 className={`text-sm tracking-[0.3em] uppercase text-[#D4AF37] mb-4`}>Pernikahan</h4>
                <h2 className={`text-4xl md:text-5xl font-bold mb-2 ${playfair.className} text-[#F3E5D8]`}>
                  {invitation.groom_name}
                  <br/><span className="text-xl text-[#D4AF37] italic font-normal">&amp;</span><br/>
                  {invitation.bride_name}
                </h2>
                <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto my-6"></div>
                <p className="text-sm tracking-widest uppercase text-[#A88B4B]">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* QUOTE SECTION */}
            <section className="py-16 px-10 text-center relative">
              <motion.div style={{ rotate: rotateOrnaments }} className="w-12 h-12 mx-auto mb-6 text-[#D4AF37]">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z" />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5 }}
              >
                <p className={`text-lg md:text-xl italic leading-relaxed text-[#F3E5D8] ${playfair.className}`}>
                  "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan di antara kami."
                </p>
              </motion.div>
            </section>

            {/* TIMELINE / LOVE STORY */}
            <section className="py-24 px-6 relative z-10">
              <div className="text-center mb-16">
                <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[#D4AF37]`}>Cerita Kami</h3>
                <div className="w-12 h-1 bg-[#D4AF37] mx-auto opacity-50"></div>
              </div>

              <div className="relative border-l-2 border-[#D4AF37]/30 ml-4 md:ml-6 space-y-12">
                {timeline.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    className="relative pl-8"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                    <span className="text-xs font-bold tracking-[0.2em] text-[#1F1010] bg-[#D4AF37] px-3 py-1 rounded-sm mb-3 inline-block">
                      {item.year}
                    </span>
                    <h4 className={`text-xl font-bold mb-2 ${playfair.className} text-[#F3E5D8]`}>{item.title}</h4>
                    <p className="text-sm leading-relaxed text-[#A88B4B]">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 bg-[#2A1515]/50 relative z-10 border-y border-[#D4AF37]/20">
              <div className="text-center mb-16">
                <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[#D4AF37]`}>Rangkaian Acara</h3>
                <p className={`text-sm tracking-widest text-[#A88B4B] uppercase`}>Pahargyan</p>
              </div>

              <div className="space-y-8">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-[#180C0C] rounded-lg p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#D4AF37]/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 text-[#D4AF37]" viewBox="0 0 100 100" fill="currentColor">
                      <path d={GununganPath} />
                    </svg>
                  </div>
                  
                  <h4 className={`text-2xl font-bold text-[#D4AF37] mb-6 ${playfair.className}`}>Akad Nikah</h4>
                  
                  <div className="space-y-4 text-sm text-[#F3E5D8] mb-8 relative z-10">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[#A88B4B]">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.akad_venue || "Lokasi Akad"}</p>
                        <p className="text-[#A88B4B] mt-1">{invitation.akad_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1F1010] py-3 rounded uppercase text-xs font-bold tracking-widest hover:bg-[#F2D26D] transition-colors">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] py-3 rounded uppercase text-xs tracking-widest hover:bg-[#D4AF37]/10 transition-colors">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-[#180C0C] rounded-lg p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#D4AF37]/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24 text-[#D4AF37] rotate-180" viewBox="0 0 100 100" fill="currentColor">
                      <path d={GununganPath} />
                    </svg>
                  </div>
                  
                  <h4 className={`text-2xl font-bold text-[#D4AF37] mb-6 ${playfair.className}`}>Resepsi</h4>
                  
                  <div className="space-y-4 text-sm text-[#F3E5D8] mb-8 relative z-10">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[#A88B4B]">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                        <p className="text-[#A88B4B] mt-1">{invitation.reception_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#D4AF37] text-[#1F1010] py-3 rounded uppercase text-xs font-bold tracking-widest hover:bg-[#F2D26D] transition-colors">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] py-3 rounded uppercase text-xs tracking-widest hover:bg-[#D4AF37]/10 transition-colors">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6 relative z-10">
                <div className="text-center mb-12">
                  <Gift className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[#D4AF37]`}>Tanda Kasih</h3>
                  <p className={`text-sm text-[#A88B4B] mb-6 tracking-widest`}>Tanpa mengurangi rasa hormat</p>
                </div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[#180C0C] p-8 rounded-lg shadow-2xl border border-[#D4AF37]/30 text-center"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] font-bold mb-4 text-[#A88B4B]">{account.bank_name}</p>
                      <p className={`text-2xl tracking-widest mb-2 text-[#D4AF37] ${playfair.className}`}>{account.account_number}</p>
                      <p className="text-sm text-[#F3E5D8] mb-8">A.N {account.account_name}</p>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="w-full flex items-center justify-center gap-2 bg-transparent text-[#D4AF37] py-3 rounded uppercase text-[10px] font-bold tracking-widest border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1F1010] transition-colors"
                      >
                        {copiedBank === account.id ? (
                          <>
                            <span>Berhasil Disalin!</span>
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

            {/* RSVP & MASONRY WISHES */}
            <section className="py-24 px-6 bg-[#2A1515]/80 relative z-10">
              <div className="text-center mb-12">
                <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[#D4AF37]`}>RSVP & Ucapan</h3>
                <div className="w-12 h-1 bg-[#D4AF37] mx-auto opacity-50"></div>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-[#180C0C] p-8 rounded-lg shadow-2xl border border-[#D4AF37]/30 mb-16"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Nama</label>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="w-full bg-transparent border-b border-[#D4AF37]/50 py-2 text-sm text-[#F3E5D8] focus:outline-none focus:border-[#D4AF37] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Kehadiran</label>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-[#180C0C] border-b border-[#D4AF37]/50 py-2 text-sm text-[#F3E5D8] focus:outline-none focus:border-[#D4AF37] transition-colors"
                      >
                        <option value="hadir">Hadir</option>
                        <option value="tidak_hadir">Tidak Hadir</option>
                      </select>
                    </div>
                    {rsvpStatus === "hadir" && (
                       <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Jumlah Kehadiran</label>
                          <select
                            value={rsvpCount}
                            onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                            className="w-full bg-[#180C0C] border-b border-[#D4AF37]/50 py-2 text-sm text-[#F3E5D8] focus:outline-none focus:border-[#D4AF37] transition-colors"
                          >
                            <option value={1}>1 Orang</option>
                            <option value={2}>2 Orang</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-[#D4AF37] text-[#1F1010] py-4 rounded uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#F2D26D] transition-colors disabled:opacity-70 mt-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    >
                      {submittingRsvp ? "Memproses..." : "Konfirmasi"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#180C0C] p-10 rounded-lg text-center shadow-2xl mb-16 border border-[#D4AF37]/30">
                  <Check className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  <h4 className={`text-2xl font-bold text-[#F3E5D8] mb-2 ${playfair.className}`}>Matur Nuwun</h4>
                  <p className="text-[#A88B4B]">Konfirmasi Anda telah kami catat.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 relative bg-[#180C0C] rounded-lg p-2 shadow-2xl border border-[#D4AF37]/30"
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-transparent text-sm p-4 text-[#F3E5D8] focus:outline-none resize-none placeholder:text-[#A88B4B]"
                  placeholder="Berikan doa & restu Anda..."
                  required
                />
                <div className="flex justify-between items-center px-4 pb-2">
                  <span className="text-xs text-[#D4AF37]">{wishName || "Nama Anda"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-[#D4AF37] text-[#1F1010] p-3 rounded hover:bg-[#F2D26D] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>

              {/* Masonry Wishes List */}
              <div className="columns-1 md:columns-2 gap-4 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar p-2">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="break-inside-avoid bg-[#1F1010] p-5 rounded-lg border border-[#D4AF37]/20 shadow-lg"
                  >
                    <p className={`text-sm text-[#F3E5D8] leading-relaxed mb-4 italic`}>
                      "{wish.message}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-[#D4AF37]/20 pt-3">
                      <div>
                        <p className="font-bold text-xs text-[#D4AF37] uppercase tracking-wider">
                          {wish.guest_name}
                        </p>
                        <p className="text-[10px] text-[#A88B4B]">
                          {format(new Date(wish.created_at), "dd MMM yy", { locale: id })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 text-center px-6 relative z-10">
              <svg className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" viewBox="0 0 100 100" fill="currentColor">
                <path d={GununganPath} />
              </svg>
              <h2 className={`text-3xl font-bold mb-6 ${playfair.className} text-[#F3E5D8]`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="text-[10px] tracking-[0.2em] text-[#A88B4B] uppercase flex flex-col items-center gap-2">
                <span>Dipersembahkan oleh</span>
                <a href="https://nikahlink.com" className="font-bold text-[#D4AF37] hover:text-[#F3E5D8] transition-colors">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
