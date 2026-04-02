# Calendar System Comparisons

GHS builds on the shoulders of giants. Here are the systems that inspired it — and where GHS diverges.

## 1. International Fixed Calendar (IFC) / Cotsworth Plan

Proposed by Moses Cotsworth in 1902. 13 months of 28 days, plus a "Year Day" at year's end and a "Leap Day" in summer — both outside the weekly cycle.

| Aspect          | IFC                           | GHS                              |
|-----------------|-------------------------------|----------------------------------|
| Months          | 13 × 28 days                  | 13 × 28 days                     |
| Extra month     | "Sol" between June and July   | "Luna" as 13th month (year's end)|
| Leap mechanism  | Year Day (outside the week)   | Aurora Week (within the week)    |
| Week continuity | **Broken** by null days       | **Never broken**                 |
| Religious issue | Fatal (Sabbath disruption)    | Solved (continuous 7-day cycle)  |
| Fate            | Rejected by League of Nations, 1930s | Active proposal          |

The IFC's null days were its fatal flaw. GHS eliminates this entirely.

## 2. New Earth Calendar

A modern leap-week calendar concept that preserves the unbroken 7-day rhythm by using leap weeks instead of leap days.

**What GHS takes from it:**
- The leap week concept (Aurora Week)
- The principle that the weekly rhythm must never be interrupted
- The idea that a leap week is culturally superior to a leap day (a full week of rest vs. one forgettable day)

**Where GHS diverges:**
- GHS adds the Human Era (+10,000 years)
- GHS integrates @Beats (decimal time)
- GHS defines a specific leap week algorithm (the Aurora Algorithm: 71 weeks in 400 years)

Reference: [New Earth Calendar on Calendars Wiki](https://calendars.fandom.com/wiki/New_Earth_Calendar)

## 3. Swatch Internet Time

Launched by Swatch in 1998. Divided the day into 1,000 ".beats" — the same decimal time concept GHS uses.

| Aspect           | Swatch Internet Time | GHS @Beats                      |
|------------------|----------------------|---------------------------------|
| Day division     | 1,000 .beats         | 1,000 @Beats                    |
| Reference point  | UTC+1 (Biel, Switzerland) | UTC (Greenwich)            |
| Sub-units        | None defined         | Decibeat, Centibeat, Millibeat  |
| Calendar pairing | None (Gregorian)     | Full 13-month calendar + HE era |

**GHS correction**: Swatch anchored @000 to midnight in Biel, Switzerland (UTC+1) — a corporate vanity decision. GHS resets to **UTC (Greenwich)**, the established global reference. This removes the arbitrary +1 hour bias.

**GHS extension**: Swatch never defined sub-beat units. GHS specifies the centibeat (~0.86s) as the everyday replacement for the second.

## 4. Holocene Calendar (Human Era)

Proposed by geologist Cesare Emiliani in 1993. Simply adds 10,000 years to the Gregorian date.

**What GHS takes from it:**
- The +10,000 year offset
- The rationale: honoring the Neolithic Revolution and creating a continuous positive timeline
- The elimination of BC/AD

**Where GHS diverges:**
- Emiliani proposed only an era change, keeping the Gregorian calendar structure. GHS pairs the Human Era with a completely restructured calendar and decimal time.

Reference: Emiliani, C. (1993). "Calendar Reform." Nature, 366, 716.

## 5. Year Day vs. Leap Week: The Core Trade-Off

| Feature         | Year Day (IFC)            | Leap Week (GHS)              |
|-----------------|---------------------------|------------------------------|
| Year length     | 365 (366) days            | 364 (371) days               |
| Weekdays        | Fixed (with break)        | Eternally fixed              |
| Economy         | Simple                    | Stable (week-based)          |
| Astronomy       | Very precise              | Pulsating (drift & reset)    |
| Holiday         | 1 day per year            | 7 days every 5–6 years       |
| Religious impact| Deal-breaker              | None                         |
| Software impact | Catastrophic (day with no weekday) | Minimal (standard week logic) |

## 6. Historical Origins of Time Division

### The Egyptian 24 Hours

The number 24 comes from counting finger joints. Using the thumb to count the joints of the other four fingers: 3 × 4 = 12. Twelve hours of daylight + twelve hours of night (marked by star constellations called "decans") = 24.

Originally, summer hours were longer than winter hours. Fixed-length hours came much later.

### The Babylonian 60

The Sumerians and Babylonians (~4,000 years ago) used base-60 because it is extraordinarily divisible: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30 all divide evenly into 60. Perfect for splitting time without a calculator.

The 360° circle, the 60-minute hour, and the 60-second minute are all their legacy.

### The GHS 1,000

GHS chooses 1,000 because it speaks the language of the metric age. We think in tens, hundreds, and thousands. Time-as-percentage (@500 = 50% of the day) is immediately intuitive.

| System          | Logic              | Strength                        | Weakness                        |
|-----------------|--------------------|---------------------------------|---------------------------------|
| Babylonian (60) | Geometric/organic  | Perfect for mental division     | Hard to calculate (1h24m + 48m = ?) |
| GHS (1,000)     | Decimal/digital    | Trivially easy arithmetic       | Feels "artificial," can't divide by 3 cleanly |
