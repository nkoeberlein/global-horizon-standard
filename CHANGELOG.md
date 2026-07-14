# Changelog

All notable changes to the Global Horizon Standard monorepo.

## ghs-time 2.0.0 — 2026-07-14 (12026.05.07)

### Breaking: epoch-based calendar conversion

The converter previously anchored **every** GHS year at 21 March (Gregorian). That made GHS years 365/366 real days long — contradicting the 364/371-day spec — with three consequences: up to three consecutive real days mapped to the same GHS date (`13.28`), Aurora days A.2–A.7 were unreachable, and `parseGHSDate`/`getGHSDate` were not inverses.

The calendar is now anchored at a single epoch — **10001.01.01 = 21 March 1 CE (proleptic Gregorian), 00:00 UTC** — with all other year starts derived by chaining the 364/371-day year lengths. Year starts drift within 16–24 March, centered on the spring equinox; in the modern era **12026.01.01 = 2026-03-18**.

**Migration:** GHS dates produced by 1.x shift by up to ~6 days depending on the year. The day ↔ date mapping is now bijective and round-trip safe.

Further breaking changes:

- `parseGHSDate` validates all components and throws `RangeError` for out-of-range input (previously returned garbage dates silently).
- `formatGHS` no longer accepts arbitrary strings as format (use `GHSFormat` / `isGHSFormat`).
- `data/holidays.json` removed — holidays now live in `ghs-time` as typed data (`HOLIDAYS`, `getHolidaysForYear`). Static Gregorian equivalents were dropped because they vary by year (several were wrong); they are now computed.

### Added

- `parseGHSString()` — strict, validating parser for `YYYYY.MM.DD [@BBB]` strings (shared by CLI and API).
- `GHSDateResult.dayOfYear`, `.weekOfYear` (1–52), `.quarter` (1–4) — week/quarter per spec §4; `null` during the Aurora Week.
- `GHS_FORMATS`, `isGHSFormat()`, `EPOCH_MS`, `EPOCH_YEAR_HE`, `getYearStartMs()`.
- Holidays: `HOLIDAYS`, `getHolidaysForYear(era)`.
- Test suite (Vitest): bijectivity, Aurora reachability, 400-year cycle, drift window, validation.

### Ecosystem

- **ghs-api**: `GET /holidays?year=`, 400 responses for invalid `format`/dates, JSON 404/500 handlers, single timestamp in `/now`.
- **ghs-cli**: `ghs holidays [year]`, format/year validation, version read from package.json.
- **ghs_mobile** (Flutter): Dart converter ported to the epoch-based algorithm; tests updated.
- **ghs-ui / ghs-web**: clock and beat displays repaint on coarse intervals instead of 60 fps rAF loops; canvas sizing out of the draw loop.
- **Tooling**: Biome (lint + format) across the repo, GitHub Actions CI (lint → build → test).
