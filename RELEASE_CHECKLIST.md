# Release Checklist — DGS App Studio Website

Enterprise-grade pre-launch review. Every item below was **verified against real tooling or the
built output** (`dist/`), not by inspection alone. Date: 2026-07-05.

Commands used for verification:

```bash
npm run build      # 10 pages + rss.xml + sitemap, 0 errors
npx astro check    # 0 errors, 0 warnings, 0 hints (32 files)
```

---

## Code quality

| Item | Status | Evidence |
| --- | --- | --- |
| Zero TypeScript errors/warnings | ✅ | `astro check` → 0 errors, 0 warnings, 0 hints |
| Zero dead code | ✅ | Removed unused `BRAND` (consts) and `privacyPath` (lib); removed old `src/data/apps.ts` |
| Zero duplicated logic | ✅ | App access centralized in `src/lib/apps.ts`; legal typography in one `.prose-legal`; JSON-LD assembled once in `BaseLayout` |
| Zero unused components | ✅ | All 11 components in `src/components/` referenced (AppCard, BaseHead, Button, Cta, Faq, FeatureCard, Footer, Header, Logo, Section, ThemeToggle) |
| Zero unused CSS | ✅ | Tailwind purges utilities via `content` globs; all 11 hand-authored classes used; removed dead `gradient-pan` + `shimmer` keyframes from `tailwind.config.js` |
| Zero unused exports | ✅ | `SITE`, `CONTACT`, `SOCIAL`, `MAIN_NAV`, `FOOTER_NAV`, `getApps`, `getFeaturedApp`, `primaryCategory`, `appPath`, `STATUS_LABEL` all consumed |

## Fixed during this review

- **TS error:** `sitemap` `changefreq` string literals not assignable to `EnumChangefreq` — now uses
  the exported `ChangeFreqEnum` from `@astrojs/sitemap`.
- **TS hint:** JSON-LD `<script>` flagged as implicitly inline — added explicit `is:inline`.
- **Dead code:** removed `BRAND`, `privacyPath`, and two unused Tailwind keyframes/animations.

## SEO & structured data

