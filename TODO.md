# TODO

Open work, ordered by priority. Sequencing and releases live in [ROADMAP.md](ROADMAP.md).

Core audit of 2026-11-13 (12026.09.17) against `ghs-time` 2.0.1 (`d178e26`). Baseline: 88 tests
green, Biome clean. Every finding below was reproduced against `packages/core/src`; none is covered
by an existing test. Nothing has been fixed yet — this file holds the proposed solutions.

Design premise: GHS is a new system for the digital age. Compatibility with the legacy calendar is
not a requirement — but where it costs nothing, GHS keeps it. The year starts in (northern) spring.

## D1 · The origin — decided 2026-11-13, implemented in 3.0.0

- [x] Implement option A

**Decision.** The origin is coupled to two things only:

- *Meaning* — the March equinox of 2000 (2000-03-20 07:35 UTC, `@316` on day 1).
- *Definition* — an integer day on the Unix time base: **12000.01.01 = Unix day 11036**, with
  ε = 286. No Gregorian date appears in the normative text.

```
Aurora Year:         (71 × Y + 286) mod 400 < 71
Unix day of Y.01.01: 11036 + 364 × (Y − 12000) + 7 × ⌊(71 × (Y − 12000) + 215) / 400⌋
```

(Checked: the closed form equals anchor-plus-chaining for era −3000 … 16000.)

**What it replaces.** Today's anchor is written in the proleptic Gregorian calendar (`0001-03-21`),
sits in "the year traditionally associated with the birth of Christ" — the anchoring
`spec/era-he.md` §2 rejects — and comes with a fitted ε = 156 that leaves the year start 0.3 d off
centre.

**Why A.** Four options were measured over era 12000–13000 against Meeus' March equinox:

| | Anchor | ε | Year start − equinox | GHS Monday is the legacy … |
|---|---|---|---|---|
| Z · reword only | 12000.01.01 = Unix day 11038 | 156 | −3.8 … +3.3 d (mean −0.3) | Wednesday |
| **A · equinox 2000** | **12000.01.01 = Unix day 11036** | **286** | −3.5 … +3.5 d (mean 0.0) | **Monday** |
| B · equinox 1970 | 11970.01.01 = Unix day 79 | 0 | −3.5 … +3.5 d (mean 0.0) | Saturday |
| C · equinox 2026 | 12026.01.01 = Unix day 20532 | 57 | −3.5 … +3.5 d (mean 0.0) | Friday |

±3.5 d is the floor for any leap-week calendar; A, B and C all reach it. A is the only one whose
anchor is a Monday, so GHS weekdays coincide with the existing seven-day week on every day, forever
(every year is a whole number of weeks). That makes `spec/calendar.md` §6 true as written, at no
astronomical cost. B's ε = 0 is more elegant but gives the week a phase of its own.

ε = 286 is a fitted constant with a stated criterion (centre the year start on the equinox); 285–289
are equivalent within 15 minutes. The 71/400 rule stays: it drifts about 0.05 d per 600 years
against the real equinox.

**Implementation.**

```ts
// epoch.ts — the setUTCFullYear workaround disappears
export const EPOCH_YEAR_HE = 12000;
/** Unix day of 12000.01.01: the UTC day of the March equinox of 2000. A Monday. */
export const EPOCH_UNIX_DAY = 11_036;
export const EPOCH_MS = EPOCH_UNIX_DAY * DAY_MS;
// aurora.ts
export const EPSILON = 286;
return (((71 * yearHE + EPSILON) % 400) + 400) % 400 < 71;
```

**Consequences.**
- Today, 2026-11-13, becomes `12026.09.12` — a Friday in both systems — instead of `12026.09.17`.
- Every date shifts by a whole-year constant: +2 days in 270 of 400 years, −5 days in the other
  130 (as in 12026, whose start moves from 18 to 23 March).
- Aurora Years become … 12019, 12025, 12030, 12036, 12042 …; 12026 is no longer one.
- The Gregorian window becomes 17–25 March — informative only, no longer part of the definition.
- `EPOCH_YEAR_HE` and `EPOCH_MS` are public exports and change value.
- Re-run the holiday calibration test: the mean year start moves 0.3 d later, so a fixed holiday
  may move by one day.

**Touch list.** `core/src/{epoch,aurora,index}.ts`, `core/tests/{epoch,holidays,converter}.test.ts`
(pinned `0001-03-21`, `2026-03-18`, `2027-03-24`, `isAuroraYear(12026)`), `api/tests/app.test.ts`,
`mobile/lib/core/ghs_converter.dart` + its test, `spec/calendar.md` §1 and §5.4–5.5,
`docs/design-compromises.md` §1, `README.md`, `CLAUDE.md`, `packages/core/CLAUDE.md`.

**New guard tests.**
- Week: for every day of a 400-year window,
  `WEEKDAYS_GHS.indexOf(getGHSDate(d).weekday) === (d.getUTCDay() + 6) % 7`.
