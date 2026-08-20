# NikahLink Theme Architecture & Development Guideline

Dokumen ini adalah acuan teknis utama untuk pengembangan, pembuatan, pengeditan, preview, publishing, dan pemakaian tema pada NikahLink.

Dokumen ini mengikuti arsitektur project terbaru. **Theme di database bukan renderer React secara langsung.** Renderer berada di registry source code, sedangkan database menyimpan metadata tema, konfigurasi variant, dan snapshot version yang dipakai invitation.

---

## 1. Arsitektur Theme NikahLink

Model utama:

```text
Theme
  │
  ├── metadata katalog
  │     ├── name
  │     ├── slug
  │     ├── category
  │     ├── thumbnail_url
  │     ├── is_premium
  │     ├── is_active
  │     └── sort_order
  │
  ├── renderer identity
  │     └── component_key
  │
  └── visual/config defaults
        ├── colors
        ├── editor_config
        ├── fields_schema
        └── assets
              │
              ▼
       Theme Version
              │
              ├── version
              ├── component_key
              ├── config
              ├── colors
              ├── fields_schema
              ├── assets
              └── lifecycle_status
                    │
                    ├── draft
                    ├── published
                    └── archived
                    │
                    ▼
              Invitation
                    │
                    ├── theme_id
                    └── theme_version_id
                          │
                          ▼
                    Theme Renderer
```

Prinsip terpenting:

1. `themes.slug` adalah identitas katalog/URL, bukan nama file React.
2. `themes.component_key` adalah identity renderer yang digunakan registry.
3. `theme_versions` adalah snapshot immutable dari renderer dan konfigurasi tema.
4. Invitation harus menunjuk ke `theme_id` dan `theme_version_id` yang berasal dari tema yang sama.
5. Invitation lama harus tetap dapat dirender walaupun tema diarsipkan atau version baru dipublish.

---

## 2. Theme Registry vs Theme Database

### Renderer Registry

Renderer React berada di:

```text
lib/themes/registry.tsx
```

Registry berisi mapping:

```ts
component_key -> React Theme Component
```

dan default field schema renderer.

Contoh konsep:

```ts
{
  slug: "golden-arch",
  component: GoldenArchTheme,
  fields: [
    // field schema default renderer
  ]
}
```

Registry adalah **developer-level fallback/source untuk renderer**. Registry bukan penyimpanan variant tema.

### Theme Database

Database `themes` menyimpan katalog tema dan konfigurasi variant.

Database dapat membuat variant baru dengan renderer yang sudah tersedia tanpa membuat file React baru.

Contoh:

```text
Golden Arch
  ├── Classic
  ├── Emerald
  └── Burgundy
```

Ketiga variant dapat menggunakan:

```text
component_key = golden-arch
```

tetapi memiliki `colors`, `config`, asset, atau field schema yang berbeda.

### Kapan perlu kode React baru?

Renderer baru diperlukan jika desain/layout/struktur interaksi benar-benar berbeda dan tidak dapat direpresentasikan oleh renderer yang ada.

Renderer baru harus:

1. dibuat di `components/themes/`;
2. didaftarkan di `lib/themes/registry.tsx`;
3. memiliki default field schema;
4. memiliki default palette/token;
5. diuji melalui admin preview dan public demo;
6. baru digunakan sebagai `component_key` oleh theme database.

---

## 3. Slug, Component Key, dan Version

Ketiga identifier tidak boleh dicampur.

```text
slug
  = identitas katalog/public URL

component_key
  = identity renderer React

version_id
  = snapshot renderer/configuration yang dipakai invitation
```

Contoh:

```text
Theme:
  name = Royal Gold Emerald
  slug = royal-gold-emerald
  component_key = royal-gold

Version:
  version = 2
  renderer = royal-gold
```

Jangan menggunakan `slug` sebagai pengganti `component_key` kecuali melalui compatibility fallback resolver.

Semua consumer runtime harus melewati canonical theme resolver.

---

## 4. Canonical Theme Resolution

Resolver tema adalah pintu utama untuk mendapatkan renderer.

Secara konsep:

```text
Theme DB / Theme Version
          │
          ▼
   resolveThemeConfig()
          │
          ├── component_key valid
          │       ↓
          │   renderer registry
          │
          └── renderer hilang
                  ↓
              fallback aman
```

