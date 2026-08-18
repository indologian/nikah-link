# Graph Report - undangan-pernikahan  (2026-08-18)

## Corpus Check
- 89 files · ~44,227 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 460 nodes · 652 edges · 56 communities (19 shown, 37 thin omitted)
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
- utils.ts
- 💍 NikahLink — Platform Undangan Pernikahan Digital Premium
- index.ts
- compilerOptions
- baru/page.tsx
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
- clsx
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

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 36 edges
2. `createClient()` - 33 edges
3. `cn()` - 16 edges
4. `compilerOptions` - 16 edges
5. `A. Marketing Website (Landing Page)` - 14 edges
6. `💍 NikahLink — Platform Undangan Pernikahan Digital Premium` - 13 edges
7. `Navbar()` - 7 edges
8. `Pagination()` - 7 edges
9. `include` - 7 edges
10. `B. Dashboard (Setelah Login)` - 7 edges

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

## Communities (56 total, 37 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.08
Nodes (28): submitLead(), LeadsPage(), metadata, DELETE(), PLAN_PRICES, POST(), GET(), AnalyticsPage() (+20 more)

### Community 1 - "app/page.tsx"
Cohesion: 0.06
Nodes (28): Window, HomePage(), metadata, ECO_STATS, EcoImpact(), FAQS, FaqSection(), FEATURES (+20 more)

### Community 2 - "createClient"
Cohesion: 0.09
Nodes (23): InvitationsClient(), dynamic, Lead, LeadsClient(), dynamic, UsersClient(), BENEFITS, RegisterPage() (+15 more)

### Community 3 - "utils.ts"
Cohesion: 0.08
Nodes (20): DashboardClient(), Props, QUICK_ACTIONS, MyInvitationsPage(), CATEGORIES, SAMPLE_VENDORS, VendorPage(), CountdownLabel() (+12 more)

### Community 4 - "💍 NikahLink — Platform Undangan Pernikahan Digital Premium"
Cohesion: 0.06
Nodes (30): 1. Wevitation (wevitation.com), 2. Link Undangan (linkundangan.com), 3. Our Wedding Link (our-wedding.link), 4. WebNikah (webnikah.com), 5. Inveet.id (inveet.id), 📊 Analisis Website Kompetitor, 🏗️ Arsitektur & Teknologi, Build Check (+22 more)

### Community 5 - "index.ts"
Cohesion: 0.08
Nodes (21): dynamic, ThemesClient(), GuestManagementPage(), AlertModal(), AlertModalProps, BlogPost, DashboardStats, GalleryItem (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "baru/page.tsx"
Cohesion: 0.11
Nodes (17): metadata, SettingsPage(), SECTION_NAMES, SettingsClient(), SettingsClientProps, DEFAULT_FORM_DATA, NewInvitationPage(), STEPS (+9 more)

### Community 8 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 9 - "A. Marketing Website (Landing Page)"
Cohesion: 0.08
Nodes (25): 10. Testimoni, 11. Blog / Inspirasi Nikah, 12. FAQ, 13. Footer, 1. Navbar, 2. Hero Section, 3. Value Proposition (Kenapa NikahLink?), 4. Demo Carousel Tema (+17 more)

### Community 10 - "dependencies"
Cohesion: 0.22
Nodes (9): class-variance-authority, dependencies, class-variance-authority, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, xlsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu (+1 more)

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

## Knowledge Gaps
- **207 isolated node(s):** `Props`, `Props`, `dynamic`, `Lead`, `metadata` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `createClient`, `utils.ts`, `index.ts`, `baru/page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `app/page.tsx`, `utils.ts`, `baru/page.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`, `clsx`, `csv-parse`, `date-fns`, `exceljs`, `framer-motion`, `@hookform/resolvers`, `lucide-react`, `midtrans-client`, `next`, `next-themes`, `papaparse`, `qrcode`, `@radix-ui/react-accordion`, `@radix-ui/react-progress`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `react`, `react-dom`, `react-hook-form`, `react-hot-toast`, `recharts`, `resend`, `sharp`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `tailwind-merge`, `@types/papaparse`, `@types/qrcode`, `zod`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `dynamic` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.07632850241545894 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06161616161616162 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.09080841638981174 - nodes in this community are weakly interconnected._