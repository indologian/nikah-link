import ThemesClient from "./ThemesClient";
import { getThemeCatalog } from "@/services/themes/theme.query";

export const dynamic = "force-dynamic";

export default async function AdminThemesPage() {
  const themes = await getThemeCatalog({ includeInactive: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Manajemen Tema</h1>
        <p className="text-slate-400 mt-1">Kelola metadata, draft, preview, publish, dan status katalog tema.</p>
      </div>
      <ThemesClient initialThemes={themes || []} />
    </div>
  );
}
