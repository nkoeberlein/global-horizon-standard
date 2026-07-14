import { isAuroraYear } from './aurora';
import { BEAT_MS, DAY_MS, DAYS_PER_NORMAL_YEAR, MONTH_NAMES_GHS, WEEKDAYS_GHS } from './constants';
import { getYearStartMs, resolveYear } from './epoch';
import type { GHSDateResult } from './types';

/**
 * Converts a JavaScript Date (defaults to now) to a GHSDateResult.
 *
 * All calculations use UTC so the result is timezone-independent. Year starts
 * are derived from the GHS epoch (see epoch.ts) by chaining the 364/371-day
 * year lengths, so the mapping between real days and GHS dates is bijective:
 * every day has exactly one GHS date and vice versa.
 */
export function getGHSDate(inputDate: Date = new Date()): GHSDateResult {
  const ms = inputDate.getTime();
  const { yearHE, yearStartMs } = resolveYear(ms);

  // Whole days elapsed since the start of this GHS year (0-indexed).
  // 0–363 in a normal year, 0–370 in an Aurora year.
  const dayIndex = Math.floor((ms - yearStartMs) / DAY_MS);

  const aurora = isAuroraYear(yearHE);
  const isAuroraWeek = aurora && dayIndex >= DAYS_PER_NORMAL_YEAR;
  const monthIndex = isAuroraWeek ? -1 : Math.floor(dayIndex / 28);
  const dayOfMonth = isAuroraWeek ? dayIndex - DAYS_PER_NORMAL_YEAR + 1 : (dayIndex % 28) + 1;
  const weekday = WEEKDAYS_GHS[dayIndex % 7] as string;

  // Weeks and quarters (spec/calendar.md §4): 4 quarters × 13 weeks.
  // The Aurora Week sits outside the weekly and quarterly structure.
  const weekOfYear = isAuroraWeek ? null : Math.floor(dayIndex / 7) + 1;
  const quarter = weekOfYear === null ? null : Math.floor((weekOfYear - 1) / 13) + 1;

  // @Beats — UTC milliseconds within the day / 86,400 (1 beat = 86.4 SI seconds)
  const msInDay = ms - yearStartMs - dayIndex * DAY_MS;

  // Clamp to [0, 999.99] to prevent floating-point rounding to "@1000.00"
  // at 23:59:59.999 UTC.
  const beatsValue = Math.min(msInDay / BEAT_MS, 999.99);

  const month = isAuroraWeek ? null : monthIndex + 1;
  const monthName = isAuroraWeek ? 'Aurora' : (MONTH_NAMES_GHS[monthIndex] as string);
  const monthStr = isAuroraWeek ? 'A' : String(month).padStart(2, '0');
  const dayStr = String(dayOfMonth).padStart(2, '0');

  return {
    era: yearHE,
    month,
    monthName,
    day: dayOfMonth,
    dayOfYear: dayIndex + 1,
    weekOfYear,
    quarter,
    weekday,
    isAuroraWeek,
    isAuroraYear: aurora,
    beats: `@${Math.floor(beatsValue).toString().padStart(3, '0')}`,
    beatsLong: `@${beatsValue.toFixed(2).padStart(6, '0')}`,
    fullDate: `${yearHE}.${monthStr}.${dayStr}`,
  };
}

/**
 * Converts a GHS date back to a native JavaScript Date (UTC).
 *
 * Inverse of `getGHSDate`: for any valid input, converting the returned Date
 * back yields the same GHS date.
 *
 * @param era   - Human Era year, e.g. 12026
 * @param month - GHS month 1–13, or "A" for Aurora Week
 * @param day   - Day of month (1–28) or Aurora day (1–7)
 * @param beats - Optional decimal time in @Beats (0 ≤ beats < 1000). Default: 0 (midnight UTC)
 * @throws RangeError when any component is outside its valid range, or when
 *         the Aurora Week is requested in a year that is not an Aurora Year.
 */
export function parseGHSDate(
  era: number,
  month: number | 'A',
  day: number,
  beats: number = 0,
): Date {
  if (!Number.isInteger(era)) {
    throw new RangeError(`Invalid era: ${era}. Must be an integer Human Era year.`);
  }
  if (!Number.isFinite(beats) || beats < 0 || beats >= 1000) {
    throw new RangeError(`Invalid beats: ${beats}. Must be in the range [0, 1000).`);
  }

  let dayIndex: number;
  if (month === 'A') {
    if (!isAuroraYear(era)) {
      throw new RangeError(`${era} HE is not an Aurora Year — it has no Aurora Week (A.1–A.7).`);
    }
    if (!Number.isInteger(day) || day < 1 || day > 7) {
      throw new RangeError(`Invalid Aurora day: ${day}. Must be an integer 1–7.`);
    }
    dayIndex = DAYS_PER_NORMAL_YEAR + (day - 1);
  } else {
    if (!Number.isInteger(month) || month < 1 || month > 13) {
      throw new RangeError(`Invalid month: ${month}. Must be an integer 1–13 or "A".`);
    }
    if (!Number.isInteger(day) || day < 1 || day > 28) {
      throw new RangeError(`Invalid day: ${day}. Must be an integer 1–28.`);
    }
    dayIndex = (month - 1) * 28 + (day - 1);
  }

  return new Date(getYearStartMs(era) + dayIndex * DAY_MS + Math.round(beats * BEAT_MS));
}
