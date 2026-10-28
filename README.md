# Booker Liao — CV

Single-page personal CV in Traditional Chinese, English and European Portuguese.
Hand-written HTML, CSS and JavaScript. No framework, no build step.

## Run locally

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080/?lang=en> (`zh-TW` / `pt` also work).

## Deploy to GitHub Pages

1. Create a repository (for example `cv`) and push this folder.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. `CNAME` holds `bookerliao.dev`; DNS is a CNAME from the apex to `booker1207.github.io` (Cloudflare, DNS only).

## Before publishing

- GitHub profile URL is set in `assets/app.js` (`GITHUB_URL`).
- Live at https://bookerliao.dev (GitHub Pages, custom domain via `CNAME`). `og:image` / `og:url` / canonical point there.
- Translations live in `assets/i18n.js`; every key must exist in all three languages (the console warns if one is missing).
- Image sources are listed in `assets/work/SOURCES.md`.
