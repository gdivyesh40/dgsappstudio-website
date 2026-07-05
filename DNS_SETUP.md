# DNS Setup — Namecheap → GitHub Pages

Exact DNS records to point **dgsappstudio.com** (registered at Namecheap) at GitHub Pages.

Where: Namecheap → **Domain List → Manage** (for dgsappstudio.com) → **Advanced DNS** tab →
**Host Records**.

---

## Records to add

### A records (apex `@`) — required

GitHub Pages' four IPv4 addresses. Add **all four**.

| Type     | Host | Value             | TTL       |
| -------- | ---- | ----------------- | --------- |
| A Record | `@`  | `185.199.108.153` | Automatic |
| A Record | `@`  | `185.199.109.153` | Automatic |
| A Record | `@`  | `185.199.110.153` | Automatic |
| A Record | `@`  | `185.199.111.153` | Automatic |

### CNAME record (`www`) — required

| Type        | Host  | Value                     | TTL       |
| ----------- | ----- | ------------------------- | --------- |
| CNAME Record| `www` | `<your-github-user>.github.io.` | Automatic |

> Replace `<your-github-user>` with the GitHub account (or org) that owns the repo. If the repo is
> `dgsappstudio/dgsappstudio-website`, the value is `dgsappstudio.github.io.` (Namecheap adds the
> trailing dot automatically; including it is fine.)

### AAAA records (apex `@`) — optional but recommended (IPv6)

| Type       | Host | Value                    | TTL       |
| ---------- | ---- | ------------------------ | --------- |
| AAAA Record| `@`  | `2606:50c0:8000::153`    | Automatic |
| AAAA Record| `@`  | `2606:50c0:8001::153`    | Automatic |
| AAAA Record| `@`  | `2606:50c0:8002::153`    | Automatic |
| AAAA Record| `@`  | `2606:50c0:8003::153`    | Automatic |

---

## Records to REMOVE

Namecheap adds default parking records that will conflict — delete them:

- ❌ The **CNAME Record** `@ → parkingpage.namecheaphosting.com` (or similar).
- ❌ Any **URL Redirect Record** on `@` or `www` (e.g. "Unmasked" redirect to a parking page).
- ❌ Any stray `A` record on `@` pointing to a Namecheap parking IP.

> **Why no CNAME on `@`?** DNS does not allow a CNAME on the apex/root domain. That's why the apex
> uses four A records and only `www` uses a CNAME.

---

## After saving

1. In the GitHub repo: **Settings → Pages → Custom domain** = `dgsappstudio.com` → **Save**.
   (This repo already includes `public/CNAME`, so the domain is re-applied on every deploy.)
2. Wait for propagation — usually 30 min, up to 24–48 h. Namecheap TTL "Automatic" ≈ 30 min.
3. When GitHub's DNS check passes, enable **Enforce HTTPS**.

Both of these should then work, with `www` redirecting to the apex:

- `https://dgsappstudio.com`
- `https://www.dgsappstudio.com`

---

## Verify from the terminal

```bash
# Apex should return the four GitHub IPs
dig +short dgsappstudio.com A
# → 185.199.108.153 / .109 / .110 / .111

# www should point at your github.io host
dig +short www.dgsappstudio.com CNAME
# → <your-github-user>.github.io.

# End-to-end
curl -sI https://dgsappstudio.com | head -n 1     # HTTP/2 200
```

Online tools: <https://dnschecker.org> (global propagation), GitHub's own DNS check on the Pages
settings screen.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| GitHub: "DNS record could not be retrieved" | Records not propagated yet, or apex still has the parking CNAME. Remove conflicts; wait. |
| Site works on `www` but not apex (or vice-versa) | Add the missing half — apex A records **and** the `www` CNAME are both required. |
| Cert error / "Enforce HTTPS" greyed out | DNS check must pass first; the Let's Encrypt cert is issued afterward (minutes–hour). |
| `dig` shows Namecheap parking IPs | Old A/URL-redirect records still present — delete them. |
| Infinite redirect | You have both a URL Redirect record and the A/CNAME records — remove the redirect record. |
