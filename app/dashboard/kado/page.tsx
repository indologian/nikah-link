import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GiftClient from "./GiftClient";

export default async function GiftManagerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/masuk");

  // Fetch user profile to get plan limit
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan = profile?.plan || "free";

  // Fetch user's invitations
  const { data: invitations } = await supabase
    .from("invitations")
    .select("id, bride_name, groom_name, username")
    .eq("user_id", user.id);

  // Fetch gift accounts for the current user's invitations
  const { data: giftAccounts } = await supabase
    .from("gift_accounts")
    .select("*, invitations!inner(bride_name, groom_name, username, user_id)")
    .eq("invitations.user_id", user.id);

  return (
    <GiftClient 
      initialAccounts={giftAccounts || []} 
      invitations={invitations || []}
      plan={plan as any}
    />
  );
}
