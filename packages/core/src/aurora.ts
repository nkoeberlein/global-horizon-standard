import { DAYS_PER_AURORA_YEAR, DAYS_PER_NORMAL_YEAR } from './constants';

/**
 * Returns true if `yearHE` is an Aurora Year (53-week leap year).
 *
 * Formula: (71 × Y + 156) mod 400 < 71
 * - Distributes exactly 71 leap weeks in every 400-year cycle (= 497 days),
 *   matching the 146,097-day Gregorian 400-year cycle. Because gcd(71, 400) = 1,
 *   any window of 400 consecutive years contains exactly 71 Aurora Years.
 * - Epsilon 156 calibrates the phase so year starts drift symmetrically
 *   around the spring equinox (see epoch.ts).
 *
 * Ref: spec/calendar.md §5.4
 */
export function isAuroraYear(yearHE: number): boolean {
  return (71 * yearHE + 156) % 400 < 71;
}

/**
 * Returns the number of days in a GHS year: 364 (normal) or 371 (Aurora).
 */
export function getDaysInYear(yearHE: number): number {
  return isAuroraYear(yearHE) ? DAYS_PER_AURORA_YEAR : DAYS_PER_NORMAL_YEAR;
}
