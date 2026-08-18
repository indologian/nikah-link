# Graph Report - undangan-pernikahan  (2026-08-18)

## Corpus Check
- 119 files · ~70,329 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 609 nodes · 857 edges · 95 communities (38 shown, 57 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 94

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 55 edges
2. `createClient()` - 40 edges
3. `cn()` - 16 edges
4. `compilerOptions` - 16 edges
5. `A. Marketing Website (Landing Page)` - 14 edges
6. `💍 NikahLink — Platform Undangan Pernikahan Digital Premium` - 13 edges
7. `invitations` - 11 edges
8. `getThemeConfig()` - 10 edges
9. `B. Dashboard (Setelah Login)` - 7 edges
10. `Navbar()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Next.js` --semantically_similar_to--> `Next.js 14`  [INFERRED] [semantically similar]
  AGENTS.md → implementation.md
- `LeadsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/leads/page.tsx → lib/supabase/server.ts
- `LoginPage()` --calls--> `createClient()`  [EXTRACTED]
  app/masuk/page.tsx → lib/supabase/client.ts
- `HomePage()` --calls--> `createClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `TemaPage()` --calls--> `createClient()`  [EXTRACTED]
  app/tema/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Sakura Bloom Visual Components** — public_images_themes_sakura_bloom_gradient_bg, public_images_themes_sakura_bloom_gradient_glow, public_images_themes_sakura_bloom_text [INFERRED 0.85]
- **NikahLink Competitors** — implementation_wevitation, implementation_link_undangan, implementation_our_wedding_link, implementation_webnikah, implementation_inveet_id [INFERRED 0.95]

## Communities (95 total, 57 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (32): InvitationsClient(), dynamic, Lead, LeadsClient(), LeadsPage(), metadata, dynamic, ThemesClient() (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (31): metadata, SettingsPage(), SECTION_NAMES, SettingsClient(), SettingsClientProps, DELETE(), GET(), AnalyticsPage() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): DashboardClient(), Props, QUICK_ACTIONS, DEFAULT_FORM_DATA, NewInvitationPage(), STEPS, STEPS, MyInvitationsPage() (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (30): 1. Wevitation (wevitation.com), 2. Link Undangan (linkundangan.com), 3. Our Wedding Link (our-wedding.link), 4. WebNikah (webnikah.com), 5. Inveet.id (inveet.id), 📊 Analisis Website Kompetitor, 🏗️ Arsitektur & Teknologi, Build Check (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): 10. Testimoni, 11. Blog / Inspirasi Nikah, 12. FAQ, 13. Footer, 1. Navbar, 2. Hero Section, 3. Value Proposition (Kenapa NikahLink?), 4. Demo Carousel Tema (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (18): auth, auth.users, blog_posts, gallery, gift_accounts, gift_transactions, guests, handle_new_user() (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): MidnightSparkleTheme(), Props, MinimalistTheme(), Props, Props, SereinWhiteTheme(), FieldType, MidnightSparkleTheme (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (9): LoginPage(), AdminSidebar(), NAV_ITEMS, NAV_ITEMS, Sidebar(), DEFAULT_NAV_ITEMS, Navbar(), ThemeToggle() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (11): HomePage(), ECO_STATS, EcoImpact(), FAQS, FaqSection(), FEATURES, FeaturesSection(), HowItWorks() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.16
Nodes (11): PLAN_PRICES, POST(), Window, Plan, PlanFeature, PLANS, PricingSection(), PricingSectionProps (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (11): BENEFITS, RegisterPage(), Props, RoyalBotanicalTheme(), Props, VintageEleganceTheme(), Props, WayangClassicTheme() (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (7): cormorant, greatVibes, jakarta, metadata, playfair, viewport, ThemeProvider()

### Community 15 - "Community 15"
Cohesion: 0.22
Nodes (9): Next.js, Inveet.id, Link Undangan, Next.js 14, NikahLink, Our Wedding Link, Supabase, WebNikah (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.28
Nodes (6): metadata, TemaPage(), Footer(), DEFAULT_CATEGORIES, ThemeCarousel(), ThemeProps

### Community 17 - "Community 17"
Cohesion: 0.28
Nodes (7): CATEGORIES, SAMPLE_VENDORS, VendorPage(), FEATURED_VENDORS, VENDOR_CATEGORIES, VendorPreview(), formatRupiah

### Community 18 - "Community 18"
Cohesion: 0.22
Nodes (9): class-variance-authority, dependencies, class-variance-authority, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, xlsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): Design System, Development Rules, Project Instructions, Stack, This is NOT the Next.js you know, UI Rules, Workflow

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (6): lora, MagazineCoverTheme(), montserrat, oswald, Props, MagazineCoverTheme

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (5): BalineseHarmonyTheme(), cormorant, playfair, Props, BalineseHarmonyTheme

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (5): greatVibes, JavaneseBatikTheme(), Props, ptSerif, JavaneseBatikTheme

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (5): italiana, lato, LineArtBotanicalTheme(), Props, LineArtBotanicalTheme

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (5): cinzel, montserrat, Props, RoyalGoldTheme(), RoyalGoldTheme

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 27 - "Community 27"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 29 - "Community 29"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (4): fs, path, refactorAdmin(), walkDir()

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (3): ElegantBlushTheme(), Props, ElegantBlushTheme

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (4): Linear Gradient Background (#bg), Radial Gradient Glow (#glow), Typography 'Sakura Bloom', Sakura Bloom Theme Image

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 41 - "Community 41"
Cohesion: 1.00
Nodes (3): Royal Blue Theme Graphic, Royal Blue, Wedding Theme

## Knowledge Gaps
- **283 isolated node(s):** `Design System`, `Development Rules`, `Stack`, `This is NOT the Next.js you know`, `UI Rules` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 12` to `Community 0`, `Community 1`, `Community 2`, `Community 33`, `Community 8`, `Community 9`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 1` to `Community 0`, `Community 2`, `Community 10`, `Community 11`, `Community 16`, `Community 31`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 18` to `Community 5`, `Community 44`, `Community 45`, `Community 46`, `Community 48`, `Community 49`, `Community 50`, `Community 51`, `Community 52`, `Community 53`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 59`, `Community 60`, `Community 61`, `Community 62`, `Community 63`, `Community 64`, `Community 65`, `Community 66`, `Community 67`, `Community 68`, `Community 69`, `Community 70`, `Community 71`, `Community 72`, `Community 73`, `Community 74`, `Community 75`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `Design System`, `Development Rules`, `Stack` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05061224489795919 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07092198581560284 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._