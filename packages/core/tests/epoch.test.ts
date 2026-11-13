import { describe, expect, it } from 'vitest';
import {
  CYCLE_DAYS,
  DAY_MS,
  EPOCH_MS,
  EPOCH_UNIX_DAY,
  EPOCH_YEAR_HE,
  EPSILON,
  getDaysInYear,
  getGHSDate,
  getHolidaysForYear,
  getYearStartMs,
  isAuroraYear,
  MAX_ERA,
  MIN_ERA,
  parseGHSDate,
  WEEKDAYS_GHS,
} from '../src';

/**
 * Year start derived by walking the 364/371-day chain from the epoch in single
 * steps — deliberately without the closed-form formula that getYearStartMs
 * uses, so the two can be cross-checked against each other.
 */
function chainedYearStartMs(target: number): number {
  let ms = EPOCH_MS;
  if (target >= EPOCH_YEAR_HE) {
    for (let y = EPOCH_YEAR_HE; y < target; y++) ms += getDaysInYear(y) * DAY_MS;
  } else {
    for (let y = EPOCH_YEAR_HE - 1; y >= target; y--) ms -= getDaysInYear(y) * DAY_MS;
  }
  return ms;
}

/**
 * Astronomical March equinox in fractional Unix days (Meeus, Astronomical
 * Algorithms, ch. 27, Table 27.A for years 1000–3000 CE).
 */
function marchEquinoxUnixDays(gregorianYear: number): number {
  const u = (gregorianYear - 2000) / 1000;
  const jde0 =
    2451623.80984 + 365242.37404 * u + 0.05169 * u ** 2 - 0.00411 * u ** 3 - 0.00057 * u ** 4;
  return jde0 - 2440587.5;
}

describe('epoch calibration', () => {
  it('anchors 12000.01.01 at Unix day 11,036 (the March equinox of 2000, a Monday)', () => {
    expect(EPOCH_YEAR_HE).toBe(12000);
    expect(EPOCH_UNIX_DAY).toBe(11_036);
    expect(EPOCH_MS).toBe(11_036 * DAY_MS);
    expect(new Date(EPOCH_MS).toISOString()).toBe('2000-03-20T00:00:00.000Z');
    expect(getYearStartMs(EPOCH_YEAR_HE)).toBe(EPOCH_MS);
  });

  it('derives 12026.01.01 = 2026-03-23 UTC (modern-era calibration)', () => {
    expect(new Date(getYearStartMs(12026)).toISOString()).toBe('2026-03-23T00:00:00.000Z');
  });

  it('keeps year starts within the 17–25 March drift window (11900–12200 HE)', () => {
    for (let year = 11900; year <= 12200; year++) {
      const start = new Date(getYearStartMs(year));
      expect(start.getUTCMonth()).toBe(2); // March
      expect(start.getUTCDate()).toBeGreaterThanOrEqual(17);
      expect(start.getUTCDate()).toBeLessThanOrEqual(25);
      // The GHS year N HE always starts in Gregorian year N - 10000
      expect(start.getUTCFullYear()).toBe(year - 10000);
    }
  });

  it('keeps year starts within ±3.6 days of the astronomical March equinox (11600–13000 HE)', () => {
    for (let era = 11600; era <= 13000; era++) {
      const startUnixDay = getYearStartMs(era) / DAY_MS;
      const equinoxUnixDay = marchEquinoxUnixDays(era - 10000);
      expect(Math.abs(startUnixDay - equinoxUnixDay)).toBeLessThanOrEqual(3.6);
    }
  });

  it('aligns GHS weekdays 1:1 with the existing seven-day week across a full 400-year cycle', () => {
    // Every GHS year is 52 or 53 full weeks and 12000.01.01 is a Monday, so
    // every year start is a Monday and every day of a year matches its UTC weekday.
    for (let era = 12000; era < 12400; era++) {
      const start = new Date(getYearStartMs(era));
      expect(start.getUTCDay()).toBe(1); // Monday in JS Date (0=Sun, 1=Mon)
    }
    // Check every day of an Aurora year (12025) and a normal year (12026)
    const startMs = getYearStartMs(12025);
    const endMs = getYearStartMs(12027);
    for (let ms = startMs; ms < endMs; ms += DAY_MS) {
      const d = new Date(ms);
      expect(WEEKDAYS_GHS.indexOf(getGHSDate(d).weekday as (typeof WEEKDAYS_GHS)[number])).toBe(
        (d.getUTCDay() + 6) % 7,
      );
    }
  });
});

