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
3. The site is served at `https://<username>.github.io/cv/`. All asset paths are relative, so it works from a sub-path.
4. Custom domain: add a `CNAME` file containing the domain and point DNS at GitHub Pages.

## Before publishing

- GitHub profile URL is set in `assets/app.js` (`GITHUB_URL`).
- Make `og:image` absolute once the final URL is known (for example `https://<username>.github.io/cv/assets/og.jpg`) and add `<meta property="og:url">`; link previews on LinkedIn/WhatsApp need absolute URLs.
- Translations live in `assets/i18n.js`; every key must exist in all three languages (the console warns if one is missing).
- Image sources are listed in `assets/work/SOURCES.md`.
