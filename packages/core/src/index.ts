/**
 * ghs-time — Global Horizon Standard converter.
 *
 * - Era:      Human Era (HE) — Gregorian year + 10,000
 * - Calendar: 13 months × 28 days = 364 days/year
 * - Time:     @Beats (decimal time, 1 day = 1,000 beats, anchored to UTC)
 * - Leap:     Aurora Week — 71 full weeks inserted per 400-year cycle
 * - Epoch:    10001.01.01 = 21 March 1 CE (proleptic Gregorian, UTC)
 *
 * Spec: https://github.com/nkoeberlein/global-horizon-standard/tree/main/spec
 */

export { getDaysInYear, isAuroraYear } from './aurora';
export { DAY_MS, MONTH_NAMES_GHS, WEEKDAYS_GHS } from './constants';
export { getGHSDate, parseGHSDate } from './converter';
export { CYCLE_DAYS, CYCLE_YEARS, EPOCH_MS, EPOCH_YEAR_HE, getYearStartMs } from './epoch';
export type { GHSFormat } from './format';
export { formatGHS, GHS_FORMATS, isGHSFormat } from './format';
export type { DynamicHoliday, FixedHoliday, Holiday, HolidayOccurrence } from './holidays';
export { getHolidaysForYear, HOLIDAYS } from './holidays';
export type { ParsedGHSDate } from './parse';
export { parseGHSString } from './parse';
export type { GHSDateResult } from './types';
