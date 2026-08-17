"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { submitLead } from "@/app/actions/leads";

export default function LeadMagnetSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitLead(formData);

    if (result.error) {
      setStatus("error");
      setErrorMessage(result.error);
    } else {
      setStatus("success");
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center py-16 lg:py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-mono font-bold tracking-widest uppercase">
              Gratis Resource
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Belum Siap Membuat Undangan?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
              Persiapkan pernikahan impian Anda dengan matang. Download <strong className="text-slate-900 dark:text-white font-medium">Buku Panduan & Checklist Persiapan 6 Bulan</strong> plus Kalkulator Budget (Excel) secara gratis.
            </p>
            
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto lg:mx-0 text-left">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-slate-900 dark:text-white shrink-0 mt-0.5" />
                <span>Timeline detail apa yang harus diurus tiap bulannya.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-slate-900 dark:text-white shrink-0 mt-0.5" />
                <span>Template Excel interaktif untuk melacak budget.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-slate-900 dark:text-white shrink-0 mt-0.5" />
                <span>Tips negosiasi dengan vendor agar lebih hemat.</span>
              </li>
            </ul>
          </div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-950 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            {status === "success" ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Terima Kasih!</h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Data Anda telah berhasil disimpan. Silakan unduh Buku Panduan melalui tombol di bawah ini.
                  </p>

                  <a 
                    href="/Buku_Panduan_NikahLink.pdf" 
                    download
                    className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 font-bold uppercase tracking-wider text-xs transition-colors hover:bg-slate-800 dark:hover:bg-slate-100 mb-6 w-full"
                  >
                    Mulai Unduh
                    <Download size={16} />
                  </a>

                  <button 
                    onClick={() => setStatus("idle")}
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-slate-900 dark:hover:border-white pb-1"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        disabled={status === "loading"}
                        placeholder="contoh@gmail.com"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Nomor WhatsApp
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        required
                        disabled={status === "loading"}
                        placeholder="08123456789"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-xs font-medium">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full group flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 font-bold uppercase tracking-wider text-xs transition-colors hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-70 mt-2"
                >
                  {status === "loading" ? "Memproses..." : (
                    <>
                      Download Sekarang
                      <Download size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider font-mono mt-4">
                  100% Gratis. Tidak ada spam.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
