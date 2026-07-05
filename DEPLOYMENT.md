# Deployment — GitHub Pages + Namecheap

How to deploy dgsappstudio.com to **GitHub Pages** with a **Namecheap** apex domain. Deployment is
automated by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml); you only configure it
once.

- **Hosting:** GitHub Pages (static, free, global CDN, free TLS)
- **CI/CD:** GitHub Actions — every push to `main` builds and deploys
- **Domain registrar:** Namecheap (DNS records only — see [DNS_SETUP.md](DNS_SETUP.md))

---

## Architecture

```
push to main ──▶ GitHub Actions ──▶ npm ci → npm run build → dist/
                                       │
                                       └─▶ upload-pages-artifact ──▶ deploy-pages ──▶ GitHub Pages CDN
                                                                                          │
                                                              dgsappstudio.com (Namecheap DNS) ◀┘
```

The build emits `dist/CNAME` (from `public/CNAME`) so GitHub Pages knows the custom domain on every
deploy.

---

## One-time setup

### 1. Push the repository

```bash
git remote add origin https://github.com/<org-or-user>/dgsappstudio-website.git
git push -u origin main
```

### 2. Enable GitHub Pages via Actions

Repo → **Settings → Pages → Build and deployment → Source = GitHub Actions**.

(No branch to pick — the workflow publishes the build artifact directly. Do **not** choose "Deploy
from a branch".)

### 3. First deploy

Pushing to `main` triggers the workflow. Watch it under the **Actions** tab. When green, the site is
live at:

```
https://<org-or-user>.github.io/   (if this is a <user>.github.io repo)
   or
https://<org-or-user>.github.io/dgsappstudio-website/   (project repo, before the custom domain)
```

> **Verify here before touching DNS.** Confirm the site renders, then proceed to the domain.

### 4. Attach the custom domain

Repo → **Settings → Pages → Custom domain** → enter `dgsappstudio.com` → **Save**.

- This repo already ships `public/CNAME` containing `dgsappstudio.com`, so GitHub will detect it.
- GitHub runs a DNS check. It passes once the Namecheap records (next step) have propagated.
- After the check passes, tick **Enforce HTTPS** (the Let's Encrypt cert can take a few minutes to
  an hour to issue).

### 5. Configure Namecheap DNS

Add the A records and `www` CNAME exactly as documented in **[DNS_SETUP.md](DNS_SETUP.md)**.

---

## Config that makes this work

Already set in [`astro.config.mjs`](astro.config.mjs):

```js
site: 'https://dgsappstudio.com',  // absolute URLs for canonical/OG/sitemap/RSS
base: '/',                          // apex custom domain lives at root
```

> If you ever drop the custom domain and serve from `username.github.io/repo`, change `base` to
> `'/repo-name'`, update `site`, and delete `public/CNAME`.

**Jekyll:** not a concern. The official `actions/deploy-pages` serves the uploaded artifact as-is, so
the underscore-prefixed `_astro/` asset folder is served correctly. No `.nojekyll` file is needed.

---

## Routine deploys

```bash
# make changes, then:
git add -A
git commit -m "Update content"
git push        # → Actions builds and deploys automatically
```

Manual trigger: **Actions → Deploy to GitHub Pages → Run workflow** (the workflow allows
`workflow_dispatch`).

---

## Local preview before pushing

```bash
npm run build && npm run preview   # serves dist/ at http://localhost:4321
```

---

## Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| Actions run fails at `npm ci` | Commit `package-lock.json`; ensure Node 20 locally matches CI. |
| 404 on every page after DNS | Custom domain set but `base` wrong — must be `'/'` for the apex domain. |
| CSS/JS 404 (unstyled site) | `base` mismatch, or you deployed a project path without a custom domain. |
| "Domain's DNS record could not be retrieved" | Namecheap records not propagated yet (wait) or wrong — see [DNS_SETUP.md](DNS_SETUP.md). |
| HTTPS checkbox greyed out | Wait for the DNS check to pass; the cert is issued afterward. |
| Custom domain reset to blank after deploy | `public/CNAME` missing/incorrect — it must contain exactly `dgsappstudio.com`. |
| Old content still showing | CDN cache; hard refresh, or wait a few minutes after the deploy completes. |
