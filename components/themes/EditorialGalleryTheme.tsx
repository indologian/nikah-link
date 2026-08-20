"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Anton, Roboto_Flex } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: ["400"], style: ["normal"] });
const roboto = Roboto_Flex({ subsets: ["latin"], style: ["normal"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any;
}

// 3D Tilt Image Card
const TiltCard = ({ src, alt, heightClass }: { src: string, alt: string, heightClass: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full ${heightClass} bg-[#222] overflow-hidden cursor-crosshair`}
    >
      <div
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="absolute inset-0 p-4"
      >
        <div className="relative w-full h-full shadow-2xl">
          <Image src={src} alt={alt} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
      </div>
    </motion.div>
  );
};

export default function EditorialGalleryTheme({
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
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

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
  
  // Dummy gallery data for layout testing
  const galleryImages = [
    customData?.gallery_1 || invitation.cover_image_url || "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    customData?.gallery_2 || invitation.groom_photo_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    customData?.gallery_3 || invitation.bride_photo_url || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7",
    "https://images.unsplash.com/photo-1505932794465-147d1f1b2c97"
  ].filter(Boolean) as string[];

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
    <div ref={containerRef} className={`min-h-screen bg-[var(--theme-background)] text-[#111] overflow-hidden relative selection:bg-black selection:text-white`}>
      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-black text-white shadow-xl hover:bg-[#333] transition-colors"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* PRELOADER COVER (Editorial Split) */
          <motion.div
            key="cover"
            className="fixed inset-0 z-50 flex overflow-hidden bg-[#111]"
          >
             {/* Left Panel */}
            <motion.div 
              exit={{ x: "-100%" }} 
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
              className="absolute top-0 bottom-0 left-0 w-1/2 bg-[var(--theme-background)] pointer-events-none origin-left"
            />
            {/* Right Panel */}
            <motion.div 
              exit={{ x: "100%" }} 
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
              className="absolute top-0 bottom-0 right-0 w-1/2 bg-[var(--theme-background)] pointer-events-none origin-right"
            />
            
            <motion.div
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="relative z-30 flex flex-col items-center justify-center text-center p-8 w-full max-w-sm mx-auto h-full"
            >
              <h4 className={`text-xs tracking-[0.5em] font-bold uppercase text-[#555] mb-8 ${roboto.className}`}>Vol. 1</h4>
              
              <h1 className={`text-7xl md:text-8xl text-black leading-none ${anton.className} uppercase`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <h1 className={`text-7xl md:text-8xl text-black leading-none ${anton.className} uppercase mb-12`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <div className="w-full mb-12 border-t-4 border-black pt-4">
                <p className={`text-[10px] tracking-[0.2em] font-bold uppercase text-[#555] mb-2 ${roboto.className}`}>Exclusive Invite For</p>
                <p className={`text-xl font-black text-black uppercase tracking-tighter ${roboto.className}`}>{guestName}</p>
              </div>

              <button
                onClick={handleOpenInvitation}
                className={`group relative overflow-hidden bg-black text-white hover:bg-white hover:text-black px-12 py-5 uppercase text-[12px] tracking-[0.3em] font-black transition-all duration-300 border-2 border-black ${roboto.className}`}
              >
                Enter Gallery
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
            className="w-full mx-auto relative z-10 bg-[var(--theme-background)] min-h-screen"
          >
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col justify-between p-8 overflow-hidden bg-black text-white">
              <div className="absolute inset-0 opacity-40 mix-blend-overlay grayscale">
                <Image src={galleryImages[0]} alt="Hero" fill className="object-cover object-top" />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="relative z-10 w-full flex justify-between items-start pt-8"
              >
                 <div className={`text-[10px] uppercase font-bold tracking-[0.3em] ${roboto.className}`}>
                    <p>Editorial Edition</p>
                    <p className="text-[#888]">{weddingDateStr && format(parseISO(weddingDateStr), "MM.dd.yyyy", { locale: id })}</p>
                 </div>
                 <div className={`text-[10px] uppercase font-bold tracking-[0.3em] text-right ${roboto.className}`}>
                    <p>The Wedding</p>
                    <p className="text-[#888]">Jakarta</p>
                 </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="relative z-10 w-full flex flex-col pb-8"
              >
                <h2 className={`text-[12vw] leading-[0.85] ${anton.className} uppercase tracking-tighter`}>
                  {invitation.groom_name}
                </h2>
                <h2 className={`text-[12vw] leading-[0.85] ${anton.className} uppercase tracking-tighter text-[#888]`}>
                  {invitation.bride_name}
                </h2>
              </motion.div>
            </section>

            {/* JUSTIFIED GALLERY 3D */}
            <section className="py-24 px-4 md:px-8 relative z-10 bg-white">
               <div className="mb-16 border-b-4 border-black pb-4">
                 <h3 className={`text-5xl md:text-7xl ${anton.className} uppercase tracking-tighter text-black`}>The Gallery</h3>
                 <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#555] mt-2 ${roboto.className}`}>Visual Documentation</p>
               </div>

               <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {galleryImages.map((src, i) => (
                     <div key={i} className="break-inside-avoid" onClick={() => setLightboxImg(src)}>
                        <TiltCard 
                           src={src} 
                           alt={`Gallery ${i}`} 
                           heightClass={i % 3 === 0 ? "h-[600px]" : i % 2 === 0 ? "h-[400px]" : "h-[500px]"} 
                        />
                     </div>
                  ))}
               </div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-4 md:px-8 relative z-10 bg-[var(--theme-background)]">
              <div className="mb-16 border-b-4 border-black pb-4">
                <h3 className={`text-5xl md:text-7xl ${anton.className} uppercase tracking-tighter text-black`}>The Event</h3>
                <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#555] mt-2 ${roboto.className}`}>Schedule & Location</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-black text-white p-10 relative overflow-hidden"
                >
                  <h4 className={`text-4xl mb-8 uppercase tracking-tighter ${anton.className}`}>Akad Nikah</h4>
                  
                  <div className={`space-y-6 text-sm mb-12 ${roboto.className} font-medium`}>
                    <div className="flex flex-col border-b border-[#333] pb-4">
                       <span className="text-[#888] text-[10px] uppercase tracking-[0.2em] mb-1">Date & Time</span>
                       <span className="text-xl uppercase tracking-tighter font-black">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMM yyyy", { locale: id })}</span>
                       <span className="text-white mt-1">{invitation.akad_time || "08:00 WIB"}</span>
                    </div>
                    <div className="flex flex-col border-b border-[#333] pb-4">
                       <span className="text-[#888] text-[10px] uppercase tracking-[0.2em] mb-1">Venue</span>
                       <span className="text-xl uppercase tracking-tighter font-black">{invitation.akad_venue || "Lokasi Akad"}</span>
                       <span className="text-[#aaa] mt-1 leading-relaxed">{invitation.akad_address}</span>
                    </div>
                  </div>

                  {invitation.akad_maps_url && (
                     <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className={`inline-block border-2 border-white text-white px-8 py-4 uppercase text-[10px] font-black tracking-[0.3em] hover:bg-white hover:text-black transition-colors ${roboto.className}`}>
                        View Map
                     </a>
                  )}
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white text-black p-10 relative overflow-hidden border-4 border-black"
                >
                  <h4 className={`text-4xl mb-8 uppercase tracking-tighter ${anton.className}`}>Resepsi</h4>
                  
                  <div className={`space-y-6 text-sm mb-12 ${roboto.className} font-medium`}>
                    <div className="flex flex-col border-b border-[#ccc] pb-4">
                       <span className="text-[#555] text-[10px] uppercase tracking-[0.2em] mb-1">Date & Time</span>
                       <span className="text-xl uppercase tracking-tighter font-black">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMM yyyy", { locale: id })}</span>
                       <span className="text-black mt-1">{invitation.reception_time || "11:00 WIB"}</span>
                    </div>
                    <div className="flex flex-col border-b border-[#ccc] pb-4">
                       <span className="text-[#555] text-[10px] uppercase tracking-[0.2em] mb-1">Venue</span>
                       <span className="text-xl uppercase tracking-tighter font-black">{invitation.reception_venue || "Lokasi Resepsi"}</span>
                       <span className="text-[#555] mt-1 leading-relaxed">{invitation.reception_address}</span>
                    </div>
                  </div>

                  {invitation.reception_maps_url && (
                     <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className={`inline-block border-2 border-black bg-black text-white px-8 py-4 uppercase text-[10px] font-black tracking-[0.3em] hover:bg-transparent hover:text-black transition-colors ${roboto.className}`}>
                        View Map
                     </a>
                  )}
                </motion.div>
              </div>
            </section>

            {/* RSVP & WISHES */}
            <section className="py-24 px-4 md:px-8 relative z-10 bg-white">
              <div className="mb-16 border-b-4 border-black pb-4">
                <h3 className={`text-5xl md:text-7xl ${anton.className} uppercase tracking-tighter text-black`}>RSVP</h3>
                <p className={`text-xs font-bold uppercase tracking-[0.3em] text-[#555] mt-2 ${roboto.className}`}>Confirm Your Attendance</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 {/* Left: Form */}
                 <div>
                  {!rsvpSuccess ? (
                     <motion.form
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        onSubmit={handleRsvpSubmit}
                        className={`space-y-8 ${roboto.className}`}
                     >
                        <div className="flex flex-col">
                           <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-2">Full Name</label>
                           <input
                              type="text"
                              value={wishName}
                              onChange={(e) => setWishName(e.target.value)}
                              className="w-full bg-transparent border-b-2 border-black py-4 text-xl font-bold uppercase tracking-wider focus:outline-none focus:border-[var(--theme-accent)] transition-colors"
                              required
                           />
                        </div>
                        <div className="flex flex-col">
                           <label className="text-[10px] uppercase font-black tracking-[0.2em] mb-2">Will you attend?</label>
                           <select
                              value={rsvpStatus}
                              onChange={(e: any) => setRsvpStatus(e.target.value)}
                              className="w-full bg-transparent border-b-2 border-black py-4 text-xl font-bold uppercase tracking-wider focus:outline-none focus:border-[var(--theme-accent)] transition-colors appearance-none"
                           >
                              <option value="hadir">Yes, I will attend</option>
                              <option value="tidak_hadir">No, I can't make it</option>
                           </select>
                        </div>
                        <button
                           disabled={submittingRsvp}
                           type="submit"
                           className="w-full bg-black text-white py-6 uppercase tracking-[0.3em] text-xs font-black hover:bg-[#333] transition-colors disabled:opacity-70 mt-4"
                        >
                           {submittingRsvp ? "SUBMITTING..." : "CONFIRM RSVP"}
                        </button>
                     </motion.form>
                  ) : (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black text-white p-12 text-center">
                        <Check className="w-16 h-16 text-white mx-auto mb-6" />
                        <h4 className={`text-4xl font-black uppercase tracking-tighter ${anton.className}`}>Thank You</h4>
                        <p className={`text-[#aaa] text-xs uppercase tracking-[0.2em] mt-4 font-bold ${roboto.className}`}>Your response has been recorded.</p>
                     </motion.div>
                  )}
                 </div>

                 {/* Right: Wishes */}
                 <div>
                    <h4 className={`text-3xl mb-8 uppercase tracking-tighter ${anton.className}`}>Guest Book</h4>
                    <motion.form
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        onSubmit={handleSendWish}
                        className={`mb-10 border-2 border-black p-2 ${roboto.className}`}
                     >
                        <textarea
                           rows={3}
                           value={wishText}
                           onChange={(e) => setWishText(e.target.value)}
                           className="w-full bg-transparent text-sm p-4 font-bold focus:outline-none resize-none placeholder:text-[#aaa] uppercase"
                           placeholder="WRITE A MESSAGE..."
                           required
                        />
                        <div className="flex justify-between items-center px-4 py-2 border-t-2 border-black">
                           <span className="text-[10px] uppercase tracking-[0.3em] font-black">{wishName || "GUEST"}</span>
                           <button
                              type="submit"
                              disabled={sendingWish || !wishText.trim()}
                              className="bg-black text-white p-4 hover:bg-[#333] transition-colors disabled:opacity-50"
                           >
                              <Send className="w-4 h-4" />
                           </button>
                        </div>
                     </motion.form>

                     <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {wishes.map((wish: any) => (
                           <motion.div
                              key={wish.id}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              className="border-b border-[#ddd] pb-6"
                           >
                              <p className={`text-sm leading-relaxed mb-4 font-bold ${roboto.className}`}>
                              "{wish.message}"
                              </p>
                              <div className={`flex items-center justify-between ${roboto.className}`}>
                              <p className="font-black text-[10px] uppercase tracking-[0.2em]">{wish.guest_name}</p>
                              <span className="text-[10px] text-[#888] font-bold">{format(new Date(wish.created_at), "dd.MM.yy", { locale: id })}</span>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                 </div>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-32 text-center px-4 bg-black text-white relative z-10">
              <h2 className={`text-[8vw] leading-none mb-12 ${anton.className} uppercase tracking-tighter`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className={`text-[10px] tracking-[0.4em] uppercase flex flex-col items-center gap-4 font-black ${roboto.className}`}>
                <span className="text-[#555]">PRODUCED BY</span>
                <a href="https://nikahlink.com" className="hover:text-[#888] transition-colors">NIKAHLINK</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
         {lightboxImg && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setLightboxImg(null)}
               className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            >
               <button className="absolute top-8 right-8 text-white hover:text-[#aaa] transition-colors">
                  <X className="w-8 h-8" />
               </button>
               <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative w-full max-w-5xl h-[80vh]"
               >
                  <Image src={lightboxImg} alt="Lightbox" fill className="object-contain" />
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
