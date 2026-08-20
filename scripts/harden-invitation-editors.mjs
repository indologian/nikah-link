import fs from "node:fs";

const files = {
  create: "app/dashboard/undangan/baru/page.tsx",
  edit: "app/dashboard/undangan/[id]/edit/page.tsx",
};

function replaceRequired(source, pattern, replacement, label) {
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`Pattern not found: ${label}`);
  return next;
}

function buildUploadHelpers() {
  return `  const uploadAsset = async (e: React.ChangeEvent<HTMLInputElement>, field: string, kind: "image" | "audio") => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading((prev) => ({ ...prev, [field]: true }));
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("kind", kind);
      const publicUrl = await uploadInvitationAssetAction(formData);

      if (kind === "image" && field.startsWith("custom_")) {
        setFormData((prev) => ({
          ...prev,
          custom_data: { ...(prev.custom_data || {}), [field]: publicUrl },
        }));
      } else {
        handleChange(field, publicUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah file.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>, field: string) => uploadAsset(e, field, "image");
  const uploadCustomImage = (e: React.ChangeEvent<HTMLInputElement>, field: string) => uploadAsset(e, field, "image");
  const uploadAudio = (e: React.ChangeEvent<HTMLInputElement>, field: string) => uploadAsset(e, field, "audio");

`;
}

function normalizeThemePayload(formData, selectedThemeEditor) {
  if (!selectedThemeEditor) throw new Error("Tema yang dipilih belum siap atau published version-nya tidak valid.");
  return {
    username: formData.username,
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
    theme_id: selectedThemeEditor.theme.id,
    theme_version_id: selectedThemeEditor.version.id,
    music_url: formData.music_url || null,
    cover_image_url: formData.cover_image_url || null,
    custom_message: formData.custom_message || null,
    is_published: formData.is_published,
    show_rsvp: formData.show_rsvp,
    show_gift: formData.show_gift,
    show_gallery: formData.show_gallery,
    show_wishes: formData.show_wishes,
    custom_data: formData.custom_data || {},
    bank_name: formData.bank_name || null,
    account_number: formData.account_number || null,
    account_name: formData.account_name || null,
  };
}

