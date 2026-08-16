import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/masuk");

  // Fetch user's invitations
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, themes(name, thumbnail_url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Get basic stats for each invitation
  const stats = {
    totalInvitations: invitations?.length ?? 0,
    publishedInvitations: invitations?.filter((i: { is_published: boolean }) => i.is_published).length ?? 0,
  };

  return (
    <DashboardClient
      user={user}
      invitations={invitations ?? []}
      stats={stats}
    />
  );
}
