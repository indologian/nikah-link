# 💍 NikahLink — Platform Undangan Pernikahan Digital Premium

## Latar Belakang & Analisis Kompetitor

Setelah mempelajari secara mendalam 5 platform undangan pernikahan digital di Indonesia, berikut adalah rangkuman analisis lengkap yang menjadi dasar desain platform baru **NikahLink**.

---

## 📊 Analisis Website Kompetitor

### 1. Wevitation (wevitation.com)
**Teknologi:** PHP/Laravel + Bootstrap 5, Owl Carousel
**Kekuatan:**
- ✅ Fitur paling lengkap: RSVP, galeri foto & video, musik, kado cashless, wishlist kado, layar penerima tamu
- ✅ Paket harga jelas (Free, Premium Rp69K, Business Rp99K) — sekali bayar aktif selamanya
- ✅ Konten eco-green: menampilkan dampak lingkungan (kertas dihindari, emisi CO2)
- ✅ Ada mobile app (Google Play, AppGallery)
- ✅ Statistik real-time (jumlah pasangan, tamu, ucapan)
- ✅ Personalisasi nama tamu + QR Code unik
- ✅ Banyak tema (Timeless Snapshot, Visual Journey, Wayang/budaya Nusantara, dll.)
- ✅ Fitur Layar Tamu (tamu check-in via layar besar)
- ✅ Blog pernikahan
- ✅ SEO baik

**Kekurangan:**
- ❌ UI landing page masih berbasis Bootstrap klasik, kurang premium/modern
- ❌ Tidak ada fitur manajemen vendor
- ❌ Tidak ada fitur wedding planning (to-do list, budget tracker)
- ❌ Tidak ada fitur live streaming bawaan (hanya link eksternal)
- ❌ Tema carousel perlu di-redesign agar lebih engaging

---

### 2. Link Undangan (linkundangan.com)
**Teknologi:** PHP + Bootstrap (older stack)
**Kekuatan:**
- ✅ Proses sangat cepat (< 5 menit)
- ✅ Gratis dengan fitur cukup lengkap
- ✅ Notifikasi ucapan via WhatsApp
- ✅ History data pengunjung / analytics
- ✅ Kustomisasi CSS/JS/HTML untuk premium
- ✅ Quick share SMS & WA langsung dari dashboard
- ✅ Tiket masuk acara (QR code untuk kehadiran)
- ✅ Fitur reseller (hapus/ganti brand)
- ✅ Download undangan versi gambar
- ✅ Undian berhadiah untuk pengguna (engagement)
- ✅ Buku tamu digital & reservasi kedatangan

**Kekurangan:**
- ❌ UI/UX landing page sangat sederhana dan outdated
- ❌ Tidak ada tema premium yang benar-benar eksklusif
- ❌ Masa aktif gratis hanya 1 bulan (sangat terbatas)
- ❌ Tidak ada fitur wedding planning
- ❌ Tidak ada marketplace vendor
- ❌ Tidak mendukung tema budaya nusantara secara serius

---

### 3. Our Wedding Link (our-wedding.link)
**Teknologi:** Nuxt.js (Vue SSR) + Bootstrap 4 + GSAP + ScrollMagic + Lax.js
**Kekuatan:**
- ✅ Teknologi modern (Nuxt/Vue SSR)
- ✅ Animasi halaman yang sangat menarik (GSAP, ScrollMagic, WOW.js, Lax.js)
- ✅ Typed.js untuk efek mengetik di hero section
- ✅ Masonry layout untuk galeri foto (aesthetic)
- ✅ Konsep "rencanakan, undang, laksanakan" — wedding planning terintegrasi
- ✅ Progressive Web App (PWA) support
- ✅ Push notification via OneSignal
- ✅ Buku tamu digital yang modern

**Kekurangan:**
- ❌ Harga tidak transparan (halaman pricing tidak bisa diakses langsung)
- ❌ Konten halaman utama kurang informatif
- ❌ Tidak ada marketplace vendor
- ❌ Kurang fitur kado/amplop digital
- ❌ Kurang dokumentasi fitur

