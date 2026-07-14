import { getDaysInYear } from './aurora';
import { DAY_MS } from './constants';

/**
 * GHS epoch — the calibration point from which every year start is derived.
 *
 * GHS year 10001 HE (= 1 CE, the year traditionally associated with the birth
 * of Christ) begins on 21 March of year 1 in the proleptic Gregorian calendar,
 * at 00:00 UTC.
 *
 * This single fixed point, chained with the 364/371-day year lengths from
 * `getDaysInYear`, determines all other year starts. Because any 400
 * consecutive GHS years sum to exactly 146,097 days (identical to the
 * Gregorian 400-year cycle), year starts drift within a stable window of
 * 16–24 March, centered on the spring equinox (~20 March). In the modern era
 * this calibration yields 12026.01.01 = 2026-03-18 UTC.
 */
export const EPOCH_YEAR_HE = 10001;

export const EPOCH_MS = (() => {
  // Date.UTC(1, ...) would map year 1 to 1901 — construct via setUTCFullYear.
  const d = new Date(0);
  d.setUTCFullYear(1, 2, 21);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
})();

/** Years per leap cycle. */
export const CYCLE_YEARS = 400;

/** Days per 400-year cycle: 400 × 364 + 71 × 7 = 146,097 (matches Gregorian). */
export const CYCLE_DAYS = 146_097;

/**
 * Returns the UTC timestamp (ms) of 00:00 on day 1 of GHS year `yearHE`.
 *
 * Jumps whole 400-year cycles, then walks the remaining ≤400 years.
 */
export function getYearStartMs(yearHE: number): number {
  const cycles = Math.floor((yearHE - EPOCH_YEAR_HE) / CYCLE_YEARS);
  let ms = EPOCH_MS + cycles * CYCLE_DAYS * DAY_MS;
  for (let y = EPOCH_YEAR_HE + cycles * CYCLE_YEARS; y < yearHE; y++) {
    ms += getDaysInYear(y) * DAY_MS;
  }
  return ms;
}

/**
 * Resolves the GHS year containing the given UTC timestamp, along with the
 * timestamp of that year's first day.
 */
export function resolveYear(ms: number): { yearHE: number; yearStartMs: number } {
  const daysSinceEpoch = Math.floor((ms - EPOCH_MS) / DAY_MS);
  const cycles = Math.floor(daysSinceEpoch / CYCLE_DAYS);
  let yearHE = EPOCH_YEAR_HE + cycles * CYCLE_YEARS;
  let yearStartMs = EPOCH_MS + cycles * CYCLE_DAYS * DAY_MS;

  for (;;) {
    const yearLengthMs = getDaysInYear(yearHE) * DAY_MS;
    if (ms < yearStartMs + yearLengthMs) {
      return { yearHE, yearStartMs };
    }
    yearStartMs += yearLengthMs;
    yearHE++;
  }
}
