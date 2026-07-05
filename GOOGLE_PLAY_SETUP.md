# Google Play Setup

The website provides every URL and contact detail the **Google Play Console** requires for a store
listing and the **Data safety** form. This doc lists exactly what to paste where.

All values derive from [`src/consts.ts`](src/consts.ts) and the app's Markdown file in
`src/content/apps/`.

---

## URLs & contact to enter in Play Console

Play Console → your app → **Grow → Store presence → Store listing** (and **App content**):

| Play Console field | Value to enter | Source |
| --- | --- | --- |
| **Website URL** | `https://dgsappstudio.com` | `SITE.url` |
| **App / store listing website** (per app) | `https://dgsappstudio.com/apps/dharma-path` | app slug |
| **Privacy policy URL** | `https://dgsappstudio.com/privacy/dharma-path` | app `privacyUrl` |
| **Support email** | `support@dgsappstudio.com` | `CONTACT.support` |
| **Support website** (optional) | `https://dgsappstudio.com/support` | `/support` |

> Per-app privacy policy is preferred over the generic `/privacy` hub — Google wants a policy that
> describes **that app's** data practices. The hub at `https://dgsappstudio.com/privacy` links to
> each app's policy.

### Privacy policy URL — where to set it in Play Console

**App content → Privacy policy → Enter the URL →** `https://dgsappstudio.com/privacy/dharma-path`.
The page must be publicly reachable (it is, once deployed) and must stay live.

---

## Data safety form

Play Console → **App content → Data safety**. Your answers **must match** what the app actually does
and what the privacy policy at `/privacy/<slug>.astro` states. Keep the two in sync.

Reference the app's privacy policy while filling this out. For **Dharma Path**, the policy
(`src/pages/privacy/dharma-path.astro`) states:

- Reading history, bookmarks and preferences are **stored locally on the device** and not
  transmitted → declare **no data collected** for those, or **data not shared**.
- Optional anonymized crash/diagnostics via Google Play services (if enabled) →
  declare **"App activity / Crash logs / Diagnostics"** as *collected, not shared*, and mark it as
  used for **App functionality / Analytics**.
- No account, no name, no precise location required.

Checklist for the Data safety form:

- [ ] **Does your app collect or share any user data?** — answer honestly per the policy above.
- [ ] For each data type: **collected? shared? ephemeral? required or optional?**
- [ ] **Is data encrypted in transit?** — yes for any network calls (HTTPS).
- [ ] **Can users request deletion?** — the policy explains clearing app data / uninstalling; provide
      `privacy@dgsappstudio.com` as the contact.
- [ ] Confirm the **privacy policy URL** on this form matches the store listing.

> **Rule of thumb:** if you later add analytics, ads (AdMob), or any network feature, update BOTH the
> privacy policy page AND the Data safety form in the same release. See
> [ADMOB_SETUP.md](ADMOB_SETUP.md) — ads change your data-collection answers.

---

## After the app is published

1. Copy the final Play Store URL:
   `https://play.google.com/store/apps/details?id=com.dgsappstudio.dharmapath`
2. In `src/content/apps/dharma-path.md`, uncomment and set `playStoreUrl` (remove the
   `TODO(launch)` note). The detail page and cards switch from "Coming soon" to a live
   **Get it on Google Play** button automatically.
3. Set `status: live` and confirm `version` / `releaseDate` in the same file.
4. Commit and push — the site redeploys.

---

## Quick-copy block

```
Website:        https://dgsappstudio.com
App page:       https://dgsappstudio.com/apps/dharma-path
Privacy policy: https://dgsappstudio.com/privacy/dharma-path
Support page:   https://dgsappstudio.com/support
Support email:  support@dgsappstudio.com
Privacy email:  privacy@dgsappstudio.com
```
