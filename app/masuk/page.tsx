"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Heart, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

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

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#120E10] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-[#C58F78]/10"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="card-wevitation p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-full bg-[#C58F78] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-white fill-white" strokeWidth={0} />
              </div>
              <span className="font-playfair text-2xl font-bold text-[#2D2424] dark:text-[#FDFBF7] tracking-tight">NikahLink</span>
            </Link>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">Selamat Datang</h1>
            <p className="text-[#756767] dark:text-[#B39E9E] text-sm mt-2">Masuk untuk mengelola undanganmu</p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-[#251E21] border border-[#EBE4DD] dark:border-[#423338] text-[#2D2424] dark:text-[#FDFBF7] font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all mb-6 shadow-sm group"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#EBE4DD] dark:bg-[#251E21]" />
            <span className="text-[#B4A8A8] dark:text-slate-500 text-xs font-medium uppercase tracking-wider">atau dengan email</span>
            <div className="flex-1 h-px bg-[#EBE4DD] dark:bg-[#251E21]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#4A3D3D] dark:text-[#D1C4C4] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@kamu.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#FDFBF7] placeholder:text-[#B4A8A8] focus:outline-none focus:border-[#C58F78] focus:ring-1 focus:ring-[#C58F78] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#4A3D3D] dark:text-[#D1C4C4] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#FDFBF7] placeholder:text-[#B4A8A8] focus:outline-none focus:border-[#C58F78] focus:ring-1 focus:ring-[#C58F78] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4A8A8] dark:text-slate-500 hover:text-[#C58F78] dark:hover:text-[#E8BAA6] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/lupa-password" className="text-xs font-medium text-[#C58F78] hover:text-[#A3735F] hover:underline transition-colors">
                Lupa password?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-wevitation py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md mt-2 transition-all group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#4A3D3D] dark:text-[#B39E9E] text-sm mt-8 font-medium">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-[#C58F78] dark:text-[#E8BAA6] hover:text-[#A3735F] dark:hover:text-white hover:underline transition-colors">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