---

### 4. WebNikah (webnikah.com)
**Teknologi:** PHP klasik + Bootstrap 3 (sangat lawas)
**Kekuatan:**
- ✅ 250K+ pengguna (trusted)
- ✅ Marketplace vendor terlengkap (katering, dekorasi, fotografi, rias, WO, seserahan, videografi, sewa jas, pager ayu, sound system, MC, musik, photobooth, gaun pengantin, souvenir, kue, mobil, gedung, penyanyi, florist, honeymoon, tenda)
- ✅ 100+ tema undangan
- ✅ Blog inspirasi nikah yang lengkap
- ✅ Event pernikahan
- ✅ Inspirasi nikah (galeri foto pernikahan nyata)
- ✅ Fitur reseller
- ✅ Subdomain custom (nama.webnikah.com)
- ✅ Testimoni pengguna nyata dengan link undangan mereka

**Kekurangan:**
- ❌ UI/UX sangat kuno (Bootstrap 3, xhtml, jQuery lama)
- ❌ Tidak ada fitur RSVP modern
- ❌ Tidak ada kado cashless/digital
- ❌ Tidak ada fitur personalisasi tamu otomatis
- ❌ Performance lambat
- ❌ Tidak mobile-first

---

### 5. Inveet.id (inveet.id)
**Teknologi:** PHP + Bootstrap 4 + Tiny Slider
**Kekuatan:**
- ✅ 446K+ pengguna, 12.8M+ tamu terkirim
- ✅ Amplop digital (tamu bisa kirim amplop cashless)
- ✅ Sesi tamu (atur waktu kedatangan per tamu)
- ✅ Live streaming terintegrasi
- ✅ Background musik
- ✅ Penunjuk lokasi (maps)
- ✅ Buku tamu digital
- ✅ Nama tamu personal
- ✅ Proses cepat 3 langkah
- ✅ Harga kompetitif

**Kekurangan:**
- ❌ UI/UX landing page kuno dan generic
- ❌ Tidak ada marketplace vendor
- ❌ Tidak ada wedding planning tools
- ❌ Tema terbatas dan kurang variatif
- ❌ Tidak ada fitur eco-green/sustainability

---

## 🔍 Persamaan Semua Website
1. Semua berbasis PHP/Bootstrap (kecuali Our Wedding Link yang Nuxt.js)
2. Semua menawarkan: tema/template, galeri foto, buku tamu/ucapan, RSVP/konfirmasi kehadiran
3. Semua memiliki struktur harga (gratis + berbayar)
4. Semua mendukung share via WhatsApp
5. Semua memiliki countdown timer ke hari H
6. Semua memiliki info lokasi + Google Maps

---

## 💡 Konsep Website Baru: NikahLink

**NikahLink** menggabungkan SEMUA kelebihan dari 5 platform di atas dengan desain premium, teknologi modern (Next.js + Supabase), dan fitur-fitur inovatif yang belum ada di platform manapun.

**Tagline:** *"Ceritakan Cintamu, Undang Duniamu"*

---

## 🏗️ Arsitektur & Teknologi

### Stack
| Layer | Teknologi |
|-------|-----------|
| Frontend | **Next.js 14** (App Router, tanpa folder src/) |
| Styling | **Tailwind CSS v3** |
| Database | **Supabase** (PostgreSQL) |
| Storage | **Supabase Storage** (foto, audio) |
| Auth | **Supabase Auth** (email + Google OAuth) |
| Animation | **Framer Motion** |
| Icons | **Lucide React** |
| Charts | **Recharts** (analytics dashboard) |
| Maps | **Leaflet.js** / Google Maps Embed |
| QR Code | **qrcode** npm package |
| Rich Text | **TipTap** atau **React-Quill** |
| Payments | **Midtrans** (payment gateway Indonesia) |
| Notifications | **Resend** (email) + WhatsApp API |
| Deployment | **Vercel** |

