import { isAuroraYear } from './aurora';
import { parseGHSDate } from './converter';

interface HolidayBase {
  name: string;
  category: string;
  description: string;
}

/** Holiday bound to a fixed GHS date (month/day are identical every year). */
export interface FixedHoliday extends HolidayBase {
  type: 'fixed';
  /** GHS month 1–13, or "A" for the Aurora Week (Aurora Years only). */
  month: number | 'A';
  day: number;
  /** Last day for multi-day observances (same month). */
  endDay?: number;
}

/** Holiday whose date follows an external (usually lunar) calendar rule. */
export interface DynamicHoliday extends HolidayBase {
  type: 'dynamic';
  rule: string;
}

export type Holiday = FixedHoliday | DynamicHoliday;

/**
 * Reference list of global, cultural, and religious holidays mapped to GHS.
 *
 * Gregorian equivalents are intentionally not stored: with the epoch-based
 * calendar they shift by up to ±4 days from year to year. Use
 * `getHolidaysForYear` to resolve a fixed holiday to its Gregorian date in a
 * specific year.
 */
export const HOLIDAYS: readonly Holiday[] = [
  {
    name: 'New Year (Equinox)',
    category: 'Global',
    type: 'fixed',
    month: 1,
    day: 1,
    description:
      'The first day of the year, aligned with the spring equinox. A celebration of renewal and the astronomical start of the cycle.',
  },
  {
    name: 'Earth Day',
    category: 'Global',
    type: 'fixed',
    month: 2,
    day: 5,
    description: 'Global celebration focusing on environmental protection and planetary awareness.',
  },
  {
    name: 'Labor Day',
    category: 'Global',
    type: 'fixed',
    month: 2,
    day: 14,
    description: 'International day honoring the labor movement and workers worldwide.',
  },
  {
    name: 'Summer Solstice Gala',
    category: 'Global',
    type: 'fixed',
    month: 4,
    day: 14,
    description:
      'Marks the longest day of the year (northern hemisphere). A festival of light and energy.',
  },
  {
    name: 'Autumn Equinox Festival',
    category: 'Global',
    type: 'fixed',
    month: 7,
    day: 14,
    description:
      'The balance point of the year. Day and night are equal. A celebration of harvest and equilibrium.',
  },
  {
    name: 'United Nations Day',
    category: 'Global',
    type: 'fixed',
    month: 8,
    day: 22,
    description: 'Commemorates the creation of the United Nations and global diplomacy.',
  },
  {
    name: 'Winter Festival',
    category: 'Global',
    type: 'fixed',
    month: 9,
    day: 28,
    description:
      'A seasonal celebration near the end of November, replacing region-specific winter holidays with a shared global moment.',
  },
  {
    name: 'Winter Solstice Ceremony',
    category: 'Global',
    type: 'fixed',
    month: 10,
    day: 14,
    description: 'The shortest day (northern hemisphere). Marking the return of the light.',
  },
  {
    name: "International Women's Day",
    category: 'Global',
    type: 'fixed',
    month: 13,
    day: 16,
    description:
      'Global day celebrating the social, economic, cultural, and political achievements of women.',
  },
  {
    name: 'Luna Moon Month',
    category: 'GHS Culture',
    type: 'fixed',
    month: 13,
    day: 1,
    endDay: 28,
    description:
      'The final month 13 — Luna. A time of reflection, closure, and preparation before the Aurora Week and the new year.',
  },
  {
    name: 'Aurora Festival',
    category: 'GHS Culture',
    type: 'fixed',
    month: 'A',
    day: 1,
    endDay: 7,
    description:
      'The Aurora Week — seven days of global pause, reflection, maintenance, and celebration before the new year begins. Aurora Years only (every 5–6 years).',
  },
  {
    name: 'Christmas',
    category: 'Christianity',
    type: 'fixed',
    month: 10,
    day: 28,
    description: 'Christian holiday commemorating the birth of Jesus Christ.',
  },
  {
    name: 'Halloween / Reformation Day',
    category: 'Culture / Christianity',
    type: 'fixed',
    month: 9,
    day: 1,
    description: 'Eve of All Hallows / Commemoration of the Protestant Reformation.',
  },
  {
    name: "Valentine's Day",
    category: 'Culture',
    type: 'fixed',
    month: 12,
    day: 23,
    description: 'Feast of Saint Valentine, globally recognized as a day of romance and love.',
  },
  {
    name: 'Day of the Dead (Dia de los Muertos)',
    category: 'Culture',
    type: 'fixed',
    month: 9,
    day: 3,
    description: 'Mexican holiday honoring deceased loved ones.',
  },
  {
    name: 'Easter Sunday',
    category: 'Christianity',
    type: 'dynamic',
    rule: 'First Sunday after the first full moon on or after GHS 01.01',
    description:
      'Celebrates the resurrection of Jesus Christ. Wanders between early March and late April.',
  },
  {
    name: 'Ramadan (Start)',
    category: 'Islam',
    type: 'dynamic',
    rule: 'Day 1 of Ramadan (Islamic Lunar Calendar)',
    description:
      'A month of fasting, prayer, reflection, and community. Shifts backwards through the GHS calendar by roughly 11 days per year.',
  },
  {
    name: 'Eid al-Fitr',
    category: 'Islam',
    type: 'dynamic',
    rule: 'Day 1 of Shawwal (Islamic Lunar Calendar)',
    description: 'Festival of Breaking the Fast, marking the end of Ramadan.',
  },
  {
    name: 'Eid al-Adha',
    category: 'Islam',
    type: 'dynamic',
    rule: 'Day 10 of Dhu al-Hijjah (Islamic Lunar Calendar)',
    description:
      'Feast of the Sacrifice, honoring the willingness of Ibrahim to sacrifice his son.',
  },
  {
    name: 'Passover (Pesach)',
    category: 'Judaism',
    type: 'dynamic',
    rule: 'Day 15 of Nisan (Hebrew Lunisolar Calendar)',
    description: 'Commemorates the liberation of the Israelites from slavery in Egypt.',
  },
  {
    name: 'Rosh Hashanah',
    category: 'Judaism',
    type: 'dynamic',
    rule: 'Day 1 of Tishrei (Hebrew Lunisolar Calendar)',
    description: 'The Jewish New Year.',
  },
  {
    name: 'Yom Kippur',
    category: 'Judaism',
    type: 'dynamic',
    rule: 'Day 10 of Tishrei (Hebrew Lunisolar Calendar)',
    description: 'Day of Atonement, the holiest day of the year in Judaism.',
  },
  {
    name: 'Hanukkah',
    category: 'Judaism',
    type: 'dynamic',
    rule: 'Day 25 of Kislev (Hebrew Lunisolar Calendar)',
    description: 'Festival of Lights, commemorating the rededication of the Second Temple.',
  },
  {
    name: 'Holi',
    category: 'Hinduism',
    type: 'dynamic',
    rule: 'Phalguna Purnima (Hindu Lunisolar Calendar)',
    description: 'Festival of Colors, celebrating spring, love, and new life.',
  },
  {
    name: 'Diwali',
    category: 'Hinduism',
    type: 'dynamic',
    rule: 'Amavasya of Kartika (Hindu Lunisolar Calendar)',
    description: 'Festival of Lights, symbolizing the spiritual victory of light over darkness.',
  },
  {
    name: 'Vesak',
    category: 'Buddhism',
    type: 'dynamic',
    rule: 'First full moon in May equivalent (Buddhist Lunar Calendar)',
    description: 'Commemorates the birth, enlightenment, and death of Gautama Buddha.',
  },
  {
    name: 'Lunar New Year',
    category: 'Culture',
    type: 'dynamic',
    rule: 'Day 1 of the month 1 (Chinese Lunisolar Calendar)',
    description: 'Celebrates the beginning of a new year on the traditional lunisolar calendar.',
  },
];

