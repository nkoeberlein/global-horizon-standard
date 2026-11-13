import { EPSILON } from './aurora';
import { DAY_MS, DAYS_PER_NORMAL_YEAR } from './constants';
import { assertEra } from './era';

/**
 * GHS epoch — the origin from which every year start is derived.
 *
 * - Meaning: the astronomical March equinox of 2000 (2000-03-20 07:35 UTC,
 *   i.e. `@316` on day 1).
 * - Definition: `12000.01.01 = Unix day 11,036` (00:00 UTC).
 *
 * Unix day 11,036 is a Monday (`11036 mod 7 = 4`). Because every GHS year is
 * an exact multiple of 7 days (364 or 371), GHS weekdays coincide with the
 * existing seven-day week on every day, forever. With `EPSILON = 286`, year
 * starts stay within ±3.5 days of the March equinox (17–25 March Gregorian;
 * e.g. `12026.01.01 = 2026-03-23 UTC`).
 */
export const EPOCH_YEAR_HE = 12000;

/** Unix day of 12000.01.01: the UTC day of the March equinox of 2000. A Monday. */
export const EPOCH_UNIX_DAY = 11_036;

export const EPOCH_MS = EPOCH_UNIX_DAY * DAY_MS;

/** Years per leap cycle. */
export const CYCLE_YEARS = 400;

/** Days per 400-year cycle: 400 × 364 + 71 × 7 = 146,097 (matches Gregorian). */
export const CYCLE_DAYS = 146_097;

const leapsThrough = (y: number): number => Math.floor((71 * y + EPSILON) / CYCLE_YEARS);

function computeYearStartMs(yearHE: number): number {
  const auroraYears = leapsThrough(yearHE - 1) - leapsThrough(EPOCH_YEAR_HE - 1);
  return EPOCH_MS + ((yearHE - EPOCH_YEAR_HE) * DAYS_PER_NORMAL_YEAR + auroraYears * 7) * DAY_MS;
}

/**
 * Returns the UTC timestamp (ms) of 00:00 on day 1 of GHS year `yearHE`.
 *
 * Closed-form O(1) calculation: `isAuroraYear(Y)` is true exactly when
 * `⌊(71Y + ε) / 400⌋` increments at `Y`, so the number of Aurora Years
 * before `yearHE` is a difference of two floors.
 */
export function getYearStartMs(yearHE: number): number {
  assertEra(yearHE);
  return computeYearStartMs(yearHE);
}

/**
 * Resolves the GHS year containing the given UTC timestamp, along with the
 * timestamp of that year's first day.
 */
export function resolveYear(ms: number): { yearHE: number; yearStartMs: number } {
  const days = Math.floor((ms - EPOCH_MS) / DAY_MS);
  let yearHE = EPOCH_YEAR_HE + Math.floor((days * CYCLE_YEARS) / CYCLE_DAYS);
  while (computeYearStartMs(yearHE) > ms) yearHE--;
  while (computeYearStartMs(yearHE + 1) <= ms) yearHE++;
  return { yearHE, yearStartMs: computeYearStartMs(yearHE) };
}
