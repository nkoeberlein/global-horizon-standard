# packages/web/src/components

Page sections and shared UI for the GHS landing page.

## Key files
- `HeroSection.tsx` — headline + live Gregorian↔GHS comparison table (250 ms refresh)
- `VisualizerSection.tsx` — calendar grid + analog clock card + beats progress bar
- `CalendarGrid.tsx` — 13 month cards (perfect 7×4 grids) + Aurora Week card; refreshes at UTC midnight
- `Layout.tsx` — nav shell for subpages, scroll-to-top on route change
- `Footer.tsx`, `GitHubIcon.tsx`, `ObfuscatedContact.tsx`, `PhilosophySection.tsx`

## Patterns
- Date/format logic always via `ghs-time` (`formatGHS`, `MONTH_NAMES_GHS`, …) — no local month-name arrays or date math
- Month cards key by month name, not array index
- During the Aurora Week `ghs.month` is `null` — guard before using it as an index
