"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import {
  Heart, Calendar, MapPin, Music, Image as ImageIcon,
  Gift, Settings, Sparkles, ArrowRight, ArrowLeft, Check, Loader2, CheckCircle2, XCircle
} from "lucide-react";
import Link from "next/link";
import UpsellModal from "@/components/dashboard/UpsellModal";
import { getPublishedThemeForEditor } from "@/lib/themes/editor";

const STEPS = [
  { id: "theme", label: "Tema", icon: Sparkles },
  { id: "basic", label: "Mempelai", icon: Heart },
  { id: "events", label: "Acara", icon: Calendar },
  { id: "media", label: "Galeri & Musik", icon: ImageIcon },
  { id: "gift", label: "Kado Cashless", icon: Gift },
  { id: "settings", label: "Pengaturan", icon: Settings },
];


export default function EditInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const invitationId = params.id as string;
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [initialUsername, setInitialUsername] = useState("");
  const [giftAccountId, setGiftAccountId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    bride_name: "",
    groom_name: "",
    bride_photo_url: "",
    groom_photo_url: "",
    love_story: "",

    // Akad
    akad_date: "",
    akad_time: "",
    akad_venue: "",
    akad_address: "",
    akad_maps_url: "",

    // Resepsi
    reception_date: "",
    reception_time: "",
    reception_venue: "",
    reception_address: "",
    reception_maps_url: "",

    // Theme & Media
    theme_slug: "minimalis",
    music_url: "",
    cover_image_url: "",
    custom_message: "",

    // Gift Accounts
    bank_name: "",
    account_number: "",
    account_name: "",

    // Options
    show_rsvp: true,
    show_gift: true,
    show_gallery: true,
    show_wishes: true,
    is_published: true,
    custom_data: {} as Record<string, any>,
  });

  // Paywall states
  const [userPlan, setUserPlan] = useState<"free" | "premium" | "pro">("free");
  const [upsellConfig, setUpsellConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    planNeeded: "premium" | "pro";
  }>({
    isOpen: false,
    title: "",
    description: "",
    planNeeded: "premium"
  });

  const [themesList, setThemesList] = useState<any[]>([]);

  const [selectedThemeEditor, setSelectedThemeEditor] =
    useState<Awaited<ReturnType<typeof getPublishedThemeForEditor>>>(null);

  const [isResolvingTheme, setIsResolvingTheme] = useState(false);

  const themeResolveRequestRef = useRef(0);

  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("themes").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (data) setThemesList(data);
    };
    fetchThemes();
  }, [supabase]);

  useEffect(() => {
    if (!invitationId) return;

    let cancelled = false;

    const fetchInvitation = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("invitations")
          .select(`
          *,
          themes(slug)
        `)
          .eq("id", invitationId)
          .single();

        if (error) throw error;

        if (cancelled) return;

        // Fetch gift accounts
        const { data: gifts } = await supabase
          .from("gift_accounts")
          .select("*")
          .eq("invitation_id", invitationId);

        if (cancelled) return;

        let bName = "", accNum = "", accName = "";
        if (gifts && gifts.length > 0) {
          bName = gifts[0].bank_name || "";
          accNum = gifts[0].account_number || "";
          accName = gifts[0].account_name || "";
          setGiftAccountId(gifts[0].id);
        }

        if (cancelled) return;

        setInitialUsername(data.username || "");

        setFormData({
          username: data.username || "",
          bride_name: data.bride_name || "",
          groom_name: data.groom_name || "",
          bride_photo_url: data.bride_photo_url || "",
          groom_photo_url: data.groom_photo_url || "",
          love_story: data.love_story || "",
          akad_date: data.akad_date || "",
          akad_time: data.akad_time || "",
          akad_venue: data.akad_venue || "",
          akad_address: data.akad_address || "",
          akad_maps_url: data.akad_maps_url || "",
          reception_date: data.reception_date || "",
          reception_time: data.reception_time || "",
          reception_venue: data.reception_venue || "",
          reception_address: data.reception_address || "",
          reception_maps_url: data.reception_maps_url || "",
          theme_slug: data.themes?.slug || "minimalis",
          music_url: data.music_url || "",
          cover_image_url: data.cover_image_url || "",
          custom_message: data.custom_message || "",
          bank_name: bName,
          account_number: accNum,
          account_name: accName,
          show_rsvp: data.show_rsvp ?? true,
          show_gift: data.show_gift ?? true,
          show_gallery: data.show_gallery ?? true,
          show_wishes: data.show_wishes ?? true,
          is_published: data.is_published ?? true,
          custom_data: data.custom_data || {},
        });

        const themeSlug = data.themes?.slug || "minimalis";

        if (cancelled) return;
        setIsResolvingTheme(true);

        try {
          const resolved = await getPublishedThemeForEditor(themeSlug);

          if (cancelled) return;

          setSelectedThemeEditor(resolved);
        } finally {
          if (!cancelled) {
            setIsResolvingTheme(false);
          }
        }

        // Ambil plan user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("plan")
            .eq("user_id", user.id)
            .single();

          if (cancelled) return;

          if (profile?.plan) {
            setUserPlan(profile.plan);
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setError("Gagal memuat data undangan.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInvitation();

    return () => {
      cancelled = true;
    };
  }, [invitationId, supabase]);

  // Real-time Slug Checking
  useEffect(() => {
    if (!formData.username) {
      setSlugStatus("idle");
      return;
    }

    const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (cleanUsername !== formData.username) {
      setFormData((prev) => ({ ...prev, username: cleanUsername }));
      return;
    }

    if (cleanUsername === initialUsername) {
      setSlugStatus("available");
      return;
    }

    setSlugStatus("checking");
    const timeoutId = setTimeout(async () => {
      const { data } = await supabase
        .from("invitations")
        .select("id")
        .eq("username", cleanUsername)
        .single();

      if (data) {
        setSlugStatus("taken");
      } else {
        setSlugStatus("available");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username, initialUsername, supabase]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      if (file.size > 1048576) {
        setError("Ukuran file terlalu besar! Maksimal 1 MB.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/tiff", "image/x-icon", "image/avif"];
      if (!allowedTypes.includes(file.type)) {
        setError("Format file tidak didukung! Pastikan file berupa gambar.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setUploading(prev => ({ ...prev, [field]: true }));
      setError("");

      const { error: uploadError } = await supabase.storage.from('invitations').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('invitations').getPublicUrl(filePath);
      handleChange(field, publicUrl);
    } catch (err: any) {
      setError("Gagal mengunggah gambar: " + err.message);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const uploadCustomImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 1048576) {
        setError("Ukuran file terlalu besar! Maksimal 1 MB.");
        return;
      }

      const allowedTypes = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "image/svg+xml", "image/bmp", "image/tiff", "image/x-icon", "image/avif"
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Format file tidak didukung! Pastikan file berupa gambar.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setUploading(prev => ({ ...prev, [field]: true }));
      setError("");

      const { error: uploadError } = await supabase.storage
        .from('invitations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invitations')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        custom_data: { ...(prev.custom_data || {}), [field]: publicUrl }
      }));
    } catch (err: any) {
      setError("Gagal mengunggah gambar: " + err.message);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      if (file.size > 5242880) {
        setError("Ukuran file musik terlalu besar! Maksimal 5 MB.");
        return;
      }

      const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/x-m4a"];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
        setError("Format musik tidak didukung! Pastikan file berupa MP3, WAV, atau OGG.");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `audio-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      setUploading(prev => ({ ...prev, [field]: true }));
      setError("");

      const { error: uploadError } = await supabase.storage.from('invitations').upload(filePath, file, {
        contentType: file.type || "audio/mpeg",
        upsert: true
      });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('invitations').getPublicUrl(filePath);
      handleChange(field, publicUrl);
    } catch (err: any) {
      setError("Gagal mengunggah musik: " + err.message);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThemeSelect = async (theme: any) => {
    if (isResolvingTheme) return;

    if (theme.is_premium && userPlan === "free") {
      setUpsellConfig({
        isOpen: true,
        title: "Tema Premium Terkunci",
        description:
          "Tema mewah ini eksklusif untuk paket Premium dan Pro. Upgrade sekarang untuk membuka semua tema.",
        planNeeded: "premium",
      });
      return;
    }

    setError("");

    const requestId = ++themeResolveRequestRef.current;
    setIsResolvingTheme(true);

    try {
      const resolved = await getPublishedThemeForEditor(theme.slug);

      if (requestId !== themeResolveRequestRef.current) {
        return;
      }

      if (!resolved) {
        setSelectedThemeEditor(null);
        setError(
          `Tema "${theme.name}" belum memiliki published version yang valid.`
        );
        return;
      }

      setSelectedThemeEditor(resolved);

      setFormData((prev) => ({
        ...prev,
        theme_slug: resolved.theme.slug,
        custom_data:
          prev.theme_slug === resolved.theme.slug
            ? prev.custom_data
            : {},
      }));
    } finally {
      if (requestId === themeResolveRequestRef.current) {
        setIsResolvingTheme(false);
      }
    }
  };

  const handleNext = () => {
    if (isResolvingTheme) {
      return;
    }

    if (STEPS[currentStep].id === "theme") {
      if (!selectedThemeEditor) {
        setError("Tema belum memiliki published version yang valid.");
        return;
      }

      const selectedFields = selectedThemeEditor.runtime.fields ?? [];

      for (const field of selectedFields) {
        const value = formData.custom_data?.[field.name];

        if (value === undefined || value === null || value === "") {
          setError(
            `Mohon isi field "${field.label}" pada pengaturan khusus tema.`
          );
          return;
        }
      }
    }

    if (STEPS[currentStep].id === "basic") {
      if (!formData.bride_name || !formData.groom_name || !formData.username) {
        setError("Nama pengantin dan URL undangan wajib diisi!");
        return;
      }

      if (slugStatus === "taken") {
        setError("URL undangan sudah digunakan. Silakan pilih URL lain.");
        return;
      }
    }

    setError("");

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setError("");
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (isResolvingTheme) {
      setError("Tema masih dimuat. Silakan tunggu sampai selesai.");
      return;
    }

    if (Object.values(uploading).some(Boolean)) {
      setError(
        "Masih ada file yang sedang diunggah. Silakan tunggu sampai selesai."
      );
      return;
    }

    if (slugStatus === "checking") {
      setError("URL undangan masih diperiksa. Silakan tunggu sampai selesai.");
      return;
    }

    setIsUpdating(true);
    setShowConfirmModal(false);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Kamu harus login terlebih dahulu.");
        return;
      }

      const cleanUsername = formData.username
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");

      if (!cleanUsername) {
        setError("URL undangan wajib diisi.");
        return;
      }

      if (slugStatus === "taken") {
        setError(
          `URL undangan "nikahlink.com/${cleanUsername}" sudah digunakan.`
        );
        return;
      }

      // Resolve tema + published version terbaru
      // Gunakan theme editor yang sudah di-resolve saat tema dipilih/dimuat.
      // Jangan mengambil published version terbaru lagi saat save.
      // RPC database akan mempertahankan theme_version_id yang sudah dipin
      // apabila user tidak mengganti tema.
      const selectedTheme = selectedThemeEditor;

      if (!selectedTheme || selectedTheme.theme.slug !== formData.theme_slug) {
        throw new Error(
          "Tema yang dipilih belum siap atau published version-nya tidak valid."
        );
      }

      const themeId = selectedTheme.theme.id;
      const themeVersionId = selectedTheme.version.id;

      // Update invitation + gift account dalam SATU transaksi database
      const { error: rpcError } = await supabase.rpc("update_invitation", {
        p_invitation_id: invitationId,

        p_username: cleanUsername,
        p_bride_name: formData.bride_name,
        p_groom_name: formData.groom_name,
        p_bride_photo_url: formData.bride_photo_url || null,
        p_groom_photo_url: formData.groom_photo_url || null,
        p_love_story: formData.love_story || null,

        p_akad_date: formData.akad_date || null,
        p_akad_time: formData.akad_time || null,
        p_akad_venue: formData.akad_venue || null,
        p_akad_address: formData.akad_address || null,
        p_akad_maps_url: formData.akad_maps_url || null,

        p_reception_date: formData.reception_date || null,
        p_reception_time: formData.reception_time || null,
        p_reception_venue: formData.reception_venue || null,
        p_reception_address: formData.reception_address || null,
        p_reception_maps_url: formData.reception_maps_url || null,

        p_theme_id: themeId,
        p_theme_version_id: themeVersionId,

        p_music_url: formData.music_url || null,
        p_cover_image_url: formData.cover_image_url || null,
        p_custom_message: formData.custom_message || null,

        p_is_published: formData.is_published,
        p_show_rsvp: formData.show_rsvp,
        p_show_gift: formData.show_gift,
        p_show_gallery: formData.show_gallery,
        p_show_wishes: formData.show_wishes,

        p_custom_data: formData.custom_data || {},

        p_gift_account_id: giftAccountId,

        p_bank_name: formData.bank_name || null,
        p_account_number: formData.account_number || null,
        p_account_name: formData.account_name || null,
      });

      if (rpcError) {
        throw rpcError;
      }

      router.push("/dashboard/undangan?success=updated");
    } catch (err: any) {
      console.error("Update invitation error:", err);

      setError(
        err?.message ||
        "Gagal memperbarui undangan. Silakan coba lagi."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-slate-50 rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm animate-pulse">Memuat data undangan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-none border border-slate-200 dark:border-slate-800 ">
        <div>
          <Link href="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3 h-3" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-playfair">Edit Undangan</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Perbarui data undangan pernikahan Anda di sini.</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold transition-all ${isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : isDone
                      ? "bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-900 dark:border-white/30"
                      : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 border border-slate-200 dark:border-slate-800"
                    }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  <span>{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && <div className={`w-6 h-0.5 ${idx < currentStep ? "bg-slate-900 dark:bg-slate-50" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <UpsellModal
        isOpen={upsellConfig.isOpen}
        onClose={() => setUpsellConfig(prev => ({ ...prev, isOpen: false }))}
        title={upsellConfig.title}
        description={upsellConfig.description}
        planNeeded={upsellConfig.planNeeded}
      />

      <div className=" bg-white dark:bg-slate-900 rounded-none p-6 lg:p-8 border border-slate-200 dark:border-slate-800  relative">
        {error && (
          <div className="mb-6 p-4 rounded-none bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: MEMPELAI */}
          {STEPS[currentStep].id === "basic" && (
            <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Heart className="w-5 h-5 text-slate-900 dark:text-white" /> Profil Mempelai & Custom URL
              </h2>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2">
                  URL Undangan Impian Kamu <span className="text-slate-900 dark:text-white">*</span>
                </label>
                <div className={`flex items-center rounded-none bg-slate-50 border overflow-hidden transition-colors ${slugStatus === "taken"
                  ? "border-rose-400 focus-within:border-rose-500"
                  : slugStatus === "available"
                    ? "border-emerald-400 focus-within:border-emerald-500"
                    : "border-slate-200 dark:border-slate-700 focus-within:border-slate-900 dark:border-white"
                  }`}>
                  <span className="px-4 py-3 bg-slate-100 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-mono border-r border-slate-200 dark:border-slate-700">
                    nikahlink.com/
                  </span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                    placeholder="romeo-juliet"
                    required
                    className="flex-1 bg-transparent px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-xs sm:text-sm font-mono font-semibold"
                  />
                  {slugStatus === "checking" && <Loader2 className="w-4 h-4 mr-4 text-slate-400 animate-spin" />}
                  {slugStatus === "available" && <CheckCircle2 className="w-4 h-4 mr-4 text-emerald-500" />}
                  {slugStatus === "taken" && <XCircle className="w-4 h-4 mr-4 text-rose-500" />}
                </div>
                {slugStatus === "taken" && (
                  <p className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    URL ini sudah digunakan orang lain.
                  </p>
                )}
                {slugStatus === "available" && (
                  <p className="text-emerald-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                    URL tersedia!
                  </p>
                )}
                <p className="text-slate-400 text-[11px] mt-1 font-medium">Hanya huruf kecil, angka, dan tanda hubung (-).</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Mempelai Pria</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Nama Panggilan / Lengkap *</label>
                    <input type="text" value={formData.groom_name} onChange={(e) => handleChange("groom_name", e.target.value)} placeholder="Contoh: Romeo Montague, S.T." className="w-full px-4 py-2.5 rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Foto Mempelai Pria</label>
                    <div className="flex items-center gap-3">
                      {formData.groom_photo_url && (
                        <div className="w-12 h-12 rounded-none border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-100">
                          <img src={formData.groom_photo_url} alt="Pria" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon,image/avif" onChange={(e) => uploadImage(e, 'groom_photo_url')} disabled={uploading['groom_photo_url']} className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 file:text-slate-900 dark:text-white hover:file:bg-[#F8D5E3] transition-all cursor-pointer disabled:opacity-50" />
                        {uploading['groom_photo_url'] ? <p className="text-[10px] text-slate-900 dark:text-white mt-1 animate-pulse">Mengunggah...</p> : <p className="text-[10px] text-slate-400 mt-1">{formData.groom_photo_url ? "Biarkan kosong untuk memakai foto lama (Maks. 1 MB)" : "Maks. 1 MB"}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Mempelai Wanita</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Nama Panggilan / Lengkap *</label>
                    <input type="text" value={formData.bride_name} onChange={(e) => handleChange("bride_name", e.target.value)} placeholder="Contoh: Juliet Capulet, S.Ked" className="w-full px-4 py-2.5 rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Foto Mempelai Wanita</label>
                    <div className="flex items-center gap-3">
                      {formData.bride_photo_url && (
                        <div className="w-12 h-12 rounded-none border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-100">
                          <img src={formData.bride_photo_url} alt="Wanita" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon,image/avif" onChange={(e) => uploadImage(e, 'bride_photo_url')} disabled={uploading['bride_photo_url']} className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 file:text-slate-900 dark:text-white hover:file:bg-[#F8D5E3] transition-all cursor-pointer disabled:opacity-50" />
                        {uploading['bride_photo_url'] ? <p className="text-[10px] text-slate-900 dark:text-white mt-1 animate-pulse">Mengunggah...</p> : <p className="text-[10px] text-slate-400 mt-1">{formData.bride_photo_url ? "Biarkan kosong untuk memakai foto lama (Maks. 1 MB)" : "Maks. 1 MB"}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2">Kisah Cinta Singkat (Love Story)</label>
                <textarea rows={3} value={formData.love_story} onChange={(e) => handleChange("love_story", e.target.value)} className="w-full px-4 py-3 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" />
              </div>
            </motion.div>
          )}

          {/* STEP 2: ACAKA */}
          {STEPS[currentStep].id === "events" && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Calendar className="w-5 h-5 text-slate-900 dark:text-white" /> Detail Acara Pernikahan
              </h2>
              <div className="p-5 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-4 h-4" /> Akad Nikah / Pemberkatan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Tanggal Akad</label><input type="date" value={formData.akad_date} onChange={(e) => handleChange("akad_date", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Waktu (Jam)</label><TimeRangePicker value={formData.akad_time} onChange={(val) => handleChange("akad_time", val)} /></div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Nama Tempat / Gedung</label>
                    <LocationAutocomplete
                      value={formData.akad_venue}
                      onChange={(val) => handleChange("akad_venue", val)}
                      onSelect={(place) => {
                        const placeName = place.name || place.display_name.split(",")[0];
                        setFormData((prev) => ({
                          ...prev,
                          akad_venue: placeName,
                          akad_address: place.display_name,
                          akad_maps_url: `https://maps.google.com/?q=${place.lat},${place.lon}`
                        }));
                      }}
                      placeholder="Ketik nama Masjid / Hotel / Gedung (Pilih saran agar Alamat otomatis terisi)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      value={formData.akad_address}
                      onChange={(e) => handleChange("akad_address", e.target.value)}
                      placeholder="Jl. Merdeka No. 1, Jakarta"
                      className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Link Google Maps</label>
                    <input type="url" value={formData.akad_maps_url} onChange={(e) => handleChange("akad_maps_url", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" />
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><MapPin className="w-4 h-4" /> Resepsi Pernikahan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Tanggal Resepsi</label><input type="date" value={formData.reception_date} onChange={(e) => handleChange("reception_date", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Waktu (Jam)</label><TimeRangePicker value={formData.reception_time} onChange={(val) => handleChange("reception_time", val)} /></div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Nama Tempat / Gedung</label>
                    <LocationAutocomplete
                      value={formData.reception_venue}
                      onChange={(val) => handleChange("reception_venue", val)}
                      onSelect={(place) => {
                        const placeName = place.name || place.display_name.split(",")[0];
                        setFormData((prev) => ({
                          ...prev,
                          reception_venue: placeName,
                          reception_address: place.display_name,
                          reception_maps_url: `https://maps.google.com/?q=${place.lat},${place.lon}`
                        }));
                      }}
                      placeholder="Ketik nama Masjid / Hotel / Gedung (Pilih saran agar Alamat otomatis terisi)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      value={formData.reception_address}
                      onChange={(e) => handleChange("reception_address", e.target.value)}
                      placeholder="Jl. Sudirman No. 1, Jakarta"
                      className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Link Google Maps</label>
                    <input type="url" value={formData.reception_maps_url} onChange={(e) => handleChange("reception_maps_url", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: TEMA */}
          {STEPS[currentStep].id === "theme" && (
            <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-slate-900 dark:text-white" /> Pilih Tema Undangan
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {themesList.map((theme) => {
                  const isSelected = formData.theme_slug === theme.slug;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => {
                        if (!isResolvingTheme) {
                          handleThemeSelect(theme);
                        }
                      }}
                      aria-disabled={isResolvingTheme}
                      aria-busy={isResolvingTheme}
                      className={`relative overflow-hidden rounded-none border-2 transition-all group ${isResolvingTheme
                        ? "cursor-wait opacity-70"
                        : "cursor-pointer"
                        } ${isSelected
                          ? "border-slate-900 dark:border-white scale-[1.02]"
                          : "border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900/50"
                        }`}
                    >
                      <div className="aspect-[3/4] relative">
                        {theme.thumbnail_url ? (
                          <img src={theme.thumbnail_url} alt={theme.name} className="w-full h-full object-cover" />
                        ) : (
                          <div
                            className="w-full h-full bg-slate-200 dark:bg-slate-800"
                            style={theme.colors?.primary ? { backgroundColor: theme.colors.primary } : {}}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-bold text-sm truncate">{theme.name}</h3>
                          <p className="text-white/80 text-[10px] uppercase tracking-wider">{theme.category}</p>
                        </div>

                        {theme.is_premium && (
                          <span className="absolute top-2 right-2 text-[10px] bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-900 dark:border-white/30 px-2 py-0.5 rounded-none font-bold">
                            PREMIUM
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 dark:text-slate-900 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* DYNAMIC FIELDS FROM THEME CONFIG */}
              {selectedThemeEditor?.runtime.fields?.length ? (
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Pengaturan Khusus Tema Ini
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedThemeEditor.runtime.fields.map((field) => (
                      <div
                        key={field.name}
                        className={field.type === "textarea" ? "md:col-span-2" : ""}
                      >
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">
                          {field.label}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            value={formData.custom_data?.[field.name] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                custom_data: {
                                  ...(prev.custom_data || {}),
                                  [field.name]: e.target.value,
                                },
                              }))
                            }
                            placeholder={field.placeholder || ""}
                            className="w-full px-4 py-2.5 rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white"
                          />
                        ) : field.type === "boolean" ? (
                          <label className="flex items-center gap-3 cursor-pointer mt-2">
                            <div
                              className={`w-4 h-4 border flex items-center justify-center ${formData.custom_data?.[field.name]
                                ? "border-slate-900 bg-slate-900 dark:border-white dark:bg-white"
                                : "border-slate-300 dark:border-slate-600"
                                }`}
                            >
                              {formData.custom_data?.[field.name] && (
                                <Check className="w-3 h-3 text-white dark:text-slate-900" />
                              )}
                            </div>

                            <input
                              type="checkbox"
                              checked={formData.custom_data?.[field.name] || false}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  custom_data: {
                                    ...(prev.custom_data || {}),
                                    [field.name]: e.target.checked,
                                  },
                                }))
                              }
                              className="hidden"
                            />

                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {field.label}
                            </span>
                          </label>
                        ) : field.type === "image" ? (
                          <div className="flex items-center gap-3">
                            {formData.custom_data?.[field.name] && (
                              <div className="w-12 h-12 rounded-none border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-100">
                                <img
                                  src={formData.custom_data[field.name]}
                                  alt={field.label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <div className="flex-1">
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon,image/avif"
                                onChange={(e) =>
                                  uploadCustomImage(e, field.name)
                                }
                                disabled={uploading[field.name]}
                                className="w-full px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white dark:file:bg-white dark:file:text-slate-900 cursor-pointer disabled:opacity-50"
                              />

                              {uploading[field.name] && (
                                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Mengunggah gambar...
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <input
                            type={
                              field.type === "url"
                                ? "url"
                                : field.type === "date"
                                  ? "date"
                                  : "text"
                            }
                            value={formData.custom_data?.[field.name] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                custom_data: {
                                  ...(prev.custom_data || {}),
                                  [field.name]: e.target.value,
                                },
                              }))
                            }
                            placeholder={field.placeholder || ""}
                            className="w-full px-4 py-2.5 rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

            </motion.div>
          )}

          {/* STEP 4: MEDIA */}
          {STEPS[currentStep].id === "media" && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ImageIcon className="w-5 h-5 text-slate-900 dark:text-white" /> Galeri Foto & Musik Latar
              </h2>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2">Musik Latar (MP3 / WAV)</label>
                <div className="flex items-center gap-3">
                  <Music className="w-5 h-5 text-slate-900 dark:text-white flex-shrink-0" />
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="audio/mpeg,audio/wav,audio/ogg,.mp3,.m4a"
                      onChange={(e) => {
                        if (userPlan === "free") {
                          e.preventDefault();
                          setUpsellConfig({
                            isOpen: true,
                            title: "Upload Musik Terkunci",
                            description: "Fitur mengunggah lagu favorit (MP3) hanya tersedia untuk paket Premium. Upgrade sekarang agar undanganmu makin romantis!",
                            planNeeded: "premium"
                          });
                          return;
                        }
                        uploadAudio(e, 'music_url');
                      }}
                      disabled={uploading['music_url']}
                      className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 file:text-slate-900 dark:text-white hover:file:bg-[#F8D5E3] transition-all cursor-pointer disabled:opacity-50"
                    />
                    {uploading['music_url'] ? <p className="text-[10px] text-slate-900 dark:text-white mt-1 animate-pulse">Mengunggah audio...</p> : <p className="text-[10px] text-slate-400 mt-1">{formData.music_url && !formData.music_url.includes('pixabay') ? "Biarkan kosong untuk memakai lagu lama (Maks. 5 MB)" : "Maks. 5 MB"}</p>}
                  </div>
                </div>
                {formData.music_url && (
                  <div className="mt-4 bg-slate-50 p-3 rounded-none border border-slate-200 dark:border-slate-700">
                    <audio controls className="h-8 w-full" src={formData.music_url}>Browser Anda tidak mendukung elemen audio.</audio>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2">Foto Cover Utama</label>
                <div className="flex items-center gap-3">
                  {formData.cover_image_url && <div className="w-16 h-24 rounded-none border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 bg-slate-100"><img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" /></div>}
                  <div className="flex-1">
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/tiff,image/x-icon,image/avif" onChange={(e) => uploadImage(e, 'cover_image_url')} disabled={uploading['cover_image_url']} className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 file:text-slate-900 dark:text-white hover:file:bg-[#F8D5E3] transition-all cursor-pointer disabled:opacity-50" />
                    {uploading['cover_image_url'] ? <p className="text-[10px] text-slate-900 dark:text-white mt-1 animate-pulse">Mengunggah...</p> : <p className="text-[10px] text-slate-400 mt-1">{formData.cover_image_url ? "Biarkan kosong untuk memakai foto lama (Maks. 1 MB)" : "Maks. 1 MB"}</p>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-2">Pesan Pembuka Undangan</label>
                <textarea rows={3} value={formData.custom_message} onChange={(e) => handleChange("custom_message", e.target.value)} className="w-full px-4 py-3 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" />
              </div>
            </motion.div>
          )}

          {/* STEP 5: KADO */}
          {STEPS[currentStep].id === "gift" && (
            <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Gift className="w-5 h-5 text-slate-900 dark:text-white" /> Rekening Kado Digital
              </h2>
              <div className="bg-slate-100 dark:bg-slate-800 dark:bg-slate-900 dark:bg-slate-50/20 p-4 rounded-none border border-slate-200 dark:border-slate-900 dark:border-white/30 flex gap-3">
                <Gift className="w-5 h-5 text-slate-900 dark:text-white flex-shrink-0" />
                <div className="text-xs text-slate-900 dark:text-white dark:text-[#F8D5E3] font-medium leading-relaxed">
                  Kamu bisa mengedit 1 rekening utama di sini. Untuk menambahkan <strong>lebih banyak rekening (GoPay, OVO, Bank lain)</strong>, silakan kelola melalui menu <strong className="font-bold">Kado & Amplop</strong> di Dashboard (mendukung hingga 3 rekening untuk Premium, dan Tak Terbatas untuk Pro).
                </div>
              </div>
              <div className="p-5 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Nama Bank / E-Wallet</label><input type="text" value={formData.bank_name} onChange={(e) => handleChange("bank_name", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Nomor Rekening</label><input type="text" value={formData.account_number} onChange={(e) => handleChange("account_number", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-700 dark:text-slate-400 mb-1">Atas Nama (Pemilik)</label><input type="text" value={formData.account_name} onChange={(e) => handleChange("account_name", e.target.value)} className="w-full px-4 py-2.5 rounded-none border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:border-white" /></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: PENGATURAN */}
          {STEPS[currentStep].id === "settings" && (
            <motion.div key="step-5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Settings className="w-5 h-5 text-slate-900 dark:text-white" /> Pengaturan Fitur Undangan
              </h2>
              <div className="space-y-3">
                {[
                  { key: "show_rsvp", label: "Aktifkan Form RSVP Tamu", desc: "Tamu dapat mengonfirmasi kehadiran" },
                  { key: "show_wishes", label: "Aktifkan Ucapan & Doa", desc: "Buku tamu digital dengan pesan ucapan" },
                  { key: "show_gift", label: "Tampilkan Fitur Kado & Amplop Cashless", desc: "Menampilkan nomor rekening/QRIS" },
                  { key: "show_gallery", label: "Tampilkan Galeri Foto", desc: "Menampilkan koleksi foto ke tamu" },
                  { key: "is_published", label: "Publikasikan Sekarang (Live)", desc: "Dapat diakses melalui URL link" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-none bg-slate-50 border border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.label}</h4>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                    <input type="checkbox" checked={(formData as any)[item.key]} onChange={(e) => handleChange(item.key, e.target.checked)} className="w-5 h-5 accent-slate-900 dark:accent-slate-50 rounded-none cursor-pointer" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-2 px-5 py-2.5 rounded-none text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ArrowLeft className="w-4 h-4" /> Sebelum
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isResolvingTheme}
              className="flex items-center gap-2 bg-slate-900 dark:bg-white px-6 py-2.5 rounded-none font-bold text-white dark:text-slate-900 text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResolvingTheme ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memuat tema...
                </>
              ) : (
                <>
                  Lanjut
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button type="button" onClick={() => setShowConfirmModal(true)} disabled={isUpdating} className="flex items-center gap-2 px-8 py-3 rounded-none font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors text-xs sm:text-sm disabled:opacity-50">
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Simpan Perubahan</>}
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Simpan Perubahan?"
        description="Apakah Anda yakin semua data sudah benar? Perubahan ini akan segera terlihat oleh semua tamu yang mengakses link undangan Anda."
        confirmText="Ya, Simpan Perubahan"
      />
    </div>
  );
}



