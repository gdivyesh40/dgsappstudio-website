# Launch Checklist — First Public Release

The final go/no-go list for the first public launch of **dgsappstudio.com**. Work top to bottom.
Related guides: [DEPLOYMENT.md](DEPLOYMENT.md) · [DNS_SETUP.md](DNS_SETUP.md) ·
[GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md) · [ADMOB_SETUP.md](ADMOB_SETUP.md) ·
[MAINTENANCE.md](MAINTENANCE.md).

> Every code placeholder is tagged `TODO(launch)`. Find them all with:
> `grep -rn "TODO(launch)" src public`

---

## 1. Content & branding

- [ ] `src/consts.ts` → `SITE.founded` is correct.
- [ ] `src/consts.ts` → `CONTACT` mailboxes (`support@`, `privacy@`, `contact@`) **exist and are
      monitored**.
- [ ] `src/consts.ts` → `SOCIAL` links point to real, live profiles (or are removed).
- [ ] `src/components/BaseHead.astro` → `twitterHandle` matches `SOCIAL.x`.
- [ ] Replace `public/og-image.svg` with a real **1200×630 PNG** (`public/og-image.png`) and set
      `SITE.ogImage = '/og-image.png'`. (Social platforms don't render SVG.)
- [ ] (Optional) Add `public/favicon.ico` and `public/icons/apple-touch-icon.png`, then re-add their
      `<link>` tags in `BaseHead.astro`.

## 2. Apps

- [ ] Each app in `src/content/apps/*.md` has final copy, `screenshots`, `version`, `releaseDate`.
- [ ] Uncomment `playStoreUrl` for any app that is live on Google Play.
- [ ] Every app that ships has a matching privacy page (`privacyUrl` → `src/pages/privacy/<slug>.astro`).

## 3. Legal

- [ ] `src/pages/terms.astro` and every `src/pages/privacy/*.astro` reviewed; "Last updated" dates
      current.
- [ ] Privacy policy matches the app's actual data collection (keep it in sync with the Play
      **Data safety** form — see [GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md)).

## 4. Monetization (only if running ads)

- [ ] `public/app-ads.txt` updated with the real AdMob publisher ID and line uncommented.
- [ ] AdMob "app-ads.txt" status shows **Found / verified** (can take 24–48 h). See
      [ADMOB_SETUP.md](ADMOB_SETUP.md).

## 5. Build & quality gates

- [ ] `npm ci` succeeds on a clean checkout.
- [ ] `npm run build` completes with no errors.
- [ ] `npx astro check` → **0 errors, 0 warnings, 0 hints**.
- [ ] `grep -rn "TODO(launch)" src public` returns nothing outstanding.
- [ ] Spot-check `dist/`: `CNAME`, `robots.txt`, `sitemap-index.xml`, `rss.xml`, `app-ads.txt`
      all present.

## 6. Deployment (GitHub Pages)

- [ ] Repo pushed to GitHub; **Settings → Pages → Source = GitHub Actions**.
- [ ] Deploy workflow (`.github/workflows/deploy.yml`) run is green.
- [ ] Site loads at the `*.github.io` URL before DNS cutover. See [DEPLOYMENT.md](DEPLOYMENT.md).

## 7. Custom domain & DNS (Namecheap)

- [ ] Namecheap A records (apex) + `www` CNAME added per [DNS_SETUP.md](DNS_SETUP.md).
- [ ] GitHub Pages **Custom domain** = `dgsappstudio.com`; DNS check passes.
- [ ] **Enforce HTTPS** enabled (after the certificate is issued).
- [ ] `https://dgsappstudio.com` and `https://www.dgsappstudio.com` both resolve and redirect
      correctly.

## 8. Post-deploy verification (live URL)

- [ ] All nav links, footer links and app pages load (no 404s); the custom 404 renders for a bad URL.
- [ ] `https://dgsappstudio.com/sitemap-index.xml`, `/rss.xml`, `/robots.txt`, `/app-ads.txt` load.
- [ ] Run `npx lighthouse https://dgsappstudio.com --view` — Performance / A11y / Best Practices /
      SEO all ≥ 95.
- [ ] Validate structured data: <https://validator.schema.org/> and Google Rich Results test.
- [ ] Social preview looks right: <https://www.opengraph.xyz/> (confirms the PNG OG image).
- [ ] Dark/light toggle, mobile menu and contact form (opens mail client) work on a real phone.

## 9. Search & analytics (recommended)

- [ ] Add the site to **Google Search Console** (DNS TXT or HTML-file verification) and submit
      `https://dgsappstudio.com/sitemap-index.xml`.
- [ ] (Optional) Add a privacy-friendly analytics tag.

## 10. Google Play (per app)

- [ ] Store listing uses the live URLs (see [GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md)):
      Website, Privacy policy, Support email.
- [ ] **Data safety** form completed and consistent with the privacy policy.
- [ ] After the app goes live, uncomment its `playStoreUrl` and redeploy.

---

### Rollback

GitHub Pages keeps prior deployments. To roll back, re-run the deploy workflow on the last good
commit (Actions → Deploy → "Re-run") or revert the offending commit and push.
