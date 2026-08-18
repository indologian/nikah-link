# Graph Report - undangan-pernikahan  (2026-08-18)

## Corpus Check
- 135 files · ~111,654 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 733 nodes · 1069 edges · 91 communities (48 shown, 43 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02f87785`
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
- EtherealWatercolorTheme.tsx
- schema.sql
- HeritageGununganTheme.tsx
- utils.ts
- EditorialGalleryTheme.tsx
- JavaneseBatikTheme.tsx
- EtherealSnowTheme.tsx
- createClient
- AGENTS.md
- Graphify Skill (Main)
- app/layout.tsx
- Semantic Extraction
- dependencies
- GeometricAbstractTheme.tsx
- Extraction Spec
- MagazineCoverTheme.tsx
- models
- BalineseHarmonyTheme.tsx
- registry.tsx
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
- LineArtBotanicalTheme.tsx
- Wedding Invitation Theme Research & Analysis
- BotanicalEleganceTheme.tsx
- client.ts
- TerracottaRustTheme.tsx
- fix_buttons.js
- refactor.js
- admin/page.tsx
- notification/route.ts
- graphify.js
- MidnightSparkleTheme.tsx
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
- RusticWoodlandTheme.tsx
- MinimalistTheme.tsx
- clsx
- ModernMonochromeTheme.tsx
- OceanBreezeTheme.tsx

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 79 edges
2. `createClient()` - 40 edges
3. `NikahLink Platform` - 29 edges
4. `Graphify Skill (Main)` - 23 edges
5. `cn()` - 16 edges
6. `compilerOptions` - 16 edges
7. `invitations` - 11 edges
8. `getThemeConfig()` - 10 edges
9. `Wedding Invitation Theme Research & Analysis` - 10 edges
10. `Extraction Spec` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/next.svg → implementation.md
- `Vercel Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/vercel.svg → implementation.md
- `HomePage()` --calls--> `createClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `TemaPage()` --calls--> `createClient()`  [EXTRACTED]
  app/tema/page.tsx → lib/supabase/server.ts
- `BalineseHarmonyTheme()` --calls--> `createClient()`  [EXTRACTED]
  components/themes/BalineseHarmonyTheme.tsx → lib/supabase/client.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Extraction Pipeline (Step 3)** — detection_concept, ast_extraction_concept, semantic_extraction_concept, extraction_merge_concept, extraction_cache_concept, transcription_concept [EXTRACTED 1.00]
- **Graph Outputs** — html_visualization_concept, graph_report_concept, wiki_export_concept, neo4j_export_concept, falkordb_export_concept, mcp_server_concept [EXTRACTED 1.00]
- **Initial Theme Set (8 previewed themes)** — implementation_theme_sakura_bloom, implementation_theme_midnight_luxe, implementation_theme_javanese_heritage, implementation_theme_minimalist_clean, implementation_theme_tropical_garden, implementation_theme_golden_arch, implementation_theme_rustic_charm, implementation_theme_royal_blue [EXTRACTED 1.00]
- **Query System** — claude_skills_graphify_references_query_expansion_concept, bfs_traversal_concept, path_finding_concept, explain_concept [EXTRACTED 1.00]
- **Theme Concept to Preview SVG Pairing** — implementation_theme_sakura_bloom, public_images_themes_sakura_bloom_svg, implementation_theme_midnight_luxe, public_images_themes_midnight_luxe_svg, implementation_theme_javanese_heritage, public_images_themes_javanese_heritage_svg, implementation_theme_minimalist_clean, public_images_themes_minimalist_clean_svg, implementation_theme_tropical_garden, public_images_themes_tropical_garden_svg, implementation_theme_golden_arch, public_images_themes_golden_arch_svg, implementation_theme_rustic_charm, public_images_themes_rustic_charm_svg, implementation_theme_royal_blue, public_images_themes_royal_blue_svg [EXTRACTED 1.00]
- **Core Platform Features** — implementation_invitation_builder, implementation_rsvp_feature, implementation_kado_cashless, implementation_analytics_feature, implementation_guest_management, implementation_marketplace_vendor [INFERRED 0.85]

## Communities (91 total, 43 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.06
Nodes (35): submitLead(), LeadsClient(), LeadsPage(), metadata, metadata, SettingsPage(), SECTION_NAMES, SettingsClient() (+27 more)

### Community 1 - "index.ts"
Cohesion: 0.06
Nodes (29): InvitationsClient(), dynamic, Lead, dynamic, ThemesClient(), dynamic, UsersClient(), GuestManagementPage() (+21 more)

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
Cohesion: 0.05
Nodes (36): Window, HomePage(), metadata, TemaPage(), CATEGORIES, SAMPLE_VENDORS, VendorPage(), ECO_STATS (+28 more)

### Community 7 - "EtherealWatercolorTheme.tsx"
Cohesion: 0.29
Nodes (6): dancing, EtherealWatercolorTheme(), lato, playfair, Props, EtherealWatercolorTheme

### Community 8 - "schema.sql"
Cohesion: 0.22
Nodes (18): auth, auth.users, blog_posts, gallery, gift_accounts, gift_transactions, guests, handle_new_user() (+10 more)

### Community 9 - "HeritageGununganTheme.tsx"
Cohesion: 0.33
Nodes (5): HeritageGununganTheme(), lora, playfair, Props, HeritageGununganTheme

### Community 10 - "utils.ts"
Cohesion: 0.06
Nodes (27): DashboardClient(), Props, QUICK_ACTIONS, DEFAULT_FORM_DATA, NewInvitationPage(), STEPS, EditInvitationPage(), STEPS (+19 more)

### Community 11 - "EditorialGalleryTheme.tsx"
Cohesion: 0.29
Nodes (5): anton, EditorialGalleryTheme(), Props, roboto, EditorialGalleryTheme

### Community 12 - "JavaneseBatikTheme.tsx"
Cohesion: 0.33
Nodes (5): greatVibes, JavaneseBatikTheme(), Props, ptSerif, JavaneseBatikTheme

### Community 13 - "EtherealSnowTheme.tsx"
Cohesion: 0.29
Nodes (5): cormorant, EtherealSnowTheme(), montserrat, Props, EtherealSnowTheme

### Community 14 - "createClient"
Cohesion: 0.20
Nodes (12): BENEFITS, RegisterPage(), LoginPage(), AdminSidebar(), NAV_ITEMS, NAV_ITEMS, Sidebar(), DEFAULT_NAV_ITEMS (+4 more)

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

### Community 20 - "GeometricAbstractTheme.tsx"
Cohesion: 0.29
Nodes (5): GeometricAbstractTheme(), inter, playfair, Props, GeometricAbstractTheme

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

### Community 25 - "registry.tsx"
Cohesion: 0.09
Nodes (21): cinzel, CosmicStarlightTheme(), outfit, Props, Props, RoyalBotanicalTheme(), Props, SereinWhiteTheme() (+13 more)

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

### Community 36 - "LineArtBotanicalTheme.tsx"
Cohesion: 0.33
Nodes (5): italiana, lato, LineArtBotanicalTheme(), Props, LineArtBotanicalTheme

### Community 37 - "Wedding Invitation Theme Research & Analysis"
Cohesion: 0.18
Nodes (10): 1. Overall Structure and Layout Patterns, 2. Design Aesthetics, Color Palettes, and Typography, 3. Icon Styles and Placement, 4. Animation Styles & Advanced Interactions, 5. Photo Layouts & Advanced Framing, 6. Background Music Integration and UI Controls, 6. Mobile Responsiveness Paradigms, 7. Premium vs Standard Tier Differentiation (Viding.co Deep Dive) (+2 more)

### Community 38 - "BotanicalEleganceTheme.tsx"
Cohesion: 0.33
Nodes (5): BotanicalEleganceTheme(), greatVibes, montserrat, Props, BotanicalEleganceTheme

### Community 39 - "client.ts"
Cohesion: 0.15
Nodes (9): DeleteAccountSection(), ElegantBlushTheme(), Props, cormorant, GoldenArchTheme(), lato, Props, ElegantBlushTheme (+1 more)

### Community 40 - "TerracottaRustTheme.tsx"
Cohesion: 0.33
Nodes (5): lora, playfair, Props, TerracottaRustTheme(), TerracottaRustTheme

### Community 48 - "MidnightSparkleTheme.tsx"
Cohesion: 0.50
Nodes (3): MidnightSparkleTheme(), Props, MidnightSparkleTheme

### Community 86 - "RusticWoodlandTheme.tsx"
Cohesion: 0.33
Nodes (5): lora, playfair, Props, RusticWoodlandTheme(), RusticWoodlandTheme

### Community 87 - "MinimalistTheme.tsx"
Cohesion: 0.50
Nodes (3): MinimalistTheme(), Props, MinimalistTheme

### Community 89 - "ModernMonochromeTheme.tsx"
Cohesion: 0.33
Nodes (5): cormorant, ModernMonochromeTheme(), montserrat, Props, ModernMonochromeTheme

### Community 90 - "OceanBreezeTheme.tsx"
Cohesion: 0.33
Nodes (5): lato, OceanBreezeTheme(), playfair, Props, OceanBreezeTheme

## Knowledge Gaps
- **310 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `baseURL`, `apiKey` (+305 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **43 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `createClient`, `index.ts`, `EtherealWatercolorTheme.tsx`, `HeritageGununganTheme.tsx`, `utils.ts`, `EditorialGalleryTheme.tsx`, `JavaneseBatikTheme.tsx`, `EtherealSnowTheme.tsx`, `GeometricAbstractTheme.tsx`, `MagazineCoverTheme.tsx`, `BalineseHarmonyTheme.tsx`, `registry.tsx`, `RoyalGoldTheme.tsx`, `LineArtBotanicalTheme.tsx`, `BotanicalEleganceTheme.tsx`, `client.ts`, `TerracottaRustTheme.tsx`, `MidnightSparkleTheme.tsx`, `RusticWoodlandTheme.tsx`, `MinimalistTheme.tsx`, `ModernMonochromeTheme.tsx`, `OceanBreezeTheme.tsx`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `utils.ts`, `app/page.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`, `csv-parse`, `date-fns`, `exceljs`, `framer-motion`, `@hookform/resolvers`, `lucide-react`, `midtrans-client`, `next`, `next-themes`, `papaparse`, `qrcode`, `@radix-ui/react-accordion`, `@radix-ui/react-progress`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `react`, `react-dom`, `react-hook-form`, `react-hot-toast`, `recharts`, `resend`, `sharp`, `sonner`, `@supabase/ssr`, `@supabase/supabase-js`, `tailwind-merge`, `@types/papaparse`, `@types/qrcode`, `zod`, `clsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `NikahLink Platform` (e.g. with `Inveet.id` and `Link Undangan`) actually correct?**
  _`NikahLink Platform` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _310 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.061952861952861954 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05507246376811594 - nodes in this community are weakly interconnected._