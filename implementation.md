# NikahLink — Current Implementation Guide

## 1. Purpose

NikahLink adalah platform undangan pernikahan digital berbasis Next.js dan Supabase. Dokumen ini menjelaskan **implementasi yang berjalan saat ini**, bukan roadmap lama atau rancangan fitur yang belum tersedia.

## 2. Current Stack

| Area | Implementation |
|---|---|
| Application | Next.js App Router |
| Language | TypeScript |
| UI | React + Tailwind CSS |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Authorization | PostgreSQL RLS + application checks |
| Storage | Supabase Storage |
| Payment | Midtrans |
| Deployment | Vercel |
| Animation | Framer Motion |
| Icons | Lucide React |

## 3. Application Structure

```text
app/
├── dashboard/
│   └── undangan/
│       ├── baru/
│       └── [id]/edit/
├── admin/
│   └── themes/
│       ├── editor/
│       └── preview/
├── demo/
└── [username]/

components/
└── themes/
    └── <ThemeRenderer>.tsx

lib/
├── themes/
│   ├── registry.tsx
│   ├── config.ts
│   ├── resolve.ts
│   ├── tokens.ts
│   ├── fields.ts
│   └── invitation-theme.ts
└── supabase/

supabase/
└── migrations/
```

`graphify-out/` adalah artefak knowledge graph dan bukan sumber runtime.

## 4. Theme Architecture

Theme system menggunakan tiga lapisan utama:

```text
Theme Catalog
    ↓
Theme Version
    ↓
React Renderer
```

### 4.1 Theme

`themes` menyimpan identitas katalog dan metadata variant:

- `id`
- `slug`
- `name`
- `category`
- `component_key`
- `colors`
- `thumbnail_url`
- `is_premium`
- `is_active`
- `sort_order`
- editor configuration / schema / assets bila digunakan oleh editor

`slug` adalah identitas publik/katalog. `component_key` adalah identitas renderer React.

### 4.2 Theme Version

`theme_versions` adalah snapshot immutable dari implementasi theme pada titik waktu tertentu.

Snapshot dapat memuat:

- `theme_id`
- `version`
- `component_key`
- `colors`
- `config`
- `editor_config`
- `fields_schema`
- `assets`
- lifecycle status

Version lama tidak diedit. Perubahan menghasilkan version baru.

### 4.3 Theme Renderer

Renderer aktual berada di `components/themes/*Theme.tsx` dan dipetakan melalui `lib/themes/registry.tsx`.

Registry adalah **renderer registry**, bukan sumber kebenaran runtime untuk metadata invitation.

## 5. Theme Resolver Contract

Semua consumer tema harus melewati resolver terpusat.

```text
Supabase theme/version data
          ↓
resolveThemeConfig()
          ↓
resolved renderer + version snapshot
```

Aturan utama:

1. Gunakan `component_key` dari snapshot bila tersedia.
2. Gunakan `slug` hanya sebagai compatibility fallback.
3. Gunakan fallback renderer yang aman bila renderer tidak lagi tersedia.
4. Invitation existing tidak boleh menjadi 404 hanya karena renderer legacy hilang.

Consumer yang harus menggunakan contract yang sama:

- public invitation
- public demo
- admin preview
- theme editor
- invitation create
- invitation edit

## 6. Invitation Theme Pinning

Invitation mempunyai dua referensi:

```text
invitations.theme_id
invitations.theme_version_id
```

Keduanya harus menunjuk ke tema dan version yang sama.

### Create

Saat user memilih tema:

```text
selected Theme
    ↓
published Theme Version terbaru
    ↓
(theme_id, theme_version_id)
```

Pasangan tersebut disimpan bersama.

### Edit

Bila user tidak mengganti tema:

```text
old theme_id
old theme_version_id
      ↓
retained
```

Bila user mengganti tema:

```text
new Theme
    ↓
new published Version
    ↓
new (theme_id, theme_version_id)
```

Database tetap menjadi safety net. Trigger `ensure_invitation_theme_version()` akan memastikan pasangan ID konsisten dan dapat mengoreksi `theme_version_id` ke published version milik `theme_id` bila client mengirim pasangan yang tidak cocok.

## 7. Field Schema

Field theme bersifat version-aware.

Resolusi schema:

```text
Theme Version fields_schema
        ↓ fallback
Theme fields_schema
        ↓ fallback
Registry renderer fields
```

Field dapat memiliki:

```text
name
label
type
placeholder
defaultValue
required
enabled
```

Dengan model ini, dua variant yang menggunakan renderer sama dapat mempunyai field schema berbeda tanpa membuat renderer React baru.

## 8. Theme Tokens

Theme visual menggunakan token semantik:

```text
--theme-primary
--theme-secondary
--theme-accent
--theme-background
--theme-text
--theme-surface
```

Resolved colors mengikuti prioritas:

```text
Theme Version colors
      ↓ fallback
Theme colors
      ↓ fallback
Renderer default palette
```

Renderer legacy masih dapat menggunakan fallback palette agar migrasi token tidak mengubah tampilan existing secara tiba-tiba.

## 9. Theme Editor

Editor versioned berada di bawah:

