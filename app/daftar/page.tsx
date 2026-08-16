"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Heart, Check, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const BENEFITS = [
  "Gratis untuk 1 undangan",
  "30+ tema cantik",
  "RSVP & manajemen tamu",
  "Aktif selamanya (paket berbayar)",
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#120E10] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#C58F78]/5 blur-3xl" />
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#EBE4DD]/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10"
      >
        {/* Left: Benefits */}
        <div className="hidden lg:flex flex-col justify-center p-8">
          <Link href="/" className="flex items-center gap-2 mb-10 group w-fit">
            <div className="w-10 h-10 rounded-full bg-[#C58F78] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" strokeWidth={0} />
            </div>
            <span className="font-playfair text-3xl font-bold text-[#2D2424] dark:text-[#FDFBF7] tracking-tight">NikahLink</span>
          </Link>

          <h2 className="font-playfair text-4xl font-bold text-[#2D2424] dark:text-[#FDFBF7] mb-4 leading-tight">
            Buat Undangan<br />
            <span className="italic text-[#C58F78]">Impian Kalian</span>
          </h2>
          <p className="text-[#756767] dark:text-[#B39E9E] mb-10 leading-relaxed text-lg">
            Bergabung dengan 125.000+ pasangan yang telah membuat undangan digital yang memukau dan berkesan.
          </p>

          <ul className="space-y-4 mb-10">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#C58F78]" strokeWidth={3} />
                </div>
                <span className="text-[#4A3D3D] dark:text-[#D1C4C4] font-medium">{b}</span>
              </li>
            ))}
          </ul>

          {/* Testimonial mini */}
          <div className="bg-white dark:bg-[#1A1517] rounded-2xl p-5 border border-[#EBE4DD] dark:border-[#33272B] shadow-sm relative">
            <div className="absolute -top-3 -left-2 text-4xl text-[#EBE4DD] dark:text-slate-800 font-serif">"</div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[#C58F78] text-sm">★</span>
              ))}
            </div>
            <p className="text-[#4A3D3D] dark:text-[#D1C4C4] text-sm italic mb-3 leading-relaxed relative z-10">
              Undangan kami dapat ribuan compliment! Prosesnya mudah banget dan desainnya super elegan.
            </p>
            <p className="text-[#756767] dark:text-[#B39E9E] text-xs font-semibold">— Ayu & Rizal, Jakarta</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="flex items-center justify-center">
          <div className="card-wevitation w-full max-w-md p-8 sm:p-10">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
               <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-[#C58F78] flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-white fill-white" strokeWidth={0} />
                </div>
                <span className="font-playfair text-2xl font-bold text-[#2D2424] dark:text-[#FDFBF7] tracking-tight">NikahLink</span>
              </Link>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#F7EDE8] dark:bg-[#251E21] border border-[#F0DDD5] dark:border-[#423338] flex items-center justify-center mx-auto mb-5">
                  <Check className="w-8 h-8 text-[#C58F78]" />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-[#2D2424] dark:text-[#FDFBF7] mb-3">Cek Email Kamu!</h3>
                <p className="text-[#756767] dark:text-[#B39E9E] text-sm leading-relaxed">
                  Kami telah mengirim link verifikasi ke <strong className="text-[#2D2424] dark:text-[#FDFBF7]">{email}</strong>.
                  <br/>Klik link tersebut untuk mengaktifkan akun.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2D2424] dark:text-[#FDFBF7]">Daftar Gratis</h1>
                  <p className="text-[#756767] dark:text-[#B39E9E] text-sm mt-2">Buat undangan cantik dalam 5 menit!</p>
                </div>

                {/* Google */}
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
                  Daftar dengan Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#EBE4DD] dark:bg-[#251E21]" />
                  <span className="text-[#B4A8A8] dark:text-slate-500 text-xs font-medium uppercase tracking-wider">atau dengan email</span>
                  <div className="flex-1 h-px bg-[#EBE4DD] dark:bg-[#251E21]" />
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#4A3D3D] dark:text-[#D1C4C4] mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama kamu"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1A1517] border border-[#EBE4DD] dark:border-[#33272B] text-[#2D2424] dark:text-[#FDFBF7] placeholder:text-[#B4A8A8] focus:outline-none focus:border-[#C58F78] focus:ring-1 focus:ring-[#C58F78] transition-all text-sm"
                    />
                  </div>

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
                        placeholder="Min. 8 karakter"
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

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-wevitation py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Daftar Gratis
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-center text-[#756767] dark:text-[#B39E9E] text-xs mt-6 leading-relaxed">
                  Dengan mendaftar, kamu setuju dengan{" "}
                  <Link href="/syarat" className="text-[#C58F78] dark:text-[#E8BAA6] hover:underline font-medium">Syarat & Ketentuan</Link>{" "}
                  serta{" "}
                  <Link href="/privasi" className="text-[#C58F78] dark:text-[#E8BAA6] hover:underline font-medium">Kebijakan Privasi</Link>
                  {" "}NikahLink.
                </p>

                <p className="text-center text-[#4A3D3D] dark:text-[#B39E9E] text-sm mt-6 font-medium">
                  Sudah punya akun?{" "}
                  <Link href="/masuk" className="text-[#C58F78] dark:text-[#E8BAA6] hover:text-[#A3735F] dark:hover:text-white hover:underline">
                    Masuk di sini
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
