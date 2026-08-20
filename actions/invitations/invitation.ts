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
const nullableText = (max: number) =>
  z.union([z.string().max(max), z.literal(""), z.null()])
    .optional()
    .transform((value) => value === "" ? null : value);
const nullableUrl = z.union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((value) => value === "" ? null : value);

const mutationSchema = z.object({
  username: usernameSchema,
  bride_name: z.string().trim().min(1).max(160),
  groom_name: z.string().trim().min(1).max(160),
  bride_photo_url: nullableUrl,
  groom_photo_url: nullableUrl,
  love_story: nullableText(5000),
  akad_date: nullableText(32),
  akad_time: nullableText(64),
  akad_venue: nullableText(255),
  akad_address: nullableText(500),
  akad_maps_url: nullableUrl,
  reception_date: nullableText(32),
  reception_time: nullableText(64),
  reception_venue: nullableText(255),
  reception_address: nullableText(500),
  reception_maps_url: nullableUrl,
  theme_id: uuidSchema,
  theme_version_id: uuidSchema,
  music_url: nullableUrl,
  cover_image_url: nullableUrl,
  custom_message: nullableText(5000),
  is_published: z.boolean(),
  show_rsvp: z.boolean(),
  show_gift: z.boolean(),
  show_gallery: z.boolean(),
  show_wishes: z.boolean(),
  custom_data: z.record(z.string(), z.unknown()).default({}),
  bank_name: nullableText(100),
  account_number: nullableText(100),
  account_name: nullableText(160),
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
  revalidatePath(`/dashboard/undangan/${parsedId}`);
  return { ok: true };
}

export async function uploadInvitationAssetAction(formData: FormData) {
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) throw new Error("File tidak ditemukan.");
  if (kind !== "image" && kind !== "audio") throw new Error("Jenis file tidak valid.");

  return uploadInvitationAsset(file, kind);
}
