# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

# Quality gates (run before committing; CI enforces all three)
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
                 ←  ghs-ui  ←  ghs-web
                 ←  ghs-extension
ghs_mobile (Flutter) — independent Dart port of core
```

### `packages/core` — `ghs-time` (v2)
Single source of truth for all GHS logic. Built with **tsdown** into dual ESM/CJS output. **Must be built before other packages and before `npm test`.** Modules:
- `epoch.ts` — the calendar anchor: `10001.01.01 = 21 March 1 CE (proleptic Gregorian) UTC`. Year starts derive by chaining 364/371-day year lengths (`getYearStartMs`). Never anchor years at a fixed Gregorian date — that reintroduces the duplicate-date/unreachable-Aurora bug (see CHANGELOG 2.0.0).
- `aurora.ts` — `isAuroraYear` (`(71Y+156) mod 400 < 71`), `getDaysInYear`
- `converter.ts` — `getGHSDate` / `parseGHSDate` (validating, throws `RangeError`)
- `parse.ts` — `parseGHSString` (strict string parser; returns `null` for non-GHS-shaped input, throws on out-of-range components)
- `format.ts` — `formatGHS`, `GHS_FORMATS`, `isGHSFormat`
- `holidays.ts` — `HOLIDAYS`, `getHolidaysForYear` (Gregorian dates are computed per year, never stored)

### `packages/api` — `ghs-api`
Hono server. `src/app.ts` exports the app (tested via `app.request()` in `tests/`); `src/index.ts` only serves. Endpoints: `/`, `/now?format=`, `/convert?date=`, `/holidays?year=`. `RangeError` → 400 via `app.onError`.

### `packages/cli` — `ghs-cli`
Commander CLI (`ghs`), CJS build via `tsc`, `moduleResolution: nodenext`. Commands: default (now), `convert`, `clock`, `cal`, `holidays`. Version is read from package.json. `badge.ts` powers the README badge workflow.

### `packages/web` / `packages/ui` / `packages/extension`
React 19 + Vite + Tailwind 4 (web); `ghs-ui` is consumed directly from source (no build). Extension: React 18, MV3. Clocks/beat displays repaint on coarse `setInterval`s (100–250 ms) — do not reintroduce 60 fps rAF loops; beats only change visibly every 864 ms.

### `packages/mobile` — `ghs_mobile`
Flutter app; `lib/core/ghs_converter.dart` is a manual Dart port of core. **Any change to core conversion logic must be mirrored there** (and in its tests).

## Key Domain Concepts

- **Human Era (HE):** Gregorian year + 10,000 (2026 → 12026)
- **Epoch:** 10001.01.01 = 0001-03-21 UTC; year starts drift 16–24 March (modern era: 12026.01.01 = 2026-03-18)
- **@Beats:** 1 day = 1,000 beats (1 beat = 86.4 s), anchored to UTC midnight
- **Aurora Week:** 7-day leap week (A.1–A.7) after Luna, 71× per 400 years; outside months, weeks, and quarters (`month`/`weekOfYear`/`quarter` are `null`)
- **GHS timestamp:** `YYYYY.MM.DD @BBB` (e.g. `12026.01.15 @685`); Aurora: `YYYYY.A.DD`
- Month 01 ("March") begins at the GHS new year; a GHS year is always exactly 364 or 371 days

## Conventions

- TypeScript 6.0 everywhere; no `any` (Biome enforces `noExplicitAny`)
- Biome formats: 2-space indent, single quotes, line width 100
- New date logic needs tests (`packages/<pkg>/tests/`); the bijectivity property test in `core/tests/converter.test.ts` is the canonical guard against calendar regressions
