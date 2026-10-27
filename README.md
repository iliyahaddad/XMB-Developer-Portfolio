# XMB Developer Portfolio

An interactive developer portfolio inspired by the horizontal-category / vertical-item navigation of console home menus. Plain HTML, CSS and JavaScript. No build step, no dependencies, no tracking.

Data (profile, repositories, languages, README excerpts, activity) is loaded live from the public GitHub API and cached in the browser for 30 minutes.

## Features

- Animated silk-wave canvas background, recoloured automatically by month (or fixed with a theme picker)
- Seven categories: Home, Projects, Stack, Activity, About, Connect, Settings
- Per-repository page: description, stats, language bar, topics, README excerpt, copy-clone button
- Sort and language filters, optional fork display
- Command-palette search (`/` or `Ctrl K`) across every page and repository
- English and Persian with full right-to-left layout
- Keyboard, mouse, touch (swipe) and gamepad control
- Deep links: `#projects/QuickCD`, `#stack/lang:C`, `#settings/theme`
- Graceful states for rate limits and offline use (cached data, then a short built-in list)
- Respects `prefers-reduced-motion`; accessible roles, focus rings, skip link, live announcements
- Content-Security-Policy meta tag, no third-party scripts (only Google Fonts for typefaces)

## Customise

Everything personal lives in **`config.js`**: username, name, tagline, intro, focus areas, approach text, pinned repositories, optional email/website. Every text has an `en` and an `fa` value.

Other files:

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, overlays, SEO tags |
| `styles.css` | Theme variables, layout, responsive rules |
| `app.js` | Data loading, rendering, navigation, input |
| `i18n.js` | English and Persian strings (copy a block to add a language) |
| `wave.js` | Canvas background |
| `assets/` | Favicon, avatar placeholder, social preview image |

## Publish on GitHub Pages

1. Create a repository (for example `iliyahaddad.github.io` or `portfolio`) and upload all files, keeping the folder layout.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions** (the included workflow in `.github/workflows/pages.yml` deploys on every push to `main`), or choose *Deploy from a branch* and select `main` / root.
3. Open the URL shown by GitHub. Link it from your profile README and the repository's *About* box.

To preview locally: `python3 -m http.server 8000` and open `http://localhost:8000` (opening `index.html` as a file also works, but GitHub API calls are more reliable over http).

## Notes

- The GitHub API allows 60 unauthenticated requests per hour per IP. Responses are cached, and the site shows saved data if the limit is hit.
- Add *topics* to your repositories on GitHub and they appear in Stack → Topics and on each project page.
- To self-host fonts (no Google request), download Albert Sans and Vazirmatn, add `@font-face` rules to `styles.css`, remove the Google `<link>` tags and tighten the CSP in `index.html`.
- Independent project inspired by console menus. Not affiliated with or endorsed by Sony Interactive Entertainment. All artwork is original; the sounds (off by default) are synthesised in the browser.

## License

See [LICENSE](LICENSE).