describe('400-year cycle', () => {
  it('sums any 400 consecutive years to exactly 146,097 days (= Gregorian cycle)', () => {
    for (const windowStart of [10001, 11723, 12000, 12026]) {
      let days = 0;
      for (let y = windowStart; y < windowStart + 400; y++) {
        days += getDaysInYear(y);
      }
      expect(days).toBe(CYCLE_DAYS);
    }
  });

  it('contains exactly 71 Aurora Years per 400-year window', () => {
    for (const windowStart of [10001, 12000]) {
      let auroraCount = 0;
      for (let y = windowStart; y < windowStart + 400; y++) {
        if (isAuroraYear(y)) auroraCount++;
      }
      expect(auroraCount).toBe(71);
    }
  });

  it('getYearStartMs jumps whole cycles consistently', () => {
    expect(getYearStartMs(12400) - getYearStartMs(12000)).toBe(CYCLE_DAYS * DAY_MS);
    expect(getYearStartMs(11626) - getYearStartMs(11226)).toBe(CYCLE_DAYS * DAY_MS);
  });

  it('spaces Aurora Years 5 or 6 years apart', () => {
    let previous: number | null = null;
    for (let y = 11900; y <= 12200; y++) {
      if (!isAuroraYear(y)) continue;
      if (previous !== null) {
        const gap = y - previous;
        expect(gap === 5 || gap === 6).toBe(true);
      }
      previous = y;
    }
  });
});

/**
 * Eras at and below the Human Era zero point (era 0 ≈ 10,000 BCE, the dawn of
 * the Neolithic Revolution — see spec/era-he.md).
 *
 * Regression guard: isAuroraYear used JavaScript's truncating `%`, which
 * returns negative results for negative operands. That misclassified negative
 * eras and broke the 146,097-day cycle invariant.
 */
describe('eras at and below the Human Era zero point', () => {
  it('uses a euclidean modulo, so negative eras classify correctly', () => {
    for (let y = -2000; y <= 2000; y++) {
      const euclidean = (((71 * y + EPSILON) % 400) + 400) % 400 < 71;
      expect(isAuroraYear(y)).toBe(euclidean);
    }
    expect(isAuroraYear(-1000)).toBe(false);
  });

  it('sums 400 consecutive years to 146,097 days in negative windows too', () => {
    for (const windowStart of [-1200, -400, -3, 0, 500]) {
      let days = 0;
      for (let y = windowStart; y < windowStart + 400; y++) {
        days += getDaysInYear(y);
      }
      expect(days).toBe(CYCLE_DAYS);
    }
  });

  it('matches a pure epoch chain, so the closed-form formula stays honest', () => {
    for (const year of [15000, 12026, 12000, 10001, 9000, 5000, 500, 1, 0, -1, -1000, -2000]) {
      expect(getYearStartMs(year)).toBe(chainedYearStartMs(year));
    }
  });

  it('keeps year starts in the 17–25 March drift window down to era -1200', () => {
    for (let year = -1200; year <= -900; year++) {
      const start = new Date(getYearStartMs(year));
      expect(start.getUTCMonth()).toBe(2); // March
      expect(start.getUTCDate()).toBeGreaterThanOrEqual(17);
      expect(start.getUTCDate()).toBeLessThanOrEqual(25);
    }
  });

  it('resolves negative-era year starts back to day 1 of that year', () => {
    // getGHSDate exercises resolveYear, which is not exported directly.
    for (let year = -1200; year < -1100; year++) {
      const ghs = getGHSDate(new Date(getYearStartMs(year)));
      expect(ghs.era).toBe(year);
      expect(ghs.dayOfYear).toBe(1);
    }
  });
});

describe('era bounds and validation (C2)', () => {
  const invalidEras = [
    ['above 2^53 (would hang a loop)', 9007199254741202],
    ['below -2^53', -9007199254740994],
    ['above MAX_ERA', MAX_ERA + 1],
    ['286000', 286_000],
    ['below MIN_ERA', MIN_ERA - 1],
    ['fractional era', 12026.5],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
  ] as const;

  it.each(invalidEras)('rejects %s across all five era entry points', (_label, badEra) => {
    expect(() => isAuroraYear(badEra)).toThrow(RangeError);
    expect(() => getDaysInYear(badEra)).toThrow(RangeError);
    expect(() => getYearStartMs(badEra)).toThrow(RangeError);
    expect(() => parseGHSDate(badEra, 1, 1)).toThrow(RangeError);
    expect(() => getHolidaysForYear(badEra)).toThrow(RangeError);
  });

  it('round-trips at MIN_ERA and MAX_ERA without throwing or producing Invalid Date', () => {
    const minStart = parseGHSDate(MIN_ERA, 1, 1);
    expect(Number.isFinite(minStart.getTime())).toBe(true);
    expect(getGHSDate(minStart).era).toBe(MIN_ERA);
    expect(getGHSDate(minStart).dayOfYear).toBe(1);

    const maxLastDay = parseGHSDate(MAX_ERA, 13, 28, 999.99);
    expect(Number.isFinite(maxLastDay.getTime())).toBe(true);
    expect(getGHSDate(maxLastDay).era).toBe(MAX_ERA);
    expect(getGHSDate(maxLastDay).month).toBe(13);
    expect(getGHSDate(maxLastDay).day).toBe(28);
  });
});