### Struktur Folder (Next.js tanpa src/)
```
nikahlink/
├── app/
│   ├── (marketing)/          # Landing page routes
│   │   ├── page.tsx          # Homepage
│   │   ├── tema/             # Katalog tema
│   │   ├── harga/            # Pricing
│   │   ├── blog/             # Blog
│   │   ├── vendor/           # Marketplace vendor
│   │   └── tentang/          # About
│   ├── (auth)/               # Auth routes
│   │   ├── masuk/            # Login
│   │   └── daftar/           # Register
│   ├── (dashboard)/          # Protected dashboard
│   │   ├── dashboard/        # Main dashboard
│   │   ├── undangan/         # Invitation management
│   │   ├── tamu/             # Guest management
│   │   ├── analitik/         # Analytics
│   │   └── pengaturan/       # Settings
│   ├── [username]/           # Public invitation page
│   │   └── page.tsx          # Invitation viewer
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── landing/              # Landing page sections
│   ├── dashboard/            # Dashboard components
│   ├── invitation/           # Invitation templates
│   └── shared/               # Shared components
├── lib/
│   ├── supabase/             # Supabase client & utils
│   ├── utils.ts              # Utility functions
│   └── constants.ts
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
├── public/                   # Static assets
│   ├── themes/               # Theme thumbnails
│   └── images/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 🎨 Desain System

### Color Palette
```
Primary:   Rose Gold   #C9956D  → #B8833A
Secondary: Deep Plum   #2D1B3B  → #4A2D6F  
Accent:    Champagne   #F5E6C8  → #EDD9A3
Success:   Sage Green  #6B9E6B
Dark BG:   #0F0A1A
Light BG:  #FDFAF7
```

### Typography
- **Display/Title:** `Playfair Display` — serif, mewah untuk heading
- **Body:** `Plus Jakarta Sans` — modern, readable
- **Mono/Accent:** `Dancing Script` — kaligrafi untuk elemen dekoratif

### Design Language
- **Glassmorphism cards** dengan backdrop-blur
- **Gradient mesh backgrounds** dengan warna rose gold & deep plum
- **Micro-animations** dengan Framer Motion (scroll-triggered, hover, tap)
- **Smooth page transitions**
- **Floating particles/confetti** di hero section
- **Premium card elevations** dengan multi-layer shadows

---

## 📱 Halaman & Fitur Utama

### A. Marketing Website (Landing Page)

#### 1. Navbar
- Sticky dengan glassmorphism effect
- Logo "NikahLink" + tagline kecil
- Menu: Beranda | Tema | Fitur | Harga | Vendor | Blog | FAQ
- CTA button: "Buat Undangan Gratis" (gradient)
- Avatar/Login jika sudah masuk

#### 2. Hero Section
- Animated text dengan Typed.js effect ("Undangan Pernikahan Digital", "Website Nikah Modern", "Kenangan Tak Terlupakan")
- Background: video/animated gradient mesh + floating petals/hearts
- Dua CTA: "Buat Gratis Sekarang" + "Lihat Demo"
- Social proof: counter animasi (pasangan, tamu, ucapan)
- Preview mockup undangan yang berputar (carousel phone mockup)

#### 3. Value Proposition (Kenapa NikahLink?)
- 6 value card dengan ikon animasi:
  1. 🎨 Desain Premium & Modern
  2. ⚡ Siap dalam 5 Menit
  3. 👤 Personalisasi Nama Tamu
  4. 💰 Harga Terjangkau, Aktif Selamanya
  5. 🌿 Ramah Lingkungan (eco-friendly impact)
  6. 🛍️ Marketplace Vendor Terintegrasi

#### 4. Demo Carousel Tema
- Grid/carousel tema dengan preview gambar mobile mockup
- Filter: Semua | Minimalis | Floral | Elegan | Budaya | Dark/Modern
- Tombol "Lihat Demo" + "Gunakan Tema Ini"
- Badge "BARU" / "POPULER" / "PREMIUM"

#### 5. Fitur Lengkap (Feature Showcase)
Dua kolom feature showcase (ala wevitation) dengan ikon + deskripsi:
- Aktif Selamanya (sekali bayar)
- Manajemen Tamu + QR Code Unik
- RSVP Online + Sesi Kedatangan (dari Inveet)
- Galeri Foto & Video Unlimited
- Musik Latar Custom
- Ucapan & Doa dari Tamu
- Kado Cashless + Amplop Digital
- Wishlist Kado (integrasi)
- Live Streaming Link
- Notifikasi WhatsApp Real-time
- Analitik Pengunjung & Tamu
- Layar Penerima Tamu (check-in screen)
- Download Undangan versi Gambar
- Buku Tamu Digital
- Custom Domain (premium)
- Story Instagram Export
- Wedding Planning Tools (to-do, countdown)
- Kustomisasi CSS/JS (developer plan)

#### 6. Cara Kerja (5 Langkah)
Timeline visual animasi:
1. 📝 Daftar & Isi Data
2. 🎨 Pilih Tema
3. 👥 Tambah Daftar Tamu
4. 📤 Bagikan Link & QR Code
5. 📊 Pantau RSVP & Kado

#### 7. Statistik Dampak (Eco-Green)
Dari Wevitation — tampilkan dampak lingkungan:
- Kertas dihindari (ton)
- Emisi CO₂ dikurangi
- Undangan digital dibagikan
- Biaya cetak dihemat (dari Inveet)

#### 8. Marketplace Vendor Preview
Grid vendor terpopuler (dari WebNikah):
- Fotografi | Katering | Dekorasi | WO | Rias | Videografi
- CTA: "Jelajahi Semua Vendor"

#### 9. Harga (Pricing)
3 paket:
| | Gratis | Premium | Pro |
|---|---|---|---|
| Harga | Rp0 | Rp79.000 | Rp149.000 |
| Aktif | 30 hari | Selamanya | Selamanya |
| Tema | Gratis | Premium | Semua |
| Tamu | 50 | Unlimited | Unlimited |
| Galeri | 5 foto | 30 foto | Unlimited |
| Kado Cashless | ❌ | ✅ | ✅ |
| Analytics | Basic | Advanced | Pro |
| Notif WA | ❌ | ✅ | ✅ |
| Custom CSS/JS | ❌ | ❌ | ✅ |
| Custom Domain | ❌ | ❌ | +Rp150K |
| Hapus Branding | ❌ | ❌ | ✅ |

#### 10. Testimoni
Carousel testimoni nyata dengan:
- Foto pengantin
- Nama + link undangan
- Bintang rating
- Kutipan ucapan

#### 11. Blog / Inspirasi Nikah
Artikel terbaru + inspirasi pernikahan nyata (dari pengguna)

#### 12. FAQ
Accordion FAQ dengan animasi smooth

#### 13. Footer
- Links: Produk, Vendor, Perusahaan, Legal
- Social media
- Download app badge
- Newsletter subscription
- Copyright + eco-friendly badge

---

### B. Dashboard (Setelah Login)

#### Sidebar Navigation
- Dashboard Overview
- Undangan Saya
- Manajemen Tamu
- Analitik
- Kado & Amplop
- Pengaturan Undangan
- Pengaturan Akun
- Upgrade Plan

#### Dashboard Overview
- Welcome banner dengan nama pengguna
- Quick stats: Total Tamu, RSVP Hadir, Tamu Belum Konfirmasi, Total Kado
- Countdown ke hari H (besar, animasi)
- Shortcut actions: Bagikan Undangan, Tambah Tamu, Lihat Live

#### Undangan Builder
Step-by-step form:
1. **Info Dasar:** Nama pasangan, tanggal, cerita cinta
2. **Pilih Tema:** Grid dengan preview
3. **Lokasi & Acara:** Google Maps picker, multiple event (akad, resepsi)
4. **Galeri:** Upload foto (drag & drop ke Supabase Storage)
5. **Musik:** Upload MP3 atau URL YouTube/Spotify
6. **Kado:** Setup rekening bank, e-wallet (QRIS)
7. **Tamu:** Import CSV atau input manual
8. **Review & Publish**

#### Manajemen Tamu
- Tabel tamu dengan status RSVP
- Import/Export CSV
- Generate link personal per tamu
- Generate QR Code individual
- Filter: Hadir/Tidak Hadir/Belum Konfirmasi
- Sesi kedatangan (pagi/siang/malam)
- Send reminder via WhatsApp (bulk)

#### Analitik
- Grafik pengunjung harian/mingguan
- Heatmap asal pengunjung
- Top tamu yang paling sering buka
- Statistik RSVP
- Timeline ucapan masuk

#### Kado & Amplop Digital
- List rekening bank + e-wallet
- Riwayat kado masuk (nama tamu, nominal)
- Total kado terkumpul
- Export laporan kado (CSV/PDF)

---

### C. Halaman Undangan Publik (/[username])

Setiap undangan memiliki URL: `nikahlink.com/nama-pasangan`

**Fitur halaman undangan:**
1. **Opening/Cover** — nama tamu personal, tombol buka (dengan musik)
2. **Hero** — nama pasangan + countdown timer animasi
3. **Cerita Cinta** — timeline love story
4. **Detail Acara** — akad & resepsi (tanggal, waktu, lokasi, tombol Maps)
5. **Galeri** — masonry/grid foto + lightbox viewer
6. **Live Streaming** — embed atau link
7. **RSVP Form** — konfirmasi kehadiran + sesi + jumlah tamu
8. **Ucapan & Doa** — form + list ucapan (real-time)
9. **Kado Digital** — pilihan metode kado (transfer, QRIS, wishlist)
10. **Musik Player** — floating music player dengan pause/play
11. **Share Button** — copy link, WhatsApp share
12. **QR Code** — QR undangan personal

---

### D. Marketplace Vendor

Dari WebNikah — halaman pencarian vendor:
- Filter: Kategori | Kota | Harga | Rating
- Kartu vendor: foto, nama, kategori, rating, harga mulai dari
- Detail vendor: portofolio, paket harga, ulasan, kontak
- Form inquiry langsung

---

### E. Katalog Tema

- Grid tema dengan filter kategori
- Preview full-screen mobile mockup
- Tombol "Gunakan Tema Ini"
- Info: nama, style, warna, ketersediaan (gratis/premium)

---

## 🗄️ Database Schema (Supabase)

### Tabel Utama

```sql
-- Users (di-handle Supabase Auth)
users
  id, email, name, avatar_url, plan, created_at

