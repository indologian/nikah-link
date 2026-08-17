import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: "%s | NikahLink",
    default: "NikahLink — Undangan Pernikahan Digital Premium",
  },
  description:
    "Buat undangan pernikahan digital yang elegan dan modern. Lengkap dengan RSVP online, galeri foto, kado cashless, analitik tamu, dan marketplace vendor. Aktif selamanya, sekali bayar.",
  keywords: [
    "undangan pernikahan digital",
    "undangan nikah online",
    "undangan pernikahan modern",
    "website nikah",
    "undangan digital gratis",
    "RSVP online",
    "NikahLink",
  ],
  authors: [{ name: "NikahLink" }],
  creator: "NikahLink",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nikahlink.com",
    siteName: "NikahLink",
    title: "NikahLink — Undangan Pernikahan Digital Premium",
    description:
      "Buat undangan pernikahan digital yang elegan, lengkap dengan RSVP, galeri foto, kado cashless, dan marketplace vendor pernikahan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NikahLink — Undangan Pernikahan Digital Premium",
    description:
      "Platform undangan pernikahan digital terlengkap di Indonesia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-jakarta antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
