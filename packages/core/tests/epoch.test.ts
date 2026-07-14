import { describe, expect, it } from 'vitest';
import {
  CYCLE_DAYS,
  DAY_MS,
  EPOCH_MS,
  EPOCH_YEAR_HE,
  getDaysInYear,
  getYearStartMs,
  isAuroraYear,
} from '../src';

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