Consumer yang wajib mengikuti contract resolver:

- public invitation;
- public demo;
- admin preview;
- theme editor preview;
- invitation create;
- invitation edit.

Tidak boleh membuat logic lookup renderer sendiri di masing-masing halaman.

---

## 5. Theme Versioning

Theme version adalah **snapshot immutable**.

Sebuah version menyimpan minimal:

```text
component_key
config
colors
fields_schema
assets
lifecycle_status
version
```

Version lama tidak boleh diedit setelah dibuat.

### Kenapa immutable?

Karena invitation yang sudah dibuat harus stabil.

Contoh:

```text
Invitation A
  → Royal Gold v1

Admin membuat v2
  → Royal Gold v2
```

Invitation A tetap menggunakan v1.

Mengubah source renderer atau version aktif tidak boleh mengubah histori invitation yang sudah dipin ke version lama.

---

## 6. Version Lifecycle

Status yang digunakan:

```text
draft
published
archived
```

Flow normal:

```text
Draft
  ↓
Publish
  ↓
Published
  ↓
Version baru dipublish
  ↓
Version lama → Archived
```

### Rollback

Rollback tidak boleh mengubah version lama.

Flow yang benar:

```text
v1 published
v2 published

rollback ke v1

→ buat v3 berdasarkan snapshot v1
→ v3 published
→ v1 tetap archived
→ v2 archived
```

Dengan demikian histori tetap utuh.

---

## 7. Invitation Theme Contract

Setiap invitation menggunakan:

```text
theme_id
theme_version_id
```

Keduanya harus merujuk ke tema yang sama.

Database memiliki trigger authoritative yang memastikan contract ini.

Aturan utama:

### Create invitation

Jika user memilih tema:

```text
selected theme
   ↓
latest published version dari theme yang sama
   ↓
theme_id + theme_version_id
```

### Edit invitation tanpa mengganti tema

```text
existing theme_id
existing theme_version_id
        ↓
pertahankan version lama
```

Ini penting agar membuka atau menyimpan edit biasa tidak otomatis memindahkan invitation ke version terbaru.

### Edit invitation dengan mengganti tema

```text
new theme
   ↓
latest published version dari new theme
   ↓
theme_id + theme_version_id baru
```

### Database safety net

Jika client mengirim pasangan yang tidak cocok:

```text
theme_id = A
theme_version_id = version milik B
```

database harus menyelesaikan pasangan tersebut ke published version milik A atau menolak jika referensi benar-benar invalid.

Frontend tetap wajib mengirim pasangan yang benar; database resolution adalah safety net, bukan mekanisme normal.

---

## 8. Field Schema

Field tema terdiri dari dua layer.

### Renderer default field schema

Didefinisikan di registry.

Field type yang didukung:

```text
text
textarea
url
boolean
date
image
```

Contoh:

```ts
{
  name: "quote",
  label: "Kutipan",
  type: "textarea",
  placeholder: "Masukkan kutipan"
}
```

### Versioned field schema

`theme_versions.fields_schema` dapat mengubah:

```text
label
placeholder
defaultValue
required
enabled
urutan field
```

Resolver field harus menggunakan prioritas:

```text
theme_version.fields_schema
        ↓ fallback
themes.fields_schema
        ↓ fallback
registry renderer fields
```

Dengan model ini satu renderer dapat digunakan oleh banyak variant dengan field schema berbeda.

---

## 9. Required Field Validation

Field wajib harus ditentukan pada version snapshot.

```json
{
  "name": "subtitle",
  "label": "Subtitle",
  "type": "text",
  "required": true,
  "enabled": true
}
```

Validation harus dilakukan pada dua level:

1. UI create/edit untuk UX;
2. database trigger untuk integrity.

Database adalah enforcement terakhir.

Field yang:

```text
required = true
enabled = true
```

harus mempunyai nilai pada `custom_data`.

---

## 10. Colors & Theme Tokens

Theme colors berasal dari version snapshot dengan fallback ke metadata/default renderer.

Token inti:

```css
--theme-primary
--theme-secondary
--theme-accent
--theme-background
--theme-text
--theme-surface
```

