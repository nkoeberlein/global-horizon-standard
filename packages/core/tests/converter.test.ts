import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CYCLE_DAYS,
  CYCLE_YEARS,
  DAY_MS,
  EPOCH_MS,
  EPOCH_UNIX_DAY,
  EPOCH_YEAR_HE,
  EPSILON,
  formatGHS,
  getDaysInYear,
  getGHSDate,
  getSolarNoonBeat,
  getYearStartMs,
  isAuroraYear,
  MAX_ERA,
  MIN_ERA,
  parseGHSDate,
  WEEKDAYS_GHS,
} from '../src';

describe('bijectivity (the core invariant)', () => {
  it('maps every real day 11990–12060 HE to a unique GHS date and back', () => {
    const startMs = getYearStartMs(11990);
    const endMs = getYearStartMs(12060);
    let previousFullDate = '';

    for (let ms = startMs; ms < endMs; ms += DAY_MS) {
      const ghs = getGHSDate(new Date(ms));

      // No two consecutive days may share a GHS date (the old clamping bug)
      expect(ghs.fullDate).not.toBe(previousFullDate);
      previousFullDate = ghs.fullDate;

      // parse(format(x)) === x at midnight
      const roundTrip = parseGHSDate(
        ghs.era,
        ghs.isAuroraWeek ? 'A' : (ghs.month as number),
        ghs.day,
      );
      expect(roundTrip.getTime()).toBe(ms);
    }
  });

  it('every valid GHS date maps to a day that converts back identically', () => {
    for (const era of [12025, 12026]) {
      const months: (number | 'A')[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      if (isAuroraYear(era)) months.push('A');
      for (const month of months) {
        const maxDay = month === 'A' ? 7 : 28;
        for (let day = 1; day <= maxDay; day++) {
          const date = parseGHSDate(era, month, day);
          const back = getGHSDate(date);
          expect(back.era).toBe(era);
          expect(back.isAuroraWeek ? 'A' : back.month).toBe(month);
          expect(back.day).toBe(day);
        }
      }
    }
  });
});

describe('Aurora Week', () => {
  it('reaches all seven Aurora days in an Aurora year', () => {
    expect(isAuroraYear(12025)).toBe(true);
    const seen: string[] = [];
    const yearStart = getYearStartMs(12025);
    for (let i = 0; i < getDaysInYear(12025); i++) {
      const ghs = getGHSDate(new Date(yearStart + i * DAY_MS));
      if (ghs.isAuroraWeek) seen.push(ghs.fullDate);
    }
    expect(seen).toEqual([
      '12025.A.01',
      '12025.A.02',
      '12025.A.03',
      '12025.A.04',
      '12025.A.05',
      '12025.A.06',
      '12025.A.07',
    ]);
  });

  it('produces no Aurora dates in a non-Aurora year', () => {
    expect(isAuroraYear(12026)).toBe(false);
    const yearStart = getYearStartMs(12026);
    for (let i = 0; i < getDaysInYear(12026); i++) {
      const ghs = getGHSDate(new Date(yearStart + i * DAY_MS));
      expect(ghs.isAuroraWeek).toBe(false);
    }
  });

  it('reports Aurora Week fields correctly', () => {
    const a3 = getGHSDate(parseGHSDate(12025, 'A', 3));
    expect(a3.month).toBeNull();
    expect(a3.monthName).toBe('Aurora');
    expect(a3.weekOfYear).toBeNull();
    expect(a3.quarter).toBeNull();
    expect(a3.dayOfYear).toBe(367);
    expect(a3.fullDate).toBe('12025.A.03');
  });
});

describe('weekday fixation (spec §2.2)', () => {
  it('binds day-of-month permanently to weekdays: 1→Mon … 7→Sun', () => {
    for (const era of [12025, 12026]) {
      for (const month of [1, 7, 13]) {
        for (let day = 1; day <= 28; day++) {
          const ghs = getGHSDate(parseGHSDate(era, month, day));
          expect(ghs.weekday).toBe(WEEKDAYS_GHS[(day - 1) % 7]);
        }
      }
    }
  });

  it('starts the Aurora Week on a Monday', () => {
    expect(getGHSDate(parseGHSDate(12025, 'A', 1)).weekday).toBe('Monday');
    expect(getGHSDate(parseGHSDate(12025, 'A', 7)).weekday).toBe('Sunday');
  });
});

describe('weeks and quarters (spec §4)', () => {
  it('assigns 52 weeks and 4 quarters of 13 weeks each', () => {
    const first = getGHSDate(parseGHSDate(12027, 1, 1));
    expect(first.weekOfYear).toBe(1);
    expect(first.quarter).toBe(1);

    // Day 91 = last day of week 13 = last day of Q1
    const q1End = getGHSDate(parseGHSDate(12027, 4, 7));
    expect(q1End.dayOfYear).toBe(91);
    expect(q1End.weekOfYear).toBe(13);
    expect(q1End.quarter).toBe(1);

    // Day 92 = first day of week 14 = first day of Q2
    const q2Start = getGHSDate(parseGHSDate(12027, 4, 8));
    expect(q2Start.weekOfYear).toBe(14);
    expect(q2Start.quarter).toBe(2);

    const last = getGHSDate(parseGHSDate(12027, 13, 28));
    expect(last.dayOfYear).toBe(364);
    expect(last.weekOfYear).toBe(52);
    expect(last.quarter).toBe(4);
  });
});

describe('@Beats', () => {
  it('starts the day at @000 and truncates 23:59:59.999 to @999.99', () => {
    const midnight = getGHSDate(new Date(Date.UTC(2026, 6, 14, 0, 0, 0, 0)));
    expect(midnight.beats).toBe('@000');
    expect(midnight.beatsLong).toBe('@000.00');

    const lastMs = getGHSDate(new Date(Date.UTC(2026, 6, 14, 23, 59, 59, 999)));
    expect(lastMs.beats).toBe('@999');
    expect(lastMs.beatsLong).toBe('@999.99');
  });

  it('converts noon UTC to @500', () => {
    const noon = getGHSDate(new Date(Date.UTC(2026, 6, 14, 12, 0, 0)));
    expect(noon.beats).toBe('@500');
  });

  it('round-trips fractional beats through parseGHSDate', () => {
    const date = parseGHSDate(12026, 5, 7, 685.25);
    const ghs = getGHSDate(date);
    expect(ghs.beatsLong).toBe('@685.25');
    expect(ghs.beatsExact).toBe(685.25);
  });

  it('computes local solar noon beat from longitude (getSolarNoonBeat)', () => {
    expect(getSolarNoonBeat(0)).toBe(500); // London
    expect(getSolarNoonBeat(180)).toBe(0); // Antimeridian
    expect(getSolarNoonBeat(-180)).toBe(0); // Antimeridian
    expect(getSolarNoonBeat(140)).toBe(111); // Tokyo
    expect(getSolarNoonBeat(151)).toBe(81); // Sydney
    expect(getSolarNoonBeat(-74)).toBe(getSolarNoonBeat(286)); // New York (-74° === 286°E)
    expect(() => getSolarNoonBeat(361)).toThrow(RangeError);
    expect(() => getSolarNoonBeat(-181)).toThrow(RangeError);
    expect(() => getSolarNoonBeat(Number.NaN)).toThrow(RangeError);
  });

  it('truncates rather than rounds — never shows a beat that has not happened', () => {
    // 172,481 ms into the day = 1.9963 beats. Rounding would display @002.00.
    const ghs = getGHSDate(new Date(parseGHSDate(12026, 1, 1).getTime() + 172_481));
    expect(ghs.beats).toBe('@001');
    expect(ghs.beatsLong).toBe('@001.99');
  });

  it('keeps beats and beatsLong in agreement across a full day', () => {
    const dayStart = parseGHSDate(12026, 1, 1).getTime();
    for (let msInDay = 0; msInDay < DAY_MS; msInDay += 997) {
      const ghs = getGHSDate(new Date(dayStart + msInDay));
      expect(ghs.beatsLong.slice(0, 4)).toBe(ghs.beats);
    }
  });

  it('clamps sub-millisecond beats near 1000 so parseGHSDate never rolls into the next day (C3)', () => {
    // 999.999995 * 86,400 = 86,399,999.568 → Math.round yields 86,400,000 (next day) without clamping.
    const endOfMonth13 = getGHSDate(parseGHSDate(12025, 13, 28, 999.999995));
    expect(endOfMonth13.fullDate).toBe('12025.13.28');
    expect(endOfMonth13.beats).toBe('@999');
    expect(endOfMonth13.beatsLong).toBe('@999.99');

    const endOfYear = getGHSDate(
      parseGHSDate(12026, 13, 28, Number.MAX_VALUE < 1000 ? 999 : 999.9999999),
    );
    expect(endOfYear.fullDate).toBe('12026.13.28');
    expect(endOfYear.era).toBe(12026);
  });
});

describe('invalid input', () => {
  // Regression: resolveYear's unbounded loop never terminated on NaN
  // (every `NaN < NaN` is false), hanging the process instead of throwing.
  it.each([
    ['Invalid Date', new Date(Number.NaN)],
    ['unparseable string', new Date('nonsense')],
  ])('throws RangeError instead of hanging on %s', (_label, input) => {
    expect(() => getGHSDate(input)).toThrow(RangeError);
  });
});

describe('parseGHSDate validation', () => {
  it.each([
    ['month 0', () => parseGHSDate(12026, 0, 1)],
    ['month 14', () => parseGHSDate(12026, 14, 1)],
    ['month 99', () => parseGHSDate(12026, 99, 99)],
    ['day 0', () => parseGHSDate(12026, 1, 0)],
    ['day 29', () => parseGHSDate(12026, 1, 29)],
    ['Aurora day 8', () => parseGHSDate(12025, 'A', 8)],
    ['Aurora Week in non-Aurora year', () => parseGHSDate(12026, 'A', 1)],
    ['negative beats', () => parseGHSDate(12026, 1, 1, -1)],
    ['beats 1000', () => parseGHSDate(12026, 1, 1, 1000)],
    ['fractional era', () => parseGHSDate(12026.5, 1, 1)],
    ['fractional day', () => parseGHSDate(12026, 1, 1.5)],
  ])('throws RangeError for %s', (_label, call) => {
    expect(call).toThrow(RangeError);
  });
});

interface ConformanceVectors {
  constants: {
    epochYearHE: number;
    epochUnixDay: number;
    epochMs: number;
    epsilon: number;
    cycleYears: number;
    cycleDays: number;
    minEra: number;
    maxEra: number;
  };
  yearStarts: Array<{
    era: number;
    isAuroraYear: boolean;
    daysInYear: number;
    startMs: number;
    startIso: string;
  }>;
  conversions: Array<{
    ms: number;
    iso: string;
    era: number;
    month: number | null;
    monthName: string;
    day: number;
    dayOfYear: number;
    weekOfYear: number | null;
    quarter: number | null;
    weekday: string;
    isAuroraWeek: boolean;
    isAuroraYear: boolean;
    beats: string;
    beatsLong: string;
    beatsExact: number;
    fullDate: string;
    formatted: { core: string; ui: string; text: string; short: string };
  }>;
  invalidParseInputs: Array<{
    label: string;
    era: number;
    month: number | 'A';
    day: number;
    beats: number;
  }>;
}

describe('spec/vectors.json conformance', () => {
  const vectors = JSON.parse(
    readFileSync(join(__dirname, '..', '..', '..', 'spec', 'vectors.json'), 'utf8'),
  ) as ConformanceVectors;

  it('matches canonical constants', () => {
    expect(vectors.constants).toEqual({
      epochYearHE: EPOCH_YEAR_HE,
      epochUnixDay: EPOCH_UNIX_DAY,
      epochMs: EPOCH_MS,
      epsilon: EPSILON,
      cycleYears: CYCLE_YEARS,
      cycleDays: CYCLE_DAYS,
      minEra: MIN_ERA,
      maxEra: MAX_ERA,
    });
  });

  it('matches all yearStart vectors', () => {
    for (const v of vectors.yearStarts) {
      expect(isAuroraYear(v.era)).toBe(v.isAuroraYear);
      expect(getDaysInYear(v.era)).toBe(v.daysInYear);
      expect(getYearStartMs(v.era)).toBe(v.startMs);
    }
  });

  it('matches all conversion and formatting vectors', () => {
    for (const v of vectors.conversions) {
      const ghs = getGHSDate(new Date(v.ms));
      expect(ghs).toEqual({
        era: v.era,
        month: v.month,
        monthName: v.monthName,
        day: v.day,
        dayOfYear: v.dayOfYear,
        weekOfYear: v.weekOfYear,
        quarter: v.quarter,
        weekday: v.weekday,
        isAuroraWeek: v.isAuroraWeek,
        isAuroraYear: v.isAuroraYear,
        beats: v.beats,
        beatsLong: v.beatsLong,
        beatsExact: v.beatsExact,
        fullDate: v.fullDate,
      });
      expect(formatGHS(ghs, 'core')).toBe(v.formatted.core);
      expect(formatGHS(ghs, 'ui')).toBe(v.formatted.ui);
      expect(formatGHS(ghs, 'text')).toBe(v.formatted.text);
      expect(formatGHS(ghs, 'short')).toBe(v.formatted.short);
    }
  });

  it('rejects all invalidParseInputs vectors with RangeError', () => {
    for (const v of vectors.invalidParseInputs) {
      expect(() => parseGHSDate(v.era, v.month, v.day, v.beats), v.label).toThrow(RangeError);
    }
  });
});