- Spring: year start minus equinox stays within ±3.6 d for era 11600–13000 (needs a small equinox
  helper in the test, not in core).

## P0 — Logic errors in core

### C2 · Era arguments are unvalidated: infinite loop, silent `Invalid Date`, garbage — 3.0.0

- [x] Add `assertEra`, switch year arithmetic to the closed form

**Evidence.**
- `parseGHSDate(9007199254741202, 1, 1)` and `getHolidaysForYear(-9007199254740994)` never return.
  Above 2⁵³ `y++` no longer changes `y`, so the loop in `getYearStartMs` cannot reach `yearHE`.
  `Number.isInteger` accepts these values. Same class as the `Invalid Date` hang fixed in 2.0.1.
- `parseGHSDate(286000, 1, 1)` returns an `Invalid Date` instead of throwing; so does everything
  below era −261821. This breaks the package rule "invalid input throws `RangeError`".
- `isAuroraYear(12026.5)` → `true`; `getYearStartMs(12026.5)` returns the start of 12027;
  `getDaysInYear(NaN)` → `364`; `getYearStartMs(NaN)` → `NaN`. All four are public exports.

`ghs-api` and `ghs-cli` clamp to 10000–99999 and are not affected; library consumers are.

**Solution.** One shared guard, called by `isAuroraYear`, `getDaysInYear`, `getYearStartMs`,
`parseGHSDate` and `getHolidaysForYear`:

```ts
// constants.ts — eras whose every instant is a valid JS Date (±8.64e15 ms); same under D1
export const MIN_ERA = -261_820;
export const MAX_ERA = 285_759;

// era.ts
export function assertEra(era: number): void {
  if (!Number.isInteger(era) || era < MIN_ERA || era > MAX_ERA) {
    throw new RangeError(`Invalid era: ${era}. Must be an integer in ${MIN_ERA}…${MAX_ERA}.`);
  }
}
```

Then remove the loops altogether. `isAuroraYear(Y)` is true exactly when `⌊(71Y + ε) / 400⌋`
increments at `Y`, so the number of Aurora Years before `Y` is a difference of two floors:

```ts
// epoch.ts
const leapsThrough = (y: number) => Math.floor((71 * y + EPSILON) / 400);

export function getYearStartMs(yearHE: number): number {
  assertEra(yearHE);
  const auroraYears = leapsThrough(yearHE - 1) - leapsThrough(EPOCH_YEAR_HE - 1);
  return EPOCH_MS + ((yearHE - EPOCH_YEAR_HE) * 364 + auroraYears * 7) * DAY_MS;
}

export function resolveYear(ms: number) {
  const days = Math.floor((ms - EPOCH_MS) / DAY_MS);
  let yearHE = EPOCH_YEAR_HE + Math.floor((days * CYCLE_YEARS) / CYCLE_DAYS); // off by ≤ 1
  while (getYearStartMs(yearHE) > ms) yearHE--;
  while (getYearStartMs(yearHE + 1) <= ms) yearHE++;
  return { yearHE, yearStartMs: getYearStartMs(yearHE) };
}
```

The closed form was checked against the shipped loop for era −3000 … 16000 (identical). Keep
`chainedYearStartMs` in `epoch.test.ts` as the independent cross-check. `resolveYear` must clamp
its correction loop at `MIN_ERA`/`MAX_ERA` so the edge of the `Date` range does not throw.
Mirror in Dart (64-bit ints do not hang, but the range check and closed form should match).

**Tests.** `RangeError` for `2**53 + 1202`, `286000`, `-261821`, `12026.5`, `NaN`, `Infinity` on
all five entry points; round-trip at `MIN_ERA` and `MAX_ERA`.

### C3 · `parseGHSDate` beats can roll over into the next day — 3.0.0

- [x] Clamp the millisecond offset

