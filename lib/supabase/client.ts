import { createBrowserClient } from "@supabase/ssr";
import { createInvitationEditorBackend } from "@/lib/invitations/editor-client";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

const INVITATION_EDITOR_PATH = /^\/dashboard\/undangan\/(?:baru|[^/]+\/edit)(?:\/|$)/;

export function createClient(): any {
  if (typeof window !== "undefined" && INVITATION_EDITOR_PATH.test(window.location.pathname)) {
    return createInvitationEditorBackend();
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
}