RGB variants juga tersedia untuk opacity:

```css
--theme-primary-rgb
--theme-secondary-rgb
--theme-accent-rgb
--theme-background-rgb
--theme-text-rgb
```

Resolusi palette:

```text
theme_version.colors
        ↓ fallback
themes.colors
        ↓ fallback
default renderer palette
```

### Aturan mempertahankan tampilan existing

Migrasi renderer ke token harus mempertahankan palette existing sebagai default.

Jangan mengganti seluruh palette renderer hanya untuk memenuhi token contract.

Jika renderer sudah menggunakan `themeColors`, pertahankan mekanisme tersebut dan integrasikan dengan token layer secara bertahap.

Renderer yang masih memiliki warna hard-coded boleh dimigrasikan secara terarah, terutama untuk warna inti:

```text
background
text
primary
secondary
accent
surface
```

Warna dekoratif khusus yang tidak memiliki padanan token tidak boleh diganti secara buta.

---

## 11. Theme Configuration

`theme_versions.config` digunakan untuk konfigurasi visual/behavioral yang tidak cocok menjadi kolom terpisah.

Contoh:

```json
{
  "layout": "editorial",
  "hero": {
    "alignment": "center",
    "height": "screen"
  },
  "typography": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "gallery": {
    "variant": "masonry"
  },
  "animation": {
    "preset": "soft-fade"
  }
}
```

`config` tidak boleh bercampur dengan wedding content seperti:

```text
nama mempelai
alamat
tanggal acara
RSVP guest data
```

Wedding content tetap berada pada model invitation/domain terkait.

---

## 12. Theme Assets

Asset tema harus dibedakan dari asset undangan user.

Theme assets dapat mencakup:

```text
background texture
ornament
floral illustration
cultural motif
decorative SVG
```

Asset snapshot disimpan pada `theme_versions.assets`.

Thumbnail katalog adalah asset metadata tema dan tidak sama dengan gallery foto invitation.

Untuk asset yang diupload admin, gunakan storage bucket/theme policy yang sudah ditentukan oleh project.

Jangan hard-code URL asset production pada renderer jika asset tersebut seharusnya dapat diubah melalui variant/version.

---

## 13. Theme Editor

Admin theme editor adalah editor **variant/version**, bukan editor source-code renderer.

Entry point:

```text
/admin/themes/editor/new
/admin/themes/editor/[theme_id]
```

Editor harus menyediakan minimal:

```text
Metadata
  ├── name
  ├── slug
  ├── category
  ├── premium
  └── renderer

Theme Tokens
  ├── primary
  ├── secondary
  ├── accent
  ├── background
  └── text

Fields
  ├── label
  ├── placeholder
  ├── required
  └── enabled

Preview
Version History
Draft
Publish
Rollback
```

Setelah perubahan disimpan:

```text
editor changes
      ↓
draft snapshot
      ↓
preview
      ↓
publish
```

Jangan mengedit version published secara langsung.

---

## 14. Theme Catalog

Halaman katalog admin:

```text
/admin/themes
```

Fungsi utama:

```text
Tambah Tema
Edit
Preview
Demo
Archive
Restore
```

`Tambah Tema` berarti membuat **theme variant baru** menggunakan renderer yang sudah terdaftar.

Itu berbeda dengan membuat renderer React baru.

### Archive

Archive dilakukan dengan:

```text
is_active = false
```

Bukan delete.

Tema yang sudah pernah digunakan invitation tidak boleh dihapus hanya karena tidak lagi muncul di katalog.

---

## 15. Public Theme Demo

Public demo menggunakan route theme demo yang mengacu pada theme catalog/resolver.

Konsep flow:

```text
Tema katalog
   ↓
public demo
   ↓
resolved renderer
   ↓
dummy invitation data
```

Admin preview dan public demo harus menggunakan renderer contract yang sama.

Jangan membuat renderer khusus hanya untuk demo.

---

## 16. Admin Preview

Admin preview digunakan untuk memeriksa:

```text
renderer
colors
fields
config
assets
```

Preview harus memakai version/snapshot yang sedang diedit jika tersedia.

Untuk katalog published, preview default menampilkan published version.