**Evidence.** `parseGHSDate(12026, 13, 28, 999.999995)` returns `2027-03-17T00:00:00.000Z`, which is
`12026.A.01 @000` — a different day (and at a year's last day, a different year). `beats < 1000`
passes validation, but `Math.round(beats * 86_400)` rounds up to 86,400,000. Contradicts
`spec/time-beats.md` §2.1 ("never rounded up … @1000 is never displayed"). Not reachable through
`parseGHSString` (two decimals max), only through the numeric API.

**Solution.**

```ts
const msInDay = Math.min(Math.round(beats * BEAT_MS), DAY_MS - 1);
```

Do not switch to `Math.floor`: float noise makes it lose a millisecond for 6,354 of the 100,000
centibeat values, which would break the `beatsLong` round-trip. Mirror in Dart
(`ghs_converter.dart:244`). Test: every `beats` in `[0, 1000)` stays on the requested GHS date.

### C4 · The Easter rule in `HOLIDAYS` yields wrong dates — 3.0.0

- [x] Correct `rule` and `description`

**Evidence.** The rule reads "First Sunday after the first full moon on or after GHS 01.01". Easter
is tied to the ecclesiastical equinox, fixed at 21 March, not to the GHS new year. Checked against
the Gregorian computus for 12000–12399, the rule picks the wrong lunation in about 20 of 400 years:
one too late when the paschal full moon precedes 01.01 (2027: full moon 22 March, `12027.01.01` =
24 March → the rule gives 25 April, Easter is 28 March), one too early when a full moon falls
between 01.01 and 20 March (2038, 2049, 2060 …). Until D1 lands, "Sunday" is ambiguous as well:
Easter Sunday 2026 (5 April) is a GHS Friday today.

**Solution.** State the real definition; with D1 the GHS position becomes a short list:

```ts
rule: 'First Sunday after the ecclesiastical full moon on or after 21 March (Gregorian computus)',
description:
  'Celebrates the resurrection of Jesus Christ. Always a GHS Sunday: 7, 14, 21 or 28 March, or 7 April.',
```

Under D1 Easter falls on 01.07, 01.14, 01.21, 01.28 or 02.07 in 397 of 400 years; in the other
three it precedes the new year (13.28 or A.7 of the previous GHS year) — mention that in the
description or leave it to the computed date. Computing dynamic holidays in core is a roadmap item.

### C5 · `parseGHSString` rejects timestamps the spec declares valid — 3.0.0

- [x] Align the grammar with `spec/timestamp-format.md` (or tighten the spec — pick one)

| Input | Spec | Today |
|---|---|---|
| `12026.01.15@685` | "The space between date and time is optional" | `null` |
| `GHS 12026.01.15 @685` | Legacy-transition prefix, "should be prefixed with GHS" | `null` |
| `110000.03.16`, `-00500.03.17` | emitted by `getGHSDate().fullDate` | `null` — no round-trip |

**Solution.** Accept the optional prefix and optional space:

```ts
const GHS_STRING_RE = /^(?:GHS\s+)?(\d{5})\.(A|\d{2})\.(\d{2})(?:\s*@(\d{1,3}(?:\.\d{1,2})?))?$/i;
```

Keep the era at exactly five digits (lexicographic sorting depends on it) and document on
`GHSDateResult.fullDate` that values outside era 1–99999 are display-only. Add a test pinning that
asymmetry so it is a decision, not an accident. Callers that fall back to `new Date(input)` on
`null` (API `/convert`, CLI) need no change.

## P1 — Spec and docs contradict the implementation

- [x] **`spec/calendar.md` §6** promises that "the Sabbath, Sunday, and Friday cycles remain
      uninterrupted". False today (GHS Monday is the legacy Wednesday), true once D1 lands — no
      rewrite needed, but the claim must not ship before the week guard test is green.
- [x] **`spec/era-he.md` §1** states `Year HE = Gregorian Year + 10,000` without qualification. It
      fails for ~79 days a year: 2027-01-15 is `12026.11.20` ("20 January 12026"). Specify: GHS year
      *N* starts in March of Gregorian year *N* − 10000 and runs into the following March. The
      off-by-one-year trap for GHS January, February and Luna belongs in `docs/design-compromises.md`.
- [x] **`README.md`** says "Year Start: The spring equinox (21 March Gregorian)" — the pre-2.0 fixed
      anchor. Replace with the equinox coupling from D1. The month table there and in
      `spec/calendar.md` §2.1 is still computed from a 21 March start.
- [x] **`spec/timestamp-format.md`**: templates read `YYYY.MM.DD` although five digits are mandatory;
      section headings are German ("Ebene 1–3") in an English document; the `ui` format shipped in
      `GHS_FORMATS` is not specified at all (and renders Aurora redundantly as `A3 Aur 12026 @685`).
- [x] **`spec/time-beats.md` §2** defines the millibeat, but the grammar stops at two decimals
      (`@685.123` → `null`). Either allow three or say that centibeats are the finest notation.

## P2 — Hardening and housekeeping

- [x] **Conformance vectors.** Generate `spec/vectors.json` from core (year starts, Aurora Years,
      date ↔ timestamp pairs, error cases) and assert it in both Vitest and `flutter test`. Replaces
      "mirror by hand" as the guard for the Dart port; D1, C2 and C3 all need mirroring.
- [x] **CI runs Node 24, `package.json` demands `>=25`.** Align one with the other.
- [x] **Vitest warns** that `vitest.config.ts` is ESM loaded as CommonJS — rename to `.mts` or set
      `"type": "module"`.
- [x] **`ghs-api` `/holidays`** uses `Number.parseInt`, so `year=12026abc` is accepted as 12026.
- [x] **Agent files.** Rename root `CLAUDE.md` → `AGENTS.md` and fold the seven
      `packages/**/CLAUDE.md` files into it as short sections (one instruction file per repo).