function patchCreate() {
  let s = fs.readFileSync(files.create, "utf8");
  s = replaceRequired(s, /import \{ createClient \} from "@\/lib\/supabase\/client";/, 'import {\n  checkInvitationUsername,\n  createInvitationAction,\n  loadActiveInvitationThemes,\n  loadNewInvitationContext,\n  uploadInvitationAssetAction,\n} from "@/actions/invitations/invitation";', "create imports");
  s = replaceRequired(s, /  const supabase = createClient\(\);\n/, "", "create client instance");

  s = replaceRequired(s, /  useEffect\(\(\) => \{\n    const fetchThemes = async \(\) => \{[\s\S]*?  \}, \[supabase\]\);\n/, `  useEffect(() => {\n    loadActiveInvitationThemes().then(setThemesList).catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat tema."));\n  }, []);\n`, "create theme effect");

  s = replaceRequired(s, /  useEffect\(\(\) => \{\n    async function fetchPlanAndCheckLimit\(\) \{[\s\S]*?  \}, \[supabase, router\]\);\n/, `  useEffect(() => {\n    async function loadContext() {\n      try {\n        const context = await loadNewInvitationContext();\n        if (!context) {\n          setIsCheckingLimit(false);\n          return;\n        }\n        const { plan, hasUsedFreeTrial, planExpiresAt, invitationCount } = context;\n        setUserPlan(plan);\n        if (plan === "free") {\n          const randomSlug = \`trial-\${Math.random().toString(36).substring(2, 10)}\`;\n          setFormData((prev) => ({ ...prev, username: randomSlug }));\n        }\n        const limits = { free: 1, premium: 1, pro: 2 };\n        const planLimit = limits[plan] ?? 1;\n        if (plan === "free" && hasUsedFreeTrial) {\n          setIsLimitReached(true);\n          setUpsellConfig({ isOpen: true, title: "Masa Coba Gratis Habis", description: "Kamu sudah pernah menggunakan kuota undangan Gratis (Trial 24 Jam) milikmu. Silakan tingkatkan paketmu ke Premium untuk membuat undangan yang aktif 3 bulan!", planNeeded: "premium" });\n        } else if (plan === "premium" && planExpiresAt && new Date(planExpiresAt) < new Date()) {\n          setIsLimitReached(true);\n          setUpsellConfig({ isOpen: true, title: "Paket Premium Kedaluwarsa", description: "Masa aktif paket Premium kamu (3 bulan) telah habis. Silakan perpanjang atau tingkatkan paketmu untuk membuat undangan baru.", planNeeded: "premium" });\n        } else if (invitationCount >= planLimit) {\n          setIsLimitReached(true);\n          setUpsellConfig({ isOpen: true, title: "Batas Undangan Tercapai", description: \`Paket \${plan.toUpperCase()} kamu membatasi maksimal pembuatan \${planLimit} undangan. Tingkatkan paketmu untuk membuat undangan lebih banyak!\`, planNeeded: plan === "free" ? "premium" : "pro" });\n        }\n      } catch (err) {\n        setError(err instanceof Error ? err.message : "Gagal memuat status akun.");\n      } finally {\n        setIsCheckingLimit(false);\n      }\n    }\n    loadContext();\n  }, []);\n`, "create context effect");

  s = replaceRequired(s, /  useEffect\(\(\) => \{\n    if \(!formData\.username\) \{[\s\S]*?  \}, \[formData\.username, supabase\]\);\n\n/, `  useEffect(() => {\n    if (!formData.username) { setSlugStatus("idle"); return; }\n    const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");\n    if (cleanUsername !== formData.username) { setFormData((prev) => ({ ...prev, username: cleanUsername })); return; }\n    setSlugStatus("checking");\n    const timeoutId = setTimeout(async () => {\n      try {\n        const available = await checkInvitationUsername(cleanUsername);\n        setSlugStatus(available ? "available" : "taken");\n      } catch {\n        setSlugStatus("idle");\n      }\n    }, 500);\n    return () => clearTimeout(timeoutId);\n  }, [formData.username]);\n\n`, "create slug effect");

  s = replaceRequired(s, /  const getUserStoragePath = async \(fileName: string\) => \{[\s\S]*?  const handleThemeSelect = async/, buildUploadHelpers() + "  const handleThemeSelect = async", "create upload helpers");

  s = replaceRequired(s, /  const handleSubmit = async \(\) => \{[\s\S]*?\n  \};\n\n  if \(isCheckingLimit\)/, `  const handleSubmit = async () => {\n    setLoading(true);\n    setShowConfirmModal(false);\n    setError("");\n    try {\n      if (isResolvingTheme) throw new Error("Tema masih dimuat. Silakan tunggu sampai selesai.");\n      if (Object.values(uploading).some(Boolean)) throw new Error("Masih ada file yang sedang diunggah.");\n      if (slugStatus === "checking") throw new Error("URL undangan masih diperiksa.\");\n      if (!selectedThemeEditor) throw new Error("Tema yang dipilih tidak valid.");\n      await createInvitationAction(normalizeThemePayload(formData, selectedThemeEditor));\n      localStorage.removeItem("nikahlink_new_invitation");\n      localStorage.removeItem("nikahlink_new_invitation_step");\n      router.push("/dashboard/undangan?success=created");\n    } catch (err) {\n      setError(err instanceof Error ? err.message : "Gagal menyimpan undangan.");\n    } finally {\n      setLoading(false);\n    }\n  };\n\n  if (isCheckingLimit)`, "create submit");

  s = s.replace(/\nfunction normalizeThemePayload[\s\S]*?\n\nexport default function NewInvitationPage/, "\nexport default function NewInvitationPage");
  // Inject helper outside component after DEFAULT_FORM_DATA declaration.
  const marker = "};\n\nexport default function NewInvitationPage";
  s = s.replace(marker, "};\n\nfunction normalizeThemePayload(formData: any, selectedThemeEditor: any) {\n  if (!selectedThemeEditor) throw new Error(\"Tema yang dipilih belum siap atau published version-nya tidak valid.\");\n  return { username: formData.username, bride_name: formData.bride_name, groom_name: formData.groom_name, bride_photo_url: formData.bride_photo_url || null, groom_photo_url: formData.groom_photo_url || null, love_story: formData.love_story || null, akad_date: formData.akad_date || null, akad_time: formData.akad_time || null, akad_venue: formData.akad_venue || null, akad_address: formData.akad_address || null, akad_maps_url: formData.akad_maps_url || null, reception_date: formData.reception_date || null, reception_time: formData.reception_time || null, reception_venue: formData.reception_venue || null, reception_address: formData.reception_address || null, reception_maps_url: formData.reception_maps_url || null, theme_id: selectedThemeEditor.theme.id, theme_version_id: selectedThemeEditor.version.id, music_url: formData.music_url || null, cover_image_url: formData.cover_image_url || null, custom_message: formData.custom_message || null, is_published: formData.is_published, show_rsvp: formData.show_rsvp, show_gift: formData.show_gift, show_gallery: formData.show_gallery, show_wishes: formData.show_wishes, custom_data: formData.custom_data || {}, bank_name: formData.bank_name || null, account_number: formData.account_number || null, account_name: formData.account_name || null };\n}\n\nexport default function NewInvitationPage");

  fs.writeFileSync(files.create, s);
}

function patchEdit() {
  let s = fs.readFileSync(files.edit, "utf8");
  s = replaceRequired(s, /import \{ createClient \} from "@\/lib\/supabase\/client";/, 'import {\n  checkInvitationUsername,\n  loadActiveInvitationThemes,\n  loadInvitationEditor,\n  updateInvitationAction,\n  uploadInvitationAssetAction,\n} from "@/actions/invitations/invitation";', "edit imports");
  s = replaceRequired(s, /  const supabase = createClient\(\);\n/, "", "edit client instance");

  s = replaceRequired(s, /  useEffect\(\(\) => \{\n    const fetchThemes = async \(\) => \{[\s\S]*?  \}, \[supabase\]\);\n\n/, `  useEffect(() => {\n    loadActiveInvitationThemes().then(setThemesList).catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat tema."));\n  }, []);\n\n`, "edit theme effect");

  s = replaceRequired(s, /  useEffect\(\(\) => \{\n    if \(!invitationId\) return;[\s\S]*?  \}, \[invitationId, supabase\]\);\n\n/, `  useEffect(() => {\n    if (!invitationId) return;\n    let cancelled = false;\n    const load = async () => {\n      setLoading(true);\n      try {\n        const result = await loadInvitationEditor(invitationId);\n        if (!result || cancelled) return;\n        const data = result.invitation;\n        const gifts = result.gifts ?? [];\n        if (gifts[0]) { setGiftAccountId(gifts[0].id); }\n        const gift = gifts[0];\n        setInitialUsername(data.username || "");\n        setFormData({ username: data.username || "", bride_name: data.bride_name || "", groom_name: data.groom_name || "", bride_photo_url: data.bride_photo_url || "", groom_photo_url: data.groom_photo_url || "", love_story: data.love_story || "", akad_date: data.akad_date || "", akad_time: data.akad_time || "", akad_venue: data.akad_venue || "", akad_address: data.akad_address || "", akad_maps_url: data.akad_maps_url || "", reception_date: data.reception_date || "", reception_time: data.reception_time || "", reception_venue: data.reception_venue || "", reception_address: data.reception_address || "", reception_maps_url: data.reception_maps_url || "", theme_slug: data.themes?.slug || "minimalis", music_url: data.music_url || "", cover_image_url: data.cover_image_url || "", custom_message: data.custom_message || "", bank_name: gift?.bank_name || "", account_number: gift?.account_number || "", account_name: gift?.account_name || "", show_rsvp: data.show_rsvp ?? true, show_gift: data.show_gift ?? true, show_gallery: data.show_gallery ?? true, show_wishes: data.show_wishes ?? true, is_published: data.is_published ?? true, custom_data: data.custom_data || {} });\n        const resolved = await getPublishedThemeForEditor(data.themes?.slug || "minimalis");\n        if (!cancelled) setSelectedThemeEditor(resolved);\n        setUserPlan(result.plan);\n        setThemesList(result.themes);\n      } catch { if (!cancelled) setError("Gagal memuat data undangan."); } finally { if (!cancelled) setLoading(false); }\n    };\n    load();\n    return () => { cancelled = true; };\n  }, [invitationId]);\n\n`, "edit invitation effect");

  s = replaceRequired(s, /  useEffect\(\(\) => \{\n    if \(!formData\.username\) \{[\s\S]*?  \}, \[formData\.username, initialUsername, supabase\]\);\n\n/, `  useEffect(() => {\n    if (!formData.username) { setSlugStatus("idle"); return; }\n    const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");\n    if (cleanUsername !== formData.username) { setFormData((prev) => ({ ...prev, username: cleanUsername })); return; }\n    if (cleanUsername === initialUsername) { setSlugStatus("available"); return; }\n    setSlugStatus("checking");\n    const timeoutId = setTimeout(async () => {\n      try { setSlugStatus((await checkInvitationUsername(cleanUsername)) ? "available" : "taken"); } catch { setSlugStatus("idle"); }\n    }, 500);\n    return () => clearTimeout(timeoutId);\n  }, [formData.username, initialUsername]);\n\n`, "edit slug effect");

  s = replaceRequired(s, /  const getUserStoragePath = async \(fileName: string\) => \{[\s\S]*?  const handleChange =/, `  const uploadAsset = async (e: React.ChangeEvent<HTMLInputElement>, field: string, kind: "image" | "audio") => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      const data = new FormData();\n      data.append("file", file);\n      data.append("kind", kind);\n      handleChange(field, await uploadInvitationAssetAction(data));\n    } catch (err) { setError(err instanceof Error ? err.message : "Gagal mengunggah file."); }\n    finally { setUploading((prev) => ({ ...prev, [field]: false })); }\n  };\n  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>, field: string) => uploadAsset(e, field, "image");\n  const uploadCustomImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try { const file = e.target.files?.[0]; if (!file) return; setUploading((prev) => ({ ...prev, [field]: true })); const data = new FormData(); data.append("file", file); data.append("kind", "image"); const publicUrl = await uploadInvitationAssetAction(data); setFormData((prev) => ({ ...prev, custom_data: { ...(prev.custom_data || {}), [field]: publicUrl } })); } catch (err) { setError(err instanceof Error ? err.message : "Gagal mengunggah file."); } finally { setUploading((prev) => ({ ...prev, [field]: false })); }\n  };\n  const uploadAudio = (e: React.ChangeEvent<HTMLInputElement>, field: string) => uploadAsset(e, field, "audio");\n\n  const handleChange =`, "edit upload helpers");

  s = replaceRequired(s, /  const handleSubmit = async \(\) => \{[\s\S]*?\n  \};\n\n  if \(loading\)/, `  const handleSubmit = async () => {\n    if (isResolvingTheme || Object.values(uploading).some(Boolean) || slugStatus === "checking") { setError("Masih ada proses yang belum selesai."); return; }\n    setIsUpdating(true);\n    setShowConfirmModal(false);\n    setError("");\n    try {\n      if (!selectedThemeEditor || selectedThemeEditor.theme.slug !== formData.theme_slug) throw new Error("Tema yang dipilih belum siap.");\n      await updateInvitationAction({ invitationId, giftAccountId, data: { username: formData.username, bride_name: formData.bride_name, groom_name: formData.groom_name, bride_photo_url: formData.bride_photo_url || null, groom_photo_url: formData.groom_photo_url || null, love_story: formData.love_story || null, akad_date: formData.akad_date || null, akad_time: formData.akad_time || null, akad_venue: formData.akad_venue || null, akad_address: formData.akad_address || null, akad_maps_url: formData.akad_maps_url || null, reception_date: formData.reception_date || null, reception_time: formData.reception_time || null, reception_venue: formData.reception_venue || null, reception_address: formData.reception_address || null, reception_maps_url: formData.reception_maps_url || null, theme_id: selectedThemeEditor.theme.id, theme_version_id: selectedThemeEditor.version.id, music_url: formData.music_url || null, cover_image_url: formData.cover_image_url || null, custom_message: formData.custom_message || null, is_published: formData.is_published, show_rsvp: formData.show_rsvp, show_gift: formData.show_gift, show_gallery: formData.show_gallery, show_wishes: formData.show_wishes, custom_data: formData.custom_data || {}, bank_name: formData.bank_name || null, account_number: formData.account_number || null, account_name: formData.account_name || null } });\n      router.push("/dashboard/undangan?success=updated");\n    } catch (err) { setError(err instanceof Error ? err.message : "Gagal memperbarui undangan. Silakan coba lagi."); } finally { setIsUpdating(false); }\n  };\n\n  if (loading)`, "edit submit");

  fs.writeFileSync(files.edit, s);
}

patchCreate();
patchEdit();

for (const file of Object.values(files)) {
  const source = fs.readFileSync(file, "utf8");
  const forbidden = ["@/lib/supabase/client", "createClient(", "supabase.", ".from(", ".rpc(", ".storage.", ".auth."];
  const hit = forbidden.find((needle) => source.includes(needle));
  if (hit) throw new Error(`${file} still contains forbidden client backend access: ${hit}`);
}

console.log("Invitation editor hardening completed.");
