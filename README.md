# NikahLink

Platform undangan pernikahan digital berbasis Next.js, Supabase, dan Vercel.

## Fitur Utama

- Undangan pernikahan digital
- RSVP, wishes, dan manajemen tamu
- Gift / cashless
- Analytics
- Theme catalog dan public demo
- Versioned theme editor
- Draft / publish / rollback theme version
- Invitation yang dipin ke theme version
- Premium / Pro subscription
- Midtrans payment

## Tech Stack

- **Frontend:** Next.js App Router, React, TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase PostgreSQL + Supabase Auth + RLS
- **Storage:** Supabase Storage
- **Payment:** Midtrans
- **Deployment:** Vercel

## Theme Architecture

Theme tidak lagi diperlakukan sebagai satu record renderer yang mutable. Arsitektur runtime menggunakan snapshot versi:

```text
Theme
  ↓
Theme Version
  ├── component_key
  ├── colors
  ├── config / editor_config
  ├── fields_schema
  └── assets
        ↓
Invitation
  ├── theme_id
  └── theme_version_id
        ↓
Theme Resolver
        ↓
React Theme Renderer
```

### Kontrak utama

- `slug` = identitas katalog dan URL tema.
- `component_key` = identitas renderer React.
- `theme_version_id` = snapshot renderer/configuration yang benar-benar dipakai invitation.
- Theme version bersifat immutable.
- Version lifecycle: `draft → published → archived`.
- Rollback membuat version baru dari snapshot lama; snapshot lama tidak dimodifikasi.
- Invitation lama mempertahankan `theme_version_id` saat data undangan diedit tanpa mengganti tema.
- Bila client mengirim pasangan `theme_id` dan `theme_version_id` yang tidak cocok, database resolver memperbaikinya ke published version milik tema yang dipilih.

### Field schema

Field tema berasal dari snapshot version bila tersedia, kemudian fallback ke schema theme, lalu fallback ke registry renderer. Ini memungkinkan variant yang berbeda memakai field schema berbeda tanpa membuat renderer React baru.

### Theme tokens

Palette tema menggunakan token semantik seperti:

```text
--theme-primary
--theme-secondary
--theme-accent
--theme-background
--theme-text
--theme-surface
```

Legacy renderer yang belum sepenuhnya menggunakan CSS variables tetap didukung melalui fallback palette yang mempertahankan tampilan existing.

## Create / Edit Invitation

Pemilihan tema harus selalu menghasilkan pasangan yang konsisten:

```text
theme
  +
published theme version
```

Saat tema tidak diganti ketika edit, `theme_version_id` yang sudah dipin dipertahankan. Saat tema diganti, `theme_id` dan `theme_version_id` dihitung ulang dari tema yang sama.

## Demo dan Preview

```text
/tema                         katalog publik
/demo/[slug]                  demo publik
/admin/themes/preview/[slug]  preview admin
/admin/themes/editor/new      membuat theme variant
/admin/themes/editor/[id]     mengedit theme variant
```

Semua renderer melewati resolver tema yang sama dan public invitation menggunakan theme version yang dipin pada invitation.

## Security

- RLS aktif pada tabel tema dan version.
- Public hanya membaca tema/version yang memang boleh dipublikasikan atau masih direferensikan invitation yang valid.
- Operasi administrasi tema dibatasi ke `super_admin`.
- Theme version snapshot immutable.
- Hard delete theme tidak digunakan untuk lifecycle normal; archive dilakukan melalui `is_active` / lifecycle status.

## Subscription

| Plan | Price | Duration |
|------|------:|----------|
| Free | Rp0 | - |
| Premium | Rp99.000 | 90 hari |
| Pro | Rp299.000 | Lifetime |

## Payment Architecture

```text
Client
  → API
  → Create local subscription
  → Midtrans
  → Verified webhook
  → Atomic subscription finalization
```

## Development

```bash
npm install
npm run dev
npm run build
```

## Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=
```

## Project Structure

```text
app/                # routes dan UI pages
components/         # UI, dashboard, invitation, theme renderers
lib/themes/         # registry, resolver, tokens, field schema
lib/supabase/       # client dan server helpers
supabase/migrations/ # schema, RLS, theme/version lifecycle
public/              # static assets
```

`graphify-out/` berisi artefak knowledge graph repository dan bukan sumber runtime aplikasi.

## Deployment

Deployment menggunakan Vercel. Sebelum merge perubahan aplikasi, jalankan build dan verifikasi migration Supabase yang terkait.