/** A fixed holiday resolved to a concrete year. */
export interface HolidayOccurrence {
  holiday: FixedHoliday;
  era: number;
  /** Compact GHS notation, e.g. "12026.02.14" or "12026.A.01" */
  ghsDate: string;
  /** Gregorian date (UTC midnight) of the (first) day in this year. */
  gregorian: Date;
  /** Gregorian date of the last day, when the holiday spans several days. */
  gregorianEnd?: Date;
}

/**
 * Resolves all fixed holidays to their Gregorian dates in the given GHS year.
 * Aurora-Week holidays are omitted in years that are not Aurora Years.
 * Dynamic (lunar-calendar) holidays cannot be resolved by GHS and are excluded.
 */
export function getHolidaysForYear(era: number): HolidayOccurrence[] {
  const occurrences: HolidayOccurrence[] = [];

  for (const holiday of HOLIDAYS) {
    if (holiday.type !== 'fixed') continue;
    if (holiday.month === 'A' && !isAuroraYear(era)) continue;

    const monthStr = holiday.month === 'A' ? 'A' : String(holiday.month).padStart(2, '0');
    const occurrence: HolidayOccurrence = {
      holiday,
      era,
      ghsDate: `${era}.${monthStr}.${String(holiday.day).padStart(2, '0')}`,
      gregorian: parseGHSDate(era, holiday.month, holiday.day),
    };
    if (holiday.endDay !== undefined) {
      occurrence.gregorianEnd = parseGHSDate(era, holiday.month, holiday.endDay);
    }
    occurrences.push(occurrence);
  }

  return occurrences;
}
