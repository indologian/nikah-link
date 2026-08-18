# Graph Report - undangan-pernikahan  (2026-08-18)

## Corpus Check
- 89 files · ~44,227 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 479 nodes · 689 edges · 57 communities (20 shown, 37 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `41d42c9f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- app/page.tsx
- createClient
- schema.sql
- 💍 NikahLink — Platform Undangan Pernikahan Digital Premium
- index.ts
- compilerOptions
- DashboardClient.tsx
- devDependencies
- A. Marketing Website (Landing Page)
- dependencies
- Project Instructions
- app/layout.tsx
- proxy.ts
- refactor_admin.js
- fix_buttons.js
- README.md
- refactor.js
- admin/page.tsx
- notification/route.ts
- SettingsClient.tsx
- csv-parse
- date-fns
- eslint.config.mjs
- exceljs
- framer-motion
- @hookform/resolvers
- lucide-react
- midtrans-client
- next
- next.config.ts
- next-themes
- papaparse
- qrcode
- @radix-ui/react-accordion
- @radix-ui/react-progress
- @radix-ui/react-tabs
- @radix-ui/react-toast
- react
- react-dom
- react-hook-form
- react-hot-toast
- recharts
- resend
- sharp
- sonner
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- @types/papaparse
- @types/qrcode
- zod
- postcss.config.mjs
- class-variance-authority

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 36 edges
2. `createClient()` - 33 edges
3. `cn()` - 16 edges
4. `compilerOptions` - 16 edges
5. `A. Marketing Website (Landing Page)` - 14 edges
6. `💍 NikahLink — Platform Undangan Pernikahan Digital Premium` - 13 edges
7. `invitations` - 11 edges
8. `Navbar()` - 7 edges
9. `Pagination()` - 7 edges
10. `include` - 7 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/settings/page.tsx → lib/supabase/server.ts
- `EditInvitationPage()` --calls--> `createClient()`  [EXTRACTED]
  app/dashboard/undangan/[id]/edit/page.tsx → lib/supabase/client.ts
- `HomePage()` --calls--> `createClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `generateMetadata()` --calls--> `createClient()`  [EXTRACTED]
  app/[username]/page.tsx → lib/supabase/server.ts
- `PublicInvitationPage()` --calls--> `createClient()`  [EXTRACTED]
  app/[username]/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (57 total, 37 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.07
Nodes (31): submitLead(), LeadsClient(), LeadsPage(), metadata, DELETE(), PLAN_PRICES, POST(), GET() (+23 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.07
Nodes (26): Window, HomePage(), metadata, ECO_STATS, EcoImpact(), FAQS, FaqSection(), FEATURES (+18 more)

### Community 2 - "createClient"
Cohesion: 0.06
Nodes (31): InvitationsClient(), dynamic, Lead, dynamic, UsersClient(), BENEFITS, RegisterPage(), LoginPage() (+23 more)

### Community 3 - "schema.sql"
Cohesion: 0.22
Nodes (18): auth, auth.users, blog_posts, gallery, gift_accounts, gift_transactions, guests, handle_new_user() (+10 more)

### Community 4 - "💍 NikahLink — Platform Undangan Pernikahan Digital Premium"
Cohesion: 0.06
Nodes (30): 1. Wevitation (wevitation.com), 2. Link Undangan (linkundangan.com), 3. Our Wedding Link (our-wedding.link), 4. WebNikah (webnikah.com), 5. Inveet.id (inveet.id), 📊 Analisis Website Kompetitor, 🏗️ Arsitektur & Teknologi, Build Check (+22 more)

### Community 5 - "index.ts"
Cohesion: 0.08
Nodes (21): dynamic, ThemesClient(), GuestManagementPage(), AlertModal(), AlertModalProps, BlogPost, DashboardStats, GalleryItem (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "DashboardClient.tsx"
Cohesion: 0.09
Nodes (23): DashboardClient(), Props, QUICK_ACTIONS, DEFAULT_FORM_DATA, NewInvitationPage(), STEPS, EditInvitationPage(), STEPS (+15 more)

### Community 8 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 9 - "A. Marketing Website (Landing Page)"
Cohesion: 0.08
Nodes (25): 10. Testimoni, 11. Blog / Inspirasi Nikah, 12. FAQ, 13. Footer, 1. Navbar, 2. Hero Section, 3. Value Proposition (Kenapa NikahLink?), 4. Demo Carousel Tema (+17 more)

### Community 10 - "dependencies"
Cohesion: 0.22
Nodes (9): clsx, dependencies, clsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, xlsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu (+1 more)

### Community 11 - "Project Instructions"
Cohesion: 0.25
Nodes (7): Design System, Development Rules, Project Instructions, Stack, This is NOT the Next.js you know, UI Rules, Workflow

### Community 12 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, viewport, ThemeProvider()

### Community 13 - "proxy.ts"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 14 - "refactor_admin.js"
Cohesion: 0.50
Nodes (4): fs, path, refactorAdmin(), walkDir()

### Community 16 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 22 - "SettingsClient.tsx"
Cohesion: 0.33
Nodes (5): metadata, SettingsPage(), SECTION_NAMES, SettingsClient(), SettingsClientProps

## Knowledge Gaps
- **207 isolated node(s):** `Props`, `Props`, `dynamic`, `Lead`, `metadata` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `createClient`, `index.ts`, `SettingsClient.tsx`, `DashboardClient.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `app/page.tsx`, `SettingsClient.tsx`, `DashboardClient.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`, `csv-parse`, `date-fns`, `exceljs`, `framer-motion`, `@hookform/resolvers`, `lucide-react`, `midtrans-client`, `next`, `next-themes`, `papaparse`, `qrcode`, `@radix-ui/react-accordion`, `@radix-ui/react-progress`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `react`, `react-dom`, `react-hook-form`, `react-hot-toast`, `recharts`, `resend`, `sharp`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `tailwind-merge`, `@types/papaparse`, `@types/qrcode`, `zod`, `class-variance-authority`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `dynamic` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06857142857142857 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.061343204653622425 - nodes in this community are weakly interconnected._