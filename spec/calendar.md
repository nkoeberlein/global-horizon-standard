# GHS Calendar Specification

## 1. Overview

The Global Horizon Standard divides the year into **13 months of exactly 28 days** (364 days). Every month begins on a Monday and ends on a Sunday. The year starts near the **spring equinox**: year starts drift within a fixed window of **16–24 March** (Gregorian), centered on the equinox (~20 March), and the Aurora Week periodically resets the drift (see §5.5).

To maintain alignment with the solar year (~365.2422 days), GHS uses the **Aurora Week** — a full 7-day leap week inserted every 5 to 6 years — instead of individual leap days.

## 2. Month Structure

### 2.1 Month Names and Order

| #  | Name      | Season | Gregorian Equivalent (approx.) | Note                        |
|----|-----------|--------|--------------------------------|-----------------------------|
| 01 | March     | Spring | Mar 21 – Apr 17               | New Year (equinox)          |
| 02 | April     | Spring | Apr 18 – May 15               |                             |
| 03 | May       | Spring | May 16 – Jun 12               |                             |
| 04 | June      | Summer | Jun 13 – Jul 10               | Summer solstice (~mid-month)|
| 05 | July      | Summer | Jul 11 – Aug 7                |                             |
| 06 | August    | Summer | Aug 8 – Sep 4                 |                             |
| 07 | September | Autumn | Sep 5 – Oct 2                 | Septem = 7 ✓                |
| 08 | October   | Autumn | Oct 3 – Oct 30                | Octo = 8 ✓                  |
| 09 | November  | Autumn | Oct 31 – Nov 27               | Novem = 9 ✓                 |
| 10 | December  | Winter | Nov 28 – Dec 25               | Decem = 10 ✓                |
| 11 | January   | Winter | Dec 26 – Jan 22               |                             |
| 12 | February  | Winter | Jan 23 – Feb 19               |                             |
| 13 | Luna      | Winter | Feb 20 – Mar 19               | The Moon Month (year's end) |
| —  | Aurora    | —      | (7 days after Luna)            | A.1–A.7 (Aurora Years only) |

> [!NOTE]
> The Gregorian ranges are approximations. Because GHS years are exactly 364 or 371 days long while Gregorian years are 365/366, every fixed GHS date shifts by up to ±4 days against the Gregorian calendar over the 5–6-year Aurora cycle.

Luna is placed as the **13th and final month**, restoring the Latin etymology that has been broken for over 2,000 years:

- **September** is the **7th** month (septem = 7) ✓
- **October** is the **8th** month (octo = 8) ✓
- **November** is the **9th** month (novem = 9) ✓
- **December** is the **10th** month (decem = 10) ✓

Luna (the Moon) as the final month carries powerful symbolism: a time of darkness, reflection, and preparation before the spring equinox brings the new year. It is the bridge from winter to rebirth.

### 2.2 Weekday Fixation

Since every month has exactly 28 days (4 complete weeks), every date is permanently bound to a weekday:

| Day of Month     | Weekday   |
|------------------|-----------|
| 1, 8, 15, 22     | Monday    |
| 2, 9, 16, 23     | Tuesday   |
| 3, 10, 17, 24    | Wednesday |
| 4, 11, 18, 25    | Thursday  |
| 5, 12, 19, 26    | Friday    |
| 6, 13, 20, 27    | Saturday  |
| 7, 14, 21, 28    | Sunday    |

You never need to buy a new calendar again. Schedules, pay cycles, and holidays are fixed forever.

## 3. Season Alignment

The year's astronomical anchor points fall at predictable calendar positions:

| GHS Date   | Event             | Astronomical Meaning   |
|------------|-------------------|------------------------|
| 1 March    | New Year          | Spring Equinox         |
| 14 June    | Summer Festival   | Summer Solstice        |
| 14 September | Autumn Festival | Autumn Equinox (sep = 7) |
| 14 December  | Winter Festival | Winter Solstice (dec = 10) |

Due to the ~1.24-day annual drift between the 364-day calendar and the solar year, these astronomical events shift by a few days over a 5–6 year cycle. The Aurora Week resets this drift periodically.

## 4. Financial Quarters

13 months cannot be divided evenly into 4 quarters. GHS solves this by defining quarters on a **weekly** basis:

- **1 Quarter = 13 weeks = 91 days**
- **4 Quarters = 52 weeks = 364 days**

| Quarter | Months         | Weeks  |
|---------|----------------|--------|
| Q1      | March – May + Week 1 of June | Weeks 1–13  |
| Q2      | Rest of June – August + Week 1 of September | Weeks 14–26 |
| Q3      | Rest of September – November + Week 1 of December | Weeks 27–39 |
| Q4      | Rest of December – Luna | Weeks 40–52 |

The Aurora Week (A.1–A.7), when it occurs, sits outside the quarterly and monthly structure entirely — a neutral bonus interval belonging to no month and no quarter.

## 5. Aurora Week (Leap Mechanism)

### 5.1 The Problem

The solar year is approximately 365.2422 days. The GHS calendar year is 364 days (52 weeks). This creates a deficit of ~1.24 days per year. Without correction, the spring equinox would drift away from March 1 within a few years.

### 5.2 The Solution: Leap Weeks

Instead of inserting individual leap days (which would break the continuous 7-day week rhythm), GHS inserts a complete **Aurora Week** (7 days) between Luna (month 13) and the new year.

The Aurora Week **does not belong to any month**. Its days are designated **A.1 through A.7** — a standalone period outside the monthly structure.

- In a normal year: 13 × 28 = 364 days (52 weeks)
- In an Aurora year: 364 + 7 = 371 days (53 weeks)

### 5.3 The 400-Year Cycle

In 400 years, the Gregorian calendar counts exactly 146,097 days.

GHS in 400 years (without leap weeks): 400 × 364 = 145,600 days.

Difference: 146,097 − 145,600 = **497 days** = **71 weeks**.

**Rule: Exactly 71 Aurora Weeks must be inserted in every 400-year cycle.**

### 5.4 The Aurora Algorithm

A year *Y* (in HE) is an Aurora Year if:

```
(71 × Y + 156) mod 400 < 71
```

Where:
- **Y** = the year in the Human Era
- **156** = the epsilon constant, calibrating the algorithm to the spring equinox

This distributes the 71 leap weeks as evenly as possible, producing intervals of 5 or 6 years between Aurora Years.

### 5.5 Epoch & Reference Implementation

The calendar is anchored at a **single epoch**:

> **GHS 10001.01.01 = 21 March of year 1 CE (proleptic Gregorian), 00:00 UTC**
>
> — the year traditionally associated with the birth of Christ, and the first full year of the Human Era.

Every other year start follows deterministically by chaining year lengths (364 or 371 days). Because any 400 consecutive GHS years sum to exactly 146,097 days — identical to the Gregorian 400-year cycle — year starts remain forever within the **16–24 March drift window**, centered on the spring equinox. In the modern era this calibration yields, e.g., **12026.01.01 = 18 March 2026**.

```typescript
function isAuroraYear(yearHE: number): boolean {
  const epsilon = 156;
  return (71 * yearHE + epsilon) % 400 < 71;
}

function getDaysInYear(yearHE: number): number {
  return isAuroraYear(yearHE) ? 371 : 364;
}

const EPOCH_YEAR = 10001; // starts 0001-03-21T00:00Z (proleptic Gregorian)

function yearStart(yearHE: number): Date {
  // epoch + sum of getDaysInYear(y) for all years between epoch and yearHE
  // (jump whole 400-year cycles of 146,097 days for efficiency)
}
```

> [!IMPORTANT]
> Conversions must **not** anchor every year at a fixed Gregorian date (e.g. "each 21 March"). That would make GHS years 365/366 real days long, break the bijective day↔date mapping, and render the Aurora Week unreachable. The year length is *always* exactly 364 or 371 days.

### 5.6 The Aurora Week as Cultural Event

The Aurora Week is not merely a technical correction — it is a global pause:

- **No deadlines**: No contracts expire, no interest accrues, no bureaucratic clocks run.
- **Global maintenance**: IT systems perform major updates.
- **Celebration**: A week of reflection and preparation before spring arrives.
- **Outside all structure**: The Aurora Week belongs to no month (A.1–A.7), no quarter, and no fiscal period. It is time outside of time.

The name "Aurora" (dawn) symbolizes the anticipation of the new year's light. It follows Luna — the month of the Moon — and precedes March, the month of new beginnings.

## 6. Continuous Week Rhythm

Unlike the International Fixed Calendar (IFC), which inserts "World Days" outside the weekly cycle, GHS **never breaks the 7-day rhythm**. Monday always follows Sunday. This is critical for:

- **Religious observance**: The Sabbath, Sunday, and Friday cycles remain uninterrupted since the beginning of recorded time.
- **Software compatibility**: Every algorithm that divides by 7 continues to work. No "day without a weekday" edge cases.
- **Human psychology**: The weekly rhythm is deeply embedded in human life. GHS preserves it absolutely.

This was the primary reason the IFC failed before the League of Nations in the 1930s. GHS eliminates that obstacle entirely.