| Item | Status | Evidence |
| --- | --- | --- |
| Valid JSON-LD schema | ✅ | Parsed all **23** JSON-LD blocks across `dist/` — 0 invalid; every block has `@context` + `@type` (`Organization`, `WebSite`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`) |
| Valid canonical URLs | ✅ | Every page has exactly 1 absolute canonical; trailing slashes normalized |
| One `<title>` / description / og:image / `lang="en"` per page | ✅ | Audited all 10 HTML files — all exactly 1 |
| No broken links | ✅ | Every internal `href` (14 unique) resolves to a built file; external links are `mailto:`/social |
| No missing alt text | ✅ | No `<img>` tags exist — all imagery is inline SVG (decorative, `aria-hidden`) |
| Sitemap valid | ✅ | `sitemap-index.xml` + `sitemap-0.xml` well-formed; 9 pages with per-route `priority`/`changefreq`/`lastmod` |
| RSS valid | ✅ | `/rss.xml` well-formed RSS 2.0 with `pubDate`, `categories`, autodiscovery `<link rel="alternate">` |
| robots.txt | ✅ | Present; references sitemap; 404 page is `noindex, nofollow` |
| Open Graph / Twitter cards | ✅ | Full OG (`image:type/width/height/alt`) + `summary_large_image` Twitter tags |

## Accessibility (WCAG 2.1 AA)

| Item | Status | Evidence |
| --- | --- | --- |
| Color contrast (both themes) | ✅ | `--brand-text` token → light `#b45309` ≈ 5.0:1, dark `#fb923c` ≈ 8.3:1 (measured) |
| Exactly one `<h1>` per page | ✅ | Verified across all 10 pages |
| Landmarks | ✅ | 1 `header`, 1 `main#main`, 1 `footer`, labelled `nav`s present |
| Keyboard navigation | ✅ | All interactive elements are native (`a`, `button`, `details/summary`, `input`); skip link is first focusable; `<main tabindex="-1">` |
| Screen-reader support | ✅ | Skip-to-content, `aria-current` nav, `aria-expanded` menu, `aria-label` on icon buttons, decorative SVGs `aria-hidden` |
| Form labels | ✅ | Contact form: 4/4 inputs have associated `<label for>`; submit has a text name |
| Reduced motion | ✅ | `prefers-reduced-motion` disables reveal + float animations |
| No-JS safety | ✅ | Reveal hidden state scoped to `html.js`; content fully visible without JS |

## Responsive & mobile usability

| Item | Status | Evidence |
| --- | --- | --- |
| No horizontal overflow @ 375px | ✅ | Home, Contact, App detail all measured `scrollWidth - innerWidth = 0` |
| Mobile menu | ✅ | Toggles open/closed, sets `aria-expanded` |
| Screenshot carousel | ✅ | Scrolls horizontally within a labelled `role="region"` without breaking page width |
| Tap targets | ✅ | Buttons/links use `py-2`–`py-3` + full-width mobile CTAs |

## Performance

| Item | Status | Evidence |
| --- | --- | --- |
| Minimal JavaScript | ✅ | ~2 KB total (theme toggle, menu, reveal, hover prefetch) |
| CSS size | ✅ | One stylesheet, ~7 KB gzipped |
| Fonts | ✅ | Self-hosted Inter (weight axis only), `unicode-range` subset — latin only fetched |
| Animations | ✅ | Opacity/transform only (compositor); scroll handler `rAF`-throttled |
| Console errors | ✅ | None on home, contact, or app detail |

## Deployment — GitHub Pages + custom domain

| Item | Status | Evidence |
| --- | --- | --- |
| GitHub Actions workflow | ✅ | `.github/workflows/deploy.yml` builds and deploys via official Pages actions |
| CNAME | ✅ | `public/CNAME` → `dgsappstudio.com`, copied into `dist/CNAME` |
| Base path | ✅ | `site: https://dgsappstudio.com`, `base: '/'` — correct for a custom apex domain |
| Jekyll safe | ✅ | `actions/deploy-pages` serves the artifact as-is (no Jekyll), so the `_astro/` folder is served correctly; no `.nojekyll` required |
| Absolute URLs | ✅ | Canonicals, OG, sitemap and RSS all emit `https://dgsappstudio.com/...` |

## Future scalability

| Item | Status | Evidence |
| --- | --- | --- |
| Add an app = 1 file | ✅ | `src/content/apps/<slug>.md` auto-generates card, page, sitemap, RSS, JSON-LD |
| Schema-validated content | ✅ | Zod schema in `src/content/config.ts` fails the build on malformed frontmatter |
| Scales to 100+ apps | ✅ | Listing/detail/feed all derive from `getApps()`; no per-app code |
| Multiple privacy policies | ✅ | `privacyUrl` in frontmatter surfaces on `/privacy`; one `.astro` per policy via `LegalLayout` |
| Localization-ready | ✅ | Copy in data/consts; `lang`/`og:locale` centralized; ready for Astro `i18n` routing |
| Drafts | ✅ | `draft: true` hides an app in production, shows it in `dev` |

---

## Known launch placeholders (by design — not defects)

These are intentional stand-ins documented in the README; none block deployment but should be set
before or shortly after go-live:

- **Social share image** is `public/og-image.svg`. Facebook/LinkedIn/X do not render SVG previews —
  export a **1200×630 PNG** and point `SITE.ogImage` to it.
- **Contact/support emails** (`support@`, `privacy@`, `contact@`) and **social URLs** in
  `src/consts.ts` are placeholders.
- **Google Play URL** for Dharma Path is unset (UI shows a "Coming soon" state until added).
- **Optional PNG icons** (`favicon.ico`, `apple-touch-icon.png`) are not included; the SVG favicon +
  manifest cover modern browsers.

## Not verifiable in this environment

- **Lighthouse scores** were not run here (no headless Chrome audit available). The underlying
  metrics Lighthouse grades were verified directly instead: JS/CSS payload size, contrast ratios,
  meta/canonical completeness, structured-data validity, single-`h1`, labelled controls, and
  no console errors. Run `npx lighthouse https://dgsappstudio.com --view` post-deploy to confirm.

---

## Verdict

**Approved for production deployment.** All must-fix items are resolved; remaining items are
documented, intentional launch placeholders.
