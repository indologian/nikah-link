# Graph Report - undangan-pernikahan  (2026-08-20)

## Corpus Check
- 139 files · ~119,002 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 766 nodes · 1034 edges · 98 communities (54 shown, 44 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f9917ead`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- createClient
- createClient
- NikahLink Platform
- models
- compilerOptions
- devDependencies
- app/page.tsx
- EtherealWatercolorTheme.tsx
- schema.sql
- HeritageGununganTheme.tsx
- index.ts
- EditorialGalleryTheme.tsx
- JavaneseBatikTheme.tsx
- EtherealSnowTheme.tsx
- DashboardClient.tsx
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
- undangan/page.tsx
- SettingsClient.tsx
- check-themes.mjs
- class-variance-authority
- Query Reference
- Update Reference
- Exports Reference
- proxy.ts
- migrate-public-mutations.mjs
- LineArtBotanicalTheme.tsx
- baru/page.tsx
- Wedding Invitation Theme Research & Analysis
- GoldenArchTheme.tsx
- themes/TerracottaRustTheme.tsx
- admin/page.tsx
- graphify.js
- CosmicStarlightTheme.tsx
- eslint.config.mjs
- token/route.ts
- next.config.ts
- postcss.config.mjs
- Cross-Repo Merge
- File Icon SVG
- Globe Icon SVG
- Window Icon SVG
- NikahLink README
- RusticWoodlandTheme.tsx
- clean-graph.mjs
- SereinWhiteTheme.tsx
- themes/BotanicalEleganceTheme.tsx
- OceanBreezeTheme.tsx
- Add and Watch Reference
- themes/ModernMonochromeTheme.tsx
- clean-snapshots.sh
- query-themes.mjs
- reset-themes.mjs
- seed-premium-themes.mjs
- entitlement.ts
- MinimalistTheme.tsx
- themes/RoyalBotanicalTheme.tsx
- clsx
- date-fns
- exceljs
- framer-motion
- @hookform/resolvers
- lucide-react
- midtrans-client
- next
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

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 40 edges
2. `createClient()` - 31 edges
3. `NikahLink Platform` - 24 edges
4. `Graphify Skill (Main)` - 23 edges
5. `cn()` - 16 edges
6. `compilerOptions` - 16 edges
7. `invitations` - 12 edges
8. `Wedding Invitation Theme Research & Analysis` - 11 edges
9. `getThemeConfig()` - 10 edges
10. `scripts` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/next.svg → implementation.md
- `Vercel Logo SVG` --references--> `Tech Stack`  [INFERRED]
  public/vercel.svg → implementation.md
- `HomePage()` --calls--> `createClient()`  [EXTRACTED]
  app/page.tsx → lib/supabase/server.ts
- `TemaPage()` --calls--> `createClient()`  [EXTRACTED]
  app/tema/page.tsx → lib/supabase/server.ts
- `Golden Arch Theme Preview SVG` --references--> `Golden Arch Theme`  [EXTRACTED]
  public/images/themes/golden-arch.svg → implementation.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Extraction Pipeline (Step 3)** — detection_concept, ast_extraction_concept, semantic_extraction_concept, extraction_merge_concept, extraction_cache_concept, transcription_concept [EXTRACTED 1.00]
- **Graph Outputs** — html_visualization_concept, graph_report_concept, wiki_export_concept, neo4j_export_concept, falkordb_export_concept, mcp_server_concept [EXTRACTED 1.00]
- **Initial Theme Set (8 previewed themes)** — implementation_theme_sakura_bloom, implementation_theme_midnight_luxe, implementation_theme_javanese_heritage, implementation_theme_minimalist_clean, implementation_theme_tropical_garden, implementation_theme_golden_arch, implementation_theme_rustic_charm, implementation_theme_royal_blue [EXTRACTED 1.00]
- **Query System** — claude_skills_graphify_references_query_expansion_concept, bfs_traversal_concept, path_finding_concept, explain_concept [EXTRACTED 1.00]
- **Theme Concept to Preview SVG Pairing** — implementation_theme_sakura_bloom, public_images_themes_sakura_bloom_svg, implementation_theme_midnight_luxe, public_images_themes_midnight_luxe_svg, implementation_theme_javanese_heritage, public_images_themes_javanese_heritage_svg, implementation_theme_minimalist_clean, public_images_themes_minimalist_clean_svg, implementation_theme_tropical_garden, public_images_themes_tropical_garden_svg, implementation_theme_golden_arch, public_images_themes_golden_arch_svg, implementation_theme_rustic_charm, public_images_themes_rustic_charm_svg, implementation_theme_royal_blue, public_images_themes_royal_blue_svg [EXTRACTED 1.00]
- **Core Platform Features** — implementation_invitation_builder, implementation_rsvp_feature, implementation_kado_cashless, implementation_analytics_feature, implementation_guest_management, implementation_marketplace_vendor [INFERRED 0.85]

## Communities (98 total, 44 thin omitted)

### Community 0 - "createClient"
Cohesion: 0.07
Nodes (33): submitLead(), Lead, LeadsClient(), LeadsPage(), metadata, metadata, SettingsPage(), SettingsClient() (+25 more)

### Community 1 - "createClient"
Cohesion: 0.05
Nodes (33): InvitationsClient(), dynamic, dynamic, ThemesClient(), dynamic, UsersClient(), BENEFITS, RegisterPage() (+25 more)

### Community 2 - "NikahLink Platform"
Cohesion: 0.05
Nodes (41): Analytics Feature, Competitor Analysis, Database Schema (Supabase), Design System, Guest Management Feature, NikahLink Implementation Plan, Inveet.id, Invitation Builder Feature (+33 more)

### Community 3 - "models"
Cohesion: 0.11
Nodes (18): name, name, name, name, .opencode/plugins/graphify.js, auto, auto/cheap, auto/coding (+10 more)

### Community 4 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 5 - "devDependencies"
Cohesion: 0.07
Nodes (28): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+20 more)

### Community 6 - "app/page.tsx"
Cohesion: 0.07
Nodes (27): Window, HomePage(), metadata, TemaPage(), ECO_STATS, EcoImpact(), FAQS, FaqSection() (+19 more)

### Community 7 - "EtherealWatercolorTheme.tsx"
Cohesion: 0.29
Nodes (5): dancing, lato, playfair, Props, EtherealWatercolorTheme

### Community 8 - "schema.sql"
Cohesion: 0.19
Nodes (20): auth, auth.users, public.handle_new_user, blog_posts, gallery, gift_accounts, gift_transactions, guests (+12 more)

### Community 9 - "HeritageGununganTheme.tsx"
Cohesion: 0.33
Nodes (4): lora, playfair, Props, HeritageGununganTheme

### Community 10 - "index.ts"
Cohesion: 0.11
Nodes (17): BlogPost, DashboardStats, GalleryItem, GiftAccount, GiftAccountType, GiftTransaction, Guest, InvitationStatus (+9 more)

### Community 11 - "EditorialGalleryTheme.tsx"
Cohesion: 0.29
Nodes (4): anton, Props, roboto, EditorialGalleryTheme

### Community 12 - "JavaneseBatikTheme.tsx"
Cohesion: 0.33
Nodes (4): greatVibes, Props, ptSerif, JavaneseBatikTheme

### Community 13 - "EtherealSnowTheme.tsx"
Cohesion: 0.29
Nodes (4): cormorant, montserrat, Props, EtherealSnowTheme

### Community 14 - "DashboardClient.tsx"
Cohesion: 0.27
Nodes (6): DashboardClient(), Props, QUICK_ACTIONS, DeleteButton(), getInitials(), Invitation

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
Cohesion: 0.53
Nodes (6): AST Extraction, Transcribe Reference, File Detection, Extraction Merge, Semantic Extraction, Video/Audio Transcription

### Community 19 - "dependencies"
Cohesion: 0.22
Nodes (9): csv-parse, dependencies, csv-parse, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, xlsx, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu (+1 more)

### Community 20 - "GeometricAbstractTheme.tsx"
Cohesion: 0.29
Nodes (4): inter, playfair, Props, GeometricAbstractTheme

### Community 21 - "Extraction Spec"
Cohesion: 0.25
Nodes (8): Extraction Spec, Confidence Rubric, Extraction Subagent Prompt, Frontmatter Schema, Hyperedges, Node ID Format, Semantic Similarity Edges, Structural Extraction

### Community 22 - "MagazineCoverTheme.tsx"
Cohesion: 0.29
Nodes (5): lora, montserrat, oswald, Props, MagazineCoverTheme

### Community 23 - "models"
Cohesion: 0.11
Nodes (18): name, name, name, name, .opencode/plugins/graphify.js, auto, auto/cheap, auto/coding (+10 more)

### Community 24 - "BalineseHarmonyTheme.tsx"
Cohesion: 0.33
Nodes (4): cormorant, playfair, Props, BalineseHarmonyTheme

### Community 25 - "registry.tsx"
Cohesion: 0.11
Nodes (12): Props, Props, Props, Props, ElegantBlushTheme, FieldType, MidnightSparkleTheme, ThemeConfig (+4 more)

### Community 26 - "RoyalGoldTheme.tsx"
Cohesion: 0.33
Nodes (4): cinzel, montserrat, Props, RoyalGoldTheme

### Community 27 - "undangan/page.tsx"
Cohesion: 0.38
Nodes (5): MyInvitationsPage(), CountdownLabel(), Props, CreateInvitationButton(), formatDate()

### Community 28 - "SettingsClient.tsx"
Cohesion: 0.40
Nodes (4): SECTION_NAMES, SettingsClientProps, ConfirmModal(), ConfirmModalProps

### Community 29 - "check-themes.mjs"
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

### Community 35 - "migrate-public-mutations.mjs"
Cohesion: 0.18
Nodes (9): APPLY, backupDir, files, findFunctionEnd(), replaceHandler(), report, ROOT, THEMES_DIR (+1 more)

### Community 36 - "LineArtBotanicalTheme.tsx"
Cohesion: 0.33
Nodes (4): italiana, lato, Props, LineArtBotanicalTheme

### Community 37 - "baru/page.tsx"
Cohesion: 0.18
Nodes (10): DEFAULT_FORM_DATA, NewInvitationPage(), STEPS, EditInvitationPage(), STEPS, CreateInvitationButtonProps, UpsellModal(), UpsellModalProps (+2 more)

### Community 38 - "Wedding Invitation Theme Research & Analysis"
Cohesion: 0.17
Nodes (11): 1. Overall Structure and Layout Patterns, 2. Design Aesthetics, Color Palettes, and Typography, 3. Icon Styles and Placement, 4. Animation Styles & Advanced Interactions, 5. Photo Layouts & Advanced Framing, 6. Background Music Integration and UI Controls, 6. Mobile Responsiveness Paradigms, 7. Premium vs Standard Tier Differentiation (Viding.co Deep Dive) (+3 more)

### Community 39 - "GoldenArchTheme.tsx"
Cohesion: 0.33
Nodes (4): cormorant, lato, Props, GoldenArchTheme

### Community 40 - "themes/TerracottaRustTheme.tsx"
Cohesion: 0.33
Nodes (4): lora, playfair, Props, TerracottaRustTheme

### Community 48 - "CosmicStarlightTheme.tsx"
Cohesion: 0.33
Nodes (4): cinzel, outfit, Props, CosmicStarlightTheme

### Community 55 - "token/route.ts"
Cohesion: 0.11
Nodes (17): mapStatus(), POST(), SubStatus, supabase, verifyMidtransSignature(), isValidPlan(), Plan, PLAN_PRICES (+9 more)

### Community 86 - "RusticWoodlandTheme.tsx"
Cohesion: 0.33
Nodes (4): lora, playfair, Props, RusticWoodlandTheme

### Community 87 - "clean-graph.mjs"
Cohesion: 0.50
Nodes (4): GRAPH_PATH, isTrivial(), main(), TRIVIAL_PATTERNS

### Community 89 - "themes/BotanicalEleganceTheme.tsx"
Cohesion: 0.33
Nodes (4): greatVibes, montserrat, Props, BotanicalEleganceTheme

### Community 90 - "OceanBreezeTheme.tsx"
Cohesion: 0.33
Nodes (4): lato, playfair, Props, OceanBreezeTheme

### Community 91 - "Add and Watch Reference"
Cohesion: 0.67
Nodes (3): Add and Watch Reference, URL Ingestion, Watch Mode

### Community 92 - "themes/ModernMonochromeTheme.tsx"
Cohesion: 0.33
Nodes (4): cormorant, montserrat, Props, ModernMonochromeTheme

### Community 99 - "query-themes.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 100 - "reset-themes.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 101 - "seed-premium-themes.mjs"
Cohesion: 0.33
Nodes (4): envFile, envPath, envs, supabase

### Community 102 - "entitlement.ts"
Cohesion: 0.50
Nodes (4): getEffectivePlan(), isPremiumOrPro(), Plan, ProfileEntitlement

## Knowledge Gaps
- **331 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `name`, `baseURL`, `apiKey` (+326 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `undangan/page.tsx`, `app/page.tsx`, `token/route.ts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `createClient`, `SettingsClient.tsx`, `baru/page.tsx`, `DashboardClient.tsx`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `recharts`, `resend`, `sharp`, `sonner`, `@supabase/ssr`, `devDependencies`, `@supabase/supabase-js`, `tailwind-merge`, `@types/papaparse`, `@types/qrcode`, `zod`, `class-variance-authority`, `clsx`, `date-fns`, `exceljs`, `framer-motion`, `@hookform/resolvers`, `lucide-react`, `midtrans-client`, `next`, `next-themes`, `papaparse`, `qrcode`, `@radix-ui/react-accordion`, `@radix-ui/react-progress`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `react`, `react-dom`, `react-hook-form`, `react-hot-toast`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `name` to the rest of the system?**
  _331 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.06711915535444947 - nodes in this community are weakly interconnected._
- **Should `createClient` be split into smaller, more focused modules?**
  _Cohesion score 0.054244306418219465 - nodes in this community are weakly interconnected._
- **Should `NikahLink Platform` be split into smaller, more focused modules?**
  _Cohesion score 0.05121951219512195 - nodes in this community are weakly interconnected._