Preview harus aman untuk tema archived agar admin tetap dapat memeriksa histori.

---

## 17. Responsive Design

Semua renderer harus mobile-first.

Target utama:

```text
smartphone portrait
```

Desktop tetap harus graceful:

```text
central invitation container
max width kira-kira 480–500px bila sesuai desain
background desktop dapat berupa color/photo/blurred surface
```

Semua action penting harus touch-friendly:

```text
Open Invitation
Maps
Copy rekening
RSVP
Share
Music Control
```

---

## 18. Section & Layout Guidelines

Renderer boleh mempunyai struktur yang berbeda, tetapi secara umum dapat memakai section berikut:

```text
Cover / Hero
Opening / Quote
Couple Profile
Event Details
Love Story / Timeline
Gallery
RSVP / Wishes
Digital Gift
Closing / Footer
```

Section optional tidak boleh dipaksa ada pada semua renderer.

Sebuah renderer baru harus memilih struktur yang benar-benar mendukung konsep visualnya.

Jangan membuat semua theme terlihat sama hanya karena menggunakan section yang sama.

---

## 19. Animation Guidelines

Gunakan animasi yang sesuai desain.

Preferred:

```text
Framer Motion
CSS animation
SVG path animation
```

Contoh:

```text
fade
slide
scale
parallax
SVG path drawing
floating ornaments
particle effect
```

Hindari animasi berlebihan yang:

- memperlambat first render;
- mengganggu readability;
- menyebabkan layout shift;
- tidak nyaman pada perangkat low-end.

Hormati `prefers-reduced-motion` untuk efek yang tidak penting.

---

## 20. Gallery Guidelines

Gallery dapat menggunakan:

```text
masonry
justified layout
grid
carousel
cross-fade
lightbox
SVG masking
```

Namun implementasi harus mempertahankan performa mobile.

Gunakan `next/image` bila sesuai dengan sumber asset dan kebutuhan renderer.

Jangan mengirim asset besar tanpa optimasi ke perangkat mobile.

---

## 21. Typography

Typography adalah bagian dari identitas renderer.

Gunakan pasangan font yang konsisten:

```text
Display / serif / script
        +
Readable body sans-serif
```

Typography idealnya dikonfigurasi melalui theme token/config bila renderer mendukungnya.

Jangan memasukkan font choice ke wedding content.

---

## 22. Music & User Interaction

Browser dapat memblokir autoplay.

Flow yang disarankan:

```text
Open Invitation
      ↓
user interaction
      ↓
start background music
```

Sediakan floating music control yang konsisten dengan desain tema.

Jangan mengasumsikan audio dapat otomatis bermain sebelum user interaction.

---

## 23. Premium vs Free Theme

Premium theme ditentukan oleh metadata/theme catalog, bukan oleh hard-coded logic pada renderer.

Contoh:

```text
is_premium = true
```

Premium dapat membedakan:

```text
visual complexity
custom assets
advanced interactions
custom fields
feature availability
```

Namun `is_premium` tidak boleh dijadikan alasan untuk menggandakan renderer jika perbedaannya hanya warna/configuration.

Gunakan variant/version selama struktur renderer tetap sama.

---

## 24. Theme Creation Flow

### Membuat variant baru

```text
Admin
  ↓
Tambah Tema
  ↓
pilih renderer
  ↓
isi metadata
  ↓
isi colors/config
  ↓
atur fields
  ↓
simpan draft
  ↓
preview
  ↓
publish
```

### Membuat renderer baru

```text
Developer
  ↓
create React renderer
  ↓
register component_key
  ↓
define default fields
  ↓
define default palette
  ↓
preview/demo
  ↓
production
```

Dua flow ini tidak boleh dicampur.

---

## 25. Theme Edit Flow

Edit metadata/configuration:

```text
Theme
  ↓
create new draft version
  ↓
modify config/colors/fields/assets
  ↓
preview
  ↓
publish
```

Version published yang lama tetap immutable.

Invitation lama tetap memakai version lama.

---

## 26. Theme Archive Flow

```text
Published Theme
      ↓
Archive
      ↓
is_active = false
```

Archive berarti:

```text
hide from new theme selection
```

bukan:

```text
break existing invitations
```

