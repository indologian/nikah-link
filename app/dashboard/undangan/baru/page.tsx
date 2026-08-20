"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  Heart, Calendar, MapPin, Music, Image as ImageIcon,
  Gift, Settings, Sparkles, ArrowRight, ArrowLeft, Check, Loader2, CheckCircle2, XCircle
} from "lucide-react";
import Link from "next/link";

import UpsellModal from "@/components/dashboard/UpsellModal";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import { getThemeConfig } from "@/lib/themes/registry";

const STEPS = [
  { id: "theme", label: "Tema", icon: Sparkles },
  { id: "basic", label: "Mempelai", icon: Heart },
  { id: "events", label: "Acara", icon: Calendar },
  { id: "media", label: "Galeri & Musik", icon: ImageIcon },
  { id: "gift", label: "Kado Cashless", icon: Gift },
  { id: "settings", label: "Pengaturan", icon: Settings },
];



const DEFAULT_FORM_DATA = {
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
  music_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-115207.mp3",
  cover_image_url: "",
  custom_message: "Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.",

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
};

export default function NewInvitationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nikahlink_new_invitation_step");
      if (saved) {
        return parseInt(saved, 10) || 0;
      }
    }
    return 0;
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const [isCheckingLimit, setIsCheckingLimit] = useState(true);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [themesList, setThemesList] = useState<any[]>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("themes").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (data) setThemesList(data);
    };
    fetchThemes();
  }, [supabase]);

  // Form State
  const [formData, setFormData] = useState<typeof DEFAULT_FORM_DATA>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nikahlink_new_invitation");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return { ...DEFAULT_FORM_DATA, ...parsed, custom_data: parsed.custom_data || {} };
        } catch (e) {
          console.error("Failed to parse saved form data", e);
        }
      }
    }
    return DEFAULT_FORM_DATA;
  });

  useEffect(() => {
    localStorage.setItem("nikahlink_new_invitation", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("nikahlink_new_invitation_step", currentStep.toString());
  }, [currentStep]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  useEffect(() => {
    async function fetchPlanAndCheckLimit() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [{ data: profile }, { count }] = await Promise.all([
          supabase.from("profiles").select("plan, has_used_free_trial, plan_expires_at").eq("user_id", user.id).single(),
          supabase.from("invitations").select("*", { count: "exact", head: true }).eq("user_id", user.id)
        ]);

        const plan = profile?.plan || "free";
        const hasUsedTrial = profile?.has_used_free_trial || false;
        const planExpiresAt = profile?.plan_expires_at ? new Date(profile.plan_expires_at) : null;
        setUserPlan(plan);

        // Jika Free tier, buatkan random slug
        if (plan === "free") {
          const randomSlug = `trial-${Math.random().toString(36).substring(2, 10)}`;
          setFormData(prev => ({ ...prev, username: randomSlug }));
        }

        // Check if limit is exceeded or free trial is already used
        const limits = { free: 1, premium: 1, pro: 2 };
        const planLimit = limits[plan as "free" | "premium" | "pro"] || 1;

        if (plan === "free" && hasUsedTrial) {
          setIsLimitReached(true);
          setUpsellConfig({
            isOpen: true,
            title: "Masa Coba Gratis Habis",
            description: "Kamu sudah pernah menggunakan kuota undangan Gratis (Trial 24 Jam) milikmu. Silakan tingkatkan paketmu ke Premium untuk membuat undangan yang aktif 3 bulan!",
            planNeeded: "premium"
          });
        } else if (plan === "premium" && planExpiresAt && planExpiresAt < new Date()) {
          setIsLimitReached(true);
          setUpsellConfig({
            isOpen: true,
            title: "Paket Premium Kedaluwarsa",
            description: "Masa aktif paket Premium kamu (3 bulan) telah habis. Silakan perpanjang atau tingkatkan paketmu untuk membuat undangan baru.",
            planNeeded: "premium"
          });
        } else if (count !== null && count >= planLimit) {
          setIsLimitReached(true);
          setUpsellConfig({
            isOpen: true,
            title: "Batas Undangan Tercapai",
            description: `Paket ${plan.toUpperCase()} kamu membatasi maksimal pembuatan ${planLimit} undangan. Tingkatkan paketmu untuk membuat undangan lebih banyak!`,
            planNeeded: plan === "free" ? "premium" : "pro"
          });
        }
      }
      setIsCheckingLimit(false);
    }
    fetchPlanAndCheckLimit();
  }, [supabase, router]);

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
  }, [formData.username, supabase]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];

      // Validasi Ukuran File (Maksimal 1 MB = 1048576 bytes)
      if (file.size > 1048576) {
        setError("Ukuran file terlalu besar! Maksimal 1 MB.");
        return;
      }

      // Validasi Tipe File
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

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('invitations')
        .getPublicUrl(filePath);

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
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      const file = e.target.files[0];

      // Validasi Ukuran File Audio (Maksimal 5 MB = 5242880 bytes)
      if (file.size > 5242880) {
        setError("Ukuran file musik terlalu besar! Maksimal 5 MB.");
        return;
      }

      // Validasi Tipe File (Toleransi fallback extension checking)
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

      const { error: uploadError } = await supabase.storage
        .from('invitations')
        .upload(filePath, file, {
          contentType: file.type || "audio/mpeg",
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('invitations')
        .getPublicUrl(filePath);

      handleChange(field, publicUrl);
    } catch (err: any) {
      setError("Gagal mengunggah musik: " + err.message);
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };


  const getSelectedThemeConfig = () => {
    const selectedTheme = themesList.find((theme) => theme.slug === formData.theme_slug);
    if (!selectedTheme?.component_key) return null;
    const config = getThemeConfig(selectedTheme.component_key);
    return config.slug === selectedTheme.component_key ? config : null;
  };

  const handleNext = () => {
    if (STEPS[currentStep].id === "theme") {
      const selectedThemeConfig = getSelectedThemeConfig();
      if (!selectedThemeConfig) {
        setError("Konfigurasi renderer tema tidak valid. Silakan pilih tema lain.");
        return;
      }
      if (selectedThemeConfig.fields && selectedThemeConfig.fields.length > 0) {
        for (const field of selectedThemeConfig.fields) {
          if (!formData.custom_data || !formData.custom_data[field.name]) {
            setError(`Mohon isi field "${field.label}" pada pengaturan khusus tema.`);
            return;
          }
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
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Kamu harus login terlebih dahulu.");
        setLoading(false);
        return;
      }

      // Check if username unique
      const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");

      const { data: existing } = await supabase
        .from("invitations")
        .select("id")
        .eq("username", cleanUsername)
        .single();

      if (existing) {
        setError(`URL undangan "nikahlink.com/${cleanUsername}" sudah digunakan. Silakan pilih URL lain.`);
        setLoading(false);
        return;
      }

      const selectedTheme = themesList.find((theme) => theme.slug === formData.theme_slug);
      if (!selectedTheme?.id || !selectedTheme.component_key) {
        setError("Tema tidak valid atau renderer tema belum terkonfigurasi.");
        setLoading(false);
        return;
      }

      const { data: themeVersion, error: themeVersionError } = await supabase
        .from("theme_versions")
        .select("id, theme_id, component_key, version, is_published, lifecycle_status")
        .eq("theme_id", selectedTheme.id)
        .eq("is_published", true)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (themeVersionError) throw themeVersionError;
      if (!themeVersion || themeVersion.theme_id !== selectedTheme.id || themeVersion.component_key !== selectedTheme.component_key) {
        setError("Tema tidak memiliki published version yang konsisten dengan renderer-nya.");
        setLoading(false);
        return;
      }

      // Save invitation. theme_version_id pins the exact published snapshot used by the invitation.
      const { data: newInv, error: insertError } = await supabase
        .from("invitations")
        .insert({
          user_id: user.id,
          username: cleanUsername,
          bride_name: formData.bride_name,
          groom_name: formData.groom_name,
          bride_photo_url: formData.bride_photo_url || null,
          groom_photo_url: formData.groom_photo_url || null,
          love_story: formData.love_story || null,

          akad_date: formData.akad_date || null,
          akad_time: formData.akad_time || null,
          akad_venue: formData.akad_venue || null,
          akad_address: formData.akad_address || null,
          akad_maps_url: formData.akad_maps_url || null,

          reception_date: formData.reception_date || null,
          reception_time: formData.reception_time || null,
          reception_venue: formData.reception_venue || null,
          reception_address: formData.reception_address || null,
          reception_maps_url: formData.reception_maps_url || null,

          theme_id: selectedTheme.id,
          theme_version_id: themeVersion.id,
          music_url: formData.music_url || null,
          cover_image_url: formData.cover_image_url || null,
          custom_message: formData.custom_message,

          is_published: formData.is_published,
          show_rsvp: formData.show_rsvp,
          show_gift: formData.show_gift,
          show_gallery: formData.show_gallery,
          show_wishes: formData.show_wishes,
          custom_data: formData.custom_data,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Save gift account if filled
      if (formData.bank_name && formData.account_number) {
        await supabase.from("gift_accounts").insert({
          invitation_id: newInv.id,
          type: "bank",
          bank_name: formData.bank_name,
          account_number: formData.account_number,
          account_name: formData.account_name,
        });
      }

      // Clear local storage on success
      localStorage.removeItem("nikahlink_new_invitation");
      localStorage.removeItem("nikahlink_new_invitation_step");

      // Set has_used_free_trial = true if user is on free plan
      if (userPlan === "free") {
        await supabase
          .from("profiles")
          .update({ has_used_free_trial: true })
          .eq("user_id", user.id);
      }

      router.push(`/dashboard/undangan?success=created`);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan undangan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };
