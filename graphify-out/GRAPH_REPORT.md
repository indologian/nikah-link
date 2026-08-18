# Graph Report - undangan-pernikahan  (2026-08-18)

## Corpus Check
- 126 files · ~89,840 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 674 nodes · 974 edges · 96 communities (49 shown, 47 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ad4af23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- index.ts
- NikahLink Platform
- models
- compilerOptions
- devDependencies
- app/page.tsx
- Pagination.tsx
- schema.sql
- registry.tsx
- utils.ts
- harga/page.tsx
- JavaneseBatikTheme.tsx
- baru/page.tsx
- client.ts
- AGENTS.md
- Graphify Skill (Main)
- app/layout.tsx
- Semantic Extraction
- dependencies
- vendor/page.tsx
- Extraction Spec
- MagazineCoverTheme.tsx
- models
- BalineseHarmonyTheme.tsx
- LineArtBotanicalTheme.tsx
- RoyalGoldTheme.tsx
- query.mjs
- reset-themes.mjs
- check-themes.mjs
- seed-premium-themes.mjs
- Query Reference
- Update Reference
- Exports Reference
- proxy.ts
- refactor_admin.js
- ElegantBlushTheme.tsx
- Wedding Invitation Theme Research & Analysis
- createClient
- DashboardClient.tsx
- tamu/page.tsx
- fix_buttons.js
- refactor.js
- admin/page.tsx
- notification/route.ts
- graphify.js
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
- Cross-Repo Merge
- File Icon SVG
- Globe Icon SVG
- Window Icon SVG
- NikahLink README
- leads/page.tsx
- ThemesClient.tsx
- UsersClient.tsx
- ModernMonochromeTheme.tsx
- OceanBreezeTheme.tsx
- RusticWoodlandTheme.tsx
- HeroSection.tsx
- ThemeCarousel.tsx
- FaqSection.tsx
- TestimonialSection.tsx

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 61 edges
2. `createClient()` - 40 edges
3. `NikahLink Platform` - 29 edges
4. `Graphify Skill (Main)` - 23 edges
5. `cn()` - 16 edges
6. `compilerOptions` - 16 edges
7. `invitations` - 11 edges
8. `getThemeConfig()` - 10 edges
9. `Wedding Invitation Theme Research & Analysis` - 9 edges
10. `Extraction Spec` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/next.svg → implementation.md
- `Vercel Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/vercel.svg → implementation.md
- `LeadsPage()` --calls--> `createClient()`  [EXTRACTED]
  app/admin/leads/page.tsx → lib/supabase/server.ts
- `RegisterPage()` --calls--> `createClient()`  [EXTRACTED]
  app/daftar/page.tsx → lib/supabase/client.ts
- `LoginPage()` --calls--> `createClient()`  [EXTRACTED]
  app/masuk/page.tsx → lib/supabase/client.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Extraction Pipeline (Step 3)** — detection_concept, ast_extraction_concept, semantic_extraction_concept, extraction_merge_concept, extraction_cache_concept, transcription_concept [EXTRACTED 1.00]
- **Graph Outputs** — html_visualization_concept, graph_report_concept, wiki_export_concept, neo4j_export_concept, falkordb_export_concept, mcp_server_concept [EXTRACTED 1.00]
- **Initial Theme Set (8 previewed themes)** — implementation_theme_sakura_bloom, implementation_theme_midnight_luxe, implementation_theme_javanese_heritage, implementation_theme_minimalist_clean, implementation_theme_tropical_garden, implementation_theme_golden_arch, implementation_theme_rustic_charm, implementation_theme_royal_blue [EXTRACTED 1.00]
- **Query System** — claude_skills_graphify_references_query_expansion_concept, bfs_traversal_concept, path_finding_concept, explain_concept [EXTRACTED 1.00]
- **Theme Concept to Preview SVG Pairing** — implementation_theme_sakura_bloom, public_images_themes_sakura_bloom_svg, implementation_theme_midnight_luxe, public_images_themes_midnight_luxe_svg, implementation_theme_javanese_heritage, public_images_themes_javanese_heritage_svg, implementation_theme_minimalist_clean, public_images_themes_minimalist_clean_svg, implementation_theme_tropical_garden, public_images_themes_tropical_garden_svg, implementation_theme_golden_arch, public_images_themes_golden_arch_svg, implementation_theme_rustic_charm, public_images_themes_rustic_charm_svg, implementation_theme_royal_blue, public_images_themes_royal_blue_svg [EXTRACTED 1.00]
- **Core Platform Features** — implementation_invitation_builder, implementation_rsvp_feature, implementation_kado_cashless, implementation_analytics_feature, implementation_guest_management, implementation_marketplace_vendor [INFERRED 0.85]

## Communities (96 total, 47 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.06
Nodes (35): submitLead(), metadata, SettingsPage(), SECTION_NAMES, SettingsClient(), SettingsClientProps, DELETE(), PLAN_PRICES (+27 more)

### Community 1 - "index.ts"
Cohesion: 0.13
Nodes (14): BlogPost, DashboardStats, GalleryItem, GiftAccount, GiftAccountType, GiftTransaction, InvitationStatus, Plan (+6 more)

### Community 2 - "NikahLink Platform"
Cohesion: 0.06
Nodes (41): Analytics Feature, Competitor Analysis, Database Schema (Supabase), Design System, Guest Management Feature, NikahLink Implementation Plan, Inveet.id, Invitation Builder Feature (+33 more)

### Community 3 - "models"
Cohesion: 0.11
Nodes (18): name, name, name, name, .opencode/plugins/graphify.js, auto, auto/cheap, auto/coding (+10 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+17 more)

### Community 6 - "app/page.tsx"
Cohesion: 0.17
Nodes (10): HomePage(), ECO_STATS, EcoImpact(), FEATURES, FeaturesSection(), Footer(), HowItWorks(), STEPS (+2 more)

### Community 7 - "Pagination.tsx"
Cohesion: 0.28
Nodes (4): InvitationsClient(), dynamic, Pagination(), PaginationProps

### Community 8 - "schema.sql"
Cohesion: 0.22
Nodes (18): auth, auth.users, blog_posts, gallery, gift_accounts, gift_transactions, guests, handle_new_user() (+10 more)

### Community 9 - "registry.tsx"
Cohesion: 0.13
Nodes (14): MidnightSparkleTheme(), Props, MinimalistTheme(), Props, Props, VintageEleganceTheme(), FieldType, MidnightSparkleTheme (+6 more)

### Community 11 - "harga/page.tsx"
Cohesion: 0.20
Nodes (8): Window, Plan, PlanFeature, PLANS, PricingSection(), PricingSectionProps, IS_PRODUCTION, SNAP_URL

### Community 12 - "JavaneseBatikTheme.tsx"
Cohesion: 0.33
Nodes (5): greatVibes, JavaneseBatikTheme(), Props, ptSerif, JavaneseBatikTheme

### Community 13 - "baru/page.tsx"
Cohesion: 0.11
Nodes (20): DEFAULT_FORM_DATA, NewInvitationPage(), STEPS, EditInvitationPage(), STEPS, MyInvitationsPage(), CountdownLabel(), Props (+12 more)

### Community 14 - "client.ts"
Cohesion: 0.17
Nodes (11): BENEFITS, RegisterPage(), LoginPage(), AdminSidebar(), NAV_ITEMS, NAV_ITEMS, Sidebar(), DEFAULT_NAV_ITEMS (+3 more)

### Community 15 - "AGENTS.md"
Cohesion: 0.20
Nodes (11): Claude CLAUDE.md (root), Claude CLAUDE.md Integration, Hooks Reference, Design Philosophy, GitHub Copilot Instructions, Graphify Pipeline, Hallmark Skill, Hook Install (+3 more)

### Community 16 - "Graphify Skill (Main)"
Cohesion: 0.24
Nodes (11): Claude Project Config, Graphify Skill (Main), Community Detection, Community Labeling, Cost Tracking, Extraction Cache, God Nodes, GRAPH_REPORT.md (+3 more)

### Community 17 - "app/layout.tsx"
Cohesion: 0.22
Nodes (7): cormorant, greatVibes, jakarta, metadata, playfair, viewport, ThemeProvider()

### Community 18 - "Semantic Extraction"
Cohesion: 0.31
Nodes (9): AST Extraction, Add and Watch Reference, Transcribe Reference, File Detection, Extraction Merge, URL Ingestion, Semantic Extraction, Video/Audio Transcription (+1 more)

### Community 19 - "dependencies"
Cohesion: 0.22
Nodes (9): class-variance-authority, dependencies, class-variance-authority, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, xlsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu (+1 more)

### Community 20 - "vendor/page.tsx"
Cohesion: 0.28
Nodes (7): CATEGORIES, SAMPLE_VENDORS, VendorPage(), FEATURED_VENDORS, VENDOR_CATEGORIES, VendorPreview(), formatRupiah

### Community 21 - "Extraction Spec"
Cohesion: 0.25
Nodes (8): Extraction Spec, Confidence Rubric, Extraction Subagent Prompt, Frontmatter Schema, Hyperedges, Node ID Format, Semantic Similarity Edges, Structural Extraction

### Community 22 - "MagazineCoverTheme.tsx"
Cohesion: 0.29
Nodes (6): lora, MagazineCoverTheme(), montserrat, oswald, Props, MagazineCoverTheme

### Community 23 - "models"
Cohesion: 0.11
Nodes (18): name, name, name, name, .opencode/plugins/graphify.js, auto, auto/cheap, auto/coding (+10 more)

### Community 24 - "BalineseHarmonyTheme.tsx"
Cohesion: 0.33
Nodes (5): BalineseHarmonyTheme(), cormorant, playfair, Props, BalineseHarmonyTheme

### Community 25 - "LineArtBotanicalTheme.tsx"
Cohesion: 0.33
Nodes (5): italiana, lato, LineArtBotanicalTheme(), Props, LineArtBotanicalTheme

### Community 26 - "RoyalGoldTheme.tsx"
Cohesion: 0.33
Nodes (5): cinzel, montserrat, Props, RoyalGoldTheme(), RoyalGoldTheme

### Community 27 - "query.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 28 - "reset-themes.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 29 - "check-themes.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 30 - "seed-premium-themes.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 31 - "Query Reference"
Cohesion: 0.50
Nodes (5): BFS Traversal, Query Expansion, Query Reference, Explain Node, Path Finding

### Community 32 - "Update Reference"
Cohesion: 0.50
Nodes (5): Build Merge, Update Reference, Cluster Only, Incremental Update, Manifest

### Community 33 - "Exports Reference"
Cohesion: 0.50
Nodes (5): Exports Reference, FalkorDB Export, MCP Server, Neo4j Export, Wiki Export

### Community 34 - "proxy.ts"
Cohesion: 0.60
Nodes (3): updateSession(), config, proxy()

### Community 35 - "refactor_admin.js"
Cohesion: 0.50
Nodes (4): fs, path, refactorAdmin(), walkDir()

### Community 36 - "ElegantBlushTheme.tsx"
Cohesion: 0.50
Nodes (3): ElegantBlushTheme(), Props, ElegantBlushTheme

### Community 37 - "Wedding Invitation Theme Research & Analysis"
Cohesion: 0.20
Nodes (9): 1. Overall Structure and Layout Patterns, 2. Design Aesthetics, Color Palettes, and Typography, 3. Icon Styles and Placement, 4. Animation Styles, 5. Mobile Responsiveness Paradigms, 6. Background Music Integration and UI Controls, 7. Premium vs Standard Tier Differentiation (Viding.co Deep Dive), Actionable Recommendations for Our Next.js Theme Development (+1 more)

### Community 38 - "createClient"
Cohesion: 0.21
Nodes (9): Props, RoyalBotanicalTheme(), Props, SereinWhiteTheme(), Props, WayangClassicTheme(), createClient(), RoyalBotanicalTheme (+1 more)

### Community 39 - "DashboardClient.tsx"
Cohesion: 0.32
Nodes (5): DashboardClient(), Props, QUICK_ACTIONS, getInitials(), Invitation

### Community 40 - "tamu/page.tsx"
Cohesion: 0.29
Nodes (4): GuestManagementPage(), AlertModal(), AlertModalProps, Guest

### Community 86 - "leads/page.tsx"
Cohesion: 0.40
Nodes (4): Lead, LeadsClient(), LeadsPage(), metadata

### Community 87 - "ThemesClient.tsx"
Cohesion: 0.40
Nodes (3): dynamic, ThemesClient(), Theme

### Community 88 - "UsersClient.tsx"
Cohesion: 0.40
Nodes (3): dynamic, UsersClient(), Profile

### Community 89 - "ModernMonochromeTheme.tsx"
Cohesion: 0.33
Nodes (5): cormorant, ModernMonochromeTheme(), montserrat, Props, ModernMonochromeTheme

### Community 90 - "OceanBreezeTheme.tsx"
Cohesion: 0.33
Nodes (5): lato, OceanBreezeTheme(), playfair, Props, OceanBreezeTheme

### Community 91 - "RusticWoodlandTheme.tsx"
Cohesion: 0.33
Nodes (5): lora, playfair, Props, RusticWoodlandTheme(), RusticWoodlandTheme

### Community 93 - "ThemeCarousel.tsx"
Cohesion: 0.50
Nodes (3): DEFAULT_CATEGORIES, ThemeCarousel(), ThemeProps

## Knowledge Gaps
- **281 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `baseURL`, `apiKey` (+276 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `createClient`, `ModernMonochromeTheme.tsx`, `RoyalGoldTheme.tsx`, `ElegantBlushTheme.tsx`, `Pagination.tsx`, `tamu/page.tsx`, `registry.tsx`, `JavaneseBatikTheme.tsx`, `baru/page.tsx`, `client.ts`, `MagazineCoverTheme.tsx`, `ThemesClient.tsx`, `UsersClient.tsx`, `BalineseHarmonyTheme.tsx`, `OceanBreezeTheme.tsx`, `RusticWoodlandTheme.tsx`, `LineArtBotanicalTheme.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `baru/page.tsx`, `leads/page.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`, `clsx`, `csv-parse`, `date-fns`, `exceljs`, `framer-motion`, `@hookform/resolvers`, `lucide-react`, `midtrans-client`, `next`, `next-themes`, `papaparse`, `qrcode`, `@radix-ui/react-accordion`, `@radix-ui/react-progress`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `react`, `react-dom`, `react-hook-form`, `react-hot-toast`, `recharts`, `resend`, `sharp`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `tailwind-merge`, `@types/papaparse`, `@types/qrcode`, `zod`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `NikahLink Platform` (e.g. with `Inveet.id` and `Link Undangan`) actually correct?**
  _`NikahLink Platform` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _281 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06103896103896104 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._