"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Theme } from "@/types";
import { Eye, ExternalLink, Pencil, Plus, RotateCcw, Archive } from "lucide-react";
import { useState } from "react";

function formatRendererLabel(key: string) {
  return key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ThemesClient({ initialThemes }: { initialThemes: Theme[] }) {
  const supabase = createClient();
  const [themes, setThemes] = useState<Theme[]>(initialThemes);
  const [busyId, setBusyId] = useState<string | null>(null);

  const updateActiveState = async (id: string, isActive: boolean) => {
    if (!confirm(isActive ? "Aktifkan kembali tema ini?" : "Arsipkan tema ini? Tema lama tetap aman untuk invitation yang sudah menggunakannya.")) return;
    setBusyId(id);
    try {
      const { data, error } = await supabase
        .from("themes")
        .update({ is_active: isActive })
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      setThemes((current) => current.map((theme) => (theme.id === id ? (data as Theme) : theme)));
    } catch (error) {
      alert(`Gagal memperbarui status tema: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">Katalog Tema</h2>
          <p className="text-xs text-slate-500 mt-1">Kelola variant tema, renderer, version, preview, dan status publikasi.</p>
        </div>
        <Link href="/admin/themes/editor/new" className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
          <Plus className="w-4 h-4" /> Tambah Tema
        </Link>
      </div>

      <div className="grid gap-4">
        {themes.map((theme) => (
          <article key={theme.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="w-full lg:w-40 aspect-[4/3] rounded-lg bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                {theme.thumbnail_url ? <img src={theme.thumbnail_url} alt={theme.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">No thumbnail</div>}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{theme.name}</h3>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${theme.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{theme.is_active ? "Aktif" : "Arsip"}</span>
                  {theme.is_premium && <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">Premium</span>}
                </div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-500">
                  <div><span className="font-mono">slug:</span> {theme.slug}</div>
                  <div><span className="font-mono">renderer:</span> {formatRendererLabel(theme.component_key)}</div>
                  <div><span className="font-mono">kategori:</span> {theme.category}</div>
                  <div><span className="font-mono">id:</span> {theme.id}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Link href={`/admin/themes/editor/${theme.id}`} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"><Pencil className="w-3.5 h-3.5" /> Edit</Link>
                <Link href={`/admin/themes/preview/${theme.slug}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"><Eye className="w-3.5 h-3.5" /> Preview</Link>
                <Link href={`/demo/${theme.slug}`} target="_blank" className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900"><ExternalLink className="w-3.5 h-3.5" /> Demo</Link>
                <button type="button" disabled={busyId === theme.id} onClick={() => updateActiveState(theme.id, !theme.is_active)} className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50">
                  {theme.is_active ? <Archive className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  {theme.is_active ? "Arsipkan" : "Pulihkan"}
                </button>
              </div>
            </div>
          </article>
        ))}
        {themes.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center text-sm text-slate-500">Belum ada tema.</div>}
      </div>
    </div>
  );
}
