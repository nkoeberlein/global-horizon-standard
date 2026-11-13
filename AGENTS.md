# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Commands

```bash
# Full build (core → cli → api → web)
npm run build

# Individual packages
npm run build:core      # tsdown (ESM + CJS dual output)
npm run build:cli       # tsc
npm run build:api       # tsc --noEmit (type-check only; run with tsx)
npm run build --workspace=packages/extension

# Dev servers (each first rebuilds core)
npm run dev:api         # tsx watch on localhost:3000
npm run dev:web         # Vite dev server

# Quality gates (run before committing; CI enforces all)
npm run lint            # Biome (lint + format check), config in biome.json
npm run lint:fix        # Biome auto-fix
npm test                # Vitest — packages/*/tests/**/*.test.ts (needs core built)

# Flutter app
cd packages/mobile && flutter test
```

## Architecture

npm workspaces monorepo, all packages under `packages/`. Dependency graph:

```
ghs-time (core)  ←  ghs-cli
                 ←  ghs-api
                 ←  ghs-web
                 ←  ghs-extension
ghs_mobile (Flutter) — independent Dart port of core
```

### `packages/core` — `ghs-time` (v3)
Single source of truth for all GHS logic. Built with **tsdown** into dual ESM/CJS output (`dist/`). **Must be built before other packages and before `npm test`.**
- `src/epoch.ts` — the calendar origin: `12000.01.01 = Unix day 11,036` (2000-03-20 UTC, the March equinox of 2000, a Monday). Year starts derive in closed form (`getYearStartMs`) from the 364/371-day year lengths (`resolveYear`). Never anchor years at a fixed Gregorian date — that reintroduces the duplicate-date/unreachable-Aurora bug (see CHANGELOG 2.0.0).
- `src/aurora.ts` — `EPSILON` (`286`), `isAuroraYear` (`(71Y+286) mod 400 < 71`), `getDaysInYear`.
- `src/era.ts` — `assertEra` (`MIN_ERA`…`MAX_ERA`), `formatEra`.
- `src/converter.ts` — `getGHSDate` (Date → `GHSDateResult` incl. numeric `beatsExact`), `parseGHSDate` (GHS → Date, validating, throws `RangeError`), `getSolarNoonBeat` (longitude → `@Beat`).
- `src/parse.ts` — `parseGHSString` (`[GHS ]YYYYY.MM.DD[@BBB]`; returns `null` for non-GHS-shaped input, throws `RangeError` on out-of-range components).
- `src/format.ts` — `formatGHS`, `GHS_FORMATS`, `isGHSFormat`.
- `src/holidays.ts` — `HOLIDAYS`, `getHolidaysForYear` (Gregorian dates are computed per year, never stored).
- `src/constants.ts` / `src/types.ts` — shared constants (`DAY_MS`, `MIN_ERA`, `MAX_ERA`, `MONTH_NAMES_GHS`, `WEEKDAYS_GHS`), `GHSDateResult`.
- `tests/` — Vitest suites; `converter.test.ts` holds the bijectivity property test and `spec/vectors.json` conformance checks.

### `packages/api` — `ghs-api`
Hono HTTP server. Type-checked with `tsc --noEmit`, run with `tsx`.
- `src/app.ts` — exports the Hono app and routes (`/`, `/now?format=`, `/convert?date=`, `/holidays?year=`).
- `src/index.ts` — entrypoint only: `serve(app)` on `PORT` (default 3000).
- `tests/app.test.ts` — endpoint tests via `app.request()`, no running server needed.
- Input validation delegates to `ghs-time`; `RangeError` becomes HTTP 400 in `app.onError`; all error responses are JSON with an `error` field.

