# Decimal Time (@Beats) Specification

## 1. Definition

GHS replaces hours, minutes, and seconds with a single decimal unit: the **@Beat**.

```
1 day = 1,000 @Beats
```

When it is **@500**, it is @500 everywhere on Earth simultaneously. There are no time zones. The global beat count is the same for every human being at every moment.

## 2. Sub-Beat Units

| Unit          | Symbol | Value       | SI Equivalent (approx.) |
|---------------|--------|-------------|-------------------------|
| 1 Beat        | @1     | 1/1000 day  | 86.4 seconds            |
| 1 Decibeat    | dB     | 0.1 @Beat   | 8.64 seconds            |
| 1 Centibeat   | cB     | 0.01 @Beat  | 0.864 seconds           |
| 1 Millibeat   | mB     | 0.001 @Beat | 0.0864 seconds          |

The **Centibeat** (~0.86 seconds) is the natural replacement for the second in everyday life — close to the duration of a human heartbeat.

## 3. Arithmetic Advantage

Calculating time durations becomes trivially simple:

- A 100-beat event = exactly 10% of the day.
- @750 minus @300 = 450 beats duration.
- No converting between hours, minutes, and seconds. No 60-based arithmetic.

Time calculation becomes as intuitive as calculating money.

## 4. Reference Meridian

@Beats are synchronized to **UTC (Coordinated Universal Time)**, anchored at the Greenwich meridian (0° longitude).

- **@000** = midnight at UTC (Greenwich)
- **@500** = noon at UTC (Greenwich)

The Greenwich meridian is retained as the reference despite its colonial origins (International Meridian Conference, 1884). Pragmatically, it is the established global standard, and relatively few people live directly on the meridian, minimizing disruption.

The decolonization of time in GHS is achieved not by moving the meridian, but by **abolishing time zones entirely** — every person, regardless of geography, shares the same clock.

## 5. Local Solar Time

With a single global time, the relationship between clock time and daylight varies by location:

| @Beats | Activity in Berlin     | Activity in Tokyo       |
|--------|------------------------|-------------------------|
| @000   | Sleeping (midnight)    | Working (morning)       |
| @350   | Waking up / breakfast  | End of workday / dinner |
| @500   | Start of work (noon)   | Going to sleep          |
| @850   | End of work / leisure  | Deep sleep              |

People would describe their schedules in terms of their **local daylight phase** (e.g., "I work from @400 to @800") rather than fixed clock labels like "9 to 5."

## 6. Precision Model: The Atom-Beat

GHS defines the @Beat using **SI seconds** (atomic time), not solar rotation:

```
1 @Beat = 86.4 SI seconds
1 @Beat = 86.4 × 9,192,631,770 caesium-133 oscillations
```

This means the beat has a fixed, invariant duration, independent of Earth's rotational variations.

**Consequence**: Like the current UTC system, occasional **leap-beat adjustments** may be needed when cumulative differences between atomic time and Earth's rotation become significant. This is the same challenge that produces today's "leap seconds."

**Rejected alternative**: A "rubber-band" beat that stretches or shrinks with the actual solar day (1 beat = exactly 1/1000 of that day's solar noon-to-noon duration). While aesthetically appealing, this would make the beat an unstable unit — unacceptable for science, navigation, and computing.

## 7. Visualization: The Analog GHS Clock

While @Beats are natively digital, a standard analog representation has been developed to provide a "sense of time" similar to traditional clocks.

### The 10-Base Dial
The GHS analog face is divided into **10 main segments**, numbered **0 to 9**. 
- Each main segment represents **100 @Beats** (1/10th of a day).
- Between each main segment are **9 sub-marks**, dividing every 100-beat section into 10-beat increments.

### The Hand System
A standard GHS analog clock uses two primary hands:

1.  **Day Hand (Large / Outer)**: 
    - Completes **one full rotation per day** (1,000 beats).
    - Points to the current century of beats (e.g., at @350, it points midway between 3 and 4).
2.  **Beat Hand (Small / Inner / Fast)**:
    - Completes **one full rotation every 100 beats**.
    - Provides high-resolution tracking of the current beat (e.g., at @350, it points exactly at the top/0 mark, as the current 100-beat cycle is at 50%).

This dual-hand system allows for both a macroscopic view of the day's progress and a microscopic view of the passing beats, maintaining the decimal logic in a physical form.