-- Profiles
profiles
  id, user_id, phone, created_at

-- Invitations
invitations
  id, user_id, username (unique), status
  bride_name, groom_name, love_story
  akad_date, akad_time, akad_venue, akad_address, akad_maps_url
  reception_date, reception_time, reception_venue, reception_address, reception_maps_url
  theme_id, music_url, cover_image_url
  livestream_url, custom_message
  is_published, created_at, updated_at

-- Themes
themes
  id, name, slug, category, thumbnail_url, preview_url
  is_premium, is_active, created_at

-- Guests
guests
  id, invitation_id, name, phone, email
  session (pagi/siang/malam/all), rsvp_status
  confirmation_date, notes, qr_token (unique), created_at

-- Wishes
wishes
  id, invitation_id, guest_id, guest_name, message, created_at

-- Gallery
gallery
  id, invitation_id, image_url, caption, order_index, created_at

-- Gift_accounts
gift_accounts
  id, invitation_id, type (bank/ewallet/qris)
  bank_name, account_number, account_name, qris_url

-- Gift_transactions
gift_transactions
  id, invitation_id, guest_name, amount, note, method, created_at

-- Vendors
vendors
  id, user_id, name, slug, category, city
  description, price_from, portfolio_images, contact_info
  rating_avg, review_count, is_verified, created_at

