import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug")?.trim().toLowerCase();
    const invitationId = searchParams.get("invitationId")?.trim();

    if (!slug || !invitationId) {
      return NextResponse.json({ error: "slug and invitationId are required" }, { status: 400 });
    }

    // Verify the current session can access the invitation before using the
    // server-only service role to read the published theme snapshot.
    const supabase = await createServerClient();
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select("id")
      .eq("id", invitationId)
      .maybeSingle();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const { data: theme, error: themeError } = await supabaseAdmin
      .from("themes")
      .select("id, name, slug, component_key, colors, is_premium, is_active, thumbnail_url")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (themeError || !theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const selectFields = "id, theme_id, version, component_key, config, fields_schema, colors, assets, fields_schema_authoritative, is_published, lifecycle_status";

    const { data: versions, error: versionsError } = await supabaseAdmin
      .from("theme_versions")
      .select(selectFields)
      .eq("theme_id", theme.id)
      .eq("is_published", true)
      .order("version", { ascending: false })
      .limit(10);

    if (versionsError) {
      console.error("[editor-theme] failed to load versions", versionsError);
      return NextResponse.json({ error: "Failed to load theme versions" }, { status: 500 });
    }

    const version = versions?.find(
      (candidate) => candidate.component_key === theme.component_key
    );

    if (!version) {
      return NextResponse.json({ error: "No valid published theme version" }, { status: 404 });
    }

    return NextResponse.json({ theme, version });
  } catch (error) {
    console.error("[editor-theme] unexpected error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
