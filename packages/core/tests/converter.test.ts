import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  getDaysInYear,
  getGHSDate,
  getYearStartMs,
  isAuroraYear,
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
    for (const era of [12026, 12027]) {
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
    expect(isAuroraYear(12026)).toBe(true);
    const seen: string[] = [];
    const yearStart = getYearStartMs(12026);
    for (let i = 0; i < getDaysInYear(12026); i++) {
      const ghs = getGHSDate(new Date(yearStart + i * DAY_MS));
      if (ghs.isAuroraWeek) seen.push(ghs.fullDate);
    }
    expect(seen).toEqual([
      '12026.A.01',
      '12026.A.02',
      '12026.A.03',
      '12026.A.04',
      '12026.A.05',
      '12026.A.06',
      '12026.A.07',
    ]);
  });

  it('produces no Aurora dates in a non-Aurora year', () => {
    expect(isAuroraYear(12027)).toBe(false);
    const yearStart = getYearStartMs(12027);
    for (let i = 0; i < getDaysInYear(12027); i++) {
      const ghs = getGHSDate(new Date(yearStart + i * DAY_MS));
      expect(ghs.isAuroraWeek).toBe(false);
    }
  });

  it('reports Aurora Week fields correctly', () => {
    const a3 = getGHSDate(parseGHSDate(12026, 'A', 3));
    expect(a3.month).toBeNull();
    expect(a3.monthName).toBe('Aurora');
    expect(a3.weekOfYear).toBeNull();
    expect(a3.quarter).toBeNull();
    expect(a3.dayOfYear).toBe(367);
    expect(a3.fullDate).toBe('12026.A.03');
  });
});

describe('weekday fixation (spec §2.2)', () => {
  it('binds day-of-month permanently to weekdays: 1→Mon … 7→Sun', () => {
    for (const era of [12026, 12030]) {
      for (const month of [1, 7, 13]) {
        for (let day = 1; day <= 28; day++) {
          const ghs = getGHSDate(parseGHSDate(era, month, day));
          expect(ghs.weekday).toBe(WEEKDAYS_GHS[(day - 1) % 7]);
        }
      }
    }
  });

  it('starts the Aurora Week on a Monday', () => {
    expect(getGHSDate(parseGHSDate(12026, 'A', 1)).weekday).toBe('Monday');
    expect(getGHSDate(parseGHSDate(12026, 'A', 7)).weekday).toBe('Sunday');
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
  it('starts the day at @000 and clamps 23:59:59.999 to @999.99', () => {
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
  });
});

describe('parseGHSDate validation', () => {
  it.each([
    ['month 0', () => parseGHSDate(12026, 0, 1)],
    ['month 14', () => parseGHSDate(12026, 14, 1)],
    ['month 99', () => parseGHSDate(12026, 99, 99)],
    ['day 0', () => parseGHSDate(12026, 1, 0)],
    ['day 29', () => parseGHSDate(12026, 1, 29)],
    ['Aurora day 8', () => parseGHSDate(12026, 'A', 8)],
    ['Aurora Week in non-Aurora year', () => parseGHSDate(12027, 'A', 1)],
    ['negative beats', () => parseGHSDate(12026, 1, 1, -1)],
    ['beats 1000', () => parseGHSDate(12026, 1, 1, 1000)],
    ['fractional era', () => parseGHSDate(12026.5, 1, 1)],
    ['fractional day', () => parseGHSDate(12026, 1, 1.5)],
  ])('throws RangeError for %s', (_label, call) => {
    expect(call).toThrow(RangeError);
  });
});
