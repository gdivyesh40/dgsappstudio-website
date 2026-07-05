# AdMob Setup — app-ads.txt

How to authorize AdMob to sell your apps' ad inventory by publishing **app-ads.txt** on
dgsappstudio.com. This is only needed if you monetize with ads.

The file lives at [`public/app-ads.txt`](public/app-ads.txt) and is served at
**https://dgsappstudio.com/app-ads.txt** after deploy.

---

## Why app-ads.txt

`app-ads.txt` is an IAB standard that lets buyers verify that the sellers offering your app's ad
inventory are authorized. Without it (or with an unverified one), AdMob may restrict demand and you
can lose revenue. Google crawls the file from the **developer website URL** listed on your app's
Play Store listing — so that website URL must be `https://dgsappstudio.com` (see
[GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md)).

---

## Step 1 — Find your publisher ID

AdMob → **Settings → Account information → Publisher ID**. Format:

```
pub-XXXXXXXXXXXXXXXX
```

(16 digits after `pub-`.) This is the same ID used in `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY` app IDs
— use only the `pub-XXXXXXXXXXXXXXXX` portion in app-ads.txt.

## Step 2 — Get the exact line from AdMob

AdMob → **Apps → View all apps → app-ads.txt** (or **Settings → app-ads.txt**). AdMob shows the exact
line(s) to publish. For a standard Google account it is:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

- `google.com` — the ad system domain
- `pub-XXXXXXXXXXXXXXXX` — **your** publisher ID
- `DIRECT` — you have a direct relationship with Google
- `f08c47fec0942fa0` — Google's certification-authority ID (constant)

> If you also use mediation networks (Meta, Unity, AppLovin, etc.), each provides its own line. Add
> every line AdMob/mediation tells you to — one per row.

## Step 3 — Publish it

Edit [`public/app-ads.txt`](public/app-ads.txt), replace `pub-0000000000000000` with your real ID,
and remove the leading `# ` so the line is active:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Commit and push — the file deploys to `https://dgsappstudio.com/app-ads.txt`.

## Step 4 — Verify

1. Load `https://dgsappstudio.com/app-ads.txt` in a browser — confirm the line is present and there
   is **no** `#` in front of it.
2. In AdMob → **app-ads.txt** status. It progresses: **Not found → Pending → Found/Verified**.
   Google re-crawls periodically; verification can take **24–48 hours** (sometimes longer).
3. The Play listing's **Website** must equal `https://dgsappstudio.com` so Google knows where to
   crawl.

---

## Common troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| AdMob shows "app-ads.txt not found" | Not deployed yet, wrong URL, or the app's Play **Website** field isn't `https://dgsappstudio.com`. Google crawls that website root for `/app-ads.txt`. |
| File loads but AdMob says "not found" | The line is still commented (`#`), or has a typo/extra characters. Must be an exact match, one entry per line, plain text. |
| Wrong publisher ID | Use `pub-XXXXXXXXXXXXXXXX` from AdMob → Account information — not the `ca-app-pub-...~...` app ID. |
| Redirects break the crawl | `app-ads.txt` must return **HTTP 200** directly at the root (no redirect to `www` chain that fails). Apex serves it fine on GitHub Pages. |
| Subdomain confusion | Google only checks the **root domain** from the Play listing. Keep the file at the apex (`dgsappstudio.com/app-ads.txt`), which this project does. |
| Verified then dropped to "not found" | The developer website changed, the file was removed, or a deploy overwrote it. `public/app-ads.txt` is committed, so it survives deploys — don't delete it. |
| Multiple apps | One `app-ads.txt` covers **all** apps under the same developer website; you don't need one per app. |

---

## Notes

- No ads = you can leave `public/app-ads.txt` as the documented, fully-commented placeholder. An
  empty/commented file is harmless.
- Keep the **Data safety** form and privacy policy updated when you enable ads — ads collect data
  (advertising ID, usage). See [GOOGLE_PLAY_SETUP.md](GOOGLE_PLAY_SETUP.md).
