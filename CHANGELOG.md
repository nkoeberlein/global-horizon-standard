# Changelog

All notable changes to the Global Horizon Standard monorepo.

## ghs-time 3.0.0 — 2026-11-13 (12026.09.12)

### Breaking: natural & digital origin (`12000.01.01 = Unix day 11,036`, $\varepsilon = 286$)

The calendar origin is no longer defined via a proleptic Gregorian date in 1 CE (`0001-03-21`). Instead, it is coupled to two things only:

- **Meaning:** the astronomical March equinox of 2000 (`2000-03-20 07:35 UTC`, `@316` on day 1).
- **Normative definition:** **`12000.01.01 = Unix day 11,036`** (`⌊unixMs / 86,400,000⌋ = 11,036`), with phase constant **`EPSILON = 286`** in `(71 × Y + 286) mod 400 < 71`.

Consequences:

- **Optimal equinox centering:** Year starts stay within **±3.5 days** (mean offset `0.0 d`, down from `−0.3 d`) of the astronomical March equinox — the theoretical floor for any leap-week calendar. The informative Gregorian window is now **17–25 March** (`12026.01.01 = 2026-03-23`).
- **1:1 weekday continuity:** Because Unix day `11,036` (`2000-03-20`) is a Monday (`11,036 mod 7 = 4`) and every GHS year is a whole number of weeks (364 or 371 days), **every GHS weekday now coincides with the existing seven-day week on every day, forever** — making `spec/calendar.md` §6 true as written.
- **Migration:** Every date shifts by a whole-year constant (`+2 days` in 270 of 400 years, `−5 days` in the other 130). Aurora Years near the present become `… 12014, 12019, 12025, 12030, 12036 …` (`12025` is an Aurora Year; `12026` is not).
- **Exports:** `EPOCH_YEAR_HE` (`12000`) and `EPOCH_MS` (`953_510_400_000`) change value. `EPOCH_UNIX_DAY` (`11_036`), `EPSILON` (`286`), `MIN_ERA` (`-261_820`), `MAX_ERA` (`285_759`), `assertEra`, and `formatEra` are now exported from `ghs-time`.

### Fixed

- **Era validation and closed-form $O(1)$ year arithmetic (C2):** `assertEra` validates all five era entry points (`isAuroraYear`, `getDaysInYear`, `getYearStartMs`, `parseGHSDate`, `getHolidaysForYear`), throwing `RangeError` for non-integers, `NaN`, or eras outside `MIN_ERA…MAX_ERA` (`-261820…285759`). `getYearStartMs` now uses a closed-form floor difference instead of a loop, removing the `> 2^53` infinite loop and silent `Invalid Date` returns.
- **`parseGHSDate` beat rollover (C3):** Clamps the millisecond offset within the day to `DAY_MS - 1` so fractional beats near `1000` (e.g. `999.999995`) never round up to `86,400,000 ms` and roll over into the next day.
- **Easter Sunday rule in `HOLIDAYS` (C4):** States the Gregorian computus definition (first Sunday after the ecclesiastical full moon on or after 21 March) instead of `GHS 01.01`. Under the Monday-aligned origin, Easter is always a GHS Sunday (`01.07`, `01.14`, `01.21`, `01.28`, or `02.07` in 397 of 400 years).
- **`parseGHSString` grammar alignment (C5):** Accepts the optional `GHS ` legacy-transition prefix and makes the space before `@BBB` optional (`12026.01.15@685`), matching `spec/timestamp-format.md`.
- **`ghs-api` `/holidays` and `ghs-cli` year parsing:** Reject trailing non-numeric characters (e.g. `/holidays?year=12026abc` → 400) that `Number.parseInt` previously accepted.

### Added & Changed

- **Cross-language conformance vectors (`spec/vectors.json`):** Generated from `ghs-time` and asserted in both Vitest and `flutter test` (`ghs_mobile`).
- **`ghs_mobile` (Dart):** Mirrored the v3.0.0 origin, `epsilon = 286`, `assertEra`, closed-form year arithmetic, and beat clamping.
- **Specifications & docs:** Updated `spec/calendar.md`, `spec/era-he.md`, `spec/timestamp-format.md`, `spec/time-beats.md`, `docs/design-compromises.md`, and `README.md`.
- **Tooling:** Renamed `vitest.config.ts` → `vitest.config.mts` to silence the Vite ESM loader warning; aligned root `package.json` `engines.node` (`>=24.0.0`) with CI.

## ghs-time 2.0.1 — 2026-07-31 (12026.05.24)

### Fixed

