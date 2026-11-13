# 🌍 ghs-cli

Command-line interface (`ghs`) for the **Global Horizon Standard (GHS)** — 13-month calendar, `@Beats` decimal time, and Human Era (HE).

## Installation

```bash
npm install -g ghs-cli
```

Or inside this repository:

```bash
npm run build
npm link packages/cli
```

## Commands

### `ghs` (Default: Current GHS Time)
Displays the current GHS timestamp and human-readable date.

```bash
$ ghs
  🌍 GHS: 12026.01.15 @685
  📅 Monday, 15 March 12026

$ ghs --format short      # Formats: core, ui, text, short
$ ghs --json              # Full GHSDateResult as JSON
$ ghs --compare           # Side-by-side GHS and ISO-8601 UTC output
```

### `ghs convert <date>`
Bidirectional converter between Gregorian (`YYYY-MM-DD` / ISO-8601) and GHS (`[GHS ]YYYYY.MM.DD[@BBB]`, or `YYYYY.A.DD` for Aurora Week).

```bash
$ ghs convert "2026-03-23"
  🌍 Gregorian:  2026-03-23T00:00:00.000Z
  🗓️  GHS Output: 12026.01.01 @000 (1 Mar 12026 @000)

$ ghs convert "12025.A.01"
  🗓️  GHS Input:  12025.A.01
  🌍 Gregorian:  2026-03-16T00:00:00.000Z
```

### `ghs clock`
Runs a live-updating terminal `@Beats` clock.

```bash
$ ghs clock
```

### `ghs cal [month] [year]`
Displays the symmetrical 4×7 GHS calendar grid for any month (`1`–`13`) or the Aurora Week (`A`).

```bash
$ ghs cal 1 12026
$ ghs cal A 12025
```

### `ghs holidays [year]`
Lists the fixed GHS holidays for a given Human Era year alongside their computed Gregorian UTC dates (including the Aurora Festival in Aurora Years).

```bash
$ ghs holidays 12026
$ ghs holidays 12025
```
