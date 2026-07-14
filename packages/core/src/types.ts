/** Result of converting a JavaScript Date to a GHS date via `getGHSDate`. */
export interface GHSDateResult {
  /** Human Era year, e.g. 12026 */
  era: number;
  /** GHS month number 1–13, or null during the Aurora Week */
  month: number | null;
  /** Full month name, or "Aurora" during the Aurora Week */
  monthName: string;
  /** Day of the month (1–28) or day within the Aurora Week (1–7) */
  day: number;
  /** Day of the year, 1-based (1–364, Aurora Week: 365–371) */
  dayOfYear: number;
  /** Week of the year (1–52), or null during the Aurora Week */
  weekOfYear: number | null;
  /** Financial quarter (1–4, 13 weeks each), or null during the Aurora Week */
  quarter: number | null;
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
