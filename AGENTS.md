# FTC Simulator (Base44 dev environment)

Static multi-page site served by Vite from the repo root; there is no app backend.

## Running it here
- `docker compose -f docker-compose.base44.yml up -d --build` starts one `web` service
  (`node:22`) on host port 3000. Dependencies install into the `node_modules` volume on
  startup, only when `package-lock.json` is newer than the installed tree.
- Vite dev server command: `npx vite --host 0.0.0.0 --port 3000 --strictPort`.
- Pages are plain HTML at the repo root (`index.html`, `3Dsim.html`, `PedroPath.html`,
  `leaderboard.html`, `dashboard.html`) sharing `style.css`. Root-relative module scripts
  such as `/orbitalRail.js` are fine because the Vite root is the repo root.
- `Images/` is capitalised; references like `images/currentLogo.png` (e.g. in `3Dsim.html`)
  do not resolve on a case-sensitive filesystem.

## Homepage structure (layout-enhancements)
- `index.html` — header markup (`headerNav.js` toggles the mobile drawer), hero with
  `.ink-reveal` Monoton titles.
- `orbitalRail.js` — builds the fixed `.orbital-rail`: the Bezier scroll spine, the five
  hexagonal waypoints, and the dial that rides the curve. Hexagon coordinates live in
  `HEX_NODES`; the curve is generated through their centres, so moving a hexagon keeps the
  line passing through it. Rail progress is page scroll, so the homepage needs to scroll
  (`body.homepage { min-height: 180vh }`).
- The ink reveal masks the title with six growing radial blooms whose radii are registered
  CSS custom properties (`@property --ink-1…6`); `prefers-reduced-motion` drops straight to
  the finished text.

## Checking changes
- `npm run lint` inside the container runs ESLint (no test suite exists).
- Visual checks: load `/` and scroll to confirm the dial travels the curve and hexagons
  activate; resize below 820px for the hamburger drawer, below 900px the rail is hidden.
