# Project notes for agents

## What this is
Static multi-page site (vanilla HTML/CSS/JS) inside a Vite workspace:
`index.html` is the homepage; `dashboard.html`, `leaderboard.html`, `3Dsim.html` and
`PedroPath.html` are separate full documents. `style.css` and `floatingHexagons.js`
are loaded by relative URL from the repo root. There is **no router** — pages are
reached by their `.html` path (e.g. `/dashboard.html`), and pages are not SPA links.
React/three.js dependencies are present in `package.json` but no React entry point
exists yet, so the Vite dev server just serves the HTML files.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d   # Vite dev server on host :3000
docker compose -f docker-compose.base44.yml logs -f web
```
- Container runs `npm ci` from `package-lock.json` into the `node_modules` named
  volume on every start, then `vite --host 0.0.0.0 --port 5173`. Restart the service
  after changing `package.json`/`package-lock.json`.
- Run project commands inside the container (the sandbox host has no Node):
  `docker compose -f docker-compose.base44.yml exec -T web npm run lint`.
- Changes to HTML/CSS/JS hot-reload; `CHOKIDAR_USEPOLLING` is set because bind mounts
  often drop filesystem events.

## Sandbox/preview specifics
- Vite rejects the preview proxy host by default; `vite.config.js` adds
  `3000-$BASE44_PUBLIC_HOST_SUFFIX` to `server.allowedHosts` **only** when
  `BASE44_PREVIEW_MODE === "1"`. With the flag unset the default host checking stays.
  `BASE44_PREVIEW_MODE` and `BASE44_PUBLIC_HOST_SUFFIX` are passed through in
  `docker-compose.base44.yml`.
- No external services or credentials are required. Google Fonts are pulled by the
  CSS `@import`s at runtime.

## Known pre-existing issues (not fixed)
- The homepage title uses a fixed `250px` (FTC) / `100px` (SIMULATOR), `nowrap`
  heading, so it is clipped on narrow viewports (`overflow-x: hidden` hides the rest).
- HTML references `images/currentLogo.png` while the folder is `Images/`; Vite's dev
  server resolves it case-insensitively, but a case-sensitive static host will 404.
- `3Dsim.html` has nested `<a>` tags and a stray closing `</div>` in `index.html`;
  browsers tolerate it.
