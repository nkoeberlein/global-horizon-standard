# packages/core — ghs-time

Single source of truth for all GHS calendar/time logic. Every other package (CLI, API, web, extension) and the Dart port in `packages/mobile` derive from this.

## Key files
- `src/epoch.ts` — calendar anchor (`10001.01.01 = 0001-03-21 UTC`), `getYearStartMs`, `resolveYear`. The heart of the calendar: year starts chain 364/371-day lengths from the epoch.
- `src/aurora.ts` — leap-week formula `(71Y+156) mod 400 < 71`
- `src/converter.ts` — `getGHSDate` (Date → GHS), `parseGHSDate` (GHS → Date, validating)
- `src/parse.ts` — `parseGHSString` for `YYYYY.MM.DD [@BBB]` strings
- `src/format.ts` — `formatGHS` + `GHS_FORMATS`/`isGHSFormat`
- `src/holidays.ts` — typed holiday data + `getHolidaysForYear`
- `src/constants.ts` / `src/types.ts` — shared constants, `GHSDateResult`
- `tests/` — Vitest suites; `converter.test.ts` holds the bijectivity property test

## Patterns
- All math in UTC milliseconds; days via `Math.floor(ms / DAY_MS)`
- Invalid input throws `RangeError` (never returns garbage dates)
- Build with tsdown (`npm run build:core` from root) — dual ESM/CJS in `dist/`

## Gotchas
- **Never anchor years at a fixed Gregorian date** — the pre-2.0 bug (duplicate dates, unreachable Aurora Week). Year lengths are exactly 364 or 371 days.
- `Date.UTC(1, ...)` maps year 1 to 1901 — epoch uses `setUTCFullYear`.
- Any behavioral change here must be mirrored in `packages/mobile/lib/core/ghs_converter.dart`.
