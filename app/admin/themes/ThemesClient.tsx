"use client";

import { useState } from "react";
import type { Theme } from "@/types";
import ThemeEditor from "@/components/themes/admin/ThemeEditor";
import { Edit2, Eye, ExternalLink } from "lucide-react";

export default function ThemesClient({ initialThemes }: { initialThemes: Theme[] }) {
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const selectedTheme = themes.find((theme) => theme.id === selectedThemeId) ?? null;

  const handleThemeChanged = (updated: Theme) => {
    setThemes((current) => current.map((theme) => theme.id === updated.id ? updated : theme));
  };

  return (
    <div className="space-y-8">
      {selectedTheme && (
        <ThemeEditor
          theme={selectedTheme}
          onClose={() => setSelectedThemeId(null)}
          onThemeChanged={handleThemeChanged}
        />
      )}

      {!selectedTheme && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white">Theme Catalog</h2>
              <p className="mt-1 text-xs text-slate-500">Renderer berasal dari source code; dashboard menangani metadata dan lifecycle version.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-800">
            <div className="grid grid-cols-[minmax(0,1.5fr)_140px_120px_160px] gap-4 border-b border-slate-800 bg-slate-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span>Tema</span>
              <span>Kategori</span>
              <span>Status</span>
              <span className="text-right">Aksi</span>
            </div>
            {themes.map((theme) => (
              <div key={theme.id} className="grid grid-cols-[minmax(0,1.5fr)_140px_120px_160px] items-center gap-4 border-b border-slate-800 px-4 py-4 last:border-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white">{theme.name}</div>
                  <div className="mt-1 truncate font-mono text-[11px] text-slate-500">{theme.slug} · {theme.component_key}</div>
                </div>
                <span className="text-xs text-slate-400">{theme.category}</span>
                <span className={theme.is_active ? "text-xs font-semibold text-emerald-400" : "text-xs font-semibold text-slate-500"}>{theme.is_active ? "active" : "archived"}</span>
                <div className="flex justify-end gap-2">
                  <a href={`/demo/${encodeURIComponent(theme.slug)}`} target="_blank" rel="noreferrer" title="Demo" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"><Eye className="h-4 w-4" /></a>
                  {theme.preview_url && <a href={theme.preview_url} target="_blank" rel="noreferrer" title="External preview" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"><ExternalLink className="h-4 w-4" /></a>}
                  <button onClick={() => setSelectedThemeId(theme.id)} title="Edit" className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-700 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800"><Edit2 className="h-4 w-4" /> Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
