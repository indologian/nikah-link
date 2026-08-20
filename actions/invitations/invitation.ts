"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  createInvitation,
  updateInvitation,
  uploadInvitationAsset,
  type InvitationMutationInput,
} from "@/services/invitations/invitation.service";
import {
  getActiveInvitationThemes,
  getInvitationEditorData,
  getInvitationUsernameAvailability,
  getNewInvitationContext,
} from "@/services/invitations/invitation.query";

const uuidSchema = z.string().uuid();
const usernameSchema = z.string().trim().min(1).max(80);

const mutationSchema = z.object({
  username: usernameSchema,
  bride_name: z.string().trim().min(1).max(160),
  groom_name: z.string().trim().min(1).max(160),
  bride_photo_url: z.string().url().nullable().optional(),
  groom_photo_url: z.string().url().nullable().optional(),
  love_story: z.string().max(5000).nullable().optional(),
  akad_date: z.string().nullable().optional(),
  akad_time: z.string().nullable().optional(),
  akad_venue: z.string().max(255).nullable().optional(),
  akad_address: z.string().max(500).nullable().optional(),
  akad_maps_url: z.string().url().nullable().optional(),
  reception_date: z.string().nullable().optional(),
  reception_time: z.string().nullable().optional(),
  reception_venue: z.string().max(255).nullable().optional(),
  reception_address: z.string().max(500).nullable().optional(),
  reception_maps_url: z.string().url().nullable().optional(),
  theme_id: uuidSchema,
  theme_version_id: uuidSchema,
  music_url: z.string().url().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  custom_message: z.string().max(5000).nullable().optional(),
  is_published: z.boolean(),
  show_rsvp: z.boolean(),
  show_gift: z.boolean(),
  show_gallery: z.boolean(),
  show_wishes: z.boolean(),
  custom_data: z.record(z.string(), z.unknown()).default({}),
  bank_name: z.string().max(100).nullable().optional(),
  account_number: z.string().max(100).nullable().optional(),
  account_name: z.string().max(160).nullable().optional(),
});

export async function loadActiveInvitationThemes() {
  return getActiveInvitationThemes();
}

export async function loadNewInvitationContext() {
  return getNewInvitationContext();
}

export async function loadInvitationEditor(invitationId: string) {
  return getInvitationEditorData(uuidSchema.parse(invitationId));
}

export async function checkInvitationUsername(username: string) {
  const normalized = usernameSchema.parse(username).toLowerCase().replace(/[^a-z0-9-]/g, "");
  return getInvitationUsernameAvailability(normalized);
}

export async function createInvitationAction(input: InvitationMutationInput) {
  const parsed = mutationSchema.parse(input);
  const created = await createInvitation(parsed);
  revalidatePath("/dashboard/undangan");
  revalidatePath(`/dashboard/undangan/${created?.id ?? ""}/edit`);
  return created;
}

export async function updateInvitationAction(input: {
  invitationId: string;
  giftAccountId?: string | null;
  data: InvitationMutationInput;
}) {
  const parsedId = uuidSchema.parse(input.invitationId);
  const giftAccountId = input.giftAccountId ? uuidSchema.parse(input.giftAccountId) : null;
  const parsed = mutationSchema.parse(input.data);
  await updateInvitation(parsedId, parsed, giftAccountId);
  revalidatePath("/dashboard/undangan");
  revalidatePath(`/dashboard/undangan/${parsedId}/edit`);
  revalidatePath(`/dashboard/undangan/${parsed.username}`);
  return { ok: true };
}

export async function uploadInvitationAssetAction(formData: FormData) {
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) throw new Error("File tidak ditemukan.");
  if (kind !== "image" && kind !== "audio") throw new Error("Jenis file tidak valid.");

  return uploadInvitationAsset(file, kind);
}
