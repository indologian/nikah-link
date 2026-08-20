import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ThemeEditorClient from "./ThemeEditorClient";
import type { Theme } from "@/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ThemeEditorPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  let theme: Theme | null = null;

  if (id !== "new") {
    const { data } = await supabase
      .from("themes")
      .select("*")
      .eq("id", id)
      .single();
    theme = (data as Theme | null) ?? null;
  }

  return <ThemeEditorClient theme={theme} />;
}
