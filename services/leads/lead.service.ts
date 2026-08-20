import { createClient } from "@/lib/supabase/server";
import type { CreateLeadInput } from "@/types/lead";

export async function createLead(input: CreateLeadInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("leads").insert([
    {
      email: input.email,
      whatsapp: input.whatsapp,
      source: input.source ?? "homepage_lead_magnet",
    },
  ]);

  if (error) {
    console.error("Lead capture error:", error);
    throw new Error("Terjadi kesalahan. Silakan coba lagi.");
  }
}
