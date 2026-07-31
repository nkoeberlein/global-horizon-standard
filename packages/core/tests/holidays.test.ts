import { describe, expect, it } from 'vitest';
import { getHolidaysForYear, HOLIDAYS, isAuroraYear } from '../src';

describe('getHolidaysForYear', () => {
  const fixedCount = HOLIDAYS.filter((h) => h.type === 'fixed').length;

  it('resolves all fixed holidays in an Aurora year', () => {
    expect(isAuroraYear(12026)).toBe(true);
    const occurrences = getHolidaysForYear(12026);
    expect(occurrences).toHaveLength(fixedCount);
    expect(occurrences.some((o) => o.holiday.name === 'Aurora Festival')).toBe(true);
  });

  it('omits Aurora-Week holidays in non-Aurora years', () => {
    expect(isAuroraYear(12027)).toBe(false);
    const occurrences = getHolidaysForYear(12027);
    expect(occurrences).toHaveLength(fixedCount - 1);
    expect(occurrences.some((o) => o.holiday.name === 'Aurora Festival')).toBe(false);
  });

  it('computes Gregorian dates from the calendar instead of stale static values', () => {
    const newYear = getHolidaysForYear(12026).find((o) => o.holiday.name === 'New Year (Equinox)');
    expect(newYear?.ghsDate).toBe('12026.01.01');
    expect(newYear?.gregorian.toISOString().slice(0, 10)).toBe('2026-03-18');

    // Same holiday lands on a different Gregorian day in another year — the
    // reason static equivalents were removed.
    const newYear27 = getHolidaysForYear(12027).find(
      (o) => o.holiday.name === 'New Year (Equinox)',
    );
    expect(newYear27?.gregorian.toISOString().slice(0, 10)).toBe('2027-03-24');
  });

  it('resolves multi-day observances with an end date', () => {
    const luna = getHolidaysForYear(12026).find((o) => o.holiday.name === 'Luna Moon Month');
    expect(luna?.gregorianEnd).toBeDefined();
    // Luna spans 13.01–13.28 → 27 days between first and last day
    const spanDays =
      ((luna?.gregorianEnd?.getTime() ?? 0) - (luna?.gregorian.getTime() ?? 0)) / 86_400_000;
    expect(spanDays).toBe(27);
  });

  // HOLIDAYS is grouped by category, so the raw array order put 13.16 before
  // 13.01 and the Aurora Week before 10.28.
  it.each([
    ['an Aurora year', 12026],
    ['a non-Aurora year', 12027],
  ])('returns occurrences in chronological order in %s', (_label, era) => {
    const times = getHolidaysForYear(era).map((o) => o.gregorian.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });
});

/**
 * Fixed GHS dates cannot track a Gregorian target exactly — they drift within a
 * ±4-day window (spec/calendar.md §2). A correctly placed holiday is therefore
 * one whose drift window is *centered* on its target.
 *
 * This caught the equinox/solstice holidays sitting on a tidy day-14-of-every-
 * third-month grid: the seasons are unequal, so that grid put them 4, 6 and 11
 * days off while their descriptions claimed "the longest day", "day and night
 * are equal" and "the shortest day".
 */
describe('Gregorian calibration of fixed holidays', () => {
  const DAY_MS = 86_400_000;

  /** Min/max/midpoint offset in days from the Gregorian target, over a century. */
  function drift(name: string, targetMonth: number, targetDay: number) {
    let lo = Number.POSITIVE_INFINITY;
    let hi = Number.NEGATIVE_INFINITY;
    for (let era = 12000; era < 12100; era++) {
      const occurrence = getHolidaysForYear(era).find((o) => o.holiday.name === name);
      if (!occurrence) continue;
      const { gregorian } = occurrence;
      const target = Date.UTC(gregorian.getUTCFullYear(), targetMonth - 1, targetDay);
      const offset = Math.round((gregorian.getTime() - target) / DAY_MS);
      lo = Math.min(lo, offset);
      hi = Math.max(hi, offset);
    }
    return { lo, hi, mid: (lo + hi) / 2 };
  }

  it.each([
    ['New Year (Equinox)', 3, 20],
    ['Summer Solstice Gala', 6, 21],
    ['Autumn Equinox Festival', 9, 23],
    ['Winter Solstice Ceremony', 12, 21],
  ])('centers %s on its astronomical event', (name, month, day) => {
    const { lo, hi, mid } = drift(name, month, day);
    expect(Math.abs(mid), `${name} drift [${lo}..${hi}] is not centered`).toBeLessThanOrEqual(1);
    expect(hi - lo).toBeLessThanOrEqual(8);
  });

  it.each([
    ['Earth Day', 4, 22],
    ['Labor Day', 5, 1],
    ['United Nations Day', 10, 24],
    ['Halloween / Reformation Day', 10, 31],
    ['Day of the Dead (Dia de los Muertos)', 11, 2],
    ['Christmas', 12, 25],
    ["Valentine's Day", 2, 14],
  ])('keeps %s within drift of its Gregorian namesake', (name, month, day) => {
    const { lo, hi, mid } = drift(name, month, day);
    expect(Math.abs(mid), `${name} drift [${lo}..${hi}] is not centered`).toBeLessThanOrEqual(1);
    expect(hi - lo).toBeLessThanOrEqual(8);
  });
});