Invitation existing harus tetap dapat merender version yang dipin.

---

## 27. Backward Compatibility

Project memiliki legacy themes dan legacy versions.

Karena itu resolver harus memiliki fallback.

Prioritas umum:

```text
pinned version
      ↓
current theme metadata
      ↓
registry renderer defaults
      ↓
minimalis fallback bila renderer benar-benar hilang
```

Jangan menghapus renderer tanpa memastikan invitation existing masih dapat dirender.

Jika renderer legacy memang sudah tidak tersedia, lakukan migration/compatibility mapping secara eksplisit dan dokumentasikan perubahan tersebut.

---

## 28. Data Integrity Rules

Aturan yang harus selalu berlaku:

```text
1 theme version → tepat 1 theme
1 published theme → maksimal 1 published version
1 invitation → 1 pinned theme version
pinned theme version → harus milik theme invitation
version published → immutable
archive theme → tidak menghapus histori
```

Jangan menggunakan hard delete pada theme/version yang masih mempunyai histori bisnis.

---

## 29. Security Rules

Untuk `themes`:

```text
Public/anon
  → read tema yang diizinkan policy

super_admin
  → create/update/archive/publish/rollback
```

RLS adalah enforcement utama.

Client-side authorization hanya UX, bukan security boundary.

Storage theme assets juga harus mengikuti policy `super_admin` untuk operasi tulis.

Jangan pernah menaruh service role key di client.

---

## 30. Testing Checklist

Setiap perubahan theme system minimal diuji:

### Registry

- renderer dapat ditemukan;
- `component_key` valid;
- fallback bekerja jika renderer hilang.

### Theme version

- create draft bekerja;
- publish menghasilkan satu published version;
- version lama menjadi archived;
- snapshot tidak dapat diedit setelah publish;
- rollback membuat version baru.

### Fields

- version schema diprioritaskan;
- registry fallback bekerja;
- required field divalidasi di UI;
- required field juga divalidasi database.

### Invitation

- create memakai published version tema yang dipilih;
- edit tanpa ganti tema mempertahankan version lama;
- ganti tema mengganti `theme_id` dan `theme_version_id` bersama-sama;
- mismatch ID tidak dapat disimpan.

### Demo/Preview

- admin preview memakai snapshot yang benar;
- public demo memakai published version;
- archived theme tetap dapat dipreview admin;
- invitation existing tetap dapat dirender.

### Visual

- mobile portrait;
- desktop container;
- typography;
- loading state;
- image loading;
- animation;
- reduced-motion;
- music control.

---

## 31. Performance Guidelines

Prioritas:

```text
mobile performance
first contentful paint
image optimization
limited JS payload
lazy loading
```

Renderer dapat memakai `next/dynamic` untuk menghindari bundle besar ketika registry memuat banyak theme.

Hindari:

```text
large unoptimized images
heavy client-only effects on first paint
unnecessary third-party scripts
```

---

## 32. New Theme Acceptance Criteria

Theme baru dianggap siap production bila:

```text
[ ] component_key terdaftar
[ ] renderer dapat dirender
[ ] default palette tersedia
[ ] field schema tersedia
[ ] responsive mobile
[ ] desktop graceful
[ ] preview admin bekerja
[ ] public demo bekerja
[ ] draft dapat dibuat
[ ] publish bekerja
[ ] rollback bekerja
[ ] invitation baru dapat menggunakan theme
[ ] invitation lama tidak rusak
[ ] required fields tervalidasi
[ ] RLS tetap benar
[ ] build/typecheck lulus
```

---

## 33. Golden Rule

**Database mendefinisikan variant dan version. Registry menyediakan renderer. Invitation menyimpan version yang dipakai.**

Jangan membuat shortcut seperti:

```text
invitation.theme_slug → langsung import component
```

Gunakan:

```text
Invitation
  ↓
theme_id + theme_version_id
  ↓
resolveThemeConfig()
  ↓
ThemeRenderer
  ↓
React Theme Component
```

Dengan arsitektur ini, NikahLink dapat menambah variant tema tanpa menambah renderer baru, mengubah desain tema melalui versioned snapshot, melakukan publish/rollback dengan aman, dan menjaga undangan lama tetap stabil.