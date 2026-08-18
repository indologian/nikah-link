"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Volume2, VolumeX,
  Gift, Copy, CheckCircle2, ArrowDownRight, MoveRight
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

// Import Google Fonts
import { Oswald, Lora, Montserrat } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "700"] });
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "900"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

export default function MagazineCoverTheme({
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
  const heroPhoto = photos.length > 0 ? photos[0] : "https://images.unsplash.com/photo-1532712938736-98c5411961a8?q=80&w=2000&auto=format&fit=crop"; // Fashion editorial
  const galleryPhotos = photos.slice(1);
  const themeColors = invitation.theme_colors || {
    background: "#FFFFFF",
    text: "#000000",       
    primary: "#000000",    
    accent: "#E5E5E5"      
  };

  const musicUrl = invitation.music_url || "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3"; 

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

  const slideUp = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } as any }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } as any }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-x-hidden ${montserrat.className}`}
      style={{ backgroundColor: themeColors.background, color: themeColors.text }}
    >
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}

      {/* Floating Audio Button */}
      {musicUrl && isOpen && (
        <button 
          onClick={toggleAudio}
          className="fixed top-6 right-6 w-12 h-12 flex items-center justify-center z-50 mix-blend-difference text-white"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {/* COVER / WELCOME SCREEN */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-white"
          >
            {/* Magazine Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 mix-blend-difference text-white">
               <div>
                  <p className={`text-xs uppercase tracking-widest ${oswald.className}`}>Issue 01</p>
                  <p className="text-xs">{new Date(weddingDateStr).getFullYear()}</p>
               </div>
               <div className="text-right">
                  <p className={`text-xs uppercase tracking-widest ${oswald.className}`}>Exclusive</p>
                  <p className="text-xs">Wedding Edition</p>
               </div>
            </div>

            <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col items-center justify-end pb-12">
               <Image src={heroPhoto} alt="Cover" fill className="object-cover object-top z-0" priority />
               
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
               
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="relative z-20 w-full px-6 text-white"
               >
                 <h1 className={`text-[12vw] sm:text-[10vw] font-black uppercase leading-[0.8] mb-2 tracking-tighter ${oswald.className}`}>
                   {invitation.bride_nickname}
                 </h1>
                 <h1 className={`text-[12vw] sm:text-[10vw] font-black uppercase leading-[0.8] tracking-tighter ${oswald.className} text-right`}>
                   {invitation.groom_nickname}
                 </h1>
                 
                 <div className="flex justify-between items-end mt-12">
                   <div className="max-w-[200px]">
                      <p className="text-[10px] uppercase tracking-widest mb-1 text-gray-300">Specially invited</p>
                      <p className={`text-lg font-bold leading-tight ${lora.className} italic`}>{guestName}</p>
                   </div>
                   
                   <button 
                     onClick={handleOpenInvitation}
                     className="flex items-center gap-2 group"
                   >
                     <span className={`text-sm uppercase tracking-widest font-bold ${oswald.className}`}>Read Issue</span>
                     <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110">
                       <ArrowDownRight size={18} />
                     </div>
                   </button>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      {isOpen && (
        <div className="relative z-10">
          
          {/* HERO SECTION */}
          <section className="min-h-[100svh] p-6 flex flex-col justify-between">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex justify-between items-start border-b-4 border-black pb-4 mb-12">
               <div className="w-1/3">
                 <p className="text-xs uppercase font-bold">The Wedding</p>
                 <p className="text-[10px] text-gray-500">{new Date(weddingDateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}</p>
               </div>
               <div className="w-1/3 text-center">
                 <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tighter ${oswald.className}`}>VOGUE</h2>
               </div>
               <div className="w-1/3 text-right">
                 <p className="text-xs uppercase font-bold">Vol 1.</p>
                 <p className="text-[10px] text-gray-500">LOVE STORY</p>
               </div>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
               <div className="md:col-span-5 flex flex-col justify-end pb-12 order-2 md:order-1">
                 <motion.h1 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className={`text-7xl sm:text-8xl md:text-[8vw] font-black uppercase leading-[0.8] tracking-tighter ${oswald.className} mb-8`}>
                   THE <br/> MAIN <br/> EVENT.
                 </motion.h1>
                 <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className={`text-xl ${lora.className} italic text-gray-600 max-w-sm`}>
                   "A celebration of love, life, and the beginning of a new chapter together."
                 </motion.p>
               </div>
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="md:col-span-7 relative h-[60vh] md:h-full w-full order-1 md:order-2 bg-gray-100">
                  <Image src={heroPhoto} alt="Couple" fill className="object-cover" priority />
               </motion.div>
            </div>
          </section>

          {/* EDITORIAL / PROFILE */}
          <section className="py-24 px-6 border-y border-black relative bg-black text-white">
             <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-4">
                     <p className={`text-sm uppercase tracking-widest font-bold mb-4 ${oswald.className}`}>01 / Featured Profiles</p>
                     <h2 className={`text-5xl font-black uppercase leading-none tracking-tighter ${oswald.className} mb-8`}>MEET THE COUPLE</h2>
                  </div>
                  
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-12">
                     <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="flex flex-col border-l border-gray-800 pl-6">
                        <h3 className={`text-3xl font-bold uppercase mb-2 ${oswald.className}`}>{invitation.bride_name}</h3>
                        <p className={`text-lg italic text-gray-400 mb-6 ${lora.className}`}>The Bride</p>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Daughter of</p>
                        <p className="text-md">{invitation.bride_parents}</p>
                     </motion.div>

                     <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="flex flex-col border-l border-gray-800 pl-6">
                        <h3 className={`text-3xl font-bold uppercase mb-2 ${oswald.className}`}>{invitation.groom_name}</h3>
                        <p className={`text-lg italic text-gray-400 mb-6 ${lora.className}`}>The Groom</p>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Son of</p>
                        <p className="text-md">{invitation.groom_parents}</p>
                     </motion.div>
                  </div>
               </div>
             </div>
          </section>

          {/* EVENT SCHEDULE (EDITORIAL LAYOUT) */}
          <section className="py-32 px-6 bg-[#f4f4f4]">
            <div className="max-w-7xl mx-auto">
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mb-20 text-center">
                 <p className={`text-sm uppercase tracking-widest font-bold mb-4 ${oswald.className}`}>02 / The Itinerary</p>
                 <h2 className={`text-[10vw] md:text-8xl font-black uppercase leading-none tracking-tighter ${oswald.className}`}>SCHEDULE</h2>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 {/* Akad */}
                 <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative group">
                    <div className="aspect-[4/3] w-full bg-gray-200 relative overflow-hidden mb-8">
                       <Image src={galleryPhotos[0] || heroPhoto} alt="Akad" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="flex gap-6">
                       <div className="w-1/4">
                         <p className={`text-5xl font-black ${oswald.className}`}>{new Date(invitation.akad_date).getDate()}</p>
                         <p className="text-sm font-bold uppercase">{new Date(invitation.akad_date).toLocaleDateString("en-US", { month: "short" })}</p>
                       </div>
                       <div className="w-3/4 border-l-2 border-black pl-6">
                         <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${oswald.className}`}>Holy Matrimony</h3>
                         <p className="text-sm font-bold mb-4">{formatTime(invitation.akad_date)}</p>
                         <p className={`text-lg italic mb-2 ${lora.className}`}>{invitation.akad_location}</p>
                         <p className="text-sm text-gray-600 mb-6 leading-relaxed">{invitation.akad_address}</p>
                         {invitation.akad_maps_url && (
                            <a href={invitation.akad_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
                              View Map <MoveRight size={14} />
                            </a>
                         )}
                       </div>
                    </div>
                 </motion.div>

                 {/* Reception */}
                 <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative group md:mt-24">
                    <div className="aspect-[4/3] w-full bg-gray-200 relative overflow-hidden mb-8">
                       <Image src={galleryPhotos[1] || heroPhoto} alt="Reception" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="flex gap-6">
                       <div className="w-1/4">
                         <p className={`text-5xl font-black ${oswald.className}`}>{new Date(invitation.reception_date || invitation.akad_date).getDate()}</p>
                         <p className="text-sm font-bold uppercase">{new Date(invitation.reception_date || invitation.akad_date).toLocaleDateString("en-US", { month: "short" })}</p>
                       </div>
                       <div className="w-3/4 border-l-2 border-black pl-6">
                         <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${oswald.className}`}>Reception</h3>
                         <p className="text-sm font-bold mb-4">{formatTime(invitation.reception_date || invitation.akad_date)}</p>
                         <p className={`text-lg italic mb-2 ${lora.className}`}>{invitation.reception_location || invitation.akad_location}</p>
                         <p className="text-sm text-gray-600 mb-6 leading-relaxed">{invitation.reception_address || invitation.akad_address}</p>
                         {invitation.reception_maps_url && (
                            <a href={invitation.reception_maps_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
                              View Map <MoveRight size={14} />
                            </a>
                         )}
                       </div>
                    </div>
                 </motion.div>
               </div>
            </div>
          </section>

          {/* QUOTE SECTION */}
          {(customData?.quote || invitation.custom_data?.quote) && (
            <section className="py-32 px-6 text-center bg-black text-white relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                  <h1 className={`text-[30vw] font-black uppercase whitespace-nowrap leading-none ${oswald.className}`}>LOVE</h1>
               </div>
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="max-w-4xl mx-auto relative z-10">
                 <p className={`text-3xl md:text-5xl italic leading-tight ${lora.className}`}>
                   "{customData?.quote || invitation.custom_data?.quote}"
                 </p>
               </motion.div>
            </section>
          )}

          {/* GALLERY - EDITORIAL SPREAD */}
          {invitation.show_gallery && galleryPhotos.length > 0 && (
            <section className="py-24 px-6 max-w-7xl mx-auto">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex justify-between items-end border-b border-black pb-4 mb-12">
                 <h2 className={`text-4xl font-black uppercase tracking-tighter ${oswald.className}`}>CAPTURES</h2>
                 <p className="text-xs font-bold uppercase tracking-widest text-gray-500">03 / Gallery</p>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {galleryPhotos.map((photo: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: (idx % 4) * 0.1 }}
                    className={`relative w-full overflow-hidden bg-gray-100 ${
                      idx === 0 ? "col-span-2 row-span-2 aspect-square" : 
                      idx === 3 ? "col-span-2 aspect-[2/1]" : "aspect-[3/4]"
                    }`}
                  >
                    <Image 
                      src={photo} 
                      alt={`Gallery ${idx+1}`} 
                      fill 
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* DIGITAL WALLET / GIFT */}
          {invitation.show_gifts && giftAccounts.length > 0 && (
            <section className="py-24 px-6 bg-[#f4f4f4]">
              <div className="max-w-4xl mx-auto bg-white p-12 border-2 border-black relative">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-black -translate-x-1 -translate-y-1"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-black translate-x-1 -translate-y-1"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-black -translate-x-1 translate-y-1"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-black translate-x-1 translate-y-1"></div>

                <div className="text-center mb-16">
                  <p className={`text-sm uppercase tracking-widest font-bold mb-4 ${oswald.className}`}>04 / Registry</p>
                  <h2 className={`text-5xl font-black uppercase tracking-tighter ${oswald.className} mb-6`}>WEDDING GIFT</h2>
                  <p className={`text-lg italic text-gray-600 max-w-lg mx-auto ${lora.className}`}>Your presence is the greatest gift of all. However, if you wish to honor us with a gift, a cash gift would be very welcome.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {giftAccounts.map((account: any) => (
                    <div key={account.id} className="p-8 border border-gray-200 text-center flex flex-col justify-between">
                      <div>
                        <div className={`text-xl font-black uppercase tracking-widest mb-4 ${oswald.className}`}>{account.bank_name}</div>
                        <div className="text-3xl font-light tracking-widest text-black mb-2">{account.account_number}</div>
                        <div className="text-sm font-medium uppercase text-gray-500 mb-8">{account.account_name}</div>
                      </div>
                      
                      <button 
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="w-full py-4 text-xs font-bold uppercase tracking-widest transition-colors border-2 border-black"
                        style={{ 
                          backgroundColor: copiedBank === account.id ? "black" : "transparent", 
                          color: copiedBank === account.id ? "white" : "black" 
                        }}
                      >
                        {copiedBank === account.id ? "Copied to Clipboard" : "Copy Account"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* RSVP & WISHES */}
          <section className="py-24 px-6 border-t-4 border-black">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-12 gap-16">
                
                {/* RSVP Form */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="md:col-span-5">
                  <h3 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${oswald.className}`}>R.S.V.P</h3>
                  <p className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-10">05 / Attendance</p>
                  
                  {rsvpSuccess ? (
                    <div className="p-12 border-2 border-black text-center">
                      <h4 className={`text-2xl font-black uppercase mb-4 ${oswald.className}`}>CONFIRMED</h4>
                      <p className={`italic text-gray-600 ${lora.className}`}>Thank you for your response.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
                        <input 
                          type="text" 
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          required
                          className="w-full pb-4 border-b-2 border-gray-200 bg-transparent outline-none focus:border-black transition-colors font-medium text-lg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Will you attend?</label>
                        <select 
                          value={rsvpStatus}
                          onChange={(e) => setRsvpStatus(e.target.value as any)}
                          className="w-full pb-4 border-b-2 border-gray-200 bg-transparent outline-none focus:border-black transition-colors font-medium text-lg appearance-none rounded-none"
                        >
                          <option value="hadir">Joyfully Accepts</option>
                          <option value="tidak_hadir">Regretfully Declines</option>
                        </select>
                      </div>

                      {rsvpStatus === "hadir" && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest mb-2">Guests Count</label>
                          <select 
                            value={rsvpCount}
                            onChange={(e) => setRsvpCount(Number(e.target.value))}
                            className="w-full pb-4 border-b-2 border-gray-200 bg-transparent outline-none focus:border-black transition-colors font-medium text-lg appearance-none rounded-none"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 Persons</option>
                          </select>
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={submittingRsvp}
                        className="w-full py-5 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                      >
                        {submittingRsvp ? "Sending..." : "Send RSVP"}
                      </button>
                    </form>
                  )}
                </motion.div>

                {/* Wishes / Guestbook */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="md:col-span-7">
                  <h3 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${oswald.className}`}>GUESTBOOK</h3>
                  <p className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-10">06 / Wishes</p>
                  
                  <form onSubmit={handleSendWish} className="mb-12 border-2 border-black p-6">
                    <textarea 
                      value={wishText}
                      onChange={(e) => setWishText(e.target.value)}
                      required
                      rows={3}
                      className="w-full p-4 border-b-2 border-gray-200 bg-transparent outline-none focus:border-black transition-colors resize-none text-lg mb-6"
                      placeholder="Write your wishes here..."
                    />
                    <button 
                      type="submit" 
                      disabled={sendingWish}
                      className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      {sendingWish ? "Publishing..." : "Publish Wish"}
                    </button>
                  </form>

                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {wishes.map((wish: any) => (
                      <div key={wish.id} className="pb-8 border-b border-gray-200">
                        <div className="flex justify-between items-baseline mb-4">
                          <span className={`font-black text-xl uppercase ${oswald.className}`}>{wish.guest_name}</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{formatDate(wish.created_at)}</span>
                        </div>
                        <div className={`text-lg italic text-gray-700 leading-relaxed ${lora.className}`}>"{wish.message}"</div>
                      </div>
                    ))}
                    {wishes.length === 0 && (
                      <p className={`text-xl italic text-gray-400 ${lora.className}`}>Be the first to write a message.</p>
                    )}
                  </div>
                </motion.div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-24 text-center bg-black text-white">
            <h2 className={`text-5xl font-black uppercase tracking-tighter mb-6 ${oswald.className}`}>
              {invitation.bride_nickname} & {invitation.groom_nickname}
            </h2>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">THE WEDDING EDITION</p>
            {!isFreePlan && <p className="mt-16 text-[10px] font-bold text-gray-600 tracking-widest uppercase">Powered by NikahLink</p>}
          </footer>

        </div>
      )}
    </div>
  );
}
