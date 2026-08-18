import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Plus_Jakarta_Sans, Playfair_Display, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nikahlink.com"),
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
      <body className={`${jakarta.variable} ${playfair.variable} ${cormorant.variable} ${greatVibes.variable} font-jakarta antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "NikahLink",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR"
              }
            }),
          }}
        />
      </body>
    </html>
  );
}
