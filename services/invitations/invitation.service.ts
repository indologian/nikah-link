import { createClient } from "@/lib/supabase/server";

export type InvitationMutationInput = {
  username: string;
  bride_name: string;
  groom_name: string;
  bride_photo_url?: string | null;
  groom_photo_url?: string | null;
  love_story?: string | null;
  akad_date?: string | null;
  akad_time?: string | null;
  akad_venue?: string | null;
  akad_address?: string | null;
  akad_maps_url?: string | null;
  reception_date?: string | null;
  reception_time?: string | null;
  reception_venue?: string | null;
  reception_address?: string | null;
  reception_maps_url?: string | null;
  theme_id: string;
  theme_version_id: string;
  music_url?: string | null;
  cover_image_url?: string | null;
  custom_message?: string | null;
  is_published: boolean;
  show_rsvp: boolean;
  show_gift: boolean;
  show_gallery: boolean;
  show_wishes: boolean;
  custom_data: Record<string, unknown>;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required");
  return { supabase, user };
}

function cleanUsername(username: string) {
  return username.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export async function createInvitation(input: InvitationMutationInput) {
  const { supabase, user } = await requireUser();
  const username = cleanUsername(input.username);

  if (!username) throw new Error("Invitation username is required");

  const { data, error } = await supabase.rpc("create_invitation", {
    p_user_id: user.id,
    p_username: username,
    p_bride_name: input.bride_name,
    p_groom_name: input.groom_name,
    p_bride_photo_url: input.bride_photo_url ?? null,
    p_groom_photo_url: input.groom_photo_url ?? null,
    p_love_story: input.love_story ?? null,
    p_akad_date: input.akad_date ?? null,
    p_akad_time: input.akad_time ?? null,
    p_akad_venue: input.akad_venue ?? null,
    p_akad_address: input.akad_address ?? null,
    p_akad_maps_url: input.akad_maps_url ?? null,
    p_reception_date: input.reception_date ?? null,
    p_reception_time: input.reception_time ?? null,
    p_reception_venue: input.reception_venue ?? null,
    p_reception_address: input.reception_address ?? null,
    p_reception_maps_url: input.reception_maps_url ?? null,
    p_theme_id: input.theme_id,
    p_theme_version_id: input.theme_version_id,
    p_music_url: input.music_url ?? null,
    p_cover_image_url: input.cover_image_url ?? null,
    p_custom_message: input.custom_message ?? null,
    p_is_published: input.is_published,
    p_show_rsvp: input.show_rsvp,
    p_show_gift: input.show_gift,
    p_show_gallery: input.show_gallery,
    p_show_wishes: input.show_wishes,
    p_custom_data: input.custom_data ?? {},
    p_bank_name: input.bank_name ?? null,
    p_account_number: input.account_number ?? null,
    p_account_name: input.account_name ?? null,
  });

  if (error) throw error;
  return data;
}

export async function updateInvitation(invitationId: string, input: InvitationMutationInput, giftAccountId: string | null) {
  const { supabase } = await requireUser();
  const username = cleanUsername(input.username);

  if (!username) throw new Error("Invitation username is required");

  const { error } = await supabase.rpc("update_invitation", {
    p_invitation_id: invitationId,
    p_username: username,
    p_bride_name: input.bride_name,
    p_groom_name: input.groom_name,
    p_bride_photo_url: input.bride_photo_url ?? null,
    p_groom_photo_url: input.groom_photo_url ?? null,
    p_love_story: input.love_story ?? null,
    p_akad_date: input.akad_date ?? null,
    p_akad_time: input.akad_time ?? null,
    p_akad_venue: input.akad_venue ?? null,
    p_akad_address: input.akad_address ?? null,
    p_akad_maps_url: input.akad_maps_url ?? null,
    p_reception_date: input.reception_date ?? null,
    p_reception_time: input.reception_time ?? null,
    p_reception_venue: input.reception_venue ?? null,
    p_reception_address: input.reception_address ?? null,
    p_reception_maps_url: input.reception_maps_url ?? null,
    p_theme_id: input.theme_id,
    p_theme_version_id: input.theme_version_id,
    p_music_url: input.music_url ?? null,
    p_cover_image_url: input.cover_image_url ?? null,
    p_custom_message: input.custom_message ?? null,
    p_is_published: input.is_published,
    p_show_rsvp: input.show_rsvp,
    p_show_gift: input.show_gift,
    p_show_gallery: input.show_gallery,
    p_show_wishes: input.show_wishes,
    p_custom_data: input.custom_data ?? {},
    p_gift_account_id: giftAccountId,
    p_bank_name: input.bank_name ?? null,
    p_account_number: input.account_number ?? null,
    p_account_name: input.account_name ?? null,
  });

  if (error) throw error;
}

export async function uploadInvitationAsset(file: File, kind: "image" | "audio") {
  const { supabase, user } = await requireUser();

  const maxSize = kind === "audio" ? 5 * 1024 * 1024 : 1 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(kind === "audio" ? "Ukuran file musik maksimal 5 MB." : "Ukuran file gambar maksimal 1 MB.");
  }

  const allowedTypes = kind === "audio"
    ? ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3", "audio/x-m4a"]
    : ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/tiff", "image/x-icon", "image/avif"];

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const extensionAllowed = kind === "audio"
    ? /^(mp3|wav|ogg|m4a)$/i.test(extension)
    : /^(jpe?g|png|gif|webp|svg|bmp|tiff?|ico|avif)$/i.test(extension);

  if (!allowedTypes.includes(file.type) && !extensionAllowed) {
    throw new Error(kind === "audio" ? "Format musik tidak didukung." : "Format gambar tidak didukung.");
  }

  const path = `users/${user.id}/uploads/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("invitations").upload(path, file, {
    contentType: file.type || (kind === "audio" ? "audio/mpeg" : "image/jpeg"),
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("invitations").getPublicUrl(path);
  return data.publicUrl;
}
