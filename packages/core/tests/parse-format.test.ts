import { describe, expect, it } from 'vitest';
import {
  formatGHS,
  GHS_FORMATS,
  getGHSDate,
  isGHSFormat,
  parseGHSDate,
  parseGHSString,
} from '../src';

describe('parseGHSString', () => {
  it('parses a plain GHS date', () => {
    const parsed = parseGHSString('12026.01.15');
    expect(parsed).not.toBeNull();
    expect(parsed?.era).toBe(12026);
    expect(parsed?.month).toBe(1);
    expect(parsed?.day).toBe(15);
    expect(parsed?.beats).toBe(0);
    expect(parsed?.date.toISOString()).toBe('2026-04-01T00:00:00.000Z');
  });

  it('parses beats and fractional beats', () => {
    expect(parseGHSString('12026.01.15 @685')?.beats).toBe(685);
    expect(parseGHSString('12026.01.15 @685.25')?.beats).toBe(685.25);
  });

  it('parses Aurora dates case-insensitively', () => {
    expect(parseGHSString('12026.A.03')?.month).toBe('A');
    expect(parseGHSString('12026.a.03')?.month).toBe('A');
  });

  it('returns null for inputs that are not GHS-shaped', () => {
    expect(parseGHSString('2026-01-01')).toBeNull();
    expect(parseGHSString('hello')).toBeNull();
    expect(parseGHSString('12026.1.15')).toBeNull(); // month must be two digits
    expect(parseGHSString('126.01.15')).toBeNull(); // era must be five digits
    expect(parseGHSString('')).toBeNull();
  });

  it('throws RangeError for GHS-shaped but invalid components', () => {
    expect(() => parseGHSString('12026.14.01')).toThrow(RangeError);
    expect(() => parseGHSString('12026.01.29')).toThrow(RangeError);
    expect(() => parseGHSString('12026.00.10')).toThrow(RangeError);
    expect(() => parseGHSString('12027.A.01')).toThrow(RangeError); // not an Aurora year
  });

  it('round-trips the fullDate produced by getGHSDate', () => {
    const ghs = getGHSDate(new Date(Date.UTC(2026, 6, 14)));
    const parsed = parseGHSString(ghs.fullDate);
    expect(parsed?.date.toISOString()).toBe('2026-07-14T00:00:00.000Z');
  });
});

describe('formatGHS', () => {
  const regular = getGHSDate(parseGHSDate(12026, 1, 15, 685));
  const aurora = getGHSDate(parseGHSDate(12026, 'A', 3, 685));

  it('formats a regular date in all formats', () => {
    expect(formatGHS(regular, 'core')).toBe('12026.01.15 @685');
    expect(formatGHS(regular, 'ui')).toBe('15 Mar 12026 @685');
    expect(formatGHS(regular, 'text')).toBe('15 March 12026');
    expect(formatGHS(regular, 'short')).toBe("15 Mar '26");
  });

  it('formats an Aurora date in all formats', () => {
    expect(formatGHS(aurora, 'core')).toBe('12026.A.03 @685');
    expect(formatGHS(aurora, 'ui')).toBe('A3 Aur 12026 @685');
    expect(formatGHS(aurora, 'text')).toBe('Aurora 3, 12026');
    expect(formatGHS(aurora, 'short')).toBe("A3 '26");
  });

  it('defaults to the core format', () => {
    expect(formatGHS(regular)).toBe('12026.01.15 @685');
  });
});

/**
 * spec/timestamp-format.md: "The full 5-digit year must be used for long-term
 * data integrity." Before this was enforced, getGHSDate emitted `500.01.01`,
 * which parseGHSString rejected — the library produced strings it could not
 * read back. Era 500 is not exotic: spec/era-he.md cites Göbekli Tepe at
 * ~500 HE as the showcase for the Human Era.
 */
describe('era padding in machine-readable output', () => {
  it.each([
    [12026, '12026.01.15'],
    [9999, '09999.01.15'],
    [500, '00500.01.15'],
    [1, '00001.01.15'],
  ])('pads era %i to five digits', (era, expected) => {
    expect(getGHSDate(parseGHSDate(era, 1, 15)).fullDate).toBe(expected);
  });

  it('keeps the sign outside the padding for negative eras', () => {
    // Naive padStart would produce "0-101".
    expect(getGHSDate(parseGHSDate(-101, 1, 15)).fullDate).toBe('-00101.01.15');
  });

  it('round-trips every fullDate back through parseGHSString', () => {
    for (const era of [1, 500, 9999, 10000, 12026, 99999]) {
      for (const [month, day] of [
        [1, 1],
        [7, 20],
        [13, 28],
      ] as [number, number][]) {
        const original = parseGHSDate(era, month, day);
        const { fullDate } = getGHSDate(original);
        const reparsed = parseGHSString(fullDate);
        expect(reparsed, `${fullDate} must parse back`).not.toBeNull();
        expect(reparsed?.date.getTime()).toBe(original.getTime());
      }
    }
  });

  it("renders the short year with a leading zero ('01, not '1)", () => {
    expect(formatGHS(getGHSDate(parseGHSDate(1, 1, 15)), 'short')).toBe("15 Mar '01");
  });
});

describe('isGHSFormat', () => {
  it('accepts exactly the known formats', () => {
    for (const format of GHS_FORMATS) {
      expect(isGHSFormat(format)).toBe(true);
    }
    expect(isGHSFormat('xyz')).toBe(false);
    expect(isGHSFormat('')).toBe(false);
    expect(isGHSFormat('CORE')).toBe(false);
  });
});
