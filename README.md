# DGS App Studio — Website

The official website for **DGS App Studio**, a mobile app development studio building modern
Android applications (with iOS on the horizon). Built as a fast, SEO-optimized static site.

**Live:** https://dgsappstudio.com

---

## Launch & operations docs

- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** — go/no-go list for the first public release
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — GitHub Pages + Namecheap deployment
- **[DNS_SETUP.md](DNS_SETUP.md)** — exact Namecheap DNS records
- **[GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md)** — store URLs, contact, Data safety
- **[ADMOB_SETUP.md](ADMOB_SETUP.md)** — `app-ads.txt`, publisher ID, verification
- **[MAINTENANCE.md](MAINTENANCE.md)** — add apps, screenshots, releases, privacy policies
- **[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)** — engineering verification matrix
- **[CHANGELOG.md](CHANGELOG.md)** — version history

> Pre-launch placeholders in code are tagged `TODO(launch)` — find them with
> `grep -rn "TODO(launch)" src public`.

---

## Tech stack

- **[Astro](https://astro.build)** — static site generation (SSG), zero JS by default
- **[Tailwind CSS](https://tailwindcss.com)** — utility-first styling with a custom brand theme
- **TypeScript** — typed data models and components
- **@astrojs/sitemap** — automatic `sitemap-index.xml`
- **GitHub Actions → GitHub Pages** — automated deploys

Design goals: premium, minimal, accessible, dark/light mode, Lighthouse 95+.

---

## Project structure

```
.
├── .github/workflows/deploy.yml   # CI/CD to GitHub Pages
├── public/                        # Static assets served as-is
│   ├── CNAME                      # Custom domain for GitHub Pages
│   ├── app-ads.txt                # Ad network authorization (mobile apps)
│   ├── robots.txt
│   ├── site.webmanifest           # PWA manifest
│   ├── favicon.svg
│   └── og-image.svg               # Social share image
├── src/
│   ├── components/                # Reusable UI (Header, Footer, cards, …)
│   ├── layouts/                   # BaseLayout, LegalLayout
│   ├── content/                   # ← CMS: Markdown content collections
│   │   ├── config.ts              # Zod schema for the `apps` collection
│   │   └── apps/
│   │       └── dharma-path.md     # One Markdown file = one app
│   ├── pages/                     # Routes (file-based)
│   │   ├── index.astro            # Home
│   │   ├── about.astro
│   │   ├── apps/
│   │   │   ├── index.astro        # Apps listing (from collection)
│   │   │   └── [slug].astro       # Auto-generated app detail pages
│   │   ├── privacy/
│   │   │   ├── index.astro        # Privacy hub (from collection)
│   │   │   └── dharma-path.astro  # Per-app policy
│   │   ├── rss.xml.ts             # Auto-generated RSS feed of apps
│   │   ├── support.astro
│   │   ├── contact.astro
│   │   ├── terms.astro
│   │   └── 404.astro
│   ├── lib/apps.ts                # Collection helpers (getApps, sorting, …)
│   ├── data/navigation.ts         # Header/footer nav
│   ├── styles/global.css          # Design tokens + base styles
│   └── consts.ts                  # Site config (single source of truth)
├── astro.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

---

## Getting started

Requires **Node.js 18+** (CI uses Node 20).

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:4321)
npm run dev

# Type-check + build to ./dist
npm run build

# Preview the production build locally
npm run preview
```

---

## Deploy to GitHub Pages

Deployment is fully automated via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Push this repository to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to
   **GitHub Actions**.
3. Every push to `main` builds the site and deploys it. No manual steps required.

### Connect a custom domain

The site is configured for the custom domain **dgsappstudio.com**:

- [`public/CNAME`](public/CNAME) contains the domain (copied into `dist` on every build).
- `site: 'https://dgsappstudio.com'` and `base: '/'` are set in
  [`astro.config.mjs`](astro.config.mjs).

To point the domain at GitHub Pages, add these DNS records with your registrar:

| Type  | Host | Value                        |
| ----- | ---- | ---------------------------- |
| A     | @    | `185.199.108.153`            |
| A     | @    | `185.199.109.153`            |
| A     | @    | `185.199.110.153`            |
| A     | @    | `185.199.111.153`            |
| CNAME | www  | `<your-username>.github.io.` |

Then enable **Enforce HTTPS** in Settings → Pages.

> **No custom domain?** Delete `public/CNAME`, and in `astro.config.mjs` set
> `site: 'https://<username>.github.io'` and `base: '/<repo-name>'`.

---

## Content management (CMS) — how to add a new app

Apps are managed as **Markdown content collections** — no database, no backend, fully static.
**Adding an app requires creating exactly one file:**

```
src/content/apps/<slug>.md
```

The filename becomes the slug and the URL (`/apps/<slug>`). Copy
[`src/content/apps/dharma-path.md`](src/content/apps/dharma-path.md) as a template. The frontmatter
is validated at build time against the Zod schema in
[`src/content/config.ts`](src/content/config.ts):

```yaml
---
title: My New App
tagline: One-line hook.
description: A short paragraph used on cards, meta and RSS.
icon: M12 3l2.4 5.9…            # SVG path (24×24 viewBox)
accent: { from: '#F59E0B', to: '#D97706' }
screenshots: [{ label: Home }, { label: Settings }]
playStoreUrl: https://play.google.com/store/apps/details?id=…   # optional
privacyUrl: /privacy/my-new-app                                  # optional
supportUrl: /support
status: coming-soon            # live | beta | coming-soon
releaseDate: 2026-09-01
version: 1.0.0
categories: [Utilities]
languages: [English]
offline: true
featured: false
order: 2                       # lower = earlier in listings
highlights: [ … ]
features: [{ title, description, icon }]
roadmap:   [{ title, description, status }]
faqs:      [{ question, answer }]
changelog: [{ version, date, notes: [ … ] }]
---

Long-form "About this app" copy goes in the Markdown body and is rendered on the
detail page. Use normal Markdown here.
```

That single file automatically produces:

- a card on the home page and `/apps` listing,
- a full detail page at `/apps/<slug>` (hero, screenshots, features, roadmap, **changelog**, FAQ),
- an entry in the **sitemap** and the **RSS feed** (`/rss.xml`),
- **JSON-LD** (`SoftwareApplication`, `BreadcrumbList`, `FAQPage`) for rich results.

Set `draft: true` to keep an app out of production builds while you work on it (it still shows in
`npm run dev`).

## How to add a privacy policy

1. Set `privacyUrl: /privacy/<slug>` in the app's Markdown frontmatter — it then appears on the
   `/privacy` hub automatically.
2. Create `src/pages/privacy/<slug>.astro` using the `LegalLayout` component. Copy
   [`privacy/dharma-path.astro`](src/pages/privacy/dharma-path.astro) as a starting point and edit
   the sections and `toc`. (Legal pages stay as `.astro` so each policy can have bespoke structure;
   the app catalogue is the part that is fully data-driven.)

## How to change branding

Brand values are defined in three coordinated places:

- **Colors:** [`tailwind.config.js`](tailwind.config.js) (`brand` / `ink` scales) and CSS variables
  in [`src/styles/global.css`](src/styles/global.css) (light + dark tokens).
- **Metadata & contacts:** [`src/consts.ts`](src/consts.ts) — site name, URL, tagline, email
  addresses, social links.
- **Logo:** [`src/components/Logo.astro`](src/components/Logo.astro), plus `public/favicon.svg`
  and `public/og-image.svg`.

---

## SEO & performance

- Per-page meta, Open Graph and Twitter cards via
  [`BaseHead.astro`](src/components/BaseHead.astro): canonical URLs, `robots` directives,
  `og:image` dimensions/alt, and image-type detection.
- **Structured data (JSON-LD):** `Organization` + `WebSite` on every page (defined once in
  `BaseLayout`), plus `SoftwareApplication`, `BreadcrumbList` and `FAQPage` on app detail pages —
  merged into a single deduplicated `@graph`-style list.
- `robots.txt`, an auto-generated sitemap with per-route `priority`/`changefreq`/`lastmod`, and a
  PWA `site.webmanifest`.
- Ships almost no JavaScript (~2 KB): theme toggle, mobile menu, scroll reveals and hover
  prefetch. Scroll handling is `requestAnimationFrame`-throttled and uses compositor-only
  transforms.
- Self-hosted Inter variable font (weight axis only, `unicode-range` subsetted), lazy reveal
  animations, and full `prefers-reduced-motion` support.

## Accessibility

- WCAG 2.1 AA color contrast in **both** themes via the `--brand-text` token
  (`.text-brand`), which resolves to an accessible orange per theme (light ≈ 5.0:1, dark ≈ 8.3:1).
- Skip-to-content link, focusable `<main>`, visible `:focus-visible` rings, semantic landmarks,
  `aria-current` on active nav, labelled controls, and `aria-hidden` on decorative SVGs.
- Content is fully visible without JavaScript — the scroll-reveal hidden state is scoped to
  `html.js` so no-JS and pre-hydration users never see empty sections.

## Security

GitHub Pages serves static files and cannot set custom HTTP response headers (CSP, HSTS, etc.).
This project applies what a static host allows: a `referrer` meta policy, `rel="noopener
noreferrer"` on external links, and no third-party runtime scripts. If you later move behind a CDN
(Cloudflare, Netlify) you can add a full security-header set there.

## Localization (i18n) readiness

The codebase is structured so localization can be added without a rewrite:

- **No hard-coded strings in logic** — content lives in `src/data/*` and page templates; site-wide
  strings live in `src/consts.ts`.
- `<html lang>` and `og:locale` are centralized in `BaseLayout` / `BaseHead`.
- To go multilingual: add locale folders under `src/pages/<lang>/`, move copy into per-locale data
  files (or Astro content collections), and set Astro's `i18n` routing config. The header, footer
  and cards already read from data, so they localize automatically.

## Scaling to 100+ apps

- Every app is one entry in `src/data/apps.ts`; the `/apps/[slug]` dynamic route, the listing grid,
  the home "latest app" section and the sitemap all derive from that array.
- Per-app assets (icons, gradients, screenshots) are described as data, so there are no bespoke
  page files per app unless you want one.
- Privacy policies scale one file per app under `src/pages/privacy/`, all sharing `LegalLayout`
  and the `.prose-legal` typographic system — no duplicated markup.

## Placeholders to replace before launch

- Email addresses in `src/consts.ts` (`support@`, `privacy@`, `contact@`).
- Social URLs and the Twitter handle in `src/consts.ts` (`SOCIAL`) / `BaseHead.astro`.
- **`public/og-image.svg`** — most social platforms (Facebook, LinkedIn, X) do **not** render SVG
  share images. Export a **1200×630 PNG** (`og-image.png`) and set `SITE.ogImage` to it.
- Optional PNG icons: `public/favicon.ico` and `public/icons/apple-touch-icon.png`, then re-add
  their `<link>` tags in `BaseHead.astro` (removed by default to avoid 404s until they exist).
- Real screenshots and the Google Play URL for each app.

---

## License

© DGS App Studio. All rights reserved.
