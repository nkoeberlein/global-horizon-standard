# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Full build (core → cli → api → web)
npm run build

# Individual packages
npm run build:core      # tsdown (ESM + CJS dual output)
npm run build:cli       # tsc
npm run build:api       # tsc --noEmit (type-check only; run with tsx)

# Dev servers (each first rebuilds core)
npm run dev:api         # tsx watch on localhost:3000
npm run dev:web         # Vite dev server

# Extension / web (within package)
cd packages/extension && npm run build
cd packages/web && npm run build
```

There are no test scripts currently.

## Architecture

This is an npm workspaces monorepo. All packages live under `packages/`. The dependency graph is:

```
ghs-time (core)  ←  ghs-cli
                 ←  ghs-api
                 ←  ghs-ui  ←  ghs-web
                 ←  ghs-extension
```

### `packages/core` — `ghs-time`
The single source of truth for all GHS logic. Built with **tsdown** (rolldown-based) into dual ESM/CJS output. Key exports from `src/ghs-converter.ts`:
- `getGHSDate(date: Date)` — converts a JS Date to a GHS date object
- `parseGHSDate(era, month, day, beats)` — converts GHS back to JS Date
- `formatGHS(ghs, format)` — formats a GHS date (`"core"` | `"ui"` | ...)
- `isAuroraYear(yearHE)` — leap year check using the formula `(71×Y + 156) mod 400 < 71`

**Must be built before any other package** — others depend on `dist/`.

### `packages/api` — `ghs-api`
Hono HTTP server (`@hono/node-server`). Type-checked only at build time (`tsc --noEmit`); run via `tsx`. Endpoints: `GET /`, `GET /now?format=`, `GET /convert?date=`. Accepts both Gregorian (`YYYY-MM-DD`) and GHS (`YYYYY.MM.DD`) date strings.

### `packages/cli` — `ghs-cli`
Commander-based CLI (`ghs` binary). Built with `tsc` using `moduleResolution: nodenext`. Entry: `src/index.ts`.

### `packages/web` — `ghs-web`
React 19 + Vite + Tailwind CSS 4 + React Router 7. Uses `ghs-ui` components directly from source (no build step for `ghs-ui`).

### `packages/ui` — `ghs-ui`
Shared React component library. No build step — consumed directly via TypeScript source (`main: "src/index.ts"`). Peer deps: React 19.

### `packages/extension` — `ghs-extension`
Browser extension built with Vite + `vite-plugin-web-extension`. React 18. Uses `ghs-time` directly.

## TypeScript

All packages use TypeScript 6.0. The CLI uses `moduleResolution: nodenext`. The `ignoreDeprecations: "6.0"` option is set in `packages/cli/tsconfig.json` to suppress TS6 deprecation warnings.

## Key Domain Concepts

- **Human Era (HE):** Gregorian year + 10,000 (e.g. 2026 → 12026)
- **@Beats:** Decimal time — 1 day = 1,000 beats, anchored to UTC midnight
- **Aurora Week:** Leap mechanism — 7-day intercalary week, 71 times per 400-year cycle
- **GHS Timestamp format:** `YYYYY.MM.DD @BBB` (e.g. `12026.01.15 @685`)
- Month numbering starts at the spring equinox (21 March Gregorian = month 01)
