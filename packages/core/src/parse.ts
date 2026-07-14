import { parseGHSDate } from './converter';

/** Components extracted from a GHS timestamp string, plus the resolved Date. */
export interface ParsedGHSDate {
  era: number;
  month: number | 'A';
  day: number;
  beats: number;
  /** The GHS date resolved to a native JavaScript Date (UTC). */
  date: Date;
}

// "12026.01.15", "12026.A.03", optionally followed by " @685" or " @685.25"
const GHS_STRING_RE = /^(\d{5})\.(A|\d{2})\.(\d{2})(?:\s+@(\d{1,3}(?:\.\d{1,2})?))?$/i;

/**
 * Parses a GHS timestamp string (`YYYYY.MM.DD` or `YYYYY.A.DD`, optionally
 * with ` @BBB` beats).
 *
 * @returns The parsed components, or `null` when the input is not shaped like
 *          a GHS timestamp at all (callers typically fall back to Gregorian
 *          parsing in that case).
 * @throws RangeError when the input is GHS-shaped but a component is out of
 *         range (e.g. month 14, day 29, Aurora Week in a non-Aurora year).
 */
export function parseGHSString(input: string): ParsedGHSDate | null {
  const match = input.trim().match(GHS_STRING_RE);
  if (!match) return null;

  const [, eraStr = '', monthStr = '', dayStr = '', beatsStr] = match;
  const era = Number.parseInt(eraStr, 10);
  const month = monthStr.toUpperCase() === 'A' ? ('A' as const) : Number.parseInt(monthStr, 10);
  const day = Number.parseInt(dayStr, 10);
  const beats = beatsStr === undefined ? 0 : Number.parseFloat(beatsStr);

  return { era, month, day, beats, date: parseGHSDate(era, month, day, beats) };
}
