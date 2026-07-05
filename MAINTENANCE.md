# Maintenance Guide

Day-to-day content operations. The site is a static Astro build with a **Markdown CMS** — most
updates are edits to one Markdown file, committed and pushed. Every push auto-deploys (see
[DEPLOYMENT.md](DEPLOYMENT.md)).

```bash
npm install       # first time
npm run dev        # local preview at http://localhost:4321
npm run build      # production build → dist/
npx astro check    # types + content-schema validation (run before pushing)
```

---

## 1. Add a new app

**One file.** Create `src/content/apps/<slug>.md`. The filename becomes the URL (`/apps/<slug>`).

1. Copy an existing app as a template:
   ```bash
   cp src/content/apps/dharma-path.md src/content/apps/festival-calendar.md
   ```
2. Edit the frontmatter. Required/validated fields (schema in
   [`src/content/config.ts`](src/content/config.ts)): `title`, `tagline`, `description`, `icon`
   (24×24 SVG path). Everything else has sensible defaults. Useful fields: `status`
   (`live`/`beta`/`coming-soon`), `categories`, `languages`, `platforms`, `version`,
   `releaseDate`, `playStoreUrl`, `privacyUrl`, `featured`, `order`, `highlights`, `features`,
   `roadmap`, `faqs`, `changelog`.
3. Write the long-form "About this app" copy in the Markdown **body** (below the `---`).
4. `npx astro check && npm run build`, then commit & push.

What you get automatically: a card on the home page and `/apps`, a full detail page, a **sitemap**
entry, an **RSS** item, and **JSON-LD** (`SoftwareApplication`, `BreadcrumbList`, `FAQPage`).

> Work in progress? Set `draft: true` — hidden in production, visible in `npm run dev`.

Full field reference: see the "Content management (CMS)" section of [README.md](README.md).

---

## 2. Update screenshots

Screenshots are currently rendered as **styled placeholders** driven by the `screenshots` list in
each app's frontmatter:

```yaml
screenshots:
  - label: Home & Daily Panchang
  - label: Scripture Reader
```

To change the captions/order, edit that list.

**To use real screenshot images:**

1. Add the image files to `public/screenshots/<slug>/` (e.g. `public/screenshots/dharma-path/home.png`).
   Use portrait phone dimensions (e.g. 1080×2340) and compress them (PNG/WebP).
2. Reference them via the optional `src` field the schema already supports:
   ```yaml
   screenshots:
     - label: Home & Daily Panchang
       src: /screenshots/dharma-path/home.png
   ```
3. Then in [`src/pages/apps/[slug].astro`](src/pages/apps/[slug].astro), render `s.src` in an
   `<img>` (with `alt={s.label}`, `loading="lazy"`, `width`/`height`) inside the carousel when
   present, falling back to the placeholder when it isn't. (The `src` field is already in the schema;
   this is the only template change needed.)
4. Build and push.

---

## 3. Publish a release (app update)

When you ship a new version of an app on Google Play:

1. In the app's `src/content/apps/<slug>.md`:
   - bump `version` and set `releaseDate`,
   - prepend a `changelog` entry:
     ```yaml
     changelog:
       - version: 1.1.0
         date: 2026-09-15
         notes:
           - Added audio playback for Aarti.
           - Fixed calendar timezone bug.
     ```
   - if this is the app's **first** public release, uncomment `playStoreUrl` and set `status: live`.
2. `npm run build`, commit, push.

The detail page shows the new version in the hero, a **Release history** section from `changelog`,
and the release date flows into the app's JSON-LD (`softwareVersion`, `datePublished`) and the RSS
feed.

> Keep the site's per-release notes consistent with the Play Console "What's new" text.

---

## 4. Update a privacy policy

Privacy pages are `.astro` files (so each can have bespoke structure) under `src/pages/privacy/`.

**Edit an existing policy:** open `src/pages/privacy/<slug>.astro`, update the sections and the
`updated` date passed to `LegalLayout`. Whenever you change the app's data practices (e.g. you add
analytics or AdMob), update this page **and** the Play **Data safety** form together
(see [GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md) and [ADMOB_SETUP.md](ADMOB_SETUP.md)).

**Add a policy for a new app:**

1. Create `src/pages/privacy/<slug>.astro` — copy
   [`src/pages/privacy/dharma-path.astro`](src/pages/privacy/dharma-path.astro) and edit the `toc`
   and sections.
2. In the app's Markdown, set `privacyUrl: /privacy/<slug>`. It then appears automatically on the
   `/privacy` hub and in the app's download section.

**Terms of Service** live at `src/pages/terms.astro` and apply site-wide — update the "Last updated"
date when you change them.

---

## Routine housekeeping

- **Change branding/colors:** `tailwind.config.js` (`brand`/`ink` scales) + CSS tokens in
  `src/styles/global.css`. Contacts/socials in `src/consts.ts`.
- **Navigation:** `src/data/navigation.ts` (header + footer).
- **Before every push:** `npx astro check` (0 errors expected) and `npm run build`.
- **Dependencies:** review with `npm outdated`; bump periodically and re-run the build. `astro`
  and `@astrojs/sitemap` are intentionally pinned to compatible v4 versions — upgrade them together.
- **Search Console:** after major content changes, resubmit
  `https://dgsappstudio.com/sitemap-index.xml`.
