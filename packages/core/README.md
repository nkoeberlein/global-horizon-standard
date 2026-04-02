# 🌍 ghs-time

The official core library for the **Global Horizon Standard (GHS)**.

GHS is a planetary calendar and decimal time system that resolves the chaos of time zones, irregular months, and archaic leap rules by introducing a symmetrical 13-month calendar and a universal decimal time protocol (@Beats).

## Installation

```bash
npm install ghs-time
```

## Usage

```typescript
import { getGHSDate, isAuroraYear } from 'ghs-time';

// Get the current GHS time (or pass a specific Date object)
const now = getGHSDate();

console.log(now.fullDate);  // e.g., "12026.01.15"
console.log(now.beats);     // e.g., "@685"
console.log(now.monthName); // e.g., "March"
console.log(now.era);       // e.g., 12026

// Check if a specific HE year is a leap year (53 weeks)
console.log(isAuroraYear(12026)); // false
```

## Documentation

For full specifications of the 13-month architecture, the Human Era (HE), and decimal beats, visit the [Global Horizon Standard GitHub Repository](https://github.com/nkoeberlein/global-horizon-standard).