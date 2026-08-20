"use server";

import { revalidatePath } from "next/cache";
import { createLead } from "@/services/leads/lead.service";

export async function submitLead(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();

  if (!email || !whatsapp) {
    return { error: "Email dan WhatsApp wajib diisi." };
  }

  try {
    await createLead({ email, whatsapp });
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}
