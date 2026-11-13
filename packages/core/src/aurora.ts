import { DAYS_PER_AURORA_YEAR, DAYS_PER_NORMAL_YEAR } from './constants';
import { assertEra } from './era';

/**
 * Phase constant calibrating the 400-year Aurora cycle so year starts stay
 * centered on the March equinox (±3.5 days) from the anchor
 * `12000.01.01 = Unix day 11,036`.
 */
export const EPSILON = 286;

/**
 * Returns true if `yearHE` is an Aurora Year (53-week leap year).
 *
 * Formula: (71 × Y + 286) mod 400 < 71
 * - Distributes exactly 71 leap weeks in every 400-year cycle (= 497 days),
 *   matching the 146,097-day Gregorian 400-year cycle. Because gcd(71, 400) = 1,
 *   any window of 400 consecutive years contains exactly 71 Aurora Years.
 * - Epsilon 286 calibrates the phase so year starts drift symmetrically
 *   (±3.5 days) around the March equinox (see epoch.ts).
 *
 * The modulo is euclidean: JavaScript's `%` returns negative results for
 * negative operands, which would misclassify eras <= 0 and break the
 * 146,097-day cycle invariant.
 *
 * Ref: spec/calendar.md §5.4
 */
export function isAuroraYear(yearHE: number): boolean {
  assertEra(yearHE);
  return (((71 * yearHE + EPSILON) % 400) + 400) % 400 < 71;
}

/**
 * Returns the number of days in a GHS year: 364 (normal) or 371 (Aurora).
 */
export function getDaysInYear(yearHE: number): number {
  return isAuroraYear(yearHE) ? DAYS_PER_AURORA_YEAR : DAYS_PER_NORMAL_YEAR;
}
