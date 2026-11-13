# 🌍 ghs-time

The official zero-dependency core library for the **Global Horizon Standard (GHS)**:

- **Calendar:** 13 months × 28 days = 364 days/year (every month starts on Monday)
- **Era:** Human Era (HE) — Gregorian year + 10,000
- **Time:** `@Beats` decimal world time (1 day = 1,000 beats, anchored to UTC midnight)
- **Leap Week:** Aurora Week (`A.1`–`A.7`) — 71 weeks per 400-year cycle (`(71Y + 286) mod 400 < 71`)
- **Origin:** `12000.01.01 = Unix day 11,036` (`2000-03-20T00:00:00Z`, the March equinox of 2000, a Monday)

## Installation

```bash
npm install ghs-time
```

## Usage

```typescript
import {
  formatGHS,
  getDaysInYear,
  getGHSDate,
  getHolidaysForYear,
  getSolarNoonBeat,
  getYearStartMs,
  isAuroraYear,
  parseGHSDate,
  parseGHSString,
} from 'ghs-time';

// 1. Convert a JS Date (defaults to now) to GHS
const ghs = getGHSDate(new Date('2026-03-23T12:00:00Z'));
console.log(ghs.fullDate);   // "12026.01.01"
console.log(ghs.beats);      // "@500"
console.log(ghs.beatsLong);  // "@500.00"
console.log(ghs.beatsExact); // 500
console.log(ghs.weekday);    // "Monday"

// 2. Format a GHS date ('core' | 'ui' | 'text' | 'short')
console.log(formatGHS(ghs, 'core'));  // "12026.01.01 @500"
console.log(formatGHS(ghs, 'ui'));    // "1 Mar 12026 @500"
console.log(formatGHS(ghs, 'text'));  // "1 March 12026"
console.log(formatGHS(ghs, 'short')); // "1 Mar '26"

// 3. Convert GHS components or timestamp strings back to a UTC Date
const date = parseGHSDate(12025, 'A', 3, 685.25);
const parsed = parseGHSString('GHS 12026.01.15 @685');

// 4. Leap-week & epoch helpers
console.log(isAuroraYear(12025));    // true (371 days)
console.log(isAuroraYear(12026));    // false (364 days)
console.log(getDaysInYear(12025));   // 371
console.log(getYearStartMs(12026));  // 1774224000000 (2026-03-23T00:00:00Z)

// 5. Fixed holidays & local solar noon @Beat
const holidays = getHolidaysForYear(12026);
const berlinNoon = getSolarNoonBeat(13.4); // @463
```

## Documentation

For the full specification of the 13-month architecture, the Human Era (HE), and `@Beats`, see the [Global Horizon Standard Repository](https://github.com/nkoeberlein/global-horizon-standard).