-- Blog_posts
blog_posts
  id, title, slug, content, excerpt
  featured_image, author_id, published_at, category, tags

-- Subscriptions
subscriptions
  id, user_id, plan (free/premium/pro)
  started_at, expires_at, payment_status, payment_id
```

---

## 🎭 Tema Undangan (Awal)

Minimal 12 tema untuk launch:

| No | Nama | Style | Target |
|----|------|-------|--------|
| 1 | **Sakura Bloom** | Floral pink, Japanese-inspired | Feminin, romantis |
| 2 | **Midnight Luxe** | Dark gold, mewah | Modern elegan |
| 3 | **Javanese Heritage** | Batik, adat Jawa | Budaya Nusantara |
| 4 | **Minimalist Clean** | Putih, tipografi | Minimalis modern |
| 5 | **Tropical Garden** | Hijau, tropis | Natural, outdoor |
| 6 | **Golden Arch** | Emas, arsitektur | Mewah klasik |
| 7 | **Rustic Charm** | Cream, bunga kering | Bohemian rustic |
| 8 | **Royal Blue** | Navy, metalik | Elegan kontemporer |
| 9 | **Sundanese Craft** | Motif Sunda | Budaya Sunda |
| 10 | **Film Grain** | Retro, foto analog | Vintage aesthetic |
| 11 | **Pastel Dream** | Pastel soft | Girly, cute |
| 12 | **Dark Botanical** | Dark green, tanaman | Moody botanical |

---

## 🚀 Rencana Implementasi

### Phase 1: Foundation (Marketing Website)
Membangun landing page yang memukau dan sistem auth.

**File-file yang dibuat:**
1. `package.json` — dependencies
2. `tailwind.config.ts` — design tokens
3. `next.config.ts` — konfigurasi Next.js
4. `app/globals.css` — global CSS + font imports
5. `app/layout.tsx` — root layout
6. `app/(marketing)/page.tsx` — homepage
7. `components/landing/Navbar.tsx`
8. `components/landing/HeroSection.tsx`
9. `components/landing/WhySection.tsx`
10. `components/landing/ThemeCarousel.tsx`
11. `components/landing/FeaturesSection.tsx`
12. `components/landing/HowItWorks.tsx`
13. `components/landing/EcoImpact.tsx`
14. `components/landing/VendorPreview.tsx`
15. `components/landing/PricingSection.tsx`
16. `components/landing/TestimonialSection.tsx`
17. `components/landing/BlogSection.tsx`
18. `components/landing/FaqSection.tsx`
19. `components/landing/Footer.tsx`
20. `app/(marketing)/tema/page.tsx` — katalog tema
21. `app/(marketing)/harga/page.tsx` — halaman harga
22. `app/(marketing)/vendor/page.tsx` — marketplace vendor
23. `app/(marketing)/blog/page.tsx` — halaman blog

### Phase 2: Auth & Dashboard
24. `lib/supabase/client.ts` — browser client
25. `lib/supabase/server.ts` — server client
26. `lib/supabase/middleware.ts`
27. `middleware.ts` — route protection
28. `app/(auth)/masuk/page.tsx` — login
29. `app/(auth)/daftar/page.tsx` — register
30. `app/(dashboard)/dashboard/page.tsx`
31. `components/dashboard/Sidebar.tsx`
32. `components/dashboard/Header.tsx`

### Phase 3: Invitation Builder & Management
33. `app/(dashboard)/undangan/page.tsx`
34. `app/(dashboard)/undangan/baru/page.tsx`
35. `app/(dashboard)/undangan/[id]/edit/page.tsx`
36. `app/(dashboard)/tamu/page.tsx`
37. `app/(dashboard)/analitik/page.tsx`
38. `app/(dashboard)/kado/page.tsx`

### Phase 4: Public Invitation Pages
- pp/[username]/page.tsx — undangan viewer
- components/themes/* — 24 tema selesai (mendukung custom gallery, layout masonry, animasi GSAP/AOS)

### Phase 5: Supabase Setup
- ✅ Tabel invitations (termasuk custom_data untuk foto)
- ✅ Storage buckets (images)
- ✅ API routes (app/api/)

---

## ✅ Status Proyek Saat Ini
1. Landing page, Dashboard, Admin selesai.
2. Form builder (baru/edit) selesai, field mandatory tidak bisa dilanjutkan jika kosong.
3. Midtrans payment sudah terhubung.
4. 24 Tema selesai dengan validasi gallery gambar.
5. Setup database (Supabase) sudah berjalan.
