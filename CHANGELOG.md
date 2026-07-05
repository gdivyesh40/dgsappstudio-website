# Changelog

All notable changes to the DGS App Studio website are documented here.
This project adheres to [Keep a Changelog](https://keepachangelog.com/) and
[Semantic Versioning](https://semver.org/).

## [1.2.1] — 2026-07-05

Enterprise-grade release review. See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for the full
verification matrix.

### Fixed

- **TypeScript errors (2):** sitemap `serialize` assigned string literals to the `changefreq` enum
  field — now uses `ChangeFreqEnum` exported by `@astrojs/sitemap`. `astro check` is now clean
  (0 errors / 0 warnings / 0 hints).
- **TypeScript hint:** JSON-LD `<script>` in `BaseHead` was implicitly inline — made `is:inline`
  explicit.

### Removed (dead code)

- Unused `BRAND` export from `src/consts.ts` (brand colors already live in Tailwind config + CSS
  tokens).
- Unused `privacyPath` helper from `src/lib/apps.ts`.
- Unused `gradient-pan` and `shimmer` keyframes/animations from `tailwind.config.js`.

### Verified (no code change needed)

- All internal links resolve; no `<img>` without alt (all SVG); 23 JSON-LD blocks valid; sitemap
  and RSS well-formed; one `h1`/canonical/description/og:image per page; no mobile overflow at
  375px; landmarks, skip link, labelled forms, keyboard-native controls; GitHub Pages + custom
  domain config correct.

## [1.2.0] — 2026-07-05

CMS-ready architecture — apps are now Markdown content collections. No database, no backend,
still 100% static.

### Added

- **`apps` content collection** ([`src/content/config.ts`](src/content/config.ts)) with a typed Zod
  schema covering title, slug (filename), icon, screenshots, description, Play Store / privacy /
  support URLs, release date, version, categories, languages, changelog, plus features, roadmap,
  FAQs, highlights and listing controls (`featured`, `order`, `draft`).
- **`src/content/apps/dharma-path.md`** — the first app migrated to Markdown; long-form copy lives
  in the Markdown body and renders in an "About" section on the detail page.
- **RSS feed** at `/rss.xml` ([`src/pages/rss.xml.ts`](src/pages/rss.xml.ts)) generated from the
  collection, with autodiscovery `<link rel="alternate">` in the document head.
- **Changelog section** on each app detail page, rendered from the `changelog` frontmatter.
- **`src/lib/apps.ts`** helper module: `getApps()` (draft-aware, sorted), `getFeaturedApp()`,
  `primaryCategory()`, `appPath()` and status labels — one source of truth for all listings.

### Changed

- App detail route [`src/pages/apps/[slug].astro`](src/pages/apps/[slug].astro) now uses
  `getStaticPaths` over the collection and `render()`s the Markdown body. JSON-LD, sitemap entries
  and RSS items are all derived automatically from frontmatter.
- Home, `/apps` listing and `/privacy` hub now read from the collection via `src/lib/apps.ts`.
- `AppCard` accepts a `CollectionEntry<'apps'>` instead of a hand-built object.
- **Adding an app is now a single Markdown file** — no code changes, no array edits.

### Removed

- `src/data/apps.ts` (the TypeScript array) — fully replaced by the content collection.

## [1.1.0] — 2026-07-05

Senior production review pass. Audited all 20 review areas (architecture, folder structure,
components, SEO, accessibility, performance, responsiveness, deployment, Lighthouse, TypeScript,
Tailwind, Astro practices, security, privacy structure, contact, support, app scalability, dynamic
routing, theme switching and animation performance) and improved every issue found. No files were
rewritten from scratch.

### Fixed (bugs found in review)

- **Fonts never shipped (critical).** `@import '@fontsource-variable/inter'` sat inside
  `@layer base` after the `@tailwind` directives, so PostCSS dropped it — **zero `@font-face` rules
  were emitted** and the site silently fell back to system fonts. Moved the import to
  `BaseLayout.astro` frontmatter (`@fontsource-variable/inter/wght.css`) so Vite fingerprints and
  emits the woff2 files. Verified: 7 subset files now emitted, latin loads via `unicode-range`.
- **AppCard stretched link misaligned.** The card used `after:absolute after:inset-0` for a
  full-card click target but the `<article>` was not positioned, so the overlay resolved against a
  distant ancestor. Added `relative` to the card.
- **Fragile header scroll classes.** The scrolled state toggled arbitrary Tailwind classes
  including `bg-[var(--bg)]/80` (opacity modifier on a CSS variable does not compose correctly).
  Replaced with a single `.header-scrolled` class using `color-mix()` + `backdrop-filter`, scoped
  to `#site-header` so its `border-color` beats Tailwind's `border-transparent` utility.
- **No-JS / pre-hydration blank content.** `.reveal` set `opacity: 0` unconditionally, hiding all
  content when JavaScript was disabled or before hydration. Scoped the hidden state to `html.js`
  (class added synchronously in the head), so content is always visible without JS — a correctness,
  SEO and accessibility fix.

### Accessibility (target: 100)

- **WCAG AA contrast in both themes.** `brand-600` (#D97706) as small text on white was ~3.2:1
  (fails AA). Introduced a theme-aware `--brand-text` token and `.text-brand` utility
  (light #B45309 ≈ 5.0:1, dark #FB923C ≈ 8.3:1) and migrated all readable brand-colored text
  (eyebrows, links, list markers) to it. Verified programmatically.
- Made `<main>` focusable (`tabindex="-1"`, `focus:outline-none`) so the skip link reliably moves
  focus to content.
- Added explicit `robots` and improved `aria`/semantic coverage (decorative SVGs `aria-hidden`,
  `aria-current` nav state, labelled form controls retained).

### SEO (target: 100)

- **Structured data expanded.** `Organization` now includes `sameAs`, `email`, `foundingDate` and a
  stable `@id`; added a site-wide `WebSite` entity. App pages emit `SoftwareApplication`,
  `BreadcrumbList` and `FAQPage`. All JSON-LD is merged into one deduplicated list via `BaseLayout`.
- **Richer Open Graph / Twitter.** Added `og:image:type/width/height/alt`, `twitter:site`,
  `twitter:creator`, `twitter:image:alt`, `color-scheme`, `referrer` and `format-detection` meta.
- **Canonical + robots hardening.** Robust trailing-slash normalization; explicit
  `index, follow, max-image-preview:large` (or `noindex` when requested).
- **Sitemap upgraded** with per-route `priority`, `changefreq` and `lastmod` (home 1.0, apps 0.8,
  legal 0.4/yearly).
- Documented that the SVG `og-image` must be exported to PNG for social platforms.

### Performance

- **Enabled hover prefetch** (`prefetch: { prefetchAll: true, defaultStrategy: 'hover' }`) for
  near-instant internal navigation at ~2 KB total JS.
- **`requestAnimationFrame`-throttled** the header scroll listener (passive) to keep scrolling on
  the compositor and avoid layout thrash — improves animation performance and INP.
- **Reduced font payload** to the weight axis only (no italic/optical-size variants).
- Reveal animations are opacity/transform only (GPU-friendly); reduced-motion fully honored.

### Maintainability / DRY

- **Removed duplicated legal typography.** The long `[&_h2]:… [&_p]:…` arbitrary-variant class
  soup was duplicated in `LegalLayout` and `privacy/index`. Extracted a single `.prose-legal`
  component style in `global.css`; both consumers now use one class.
- Centralized brand text color in one token instead of scattered `text-brand-600 dark:text-brand-400`
  pairs.
- JSON-LD assembly centralized in `BaseLayout` (pages pass only page-specific entities).

### PWA / icons

- Fixed `site.webmanifest` to reference the existing `favicon.svg` (previously pointed at missing
  PNG icons) and added `categories`.
- Removed `<link>` references to not-yet-created `favicon.ico` / apple-touch PNG to avoid 404s that
  would lower the Best Practices score; documented how to re-add them.
- Added `mask-icon` and preserved `theme-color` per color scheme.

### Documentation

- Expanded the README with Accessibility, Security, Localization readiness, and "Scaling to 100+
  apps" sections, plus an accurate pre-launch placeholder checklist.
- Added this CHANGELOG.

## [1.0.0] — 2026-07-05

- Initial production build: Astro + Tailwind + TypeScript static site with home, about, apps
  listing, dynamic app detail, support, contact, privacy hub + per-app policy, terms and a custom
  404. Dark/light mode, SEO head, sitemap, GitHub Actions deployment to GitHub Pages.
