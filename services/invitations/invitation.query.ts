import { createClient } from "@/lib/supabase/server";

export async function getActiveInvitationThemes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("themes")
    .select("id,name,slug,component_key,category,thumbnail_url,colors,is_premium,is_active,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getInvitationUsernameAvailability(username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return !data;
}

export async function getNewInvitationContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile, error: profileError }, { count, error: countError }, themes] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("plan,has_used_free_trial,plan_expires_at")
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("invitations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      getActiveInvitationThemes(),
    ]);

  if (profileError) throw profileError;
  if (countError) throw countError;

  return {
    userId: user.id,
    plan: profile?.plan ?? "free",
    hasUsedFreeTrial: profile?.has_used_free_trial ?? false,
    planExpiresAt: profile?.plan_expires_at ?? null,
    invitationCount: count ?? 0,
    themes,
  };
}

export async function getInvitationEditorData(invitationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: invitation, error: invitationError }, { data: gifts, error: giftError }, { data: profile, error: profileError }, themes] =
    await Promise.all([
      supabase
        .from("invitations")
        .select("*, themes(slug)")
        .eq("id", invitationId)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("gift_accounts")
        .select("*")
        .eq("invitation_id", invitationId),
      supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single(),
      getActiveInvitationThemes(),
    ]);

  if (invitationError) throw invitationError;
  if (giftError) throw giftError;
  if (profileError) throw profileError;

  return {
    invitation,
    gifts: gifts ?? [],
    plan: profile?.plan ?? "free",
    themes,
  };
}
