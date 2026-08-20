"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Heart, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

const THEME_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const requestedTheme = searchParams.get("tema")?.trim().toLowerCase() || "";
  const selectedTheme = THEME_SLUG_PATTERN.test(requestedTheme) ? requestedTheme : "";
  const dashboardTarget = selectedTheme
    ? `/dashboard/undangan/baru?tema=${encodeURIComponent(selectedTheme)}`
    : "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push(dashboardTarget);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", dashboardTarget);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl.toString() },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-6 right-6 z-50"><ThemeToggle /></div>
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group"><div className="w-10 h-10 rounded-full bg-[var(--accent-rosegold)] flex items-center justify-center"><Heart className="w-5 h-5 text-white fill-white" strokeWidth={0} /></div><span className="font-playfair text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">NikahLink</span></Link>
            <h1 className="font-playfair text-3xl font-bold text-[var(--text-primary)] dark:text-white mb-2">Selamat Datang</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk untuk mengelola undanganmu</p>
          </div>

          {selectedTheme && <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">Tema pilihanmu akan digunakan saat membuat undangan.</div>}
          {error && <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-sm font-medium">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2 text-left"><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" required className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-rosegold)]/50 focus:border-transparent transition-all text-sm" /></div>
            <div className="space-y-2 text-left"><div className="flex items-center justify-between"><label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label><Link href="/lupa-password" className="text-xs font-semibold text-[var(--accent-rosegold)] hover:underline">Lupa password?</Link></div><div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-rosegold)]/50 focus:border-transparent transition-all text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-2">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
            <button type="submit" disabled={loading || googleLoading} className="w-full py-3.5 mt-2 rounded-xl bg-[var(--accent-rosegold)] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70">{loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : selectedTheme ? "Lanjut ke Pembuatan Undangan" : "Masuk ke Dashboard"}</button>
          </form>

          <div className="flex items-center gap-4 my-8"><div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" /><span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">atau</span><div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" /></div>

          <button onClick={handleGoogleLogin} disabled={googleLoading || loading} className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm disabled:opacity-70">{googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : <span className="font-bold">G</span>}<span>Masuk dengan Google</span></button>

          <p className="text-center text-sm text-slate-500 mt-8">Belum punya akun? <Link href={selectedTheme ? `/daftar?tema=${encodeURIComponent(selectedTheme)}` : "/daftar"} className="font-semibold text-[var(--accent-rosegold)] hover:underline">Daftar Gratis</Link></p>
        </div>
      </div>
    </div>
  );
}
