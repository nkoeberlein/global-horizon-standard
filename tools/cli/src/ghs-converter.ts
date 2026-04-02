/**
 * GHS - Global Horizon Standard Converter
 *
 * Converts Gregorian dates to the GHS calendar system:
 * - Era: Human Era (HE) — Gregorian year + 10,000
 * - Calendar: 13 months × 28 days
 * - Time: @Beats (decimal time, 1 day = 1,000 beats)
 * - Leap mechanism: Aurora Week (71 weeks in 400 years)
 */

export const MONTH_NAMES_GHS = [
  "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December", "January", "February", "Luna"
];

export const WEEKDAYS_GHS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

// Reference meridian offset in hours (0 = UTC/Greenwich)
const MERIDIAN_OFFSET_HOURS = 0;

/**
 * Checks whether a GHS year is an Aurora Year (leap year with 53 weeks).
 * Uses the 71/400 cycle for maximum astronomical stability.
 */
export function isAuroraYear(yearHE: number): boolean {
  const epsilon = 156;
  return (71 * yearHE + epsilon) % 400 < 71;
}

/**
 * Returns the number of days in a GHS year.
 * Normal year: 364 days (52 weeks)
 * Aurora year: 371 days (53 weeks)
 */
export function getDaysInYear(yearHE: number): number {
  return isAuroraYear(yearHE) ? 371 : 364;
}

/**
 * Converts a JavaScript Date to a GHS date/time object.
 */
export function getGHSDate(inputDate: Date = new Date()) {
  const gregorianYear = inputDate.getUTCFullYear();

  // Note: Using 'let' instead of 'const' so we can decrement it if needed
  let yearHE = gregorianYear + 10000;

  // Reference point: spring equinox on March 21
  let startOfYear = new Date(Date.UTC(gregorianYear, 2, 21)); // Month 2 = March (0-indexed)

  // If the input date is before March 21, it belongs to the previous GHS year
  if (inputDate < startOfYear) {
    startOfYear = new Date(Date.UTC(gregorianYear - 1, 2, 21));
    yearHE -= 1;
  }

  // Calculate difference in days (absolute day count within the GHS year)
  const diffInMs = inputDate.getTime() - startOfYear.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // GHS month and day (13 months × 28 days = 364 days)
  const isAurora = diffInDays >= 364;
  const monthIndex = isAurora ? -1 : Math.floor(diffInDays / 28);
  const dayOfMonth = isAurora ? diffInDays - 364 + 1 : (diffInDays % 28) + 1;
  const weekday = WEEKDAYS_GHS[((isAurora ? 364 + dayOfMonth - 1 : diffInDays) % 7)];

  // @Beats calculation (UTC-based)
  const utcHours = inputDate.getUTCHours();
  const utcMinutes = inputDate.getUTCMinutes();
  const utcSeconds = inputDate.getUTCSeconds();
  const utcMilliseconds = inputDate.getUTCMilliseconds();

  // Total seconds of the day including meridian offset
  const totalSeconds =
    ((utcHours + MERIDIAN_OFFSET_HOURS) * 3600 +
      utcMinutes * 60 +
      utcSeconds +
      utcMilliseconds / 1000) %
    86400;
  const beats = totalSeconds / 86.4;

  const month = isAurora ? null : monthIndex + 1;
  const monthName = isAurora ? "Aurora" : MONTH_NAMES_GHS[monthIndex];
  const yearStr = String(yearHE);
  const monthStr = isAurora ? "A" : String(month).padStart(2, "0");
  const dayStr = String(dayOfMonth).padStart(2, "0");

  return {
    era: yearHE,
    month: month,
    monthName: monthName,
    day: dayOfMonth,
    weekday: weekday,
    isAuroraWeek: isAurora,
    beats: `@${Math.floor(beats).toString().padStart(3, "0")}`,
    beatsLong: `@${beats.toFixed(2).padStart(6, "0")}`,
    fullDate: `${yearStr}.${monthStr}.${dayStr}`,
    isAuroraYear: isAuroraYear(yearHE),
  };
}