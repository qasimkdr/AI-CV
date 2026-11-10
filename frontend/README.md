# AI CV — Frontend

React 19 + Vite + Tailwind CSS v4 frontend for **AI CV**, the AI resume builder.

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build + SEO step (per-route HTML, sitemap, robots, 404)
npm run preview  # serve the production build
npm run lint
```

## Design system

Light, glassmorphic UI defined in `src/index.css`:

- Tokens: `ink`, `violet`, `sky`, `blush`, `peach`, `mint`, `pearl` (use as Tailwind colors, e.g. `text-ink`, `bg-violet/20`)
- Surfaces: `.glass`, `.glass-strong`, `.glass-tint`, `.aurora` (page background)
- Buttons: `.btn` + `.btn-primary | .btn-glass | .btn-ghost | .btn-danger`, sizes `.btn-sm | .btn-lg`
- Inputs: `.field`
- Fonts: Bricolage Grotesque (headings) + Geist (body), self-hosted

Motion primitives live in `src/components/motion` (`Reveal`, `TiltCard`, `Counter`, `ScoreRing`).

## 3D

WebGL scenes (`src/components/three`) use three.js + React Three Fiber. `Scene3D` lazy-loads them
after the page is idle, pauses rendering off-screen, renders a still frame for reduced-motion users
and falls back to CSS when WebGL is unavailable — three.js never blocks first paint.

## SEO

- Route titles/descriptions, FAQ and JSON-LD: `src/seo/site.js`
- `scripts/seo-build.mjs` writes static `dist/<route>/index.html` with route-specific meta,
  JSON-LD on the home page, `sitemap.xml`, `robots.txt` and a `404.html`
- Set `VITE_SITE_URL` to change the canonical domain (defaults to `https://aicvfrontend.netlify.app`)
- `public/_redirects` serves app routes as SPA and returns real 404s for unknown URLs
