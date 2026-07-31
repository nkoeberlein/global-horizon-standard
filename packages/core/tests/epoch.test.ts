import { describe, expect, it } from 'vitest';
import {
  CYCLE_DAYS,
  DAY_MS,
  EPOCH_MS,
  EPOCH_YEAR_HE,
  getDaysInYear,
  getGHSDate,
  getYearStartMs,
  isAuroraYear,
} from '../src';

/**
 * Year start derived by walking the 364/371-day chain from the epoch in single
 * steps — deliberately without the 400-year shortcut that getYearStartMs uses,
 * so the two can be cross-checked against each other.
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

describe('epoch calibration', () => {
  it('anchors 10001.01.01 (1 CE) at 21 March of year 1, proleptic Gregorian UTC', () => {
    expect(EPOCH_YEAR_HE).toBe(10001);
    expect(new Date(EPOCH_MS).toISOString()).toBe('0001-03-21T00:00:00.000Z');
    expect(getYearStartMs(EPOCH_YEAR_HE)).toBe(EPOCH_MS);
  });

  it('derives 12026.01.01 = 2026-03-18 UTC (modern-era calibration)', () => {
    expect(new Date(getYearStartMs(12026)).toISOString()).toBe('2026-03-18T00:00:00.000Z');
  });

  it('keeps year starts within the 16–24 March drift window (11900–12200 HE)', () => {
    for (let year = 11900; year <= 12200; year++) {
      const start = new Date(getYearStartMs(year));
      expect(start.getUTCMonth()).toBe(2); // March
      expect(start.getUTCDate()).toBeGreaterThanOrEqual(16);
      expect(start.getUTCDate()).toBeLessThanOrEqual(24);
      // The GHS year N HE always starts in Gregorian year N - 10000
      expect(start.getUTCFullYear()).toBe(year - 10000);
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
 * returns negative results for negative operands. That misclassified every era
 * <= -3 and broke the 146,097-day cycle invariant, putting getYearStartMs(0)
 * 2,289 days and getYearStartMs(-1000) 6,895 days off — silently.
 */
describe('eras at and below the Human Era zero point', () => {
  it('uses a euclidean modulo, so negative eras classify correctly', () => {
    for (let y = -2000; y <= 2000; y++) {
      const euclidean = (((71 * y + 156) % 400) + 400) % 400 < 71;
      expect(isAuroraYear(y)).toBe(euclidean);
    }
    // The pre-fix implementation reported true here.
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

  it('matches a pure epoch chain, so the 400-year shortcut stays honest', () => {
    for (const year of [12026, 10001, 9000, 5000, 500, 1, 0, -1, -1000]) {
      expect(getYearStartMs(year)).toBe(chainedYearStartMs(year));
    }
  });

  it('keeps year starts in the 16–24 March drift window down to era -1200', () => {
    for (let year = -1200; year <= -900; year++) {
      const start = new Date(getYearStartMs(year));
      expect(start.getUTCMonth()).toBe(2); // March
      expect(start.getUTCDate()).toBeGreaterThanOrEqual(16);
      expect(start.getUTCDate()).toBeLessThanOrEqual(24);
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
