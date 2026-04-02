/**
 * GHS - Global Horizon Standard Converter
 *
 * Converts Gregorian dates to the GHS calendar system:
 * - Era:      Human Era (HE) — Gregorian year + 10,000
 * - Calendar: 13 months × 28 days = 364 days/year
 * - Time:     @Beats (decimal time, 1 day = 1,000 beats, anchored to UTC)
 * - Leap:     Aurora Week — 71 full weeks inserted per 400-year cycle
 *
 * Spec: https://github.com/nkoeberlein/global-horizon-standard/tree/main/spec
 */

export const MONTH_NAMES_GHS = [
  "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December", "January", "February", "Luna",
] as const;

export const WEEKDAYS_GHS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

/**
 * Returns true if `yearHE` is an Aurora Year (53-week leap year).
 *
 * Formula: (71 × Y + 156) mod 400 < 71
 * - Distributes exactly 71 leap weeks in every 400-year cycle (= 497 days),
 *   matching the 146,097-day Gregorian 400-year cycle.
 * - Epsilon 156 calibrates the phase so the first Aurora Year in the modern
 *   era falls at the correct astronomical position.
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
  return isAuroraYear(yearHE) ? 371 : 364;
}

// ---------------------------------------------------------------------------
// Return type for getGHSDate
// ---------------------------------------------------------------------------

export interface GHSDateResult {
  /** Human Era year, e.g. 12026 */
  era: number;
  /** GHS month number 1–13, or null during the Aurora Week */
  month: number | null;
  /** Full month name, or "Aurora" during the Aurora Week */
  monthName: string;
  /** Day of the month (1–28) or day within the Aurora Week (1–7) */
  day: number;
  /** GHS weekday name */
  weekday: string;
  /** True when the date falls in the Aurora Week */
  isAuroraWeek: boolean;
  /** True when the current GHS year is an Aurora Year */
  isAuroraYear: boolean;
  /** Whole-beat value, e.g. "@045" */
  beats: string;
  /** Centibeat-precision value, e.g. "@045.23" */
  beatsLong: string;
  /** ISO-style compact notation, e.g. "12026.01.15" or "12026.A.03" */
  fullDate: string;
}

// ---------------------------------------------------------------------------
// Forward converter
// ---------------------------------------------------------------------------

/**
 * Converts a JavaScript Date (defaults to now) to a GHSDateResult.
 *
 * All calculations use UTC so the result is timezone-independent.
 */
export function getGHSDate(inputDate: Date = new Date()): GHSDateResult {
  const gregorianYear = inputDate.getUTCFullYear();

  // GHS year starts on Gregorian March 21 (fixed anchor — see spec/design-compromises.md)
  let yearHE = gregorianYear + 10000;
  let startOfYear = new Date(Date.UTC(gregorianYear, 2, 21));

  if (inputDate < startOfYear) {
    startOfYear = new Date(Date.UTC(gregorianYear - 1, 2, 21));
    yearHE -= 1;
  }

  // Whole days elapsed since the start of this GHS year (0-indexed)
  const diffInDays = Math.floor(
    (inputDate.getTime() - startOfYear.getTime()) / 86_400_000,
  );

  // In a non-Aurora year the valid range is 0–363.
  // A Gregorian year has 365 or 366 days between two March 21 anchors, so
  // day 364 (or 365) can occur in non-Aurora years.  Clamp to the last valid
  // day of Luna (day 363) rather than incorrectly flagging it as Aurora Week.
  const aurora = isAuroraYear(yearHE);
  const clampedDays = (!aurora && diffInDays >= 364) ? 363 : diffInDays;

  const isAuroraWeek = aurora && clampedDays >= 364;
  const monthIndex   = isAuroraWeek ? -1 : Math.floor(clampedDays / 28);
  const dayOfMonth   = isAuroraWeek
    ? clampedDays - 364 + 1
    : (clampedDays % 28) + 1;
  const weekday = WEEKDAYS_GHS[
    (isAuroraWeek ? 364 + dayOfMonth - 1 : clampedDays) % 7
  ] as string;

  // @Beats — UTC seconds / 86.4 (1 beat = 86.4 SI seconds)
  const secondsUTC =
    inputDate.getUTCHours() * 3600 +
    inputDate.getUTCMinutes() * 60 +
    inputDate.getUTCSeconds() +
    inputDate.getUTCMilliseconds() / 1000;

  // Clamp to [0, 999.99] to prevent floating-point rounding to "@1000.00"
  // at 23:59:59.999 UTC.
  const beatsValue = Math.min(secondsUTC / 86.4, 999.99);

  const month     = isAuroraWeek ? null : monthIndex + 1;
  const monthName = isAuroraWeek ? "Aurora" : MONTH_NAMES_GHS[monthIndex] as string;
  const monthStr  = isAuroraWeek ? "A" : String(month).padStart(2, "0");
  const dayStr    = String(dayOfMonth).padStart(2, "0");

  return {
    era:         yearHE,
    month,
    monthName,
    day:         dayOfMonth,
    weekday,
    isAuroraWeek,
    isAuroraYear: aurora,
    beats:        `@${Math.floor(beatsValue).toString().padStart(3, "0")}`,
    beatsLong:    `@${beatsValue.toFixed(2).padStart(6, "0")}`,
    fullDate:     `${yearHE}.${monthStr}.${dayStr}`,
  };
}

