# GHS Web

The official GHS landing page and web dashboard at [ghs-time.vercel.app](https://ghs-time.vercel.app).

## Pages

- `/` — Landing page: live time display, @Beats visualizer, philosophy section
- `/imprint` — Imprint
- `/privacy` — Privacy policy

## Development

```bash
# From repo root (builds core first, then starts Vite dev server)
npm run dev:web
```

```bash
# Production build
npm run build --workspace=packages/web
```

## Tech Stack

- React 19, React Router 7, Vite 8, Tailwind CSS 4
- [`ghs-time`](../core/) for calendar and time logic
- [`ghs-ui`](../ui/) for shared components (consumed directly from source)
