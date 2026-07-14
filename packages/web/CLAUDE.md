# packages/web — ghs-web

Official GHS landing page / dashboard. React 19 + Vite + Tailwind CSS 4 + React Router 7.

## Key files
- `src/App.tsx` — routes (home, imprint, privacy)
- `src/components/` — page sections (see its CLAUDE.md)
- `src/pages/` — ImprintPage, PrivacyPage
- `vite.config.ts` — aliases `ghs-time`/`ghs-ui` **directly to their TypeScript source** (workaround: exFAT has no symlinks, so npm workspace links don't work here)

## Patterns
- Warm organic palette via inline hex values (`#c8903a` amber, `#2d2926` charcoal, `#faf9f6` cream) — match existing colors when adding UI
- Live time displays poll on coarse `setInterval`s (250 ms), never 60 fps rAF loops
- Dev: `npm run dev:web` from root (builds core first)

## Gotchas
- Because of the source aliases, changes in `packages/core/src` are picked up by Vite without rebuilding core — but Node-based consumers (CLI/API/tests) still need `npm run build:core`