// ---------------------------------------------------------------------------
// Reverse converter
// ---------------------------------------------------------------------------

/**
 * Converts a GHS date back to a native JavaScript Date (UTC).
 *
 * @param era   - Human Era year, e.g. 12026
 * @param month - GHS month 1–13, or "A" for Aurora Week
 * @param day   - Day of month (1–28) or Aurora day (1–7)
 * @param beats - Optional decimal time in @Beats (0–999.99). Default: 0 (midnight UTC)
 */
export function parseGHSDate(
  era: number,
  month: number | "A",
  day: number,
  beats: number = 0,
): Date {
  const gregorianYear = era - 10000;
  const startOfYear   = new Date(Date.UTC(gregorianYear, 2, 21));

  const dayOffset =
    month === "A"
      ? 364 + (day - 1)                  // Aurora Week starts after 13×28 days
      : (month - 1) * 28 + (day - 1);    // Normal month (1-indexed)

  // 1 beat = 86.4 seconds = 86,400 ms
  const msOffset = beats * 86_400;

  return new Date(startOfYear.getTime() + dayOffset * 86_400_000 + msOffset);
}

// ---------------------------------------------------------------------------
// Formatter
// ---------------------------------------------------------------------------

/** Available output formats for {@link formatGHS}. */
export type GHSFormat = "core" | "ui" | "text" | "short";

/**
 * Formats a GHSDateResult into an official human-readable string.
 *
 * | Format  | Example output              | Intended use       |
 * |---------|-----------------------------|--------------------|
 * | "core"  | `12026.01.15 @685`          | Logs / machines    |
 * | "ui"    | `15 Mar 12026 @685`         | Dashboards         |
 * | "text"  | `15 March 12026`            | Formal writing     |
 * | "short" | `15 Mar '26`                | Everyday shorthand |
 */
export function formatGHS(
  ghsObj: GHSDateResult,
  format: GHSFormat = "core",
): string {
  const { era, monthName, day, beats, isAuroraWeek, fullDate } = ghsObj;
  const shortYear  = String(era).slice(-2);
  const shortMonth = isAuroraWeek ? "Aur" : monthName.slice(0, 3);

  switch (format) {
    case "core":
      return `${fullDate} ${beats}`;

    case "ui":
      return isAuroraWeek
        ? `A${day} ${shortMonth} ${era} ${beats}`
        : `${day} ${shortMonth} ${era} ${beats}`;

    case "text":
      return isAuroraWeek
        ? `Aurora ${day}, ${era}`
        : `${day} ${monthName} ${era}`;

    case "short":
      return isAuroraWeek
        ? `A${day} '${shortYear}`
        : `${day} ${shortMonth} '${shortYear}`;

    default:
      return fullDate;
  }
}