```text
/admin/themes/editor/new
/admin/themes/editor/[id]
```

Editor mengelola:

- metadata theme
- renderer selection
- colors/tokens
- field schema
- editor configuration
- assets
- preview
- version history

## 10. Version Lifecycle

Lifecycle version:

```text
draft
  ↓
published
  ↓
archived
```

### Publish

Publish memindahkan version yang dipilih menjadi published dan mengarsipkan version aktif sebelumnya.

### Rollback

Rollback tidak mengubah snapshot lama.

```text
v1 archived
v2 published

rollback v1
    ↓
v3 published  ← snapshot v1
```

Dengan demikian histori version tetap immutable.

## 11. Theme Catalog / Preview / Demo

Flow publik:

```text
/tema
  ↓
/demo/[slug]
  ↓
/daftar?tema=<slug>
```

Flow admin:

```text
/admin/themes
      ├── create → /admin/themes/editor/new
      ├── edit   → /admin/themes/editor/[id]
      └── preview → /admin/themes/preview/[slug]
```

Preview dan demo harus menggunakan resolver serta renderer contract yang sama dengan public invitation.

## 12. Theme Lifecycle

Theme yang sudah digunakan invitation tidak boleh dihapus secara hard delete.

Gunakan:

```text
is_active = false
```

untuk archive pada catalog.

Invitation lama tetap dapat merender theme/version yang dipin meskipun theme tidak lagi tersedia untuk invitation baru.

## 13. Database Security

Theme dan version menggunakan RLS.

Prinsip akses:

```text
Public
  → read only published/allowed theme data

Super Admin
  → create/update/archive theme
  → create/publish/rollback versions
```

Hard delete bukan bagian dari normal theme lifecycle.

## 14. Theme Storage

Bucket Supabase Storage `themes` digunakan untuk asset theme yang dikelola sistem.

Upload/update/delete asset admin dibatasi melalui role authorization dan policy Storage.

## 15. Design and Renderer Rules

Saat membuat renderer baru:

1. Tambahkan component renderer di `components/themes/`.
2. Daftarkan `component_key` di `lib/themes/registry.tsx`.
3. Definisikan default field schema.
4. Definisikan default token palette.
5. Pastikan renderer dapat menerima theme colors/token.
6. Sediakan thumbnail/demo data.
7. Verifikasi public invitation, demo, dan admin preview.
8. Jangan memindahkan business data invitation ke renderer.

Renderer hanya bertanggung jawab terhadap presentasi.

## 16. Creating a New Theme Variant

Variant baru **tidak harus membuat renderer baru**.

Contoh:

```text
Renderer: royal-gold

Variant A
  colors = gold / black

Variant B
  colors = emerald / gold

Variant C
  colors = burgundy / gold
```

Renderer baru hanya diperlukan jika layout/behavior benar-benar berbeda dan tidak dapat direpresentasikan melalui configuration/token/field snapshot.

## 17. Backward Compatibility

Legacy theme yang masih direferensikan invitation harus tetap dapat dirender melalui:

- preserved theme version
- preserved renderer key
- compatibility resolver
- safe fallback renderer bila renderer asli hilang

Jangan menghapus version lama hanya karena theme sudah inactive.

## 18. Payment Architecture

Payment tetap terpisah dari theme system:

```text
Client
  → API
  → local subscription/payment record
  → Midtrans
  → webhook verification
  → atomic entitlement/subscription finalization
```

Webhook payment harus memvalidasi signature/status Midtrans dan tidak bergantung pada client state.

## 19. Testing Checklist

### Theme

- [ ] Theme catalog hanya menampilkan theme aktif/public.
- [ ] Admin dapat membuat draft.
- [ ] Draft dapat dipreview tanpa dipublish.
- [ ] Publish menghasilkan tepat satu published version.
- [ ] Version lama menjadi archived.
- [ ] Rollback menghasilkan version baru.
- [ ] Version lama tidak berubah.
- [ ] Field schema snapshot dipakai oleh editor/create/edit invitation.
- [ ] Warna snapshot dipakai oleh renderer.
- [ ] Theme inactive yang masih digunakan invitation tetap dapat dirender.
- [ ] Missing renderer tidak memutus invitation existing.

### Invitation

- [ ] Create memilih published version dari theme yang sama.
- [ ] Edit tanpa ganti tema mempertahankan pinned version.
- [ ] Ganti tema mengganti `theme_id` dan `theme_version_id` sebagai satu pasangan.
- [ ] Database menolak atau mengoreksi mismatch theme/version.
- [ ] Required theme fields tervalidasi dari version snapshot.

### Build

```bash
npm run build
```

Perubahan schema Supabase harus mempunyai migration yang masuk repository.

## 20. Current Scope vs Roadmap

Dokumen ini hanya mendeskripsikan implementasi yang telah dibangun atau dikontrak pada repository saat ini.

Fitur seperti marketplace vendor penuh, wedding planning, custom CSS/JS untuk pengguna, live streaming native, mobile application, dan integrasi pihak ketiga tambahan hanya boleh dianggap sebagai roadmap sampai benar-benar tersedia di source code dan database.
