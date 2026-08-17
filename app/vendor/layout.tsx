import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("config")
    .eq("id", 1)
    .single();

  if (settings?.config && settings.config.showVendor === false) {
    notFound();
  }

  return <>{children}</>;
}
