"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitLead(formData: FormData) {
  const email = formData.get("email") as string;
  const whatsapp = formData.get("whatsapp") as string;

  if (!email || !whatsapp) {
    return { error: "Email dan WhatsApp wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("leads")
    .insert([{ email, whatsapp, source: "homepage_lead_magnet" }]);

  if (error) {
    console.error("Lead capture error:", error);
    return { error: "Terjadi kesalahan. Silakan coba lagi." };
  }

  revalidatePath("/");
  return { success: true };
}