### `packages/cli` — `ghs-cli`
Commander terminal CLI (`ghs` binary). CommonJS output via `tsc` (`moduleResolution: nodenext`).
- `src/index.ts` — commands: default (current time), `convert`, `clock`, `cal`, `holidays`. Reads version from `../package.json` at runtime (`__dirname` available in CJS).
- `src/badge.ts` — minimal `YYYYY.MM.DD @BBB` output consumed by `.github/workflows/update-badge.yml`.

### `packages/web` — `ghs-web`
Official GHS landing page and dashboard. React 19 + Vite + Tailwind CSS 4 + React Router 7.
- `src/App.tsx` — routes (home, imprint, privacy).
- `src/components/` — `HeroSection.tsx` (headline + live UTC Gregorian↔GHS comparison), `VisualizerSection.tsx` (calendar grid + clock card + day progress via `beatsExact`), `GHSAnalogClock.tsx` (10-segment canvas analog `@Beats` clock, 100 ms repaint), `CalendarGrid.tsx` (13 month cards + Aurora Week card, refreshes at UTC midnight), `PhilosophySection.tsx`, `Layout.tsx`, `Footer.tsx`.
- Warm organic palette (`#c8903a` amber, `#2d2926` charcoal, `#faf9f6` cream). Live displays use coarse `setInterval`s (100–250 ms) — never 60 fps `requestAnimationFrame` loops.

### `packages/extension` — `ghs-extension`
Browser extension (Manifest V3) showing live GHS time. React 19 + Vite + `vite-plugin-web-extension`.
- `src/background.ts` — MV3 service worker; updates the action badge with current beats via `chrome.alarms`.
- `src/popup/Popup.tsx` — popup UI polling every 864 ms (1 centibeat). Buttons require explicit `type="button"` (Biome a11y rule).

### `packages/mobile` — `ghs_mobile`
Self-contained Flutter app (Android/iOS).
- `lib/core/ghs_converter.dart` — pure Dart port of `packages/core/src` (`getGhsDate`, `parseGhsDate`, `parseGhsString`, `parseGhsComponents`, `getSolarNoonBeat`, `formatGhs`). **Any change to core conversion logic must be mirrored here and in `spec/vectors.json` / `packages/mobile/test/fixtures/vectors.json`.**
- `lib/screens/home_screen.dart` — live GHS clock (`Timer.periodic` 1 s).
- `lib/screens/converter_screen.dart` — bidirectional converter delegating to `ghs_converter.dart`.
- `test/core/ghs_converter_test.dart` — unit tests and `test/fixtures/vectors.json` conformance suite.

## Planning

- `TODO.md` — tracked core audit items and decisions (D1, C2–C5, P1, P2)
- `ROADMAP.md` — release sequencing and repository architecture

## Key Domain Concepts

- **Human Era (HE):** Gregorian year + 10,000 from GHS new year through 31 Dec (2026 → 12026)
- **Epoch:** `12000.01.01 = Unix day 11,036` (2000-03-20 UTC, a Monday); year starts drift 17–25 March (modern era: `12026.01.01 = 2026-03-23`), and GHS weekdays coincide 1:1 with the legacy seven-day week
- **@Beats:** 1 day = 1,000 beats (1 beat = 86.4 s), anchored to UTC midnight
- **Aurora Week:** 7-day leap week (`A.1`–`A.7`) after Luna, 71× per 400 years; outside months, weeks, and quarters (`month`/`weekOfYear`/`quarter` are `null`)
- **GHS timestamp:** `YYYYY.MM.DD @BBB` (e.g. `12026.01.15 @685`); Aurora: `YYYYY.A.DD`
- Month 01 ("March") begins at the GHS new year; a GHS year is always exactly 364 or 371 days

## Conventions

- TypeScript everywhere; no `any` (Biome enforces `noExplicitAny`)
- Biome formats: 2-space indent, single quotes, line width 100
- New date logic needs tests (`packages/<pkg>/tests/`); the bijectivity property test in `core/tests/converter.test.ts` and `spec/vectors.json` are the canonical guards against calendar regressions
