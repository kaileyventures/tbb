# Graph Report - .  (2026-08-20)

## Corpus Check
- 55 files · ~90,498 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 180 nodes · 262 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Static Pages & Navigation
- Bakery Storefront Components
- Admin Dashboard & Financial Ledger
- Core Project Dependencies
- TypeScript Compiler Configurations
- Development & Linting Tools
- Main Landing Page & Layout
- Next.js Type Declarations
- ESLint Code Quality Config
- Next.js Framework Config
- PostCSS & Styling Config

## God Nodes (most connected - your core abstractions)
1. `MenuItem` - 24 edges
2. `useSite()` - 23 edges
3. `compilerOptions` - 17 edges
4. `include` - 7 edges
5. `scripts` - 5 edges
6. `exportSingleToExcel()` - 5 edges
7. `exportBothToExcel()` - 5 edges
8. `AdminPage()` - 4 edges
9. `xlsx` - 4 edges
10. `lib` - 4 edges

## Surprising Connections (you probably didn't know these)
- `ProductModalProps` --references--> `MenuItem`  [EXTRACTED]
  components/ProductModal.tsx → hooks/types.ts
- `AboutPage()` --calls--> `useSite()`  [EXTRACTED]
  app/about/page.tsx → context/SiteContext.tsx
- `ContactPage()` --calls--> `useSite()`  [EXTRACTED]
  app/contact/page.tsx → context/SiteContext.tsx
- `CustomCakesPage()` --calls--> `useSite()`  [EXTRACTED]
  app/customcakes/page.tsx → context/SiteContext.tsx
- `Home()` --calls--> `useSite()`  [EXTRACTED]
  app/page.tsx → context/SiteContext.tsx

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "Static Pages & Navigation"
Cohesion: 0.08
Nodes (17): AboutPage(), ContactPage(), CustomCakesPage(), jakarta, metadata, playfair, Footer(), LayoutShell() (+9 more)

### Community 1 - "Bakery Storefront Components"
Cohesion: 0.13
Nodes (10): HeroSectionProps, MenuGridProps, ProductModalProps, HeroSectionProps, MenuGridProps, ProductModalProps, HeroSection(), HeroSectionProps (+2 more)

### Community 2 - "Admin Dashboard & Financial Ledger"
Cohesion: 0.12
Nodes (18): AdminPage(), formatDateFormatted(), INITIAL_PURCHASES, INITIAL_SALES, AutoSuggestInputProps, currentYear, CustomDatePicker(), MONTHS (+10 more)

### Community 3 - "Core Project Dependencies"
Cohesion: 0.10
Nodes (19): lucide-react, next, dependencies, lucide-react, next, react, react-dom, @supabase/supabase-js (+11 more)

### Community 4 - "TypeScript Compiler Configurations"
Cohesion: 0.10
Nodes (20): dom, dom.iterable, esnext, compilerOptions, allowJs, baseUrl, esModuleInterop, incremental (+12 more)

### Community 5 - "Development & Linting Tools"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "Main Landing Page & Layout"
Cohesion: 0.21
Nodes (5): Home(), BentoHighlights(), MenuGrid(), BURGER_MENU_ITEMS, useGoogleSheet()

### Community 7 - "Next.js Type Declarations"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

## Knowledge Gaps
- **61 isolated node(s):** `playfair`, `jakarta`, `metadata`, `INITIAL_SALES`, `INITIAL_PURCHASES` (+56 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core Project Dependencies` to `Admin Dashboard & Financial Ledger`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `useSite()` connect `Static Pages & Navigation` to `Bakery Storefront Components`, `Main Landing Page & Layout`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `xlsx` connect `Admin Dashboard & Financial Ledger` to `Core Project Dependencies`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `playfair`, `jakarta`, `metadata` to the rest of the system?**
  _61 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Static Pages & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `Bakery Storefront Components` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Admin Dashboard & Financial Ledger` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._