- **`isAuroraYear` misclassified every era ≤ 0.** The leap-week formula used JavaScript's `%`, which returns negative results for negative operands, so `(71Y + 156) % 400` never normalized into `[0, 400)`. This broke the 146,097-day invariant that `getYearStartMs`/`resolveYear` rely on for their 400-year shortcut: a window of 400 consecutive years starting at −400 summed to 148,393 days instead of 146,097, `getYearStartMs(0)` landed 2,289 days off, `getYearStartMs(-1000)` 6,895 days off, and the 16–24 March drift window scattered across all twelve Gregorian months. Because JavaScript accepts expanded ISO years, this was reachable through the public API — `/convert?date=-011000-01-01` silently returned a wrong date. The modulo is now euclidean. Era ≥ 1 is unaffected; results there are bit-for-bit identical to 2.0.0.

- **`getGHSDate` hung forever on an Invalid Date.** `resolveYear`'s unbounded loop compares `ms < yearStartMs + yearLengthMs`; with `NaN` every comparison is false, so the loop never terminated and the process froze instead of failing. `getGHSDate` now throws `RangeError` for invalid or non-finite dates, matching the package convention. `ghs-api` and `ghs-cli` already guarded their inputs and were never affected — library consumers were.

- **`beats` and `beatsLong` could disagree by a full beat.** `beats` truncated (`Math.floor`) while `beatsLong` rounded (`toFixed(2)`), so ~0.5 % of all instants rendered as e.g. `@001` and `@002.00` simultaneously — visible in the web UI, where HeroSection shows `beats` and VisualizerSection shows `beatsLong`. Both are now derived by integer arithmetic from the millisecond offset in the UTC day and share the same whole-beat component, so they cannot diverge. The `999.99` clamp was a symptom of the same rounding and has been removed.

  **Behavior change:** `beatsLong` output shifts by one centibeat position for the last ~0.43 s of every beat (e.g. `@002.00` → `@001.99`). `beats` and all date components are unchanged.

- **The era was not padded to five digits.** `spec/timestamp-format.md` requires the full 5-digit year in the core format, but `fullDate` emitted `500.01.01`, `9999.01.01`, `1.01.15`. This also broke round-tripping: `parseGHSString('500.01.01')` returned `null` while `'00500.01.01'` parsed fine — the library produced timestamps it could not read back. Era 500 is not a curiosity; `spec/era-he.md` cites Göbekli Tepe at ~500 HE as the showcase for the Human Era. `fullDate`, `HolidayOccurrence.ghsDate`, and the `short` format now pad via a shared sign-aware helper (naive `padStart` turns era −101 into `0-101`). Era ≥ 10000 — all real-world usage — is unchanged.

- **`formatGHS(…, 'short')` rendered single-digit eras as `'1`** instead of `'01`. The Dart port's equivalent (`substring(len - 2)`) threw a `RangeError` outright.

- **`getHolidaysForYear` returned occurrences unsorted.** `HOLIDAYS` is grouped by category, so the output ran `13.16` before `13.01`, then the Aurora Week, then back to `10.28` — surfacing that way in both CLI and API responses, and contradicting the chronological-sorting rationale the spec gives for the big-endian core format. Results are now ordered by date.

- **`ghs cal <non-numeric>` printed a calendar headed `undefined 12026 HE`.** `Number.parseInt('abc')` yields `NaN`, and `NaN < 1 || NaN > 13` is false in both directions, so the guard let it through. It now validates with `Number.isInteger` first.

### Changed

- **The equinox and solstice holidays moved.** They sat on a tidy day-14-of-every-third-month grid, which does not match the sky — the astronomical seasons are unequal because Earth's orbit is elliptical. Measured against the real events across era 12000–12100, the old dates were off by a mean of +4, −6 and −11 days respectively, while their descriptions claimed "the longest day", "day and night are equal" and "the shortest day".

  | Holiday | Old | New | Old mean offset | New |
  |---|---|---|---|---|
  | Summer Solstice Gala | 04.14 | **04.10** | +4 d | 0 |
  | Autumn Equinox Festival | 07.14 | **07.20** | −6 d | 0 |
  | Winter Solstice Ceremony | 10.14 | **10.25** | −11 d | 0 |

  Each new date leaves only the ±4-day drift that is irreducible for a fixed calendar date. `spec/calendar.md` §3 listed the same wrong grid and has been corrected. A calibration test now guards every fixed holiday's drift window.

- `ghs clock` repainted every 86 ms while displaying whole beats, which change every 86,400 ms — 1000× oversampling, and faster than the 100–250 ms convention the repo documents. Now 250 ms.

- `spec/calendar.md` §5.4 now states that `mod` denotes the non-negative residue and flags which languages need `((x % 400) + 400) % 400`; the §5.5 reference implementation reproduced the bug verbatim and has been corrected.
- `spec/time-beats.md` §2.1 (new) pins beat rendering to truncation toward zero at every precision — previously unspecified.
- `ghs_mobile`: beats derivation mirrored to integer arithmetic. Dart's `%` is euclidean, so its `isAuroraYear` was already correct; a regression test now pins that so the ports cannot drift apart again.

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
