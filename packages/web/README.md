# GHS Web

The official GHS landing page and web dashboard at [ghs-time.vercel.app](https://ghs-time.vercel.app).

## Pages

- `/` (`src/pages/index.astro`) — Landing page: live time display, why legacy time fails, concrete advantages bento grid, @Beats visualizer & interactive converter, ecosystem overview
- `/imprint` (`src/pages/imprint.astro`) — Imprint
- `/privacy` (`src/pages/privacy.astro`) — Privacy policy

## Development

```bash
# From repo root (builds core first, then starts Astro dev server)
npm run dev:web
```

```bash
# Production build (static HTML + selective React Islands)
npm run build --workspace=packages/web
```

## Tech Stack

- Astro 7, React 19 (`@astrojs/react` Islands), Tailwind CSS 4 (`@tailwindcss/vite`)
- [`ghs-time`](../core/) for calendar and time logic
