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
});
