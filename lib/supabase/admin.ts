import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function createSupabaseAdminClient(): SupabaseClient {
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

/**
 * Server-only Supabase admin client.
 *
 * The underlying client is initialized lazily on first property access so
 * Next.js build-time module evaluation does not require runtime secrets.
 *
 * IMPORTANT:
 * Jangan pernah import file ini dari Client Component.
 * Service role key memiliki hak bypass RLS.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    if (!cachedClient) {
      cachedClient = createSupabaseAdminClient();
    }

    return Reflect.get(cachedClient as object, property, receiver);
  },
});

export function getSupabaseAdmin(): SupabaseClient {
  if (!cachedClient) {
    cachedClient = createSupabaseAdminClient();
  }

  return cachedClient;
}
