import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = {
  new: path.join(root, "app/dashboard/undangan/baru/page.tsx"),
  edit: path.join(root, "app/dashboard/undangan/[id]/edit/page.tsx"),
};

function fail(message) {
  console.error(`\nInvitation editor refactor aborted: ${message}`);
  process.exit(1);
}

function replaceSection(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  if (start === -1) fail(`${label}: start marker not found.`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end === -1) fail(`${label}: end marker not found.`);
  const before = source.slice(0, start);
  const after = source.slice(end);
  const section = source.slice(start, end);
  if (!section.trim()) fail(`${label}: empty section.`);
  return `${before}${replacement}${after}`;
}

function replaceExact(source, search, replacement, label) {
  const first = source.indexOf(search);
  if (first === -1) fail(`${label}: exact text not found.`);
  const second = source.indexOf(search, first + search.length);
  if (second !== -1) fail(`${label}: exact text occurs more than once.`);
  return `${source.slice(0, first)}${replacement}${source.slice(first + search.length)}`;
}

function backup(file) {
  const backupPath = `${file}.server-actions.bak`;
  if (!fs.existsSync(backupPath)) fs.copyFileSync(file, backupPath);
}

function assertClean(source, label) {
  const forbidden = [
    [/createClient\s*\(/g, "createClient()"],
    [/\bcreateClient\b/g, "createClient reference"],
    [/\.storage\s*\./g, ".storage"],
    [/\.storage\s*\(/g, ".storage()"],
    [/\.from\s*\(/g, ".from()"],
    [/\.rpc\s*\(/g, ".rpc()"],
    [/Math\.random\s*\(/g, "Math.random()"],
    [/Date\.now\s*\(/g, "Date.now()"],
  ];

  const hits = forbidden
    .map(([pattern, name]) => {
      const count = source.match(pattern)?.length ?? 0;
      return count ? `${name}: ${count}` : null;
    })
    .filter(Boolean);

  if (hits.length) {
    fail(`${label}: forbidden client-side patterns remain: ${hits.join(", ")}`);
  }
}

function normalizeUseClient(source) {
  source = source.replace(/^\s*["']use client["'];?\s*\r?\n?/gm, "");
  source = source.replace(/\r?\n[ \t]*["']use client["'];?\s*\r?\n/g, "\n");
  return `"use client";\n\n${source.replace(/^\s+/, "")}`;
}

function updateActionImport(source, importLine) {
  source = source.replace(/import \{ createClient \} from "@\/lib\/supabase\/client";\r?\n/, "");
  source = source.replace(/import \{ checkInvitationUsername,[^\n]+\} from "@\/actions\/invitations\/invitation";\r?\n/, "");
  const marker = 'import Link from "next/link";\n';
  if (!source.includes(marker)) fail("next/link import marker not found.");
  return source.replace(marker, `${marker}${importLine}`);
}

function transformNew(source) {
  source = normalizeUseClient(source);
  source = updateActionImport(
    source,
    'import { checkInvitationUsername, createInvitationAction, loadNewInvitationContext, uploadInvitationAssetAction } from "@/actions/invitations/invitation";\n',
  );
  source = source.replace(/\n\s*const supabase = createClient\(\);\n/, "\n");

  source = replaceSection(
    source,
    "  useEffect(() => {\n    const fetchThemes = async () => {",
    "  // Form State",
    "",
    "new invitation themes query",
  );

  source = replaceSection(
    source,
    "  useEffect(() => {\n    async function fetchPlanAndCheckLimit() {",
    "  // Real-time Slug Checking",
    `  useEffect(() => {\n    async function loadContext() {\n      try {\n        const context = await loadNewInvitationContext();\n        if (!context) {\n          setIsCheckingLimit(false);\n          return;\n        }\n\n        setThemesList(context.themes);\n        setUserPlan(context.plan);\n\n        if (context.plan === "free") {\n          setFormData((prev) =>\n            prev.username\n              ? prev\n              : { ...prev, username: \\`trial-\${crypto.randomUUID().slice(0, 8)}\\` },\n          );\n        }\n\n        const limits = { free: 1, premium: 1, pro: 2 };\n        const planLimit = limits[context.plan as "free" | "premium" | "pro"] || 1;\n        const expiresAt = context.planExpiresAt ? new Date(context.planExpiresAt) : null;\n\n        if (context.plan === "free" && context.hasUsedFreeTrial) {\n          setIsLimitReached(true);\n          setUpsellConfig({\n            isOpen: true,\n            title: "Masa Coba Gratis Habis",\n            description: "Kamu sudah pernah menggunakan kuota undangan Gratis (Trial 24 Jam) milikmu. Silakan tingkatkan paketmu ke Premium untuk membuat undangan yang aktif 3 bulan!",\n            planNeeded: "premium",\n          });\n        } else if (context.plan === "premium" && expiresAt && expiresAt < new Date()) {\n          setIsLimitReached(true);\n          setUpsellConfig({\n            isOpen: true,\n            title: "Paket Premium Kedaluwarsa",\n            description: "Masa aktif paket Premium kamu (3 bulan) telah habis. Silakan perpanjang atau tingkatkan paketmu untuk membuat undangan baru.",\n            planNeeded: "premium",\n          });\n        } else if (context.invitationCount >= planLimit) {\n          setIsLimitReached(true);\n          setUpsellConfig({\n            isOpen: true,\n            title: "Batas Undangan Tercapai",\n            description: \\`Paket \${context.plan.toUpperCase()} kamu membatasi maksimal pembuatan \${planLimit} undangan. Tingkatkan paketmu untuk membuat undangan lebih banyak!\`,\n            planNeeded: context.plan === "free" ? "premium" : "pro",\n          });\n        }\n      } catch (err) {\n        console.error("Failed to load invitation context", err);\n        setError("Gagal memuat konteks pembuatan undangan.");\n      } finally {\n        setIsCheckingLimit(false);\n      }\n    }\n\n    loadContext();\n  }, []);\n\n`,
    "new invitation plan/limit query",
  );

  source = replaceSection(
    source,
    "  // Real-time Slug Checking\n  useEffect(() => {",
    "  const handleThemeSelect = async (theme: any) => {",
    `  // Real-time Slug Checking\n  useEffect(() => {\n    if (!formData.username) {\n      setSlugStatus("idle");\n      return;\n    }\n\n    const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");\n    if (cleanUsername !== formData.username) {\n      setFormData((prev) => ({ ...prev, username: cleanUsername }));\n      return;\n    }\n\n    setSlugStatus("checking");\n    const timeoutId = setTimeout(async () => {\n      try {\n        const available = await checkInvitationUsername(cleanUsername);\n        setSlugStatus(available ? "available" : "taken");\n      } catch {\n        setSlugStatus("idle");\n      }\n    }, 500);\n\n    return () => clearTimeout(timeoutId);\n  }, [formData.username]);\n\n  const uploadAsset = async (file: File, kind: "image" | "audio") => {\n    const formData = new FormData();\n    formData.set("file", file);\n    formData.set("kind", kind);\n    return uploadInvitationAssetAction(formData);\n  };\n\n  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      if (file.size > 1048576) {\n        setError("Ukuran file terlalu besar! Maksimal 1 MB.");\n        return;\n      }\n\n      const allowedTypes = [\n        "image/jpeg", "image/png", "image/gif", "image/webp",\n        "image/svg+xml", "image/bmp", "image/tiff", "image/x-icon", "image/avif",\n      ];\n      if (!allowedTypes.includes(file.type)) {\n        setError("Format file tidak didukung! Pastikan file berupa gambar.");\n        return;\n      }\n\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      handleChange(field, await uploadAsset(file, "image"));\n    } catch (err) {\n      setError(`Gagal mengunggah gambar: \${err instanceof Error ? err.message : "Unknown error"}`);\n    } finally {\n      setUploading((prev) => ({ ...prev, [field]: false }));\n    }\n  };\n\n  const uploadCustomImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      if (file.size > 1048576) {\n        setError("Ukuran file terlalu besar! Maksimal 1 MB.");\n        return;\n      }\n\n      const allowedTypes = [\n        "image/jpeg", "image/png", "image/gif", "image/webp",\n        "image/svg+xml", "image/bmp", "image/tiff", "image/x-icon", "image/avif",\n      ];\n      if (!allowedTypes.includes(file.type)) {\n        setError("Format file tidak didukung! Pastikan file berupa gambar.");\n        return;\n      }\n\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      const publicUrl = await uploadAsset(file, "image");\n      setFormData((prev) => ({\n        ...prev,\n        custom_data: { ...(prev.custom_data || {}), [field]: publicUrl },\n      }));\n    } catch (err) {\n      setError(`Gagal mengunggah gambar: \${err instanceof Error ? err.message : "Unknown error"}`);\n    } finally {\n      setUploading((prev) => ({ ...prev, [field]: false }));\n    }\n  };\n\n  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      if (file.size > 5242880) {\n        setError("Ukuran file musik terlalu besar! Maksimal 5 MB.");\n        return;\n      }\n\n      const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/x-m4a"];\n      if (!allowedTypes.includes(file.type) && !file.name.match(/\\.(mp3|wav|ogg|m4a)$/i)) {\n        setError("Format musik tidak didukung! Pastikan file berupa MP3, WAV, atau OGG.");\n        return;\n      }\n\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      handleChange(field, await uploadAsset(file, "audio"));\n    } catch (err) {\n      setError(`Gagal mengunggah musik: \${err instanceof Error ? err.message : "Unknown error"}`);\n    } finally {\n      setUploading((prev) => ({ ...prev, [field]: false }));\n    }\n  };\n\n`,
    "new invitation slug/upload section",
  );

  source = replaceSection(
    source,
    "  const handleSubmit = async () => {",
    "  if (isCheckingLimit) {",
    `  const handleSubmit = async () => {\n    setLoading(true);\n    setShowConfirmModal(false);\n    setError("");\n\n    try {\n      const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");\n      if (!cleanUsername) {\n        throw new Error("URL undangan wajib diisi.");\n      }\n\n      const selectedTheme = await getPublishedThemeForEditor(formData.theme_slug);\n      if (!selectedTheme) {\n        throw new Error("Tema yang dipilih tidak memiliki published version yang valid.");\n      }\n\n      const created = await createInvitationAction({\n        username: cleanUsername,\n        bride_name: formData.bride_name,\n        groom_name: formData.groom_name,\n        bride_photo_url: formData.bride_photo_url || null,\n        groom_photo_url: formData.groom_photo_url || null,\n        love_story: formData.love_story || null,\n        akad_date: formData.akad_date || null,\n        akad_time: formData.akad_time || null,\n        akad_venue: formData.akad_venue || null,\n        akad_address: formData.akad_address || null,\n        akad_maps_url: formData.akad_maps_url || null,\n        reception_date: formData.reception_date || null,\n        reception_time: formData.reception_time || null,\n        reception_venue: formData.reception_venue || null,\n        reception_address: formData.reception_address || null,\n        reception_maps_url: formData.reception_maps_url || null,\n        theme_id: selectedTheme.theme.id,\n        theme_version_id: selectedTheme.version.id,\n        music_url: formData.music_url || null,\n        cover_image_url: formData.cover_image_url || null,\n        custom_message: formData.custom_message || null,\n        is_published: formData.is_published,\n        show_rsvp: formData.show_rsvp,\n        show_gift: formData.show_gift,\n        show_gallery: formData.show_gallery,\n        show_wishes: formData.show_wishes,\n        custom_data: formData.custom_data ?? {},\n        bank_name: formData.bank_name || null,\n        account_number: formData.account_number || null,\n        account_name: formData.account_name || null,\n      });\n\n      localStorage.removeItem("nikahlink_new_invitation");\n      localStorage.removeItem("nikahlink_new_invitation_step");\n      router.push(`/dashboard/undangan?success=created${created?.id ? `&id=${created.id}` : ""}`);\n    } catch (err) {\n      setError(err instanceof Error ? err.message : "Gagal menyimpan undangan. Coba lagi.");\n    } finally {\n      setLoading(false);\n    }\n  };\n\n`,
    "new invitation submit",
  );

  return source;
}

function transformEdit(source) {
  source = normalizeUseClient(source);
  source = updateActionImport(
    source,
    'import { checkInvitationUsername, loadInvitationEditor, updateInvitationAction, uploadInvitationAssetAction } from "@/actions/invitations/invitation";\n',
  );
  source = source.replace(/\n\s*const supabase = createClient\(\);\n/, "\n");

  source = replaceSection(
    source,
    "  useEffect(() => {\n    const fetchThemes = async () => {",
    "  // Real-time Slug Checking",
    `  useEffect(() => {\n    if (!invitationId) return;\n\n    let cancelled = false;\n\n    const loadEditor = async () => {\n      setLoading(true);\n      try {\n        const result = await loadInvitationEditor(invitationId);\n        if (cancelled) return;\n        if (!result) throw new Error("Undangan tidak ditemukan atau Anda tidak memiliki akses.");\n\n        const data = result.invitation;\n        const gifts = result.gifts ?? [];\n        const firstGift = gifts[0];\n        setThemesList(result.themes);\n        setUserPlan(result.plan as "free" | "premium" | "pro");\n        setGiftAccountId(firstGift?.id ?? null);\n        setInitialUsername(data.username || "");\n\n        setFormData({\n          username: data.username || "",\n          bride_name: data.bride_name || "",\n          groom_name: data.groom_name || "",\n          bride_photo_url: data.bride_photo_url || "",\n          groom_photo_url: data.groom_photo_url || "",\n          love_story: data.love_story || "",\n          akad_date: data.akad_date || "",\n          akad_time: data.akad_time || "",\n          akad_venue: data.akad_venue || "",\n          akad_address: data.akad_address || "",\n          akad_maps_url: data.akad_maps_url || "",\n          reception_date: data.reception_date || "",\n          reception_time: data.reception_time || "",\n          reception_venue: data.reception_venue || "",\n          reception_address: data.reception_address || "",\n          reception_maps_url: data.reception_maps_url || "",\n          theme_slug: data.themes?.slug || "minimalis",\n          music_url: data.music_url || "",\n          cover_image_url: data.cover_image_url || "",\n          custom_message: data.custom_message || "",\n          bank_name: firstGift?.bank_name || "",\n          account_number: firstGift?.account_number || "",\n          account_name: firstGift?.account_name || "",\n          show_rsvp: data.show_rsvp ?? true,\n          show_gift: data.show_gift ?? true,\n          show_gallery: data.show_gallery ?? true,\n          show_wishes: data.show_wishes ?? true,\n          is_published: data.is_published ?? true,\n          custom_data: data.custom_data || {},\n        });\n\n        const themeSlug = data.themes?.slug || "minimalis";\n        setIsResolvingTheme(true);\n        const resolved = await getPublishedThemeForEditor(themeSlug);\n        if (cancelled) return;\n        setSelectedThemeEditor(resolved);\n      } catch (err) {\n        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat data undangan.");\n      } finally {\n        if (!cancelled) setLoading(false);\n        if (!cancelled) setIsResolvingTheme(false);\n      }\n    };\n\n    loadEditor();\n    return () => {\n      cancelled = true;\n    };\n  }, [invitationId]);\n\n`,
    "edit invitation data/theme query",
  );

  source = replaceSection(
    source,
    "  // Real-time Slug Checking\n  useEffect(() => {",
    "  const handleThemeSelect = async (theme: any) => {",
    `  // Real-time Slug Checking\n  useEffect(() => {\n    if (!formData.username) {\n      setSlugStatus("idle");\n      return;\n    }\n\n    const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");\n    if (cleanUsername !== formData.username) {\n      setFormData((prev) => ({ ...prev, username: cleanUsername }));\n      return;\n    }\n\n    if (cleanUsername === initialUsername) {\n      setSlugStatus("available");\n      return;\n    }\n\n    setSlugStatus("checking");\n    const timeoutId = setTimeout(async () => {\n      try {\n        const available = await checkInvitationUsername(cleanUsername);\n        setSlugStatus(available ? "available" : "taken");\n      } catch {\n        setSlugStatus("idle");\n      }\n    }, 500);\n\n    return () => clearTimeout(timeoutId);\n  }, [formData.username, initialUsername]);\n\n  const uploadAsset = async (file: File, kind: "image" | "audio") => {\n    const payload = new FormData();\n    payload.set("file", file);\n    payload.set("kind", kind);\n    return uploadInvitationAssetAction(payload);\n  };\n\n  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      if (file.size > 1048576) {\n        setError("Ukuran file terlalu besar! Maksimal 1 MB.");\n        return;\n      }\n      const allowedTypes = [\n        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",\n        "image/bmp", "image/tiff", "image/x-icon", "image/avif",\n      ];\n      if (!allowedTypes.includes(file.type)) {\n        setError("Format file tidak didukung! Pastikan file berupa gambar.");\n        return;\n      }\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      handleChange(field, await uploadAsset(file, "image"));\n    } catch (err) {\n      setError(`Gagal mengunggah gambar: \${err instanceof Error ? err.message : "Unknown error"}`);\n    } finally {\n      setUploading((prev) => ({ ...prev, [field]: false }));\n    }\n  };\n\n  const uploadCustomImage = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      if (file.size > 1048576) {\n        setError("Ukuran file terlalu besar! Maksimal 1 MB.");\n        return;\n      }\n      const allowedTypes = [\n        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",\n        "image/bmp", "image/tiff", "image/x-icon", "image/avif",\n      ];\n      if (!allowedTypes.includes(file.type)) {\n        setError("Format file tidak didukung! Pastikan file berupa gambar.");\n        return;\n      }\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      const publicUrl = await uploadAsset(file, "image");\n      setFormData((prev) => ({\n        ...prev,\n        custom_data: { ...(prev.custom_data || {}), [field]: publicUrl },\n      }));\n    } catch (err) {\n      setError(`Gagal mengunggah gambar: \${err instanceof Error ? err.message : "Unknown error"}`);\n    } finally {\n      setUploading((prev) => ({ ...prev, [field]: false }));\n    }\n  };\n\n  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {\n    try {\n      const file = e.target.files?.[0];\n      if (!file) return;\n      if (file.size > 5242880) {\n        setError("Ukuran file musik terlalu besar! Maksimal 5 MB.");\n        return;\n      }\n      const allowedTypes = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/x-m4a"];\n      if (!allowedTypes.includes(file.type) && !file.name.match(/\\.(mp3|wav|ogg|m4a)$/i)) {\n        setError("Format musik tidak didukung! Pastikan file berupa MP3, WAV, atau OGG.");\n        return;\n      }\n      setUploading((prev) => ({ ...prev, [field]: true }));\n      setError("");\n      handleChange(field, await uploadAsset(file, "audio"));\n    } catch (err) {\n      setError(`Gagal mengunggah musik: \${err instanceof Error ? err.message : "Unknown error"}`);\n    } finally {\n      setUploading((prev) => ({ ...prev, [field]: false }));\n    }\n  };\n\n  const handleChange = (field: string, value: unknown) => {\n    setFormData((prev) => ({ ...prev, [field]: value }));\n  };\n\n`,
    "edit invitation slug/upload section",
  );

  source = replaceSection(
    source,
    "  const handleSubmit = async () => {",
    "  if (loading) {",
    `  const handleSubmit = async () => {\n    if (isResolvingTheme) {\n      setError("Tema masih dimuat. Silakan tunggu sampai selesai.");\n      return;\n    }\n    if (Object.values(uploading).some(Boolean)) {\n      setError("Masih ada file yang sedang diunggah. Silakan tunggu sampai selesai.");\n      return;\n    }\n    if (slugStatus === "checking") {\n      setError("URL undangan masih diperiksa. Silakan tunggu sampai selesai.");\n      return;\n    }\n\n    setIsUpdating(true);\n    setShowConfirmModal(false);\n    setError("");\n\n    try {\n      const cleanUsername = formData.username.toLowerCase().replace(/[^a-z0-9-]/g, "");\n      if (!cleanUsername) throw new Error("URL undangan wajib diisi.");\n      if (slugStatus === "taken") throw new Error(\`URL undangan "nikahlink.com/\${cleanUsername}" sudah digunakan.\`);\n\n      const selectedTheme = selectedThemeEditor;\n      if (!selectedTheme || selectedTheme.theme.slug !== formData.theme_slug) {\n        throw new Error("Tema yang dipilih belum siap atau published version-nya tidak valid.");\n      }\n\n      await updateInvitationAction({\n        invitationId,\n        giftAccountId,\n        data: {\n          username: cleanUsername,\n          bride_name: formData.bride_name,\n          groom_name: formData.groom_name,\n          bride_photo_url: formData.bride_photo_url || null,\n          groom_photo_url: formData.groom_photo_url || null,\n          love_story: formData.love_story || null,\n          akad_date: formData.akad_date || null,\n          akad_time: formData.akad_time || null,\n          akad_venue: formData.akad_venue || null,\n          akad_address: formData.akad_address || null,\n          akad_maps_url: formData.akad_maps_url || null,\n          reception_date: formData.reception_date || null,\n          reception_time: formData.reception_time || null,\n          reception_venue: formData.reception_venue || null,\n          reception_address: formData.reception_address || null,\n          reception_maps_url: formData.reception_maps_url || null,\n          theme_id: selectedTheme.theme.id,\n          theme_version_id: selectedTheme.version.id,\n          music_url: formData.music_url || null,\n          cover_image_url: formData.cover_image_url || null,\n          custom_message: formData.custom_message || null,\n          is_published: formData.is_published,\n          show_rsvp: formData.show_rsvp,\n          show_gift: formData.show_gift,\n          show_gallery: formData.show_gallery,\n          show_wishes: formData.show_wishes,\n          custom_data: formData.custom_data ?? {},\n          bank_name: formData.bank_name || null,\n          account_number: formData.account_number || null,\n          account_name: formData.account_name || null,\n        },\n      });\n\n      router.push("/dashboard/undangan?success=updated");\n    } catch (err) {\n      console.error("Update invitation error:", err);\n      setError(err instanceof Error ? err.message : "Gagal memperbarui undangan. Silakan coba lagi.");\n    } finally {\n      setIsUpdating(false);\n    }\n  };\n\n`,
    "edit invitation submit",
  );

  return source;
}

for (const file of Object.values(targets)) {
  if (!fs.existsSync(file)) fail(`Missing target: ${path.relative(root, file)}`);
  backup(file);
}

const newOriginal = fs.readFileSync(targets.new, "utf8");
const editOriginal = fs.readFileSync(targets.edit, "utf8");

const newTransformed = transformNew(newOriginal);
const editTransformed = transformEdit(editOriginal);

assertClean(newTransformed, "new invitation editor");
assertClean(editTransformed, "edit invitation editor");

if (!newTransformed.includes("createInvitationAction") || !newTransformed.includes("uploadInvitationAssetAction")) {
  fail("new invitation editor: expected Server Action imports are missing.");
}
if (!editTransformed.includes("updateInvitationAction") || !editTransformed.includes("uploadInvitationAssetAction")) {
  fail("edit invitation editor: expected Server Action imports are missing.");
}

fs.writeFileSync(targets.new, newTransformed, "utf8");
fs.writeFileSync(targets.edit, editTransformed, "utf8");

console.log("Invitation editor Server Action refactor completed safely.");
console.log("Backups:");
console.log(`  ${path.relative(root, `${targets.new}.server-actions.bak`)}`);
console.log(`  ${path.relative(root, `${targets.edit}.server-actions.bak`)}`);
console.log("\nNext:");
console.log("  npx tsc --noEmit");
console.log("  npm run build");
console.log("  npm run lint");
