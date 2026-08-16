import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.7",
    "192.168.1.7:3000",
    "192.168.1.7:3001",
    "localhost:3000",
    "*.loca.lt"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vyjqubgkkpapsovnrnab.supabase.co",
        port: "",
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
