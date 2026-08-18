"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Heart, Check, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const BENEFITS = [
  "Gratis selamanya untuk 1 undangan",
  "Akses 30+ tema desain eksklusif",
  "Manajemen RSVP & ucapan tamu terpusat",
  "Tanpa batasan jumlah tamu undangan",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-16 relative z-10">
        
        {/* Left: Editorial Benefits (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-center py-8 pr-8 border-r border-slate-200 dark:border-slate-800">
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group w-fit">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-rosegold)] flex items-center justify-center transition-colors hover:bg-[var(--accent-rosegold-hover)]">
              <Heart className="w-5 h-5 text-white fill-white" strokeWidth={0} />
            </div>
            <span className="font-playfair text-3xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">NikahLink</span>
          </Link>

          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-[var(--text-primary)] dark:text-white mb-6 leading-[1.1]">
            Cerita Cinta Anda,<br />
            <span className="italic text-[var(--accent-rosegold)]">Dimulai di Sini.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12 leading-relaxed text-lg max-w-md">
            Bergabunglah dengan ribuan pasangan yang telah menciptakan undangan digital elegan dan tak terlupakan.
          </p>

          <ul className="space-y-5 mb-12">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[var(--accent-rosegold)]" strokeWidth={3} />
                </div>
                {b}
              </li>
            ))}
          </ul>

          {/* Minimalist Blockquote */}
          <div className="border-l-2 border-[var(--accent-rosegold)] pl-5 py-1">
            <p className="text-slate-600 dark:text-slate-400 text-sm italic mb-3 leading-relaxed">
              "Proses pembuatannya sangat intuitif dan desainnya memukau. Tamu kami terus memberikan pujian!"
            </p>
            <p className="text-[var(--text-primary)] dark:text-white text-xs font-semibold uppercase tracking-widest">— Ayu & Rizal</p>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="flex items-center justify-center w-full">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
               <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-rosegold)] flex items-center justify-center transition-colors">
                  <Heart className="w-5 h-5 text-white fill-white" strokeWidth={0} />
                </div>
                <span className="font-playfair text-2xl font-bold text-[var(--text-primary)] dark:text-white tracking-tight">NikahLink</span>
              </Link>
            </div>

            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-[var(--text-primary)] dark:text-white mb-3">Cek Email Anda</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
                  Tautan verifikasi telah dikirim ke <strong className="text-slate-900 dark:text-white">{email}</strong>.
                  Klik tautan tersebut untuk mengaktifkan akun.
                </p>
                <Link href="/masuk" className="inline-block bg-[var(--accent-rosegold)] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors hover:bg-[var(--accent-rosegold-hover)]">
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-playfair text-3xl font-bold text-[var(--text-primary)] dark:text-white mb-2">Daftar Akun</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Buat undangan impian dalam 5 menit</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Romeo & Juliet"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-rosegold)]/50 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@kamu.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-rosegold)]/50 focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        required
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent-rosegold)]/50 focus:border-transparent transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full py-3.5 mt-4 rounded-xl bg-[var(--accent-rosegold)] text-white font-semibold text-sm transition-colors hover:bg-[var(--accent-rosegold-hover)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                      </>
                    ) : (
                      "Buat Akun Gratis"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">atau</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  <span>Daftar dengan Google</span>
                </button>

                <p className="text-center text-[#4A3D3D] dark:text-[#B39E9E] text-sm mt-6 font-medium">
                  Sudah punya akun?{" "}
                  <Link href="/masuk" className="text-slate-900 dark:text-slate-50 hover:underline font-semibold">
                    Masuk di sini
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
