# Graph Report - undangan-pernikahan  (2026-08-18)

## Corpus Check
- 19 files · ~82,279 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 645 nodes · 935 edges · 86 communities (43 shown, 43 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- API Routes & Admin
- Admin Dashboard & Themes
- Implementation Plans
- OpenCode Configuration
- TypeScript References
- Package Dependencies
- Landing Page
- Admin Invitations & Leads
- Auth & Database Schema
- Admin Settings & Auth
- Vendor Preview & Utils
- Pricing & Theme Pages
- Traditional Indonesian Themes
- Invitation Builder
- Admin Layout & Auth
- AI Agent Configuration
- Graphify Skill Docs
- Root Layout & Typography
- Graphify Extraction Docs
- Radix UI & CVA
- Vendor Page & Navigation
- Extraction Spec
- Magazine Cover Theme
- Pricing Section
- Balinese Harmony Theme
- Line Art Botanical Theme
- Royal Gold Theme
- Query Script
- Reset Themes Script
- Check Themes Script
- Seed Themes Script
- Graph Query Concepts
- Update & Merge Concepts
- Export Concepts
- Supabase Middleware
- Refactor Admin Script
- Elegant Blush Theme
- Midnight Sparkle Theme
- Royal Botanical Theme
- Serein White Theme
- Vintage Elegance Theme
- Fix Buttons Script
- Refactor Script
- Admin Dashboard
- Payment Webhook
- Graphify Plugin
- clsx
- csv-parse
- date-fns
- ESLint Config
- ExcelJS
- Framer Motion
- Hookform Resolvers
- Lucide React
- Midtrans Client
- Next.js
- Next Config
- Next Themes
- PapaParse
- QRCode
- Radix Accordion
- Radix Progress
- Radix Tabs
- Radix Toast
- React
- React DOM
- React Hook Form
- React Hot Toast
- Recharts
- Resend
- Sharp
- Sonner
- Supabase SSR
- Supabase JS
- Tailwind Merge
- Types PapaParse
- Types QRCode
- Zod
- PostCSS Config
- Cross-Repo Merge
- File SVG
- Globe SVG
- Window SVG
- Project README

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 55 edges
2. `createClient()` - 40 edges
3. `NikahLink Platform` - 29 edges
4. `Graphify Skill (Main)` - 23 edges
5. `cn()` - 16 edges
6. `compilerOptions` - 16 edges
7. `invitations` - 11 edges
8. `getThemeConfig()` - 10 edges
9. `Extraction Spec` - 8 edges
10. `Navbar()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/next.svg → implementation.md
- `Vercel Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/vercel.svg → implementation.md
- `LeadsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/leads/page.tsx → lib/supabase/server.ts
- `HomePage()` --calls--> `createClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `TemaPage()` --calls--> `createClient()`  [EXTRACTED]
  app/tema/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Extraction Pipeline (Step 3)** — detection_concept, ast_extraction_concept, semantic_extraction_concept, extraction_merge_concept, extraction_cache_concept, transcription_concept [EXTRACTED 1.00]
- **Graph Outputs** — html_visualization_concept, graph_report_concept, wiki_export_concept, neo4j_export_concept, falkordb_export_concept, mcp_server_concept [EXTRACTED 1.00]
- **Query System** — claude_skills_graphify_references_query_expansion_concept, bfs_traversal_concept, path_finding_concept, explain_concept [EXTRACTED 1.00]
- **Initial Theme Set (8 previewed themes)** — implementation_theme_sakura_bloom, implementation_theme_midnight_luxe, implementation_theme_javanese_heritage, implementation_theme_minimalist_clean, implementation_theme_tropical_garden, implementation_theme_golden_arch, implementation_theme_rustic_charm, implementation_theme_royal_blue [EXTRACTED 1.00]
- **Theme Concept to Preview SVG Pairing** — implementation_theme_sakura_bloom, public_images_themes_sakura_bloom_svg, implementation_theme_midnight_luxe, public_images_themes_midnight_luxe_svg, implementation_theme_javanese_heritage, public_images_themes_javanese_heritage_svg, implementation_theme_minimalist_clean, public_images_themes_minimalist_clean_svg, implementation_theme_tropical_garden, public_images_themes_tropical_garden_svg, implementation_theme_golden_arch, public_images_themes_golden_arch_svg, implementation_theme_rustic_charm, public_images_themes_rustic_charm_svg, implementation_theme_royal_blue, public_images_themes_royal_blue_svg [EXTRACTED 1.00]
- **Core Platform Features** — implementation_invitation_builder, implementation_rsvp_feature, implementation_kado_cashless, implementation_analytics_feature, implementation_guest_management, implementation_marketplace_vendor [INFERRED 0.85]

## Communities (86 total, 43 thin omitted)

### Community 0 - "API Routes & Admin"
Cohesion: 0.07
Nodes (30): submitLead(), metadata, SettingsPage(), DELETE(), PLAN_PRICES, POST(), GET(), AnalyticsPage() (+22 more)

### Community 1 - "Admin Dashboard & Themes"
Cohesion: 0.05
Nodes (34): dynamic, ThemesClient(), DashboardClient(), Props, QUICK_ACTIONS, GuestManagementPage(), MyInvitationsPage(), AlertModal() (+26 more)

### Community 2 - "Implementation Plans"
Cohesion: 0.06
Nodes (41): Analytics Feature, Competitor Analysis, Database Schema (Supabase), Design System, Guest Management Feature, NikahLink Implementation Plan, Inveet.id, Invitation Builder Feature (+33 more)

### Community 3 - "OpenCode Configuration"
Cohesion: 0.05
Nodes (35): name, name, name, name, .opencode/plugins/graphify.js, auto, auto/cheap, auto/coding (+27 more)

### Community 4 - "TypeScript References"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "Package Dependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "Landing Page"
Cohesion: 0.11
Nodes (15): HomePage(), ECO_STATS, EcoImpact(), FAQS, FaqSection(), FEATURES, FeaturesSection(), HeroSection() (+7 more)

### Community 7 - "Admin Invitations & Leads"
Cohesion: 0.12
Nodes (11): InvitationsClient(), dynamic, Lead, LeadsClient(), LeadsPage(), metadata, dynamic, UsersClient() (+3 more)

### Community 8 - "Auth & Database Schema"
Cohesion: 0.22
Nodes (18): auth, auth.users, blog_posts, gallery, gift_accounts, gift_transactions, guests, handle_new_user() (+10 more)

### Community 9 - "Admin Settings & Auth"
Cohesion: 0.18
Nodes (12): SECTION_NAMES, SettingsClient(), SettingsClientProps, BENEFITS, RegisterPage(), DeleteButton(), MinimalistTheme(), Props (+4 more)

### Community 10 - "Vendor Preview & Utils"
Cohesion: 0.14
Nodes (6): FEATURED_VENDORS, VENDOR_CATEGORIES, VendorPreview(), formatRupiah, SUPABASE_ANON_KEY, SUPABASE_URL

### Community 11 - "Pricing & Theme Pages"
Cohesion: 0.17
Nodes (9): Window, metadata, TemaPage(), Footer(), DEFAULT_CATEGORIES, ThemeCarousel(), ThemeProps, IS_PRODUCTION (+1 more)

### Community 12 - "Traditional Indonesian Themes"
Cohesion: 0.15
Nodes (12): greatVibes, JavaneseBatikTheme(), Props, ptSerif, Props, WayangClassicTheme(), FieldType, JavaneseBatikTheme (+4 more)

### Community 13 - "Invitation Builder"
Cohesion: 0.23
Nodes (9): DEFAULT_FORM_DATA, NewInvitationPage(), STEPS, EditInvitationPage(), STEPS, LocationAutocomplete(), TimeRangePicker(), FallbackTheme() (+1 more)

### Community 14 - "Admin Layout & Auth"
Cohesion: 0.21
Nodes (6): LoginPage(), AdminSidebar(), NAV_ITEMS, NAV_ITEMS, Sidebar(), ThemeToggle()

### Community 15 - "AI Agent Configuration"
Cohesion: 0.20
Nodes (11): Claude CLAUDE.md (root), Claude CLAUDE.md Integration, Hooks Reference, Design Philosophy, GitHub Copilot Instructions, Graphify Pipeline, Hallmark Skill, Hook Install (+3 more)

### Community 16 - "Graphify Skill Docs"
Cohesion: 0.24
Nodes (11): Claude Project Config, Graphify Skill (Main), Community Detection, Community Labeling, Cost Tracking, Extraction Cache, God Nodes, GRAPH_REPORT.md (+3 more)

### Community 17 - "Root Layout & Typography"
Cohesion: 0.22
Nodes (7): cormorant, greatVibes, jakarta, metadata, playfair, viewport, ThemeProvider()

### Community 18 - "Graphify Extraction Docs"
Cohesion: 0.31
Nodes (9): AST Extraction, Add and Watch Reference, Transcribe Reference, File Detection, Extraction Merge, URL Ingestion, Semantic Extraction, Video/Audio Transcription (+1 more)

### Community 19 - "Radix UI & CVA"
Cohesion: 0.22
Nodes (9): class-variance-authority, dependencies, class-variance-authority, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, xlsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu (+1 more)

### Community 20 - "Vendor Page & Navigation"
Cohesion: 0.39
Nodes (6): CATEGORIES, SAMPLE_VENDORS, VendorPage(), DEFAULT_NAV_ITEMS, Navbar(), cn()

### Community 21 - "Extraction Spec"
Cohesion: 0.25
Nodes (8): Extraction Spec, Confidence Rubric, Extraction Subagent Prompt, Frontmatter Schema, Hyperedges, Node ID Format, Semantic Similarity Edges, Structural Extraction

### Community 22 - "Magazine Cover Theme"
Cohesion: 0.29
Nodes (6): lora, MagazineCoverTheme(), montserrat, oswald, Props, MagazineCoverTheme

### Community 23 - "Pricing Section"
Cohesion: 0.33
Nodes (5): Plan, PlanFeature, PLANS, PricingSection(), PricingSectionProps

### Community 24 - "Balinese Harmony Theme"
Cohesion: 0.33
Nodes (5): BalineseHarmonyTheme(), cormorant, playfair, Props, BalineseHarmonyTheme

### Community 25 - "Line Art Botanical Theme"
Cohesion: 0.33
Nodes (5): italiana, lato, LineArtBotanicalTheme(), Props, LineArtBotanicalTheme

### Community 26 - "Royal Gold Theme"
Cohesion: 0.33
Nodes (5): cinzel, montserrat, Props, RoyalGoldTheme(), RoyalGoldTheme

### Community 27 - "Query Script"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 28 - "Reset Themes Script"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 29 - "Check Themes Script"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 30 - "Seed Themes Script"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 31 - "Graph Query Concepts"
Cohesion: 0.50
Nodes (5): BFS Traversal, Query Expansion, Query Reference, Explain Node, Path Finding

### Community 32 - "Update & Merge Concepts"
Cohesion: 0.50
Nodes (5): Build Merge, Update Reference, Cluster Only, Incremental Update, Manifest

### Community 33 - "Export Concepts"
Cohesion: 0.50
Nodes (5): Exports Reference, FalkorDB Export, MCP Server, Neo4j Export, Wiki Export

### Community 34 - "Supabase Middleware"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 35 - "Refactor Admin Script"
Cohesion: 0.50
Nodes (4): fs, path, refactorAdmin(), walkDir()

### Community 36 - "Elegant Blush Theme"
Cohesion: 0.50
Nodes (3): ElegantBlushTheme(), Props, ElegantBlushTheme

### Community 37 - "Midnight Sparkle Theme"
Cohesion: 0.50
Nodes (3): MidnightSparkleTheme(), Props, MidnightSparkleTheme

### Community 38 - "Royal Botanical Theme"
Cohesion: 0.50
Nodes (3): Props, RoyalBotanicalTheme(), RoyalBotanicalTheme

### Community 39 - "Serein White Theme"
Cohesion: 0.50
Nodes (3): Props, SereinWhiteTheme(), SereinWhiteTheme

### Community 40 - "Vintage Elegance Theme"
Cohesion: 0.50
Nodes (3): Props, VintageEleganceTheme(), VintageEleganceTheme

## Knowledge Gaps
- **262 isolated node(s):** `GiftAccount`, `GiftClientProps`, `Invitation`, `Plan`, `Props` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Admin Settings & Auth` to `API Routes & Admin`, `Admin Dashboard & Themes`, `Elegant Blush Theme`, `Midnight Sparkle Theme`, `Royal Botanical Theme`, `Admin Invitations & Leads`, `Serein White Theme`, `Vintage Elegance Theme`, `Traditional Indonesian Themes`, `Invitation Builder`, `Admin Layout & Auth`, `Vendor Page & Navigation`, `Magazine Cover Theme`, `Balinese Harmony Theme`, `Line Art Botanical Theme`, `Royal Gold Theme`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `createClient()` connect `API Routes & Admin` to `Admin Dashboard & Themes`, `Pricing & Theme Pages`, `Landing Page`, `Admin Invitations & Leads`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Radix UI & CVA` to `Package Dependencies`, `clsx`, `csv-parse`, `date-fns`, `ExcelJS`, `Framer Motion`, `Hookform Resolvers`, `Lucide React`, `Midtrans Client`, `Next.js`, `Next Themes`, `PapaParse`, `QRCode`, `Radix Accordion`, `Radix Progress`, `Radix Tabs`, `Radix Toast`, `React`, `React DOM`, `React Hook Form`, `React Hot Toast`, `Recharts`, `Resend`, `Sharp`, `Sonner`, `Supabase SSR`, `Supabase JS`, `Tailwind Merge`, `Types PapaParse`, `Types QRCode`, `Zod`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `NikahLink Platform` (e.g. with `Inveet.id` and `Link Undangan`) actually correct?**
  _`NikahLink Platform` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `GiftAccount`, `GiftClientProps`, `Invitation` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Routes & Admin` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Admin Dashboard & Themes` be split into smaller, more focused modules?**
  _Cohesion score 0.05357142857142857 - nodes in this community are weakly interconnected._