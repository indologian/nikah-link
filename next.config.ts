import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hanya origin yang benar-benar dipakai tim selama dev (tunneling, preview).
  // localhost & 127.0.0.1 sudah diizinkan secara default oleh Next.js,
  // jadi tidak perlu didaftarkan di sini.
  allowedDevOrigins: ["*.loca.lt"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Izinkan gambar dari Storage project Supabase mana pun (multi-tenant).
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "fonts.gstatic.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;