/**
 * Shared GHS constants.
 *
 * Spec: https://github.com/nkoeberlein/global-horizon-standard/tree/main/spec
 */

export const MONTH_NAMES_GHS = [
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'Luna',
] as const;

export const WEEKDAYS_GHS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

/** Milliseconds per day. */
export const DAY_MS = 86_400_000;

/** Milliseconds per @Beat (1 day = 1,000 beats → 86.4 SI seconds). */
export const BEAT_MS = 86_400;

/** Days in a normal GHS year (13 × 28). */
export const DAYS_PER_NORMAL_YEAR = 364;

/** Days in an Aurora year (364 + 7-day Aurora Week). */
export const DAYS_PER_AURORA_YEAR = 371;
