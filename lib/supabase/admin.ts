import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase admin client factory.
 *
 * Environment variables are validated lazily so Next.js build-time module
 * evaluation does not fail when runtime-only secrets are not exposed to the
 * build worker. Runtime callers still receive a clear error when the secret
 * is actually required.
 *
 * IMPORTANT:
 * Jangan pernah import file ini dari Client Component.
 * Service role key memiliki hak bypass RLS.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
