"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { MapPin, Gift, Copy, Check, Music, Calendar, Send, Heart } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Playfair_Display, Lato, Dancing_Script } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const dancing = Dancing_Script({ subsets: ["latin"], weight: ["400", "700"] });

interface Props {
  invitation: any;
  guestName?: string;
  initialWishes?: any[];
  giftAccounts?: any[];
  isFreePlan?: boolean;
  expiresAt?: string | null;
  customData?: any; // To pass timeline data or custom quotes
}

export default function EtherealWatercolorTheme({
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

  // Parallax Values
  const yBlob1 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yBlob2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yFlora = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  
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
      url.searchParams.append("details", "Semoga kehadiran Bapak/Ibu/Saudara/i membawa keberkahan bagi kami.");
      url.searchParams.append("location", location);
      return url.toString();
    } catch {
      return "#";
    }
  };

  // Default Timeline Data (if customData.timeline is not provided)
  const timeline = customData?.timeline || [
    { year: "2018", title: "Pertama Bertemu", desc: "Berawal dari sebuah kebetulan di sudut kedai kopi kecil di Bandung." },
    { year: "2021", title: "Menjalin Kasih", desc: "Setelah bertahun-tahun menjadi sahabat, kami memutuskan untuk melangkah bersama." },
    { year: "2025", title: "Lamaran", desc: "Sebuah janji terucap di bawah rintik hujan sore hari, mengikat komitmen kami." },
    { year: "2026", title: "Pernikahan", desc: "Hari di mana kami menyatukan dua keluarga dalam ikatan suci." }
  ];

  return (
    <div ref={containerRef} className={`min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] overflow-hidden ${lato.className} relative`}>
      
      {/* Animated Morphing Watercolor Blobs in Background */}
      <motion.div style={{ y: yBlob1 }} className="fixed top-[-10%] left-[-20%] w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] opacity-30 pointer-events-none z-0 blur-[80px]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[var(--theme-primary)] animate-[spin_30s_linear_infinite]">
          <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.2,87.6,-1.4C85.1,13.4,77.5,26.8,69,38.9C60.5,51,51,61.8,39,70.1C27,78.4,13.5,84.1,0.2,83.7C-13.1,83.3,-26.2,76.8,-37.9,68.2C-49.6,59.6,-59.9,48.9,-68.8,36.4C-77.7,23.9,-85.2,9.6,-85.7,-4.8C-86.2,-19.2,-79.8,-33.6,-70.7,-45.5C-61.6,-57.4,-49.8,-66.8,-36.8,-74.6C-23.8,-82.4,-11.9,-88.6,2.2,-92.5C16.3,-96.4,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      <motion.div style={{ y: yBlob2 }} className="fixed bottom-[-10%] right-[-20%] w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] opacity-20 pointer-events-none z-0 blur-[60px]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[var(--theme-accent)] animate-[spin_40s_linear_infinite_reverse]">
          <path d="M49.2,-72.5C62.8,-62.4,72.2,-48.1,78.5,-32.5C84.8,-16.9,88.1,0,84.5,15.1C80.9,30.2,70.4,43.5,58,54.2C45.6,64.9,31.3,73.1,15.8,77.1C0.3,81.1,-16.3,80.9,-31.6,75.1C-46.9,69.3,-60.8,57.9,-71,44.2C-81.2,30.5,-87.7,14.5,-87.5,-1.3C-87.3,-17.1,-80.4,-32.8,-70.2,-45.3C-60,-57.8,-46.5,-67.2,-32.6,-73.4C-18.7,-79.6,-4.4,-82.6,10.6,-80.5C25.6,-78.4,35.6,-82.6,49.2,-72.5Z" transform="translate(100 100)" />
        </svg>
      </motion.div>

      {/* SVG Floral Overlays (Parallax) */}
      <motion.div style={{ y: yFlora }} className="fixed top-[20%] left-0 w-32 h-64 opacity-20 pointer-events-none z-0">
         <svg viewBox="0 0 100 200" className="w-full h-full stroke-[var(--theme-text)] fill-none" strokeWidth="1">
            <path d="M0,200 C30,150 40,100 20,50 C60,80 80,120 50,180" />
            <circle cx="20" cy="50" r="5" className="fill-[var(--theme-primary)] stroke-none" />
            <circle cx="50" cy="180" r="8" className="fill-[var(--theme-accent)] stroke-none" />
            <path d="M20,50 Q40,30 30,10 M50,180 Q80,160 90,190" />
         </svg>
      </motion.div>

      {invitation.music_url && <audio ref={audioRef} loop src={invitation.music_url} />}

      <AnimatePresence>
        {isOpen && invitation.music_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={toggleAudio}
            className="fixed bottom-6 right-6 z-50 p-4 bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-white text-[var(--theme-text)] hover:bg-white transition-colors"
          >
            <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
              <Music className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* INK BLEED COVER SCREEN */
          <motion.div
            key="cover"
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-background)] text-[var(--theme-text)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--theme-primary-rgb),0.2)] to-[rgba(var(--theme-accent-rgb),0.2)]"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="relative z-10 text-center p-8 flex flex-col items-center"
            >
              <h4 className={`text-2xl mb-6 text-[var(--theme-text)] ${dancing.className}`}>The Wedding of</h4>
              
              <h1 className={`text-5xl md:text-6xl font-bold mb-2 ${playfair.className} text-[var(--theme-text)]`}>
                {invitation.groom_name?.split(" ")[0]}
              </h1>
              <span className={`text-3xl text-[var(--theme-primary)] font-style: italic my-2 ${playfair.className}`}>&amp;</span>
              <h1 className={`text-5xl md:text-6xl font-bold mb-10 ${playfair.className} text-[var(--theme-text)]`}>
                {invitation.bride_name?.split(" ")[0]}
              </h1>

              <p className="text-xs tracking-[0.3em] uppercase text-[var(--theme-text)] mb-2">Dear</p>
              <p className={`text-lg font-medium mb-10 border-b border-[rgba(var(--theme-text-rgb),0.3)] pb-2 px-6`}>{guestName}</p>

              <button
                onClick={handleOpenInvitation}
                className="group relative overflow-hidden bg-transparent text-[var(--theme-text)] px-10 py-3 rounded-full border-2 border-[var(--theme-text)] uppercase text-[10px] font-bold tracking-widest transition-all hover:bg-[var(--theme-text)] hover:text-white hover:border-transparent"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Invitation
                </span>
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
            className="w-full max-w-lg mx-auto relative z-10 bg-white/40 backdrop-blur-sm min-h-screen border-x border-white/50 shadow-2xl"
          >
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center p-8 text-center pt-20">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
              >
                <div className="w-40 h-56 mx-auto mb-10 relative rounded-t-full overflow-hidden border-[6px] border-white shadow-xl">
                   {invitation.cover_image_url ? (
                      <Image src={invitation.cover_image_url} alt="Cover" fill className="object-cover" />
                   ) : (
                      <div className="w-full h-full bg-[rgba(var(--theme-primary-rgb),0.5)]"></div>
                   )}
                </div>
                
                <h4 className={`text-xl md:text-2xl mb-4 text-[var(--theme-text)] ${dancing.className}`}>We Are Getting Married!</h4>
                <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className}`}>
                  {invitation.groom_name}
                  <br/><span className="text-2xl text-[var(--theme-accent)] italic font-normal">&amp;</span><br/>
                  {invitation.bride_name}
                </h2>
                <div className="w-10 h-[1px] bg-[var(--theme-text)] mx-auto my-6"></div>
                <p className="text-sm tracking-widest uppercase text-[var(--theme-text)]">
                  {weddingDateStr && format(parseISO(weddingDateStr), "dd MMMM yyyy", { locale: id })}
                </p>
              </motion.div>
            </section>

            {/* QUOTE SECTION */}
            <section className="py-16 px-10 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5 }}
              >
                <Heart className="w-6 h-6 text-[var(--theme-primary)] mx-auto mb-6 opacity-60" />
                <p className={`text-lg md:text-xl italic leading-relaxed text-[var(--theme-text)] ${playfair.className}`}>
                  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
                </p>
                <p className="mt-4 text-xs tracking-widest text-[var(--theme-text)] uppercase">(QS. Ar-Rum: 21)</p>
              </motion.div>
            </section>

            {/* LOVE STORY TIMELINE */}
            <section className="py-24 px-6">
              <div className="text-center mb-16">
                <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[var(--theme-text)]`}>Our Story</h3>
                <p className={`text-lg text-[var(--theme-text)] ${dancing.className}`}>Perjalanan cinta kami</p>
              </div>

              <div className="relative border-l border-[rgba(var(--theme-accent-rgb),0.5)] ml-4 md:ml-6 space-y-12">
                {timeline.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    className="relative pl-8"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-[var(--theme-primary)] shadow-sm"></div>
                    <span className="text-xs font-bold tracking-widest text-[var(--theme-text)] bg-white/60 px-2 py-1 rounded mb-2 inline-block">
                      {item.year}
                    </span>
                    <h4 className={`text-xl font-bold mb-2 ${playfair.className}`}>{item.title}</h4>
                    <p className="text-sm leading-relaxed text-[var(--theme-text)]">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* EVENT DETAILS */}
            <section className="py-24 px-6 bg-white/60">
              <div className="text-center mb-16">
                <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[var(--theme-text)]`}>Event Details</h3>
                <p className={`text-lg text-[var(--theme-text)] ${dancing.className}`}>Dengan memohon rahmat Allah SWT</p>
              </div>

              <div className="space-y-8">
                {/* AKAD */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[rgba(var(--theme-primary-rgb),0.2)] to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <h4 className={`text-2xl font-bold text-[var(--theme-text)] mb-6 ${playfair.className}`}>Akad Nikah</h4>
                  
                  <div className="space-y-4 text-sm text-[var(--theme-text)] mb-8">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-[var(--theme-accent)] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.akad_date && format(parseISO(invitation.akad_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[var(--theme-text)]">{invitation.akad_time || "08:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[var(--theme-accent)] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.akad_venue || "Lokasi Akad"}</p>
                        <p className="text-[var(--theme-text)] mt-1">{invitation.akad_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.akad_maps_url && (
                      <a href={invitation.akad_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-text)] text-white py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-[var(--theme-text)] transition-colors shadow-md">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.akad_date || "2026-12-31", invitation.akad_time || "08:00", "Akad Nikah", invitation.akad_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-background)] text-[var(--theme-text)] py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-[var(--theme-primary)] transition-colors border border-[var(--theme-primary)]">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>

                {/* RESEPSI */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[rgba(var(--theme-accent-rgb),0.2)] to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <h4 className={`text-2xl font-bold text-[var(--theme-text)] mb-6 ${playfair.className}`}>Resepsi</h4>
                  
                  <div className="space-y-4 text-sm text-[var(--theme-text)] mb-8">
                    <div className="flex gap-4">
                      <Calendar className="w-5 h-5 text-[var(--theme-primary)] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.reception_date && format(parseISO(invitation.reception_date), "EEEE, dd MMMM yyyy", { locale: id })}</p>
                        <p className="text-[var(--theme-text)]">{invitation.reception_time || "11:00 WIB"}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[var(--theme-primary)] shrink-0" />
                      <div>
                        <p className="font-bold">{invitation.reception_venue || "Lokasi Resepsi"}</p>
                        <p className="text-[var(--theme-text)] mt-1">{invitation.reception_address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {invitation.reception_maps_url && (
                      <a href={invitation.reception_maps_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-text)] text-white py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-[var(--theme-text)] transition-colors shadow-md">
                         Buka Peta Lokasi
                      </a>
                    )}
                    <a href={generateGCalLink(invitation.reception_date || "2026-12-31", invitation.reception_time || "11:00", "Resepsi", invitation.reception_address || "")} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[var(--theme-background)] text-[var(--theme-text)] py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-[var(--theme-primary)] transition-colors border border-[var(--theme-primary)]">
                       Simpan ke Kalender
                    </a>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* GIFT REGISTRY */}
            {(giftAccounts && giftAccounts.length > 0) && (
              <section className="py-24 px-6">
                <div className="text-center mb-12">
                  <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[var(--theme-text)]`}>Wedding Gift</h3>
                  <p className={`text-lg text-[var(--theme-text)] mb-6 ${dancing.className}`}>Bagi yang ingin memberikan tanda kasih</p>
                </div>

                <div className="space-y-6">
                  {giftAccounts.map((account, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--theme-primary)] relative overflow-hidden"
                    >
                      <Gift className="absolute top-8 right-8 w-16 h-16 text-[rgba(var(--theme-primary-rgb),0.3)] -rotate-12" />
                      <p className="text-xs uppercase tracking-widest font-bold mb-2 text-[var(--theme-text)]">{account.bank_name}</p>
                      <p className={`text-2xl mb-1 text-[var(--theme-text)] ${playfair.className}`}>{account.account_number}</p>
                      <p className="text-sm text-[var(--theme-text)] mb-6">A.N {account.account_name}</p>
                      
                      <button
                        onClick={() => handleCopy(account.account_number, account.id)}
                        className="w-full flex items-center justify-center gap-2 bg-[var(--theme-background)] text-[var(--theme-text)] py-3 rounded-xl uppercase text-xs tracking-widest border border-[var(--theme-primary)] hover:bg-[rgba(var(--theme-primary-rgb),0.3)] transition-colors"
                      >
                        {copiedBank === account.id ? (
                          <>
                            <span className="text-[var(--theme-text)]">Berhasil Disalin!</span>
                            <Check className="w-4 h-4 text-[var(--theme-text)]" />
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
            <section className="py-24 px-6 bg-[rgba(var(--theme-primary-rgb),0.1)] border-t border-white">
              <div className="text-center mb-12">
                <h3 className={`text-3xl font-bold mb-2 ${playfair.className} text-[var(--theme-text)]`}>RSVP & Wishes</h3>
                <p className={`text-lg text-[var(--theme-text)] ${dancing.className}`}>Kehadiran & Doa Anda</p>
              </div>

              {/* RSVP Form */}
              {!rsvpSuccess ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onSubmit={handleRsvpSubmit}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-[var(--theme-primary)] mb-16 relative"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--theme-text)] mb-2">Nama</label>
                      <input
                        type="text"
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="w-full bg-[var(--theme-background)] border-b-2 border-[var(--theme-primary)] py-2 text-sm text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-text)] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[var(--theme-text)] mb-2">Kehadiran</label>
                      <select
                        value={rsvpStatus}
                        onChange={(e: any) => setRsvpStatus(e.target.value)}
                        className="w-full bg-[var(--theme-background)] border-b-2 border-[var(--theme-primary)] py-2 text-sm text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-text)] transition-colors"
                      >
                        <option value="hadir">Akan Hadir</option>
                        <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                      </select>
                    </div>
                    {rsvpStatus === "hadir" && (
                       <div>
                          <label className="block text-xs uppercase tracking-widest text-[var(--theme-text)] mb-2">Jumlah Kehadiran</label>
                          <select
                            value={rsvpCount}
                            onChange={(e: any) => setRsvpCount(Number(e.target.value))}
                            className="w-full bg-[var(--theme-background)] border-b-2 border-[var(--theme-primary)] py-2 text-sm text-[var(--theme-text)] focus:outline-none focus:border-[var(--theme-text)] transition-colors"
                          >
                            <option value={1}>1 Orang</option>
                            <option value={2}>2 Orang</option>
                          </select>
                       </div>
                    )}
                    <button
                      disabled={submittingRsvp}
                      type="submit"
                      className="w-full bg-[var(--theme-text)] text-white py-4 rounded-xl uppercase tracking-widest text-xs font-bold hover:bg-[var(--theme-text)] transition-colors disabled:opacity-70 mt-4 shadow-md"
                    >
                      {submittingRsvp ? "Mengirim..." : "Kirim Konfirmasi"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-3xl text-center shadow-md mb-16 border border-[var(--theme-primary)]">
                  <Check className="w-16 h-16 text-[var(--theme-accent)] mx-auto mb-4" />
                  <h4 className={`text-2xl font-bold text-[var(--theme-text)] mb-2 ${playfair.className}`}>Terima Kasih!</h4>
                  <p className="text-[var(--theme-text)]">Konfirmasi kehadiran Anda telah kami terima.</p>
                </motion.div>
              )}

              {/* Wishes Form */}
              <motion.form
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                onSubmit={handleSendWish}
                className="mb-10 relative bg-white rounded-3xl p-2 shadow-sm border border-[var(--theme-primary)]"
              >
                <textarea
                  rows={3}
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="w-full bg-transparent text-sm p-4 text-[var(--theme-text)] focus:outline-none resize-none"
                  placeholder="Tuliskan ucapan & doa..."
                  required
                />
                <div className="flex justify-between items-center px-4 pb-2">
                  <span className="text-xs text-[var(--theme-text)]">{wishName || "Nama Anda"}</span>
                  <button
                    type="submit"
                    disabled={sendingWish || !wishText.trim()}
                    className="bg-[var(--theme-accent)] text-white p-3 rounded-xl hover:bg-[var(--theme-accent)] transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>

              {/* Masonry Wishes List */}
              <div className="columns-1 md:columns-2 gap-6 space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar p-2">
                {wishes.map((wish: any) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="break-inside-avoid bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white"
                  >
                    <p className={`text-sm text-[var(--theme-text)] leading-relaxed mb-4 italic`}>
                      "{wish.message}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--theme-primary)] flex items-center justify-center text-[var(--theme-text)] font-bold text-xs uppercase">
                        {wish.guest_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[var(--theme-text)] uppercase tracking-wider">
                          {wish.guest_name}
                        </p>
                        <p className="text-[10px] text-[var(--theme-accent)]">
                          {format(new Date(wish.created_at), "dd MMM yy", { locale: id })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 text-center px-6">
              <h2 className={`text-4xl font-bold mb-6 ${playfair.className} text-[var(--theme-text)]`}>
                {invitation.groom_name?.split(" ")[0]} & {invitation.bride_name?.split(" ")[0]}
              </h2>
              <div className="text-xs tracking-widest text-[var(--theme-text)] flex flex-col items-center gap-2">
                <span>Dibuat dengan cinta oleh</span>
                <a href="https://nikahlink.com" className="font-bold text-[var(--theme-text)] hover:text-[var(--theme-text)] transition-colors">NikahLink</a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
