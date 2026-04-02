# CLI Tool Design - Global Horizon Standard (GHS)

## 1. Vision & Purpose
For a project like GHS, a CLI (Command Line Interface) is the ultimate statement. It demonstrates to the developer community that this system is not just a philosophical concept, but a robust, working tool.

The goal is to provide a tool that can be easily installed via `npm install -g ghs-time` and controlled through the `ghs` command.

## 2. Core Command Set

### `ghs now`
The primary command. It outputs the current moment in its full GHS representation.
- **Output Example:** `12026.01.13 @685.42`
- **Context:** "Today is Tuesday, 13 March. Current year type: Common Year."

### `ghs convert [date]`
Converts any Gregorian date into GHS.
- **Input Example:** `ghs convert 1995-08-15`
- **Output Example:** `11995.06.13 @000` (placeholder value)
- **Features:** Supports ISO strings, Unix timestamps, and relative descriptions like "tomorrow".

### `ghs cal [month] [year]`
An interactive terminal calendar, similar to the classic Linux `cal` command.
- **Symmetry:** Every GHS month is structured identically (starting on Monday, ending on Sunday), resulting in a perfect terminal layout.
- **Aurora Check:** Automatically highlights the "Aurora Week" at the end of the year if it is a leap year.

### `ghs beats`
Outputs only the current global time. Designed for easy integration into custom scripts or desktop status bars (e.g., i3status, Waybar).

## 3. Why a CLI is Essential

- **Automation:** System administrators can use GHS beats in log files, making global server debugging effortless by eliminating time zone conversions.
- **Technical Credibility:** It serves as the "engine" of the repository, proving that the mathematical formulas (the Aurora Algorithm) are correctly implemented in code.
- **Accessibility:** Provides the fastest way to interact with the system directly from the environment where developers spend most of their time.

## 4. User Experience (UX)

### Terminal Interface Mockup (`ghs info`)
```text
GLOBAL HORIZON STANDARD (GHS)
-----------------------------
Current Era:   12026 HE
Current Date:  01.13 (March)
Weekday:       Tuesday
Global Time:   @687 Beats

Next Aurora:   12027 HE (In 1 year)
Meridian:      Pacific Central (180°)
-----------------------------
"Time is a shared human horizon."
```

### User Journeys
- **Default (`ghs`):** Displays a prominent timestamp.
    - `12026.01.13 @642` (March, Tuesday, UTC Standard)
- **Scripting (`ghs --unix`):** Returns only the beats, ideal for custom shell prompts (ZSH/Bash).
    - `@642`
- **Comparison (`ghs --compare`):** Shows GHS time alongside the traditional Gregorian ISO time for reference.
    - `GHS: 12026.01.13 @642`
    - `ISO: 2026-03-31T15:24:00Z`

## 5. Technical Architecture

The tool is implemented using **Node.js** and **Commander.js**.

### Core Calculation Logic (Preview)
```typescript
/**
 * Calculates current Beats (UTC 0-offset)
 */
const getBeats = (date: Date): string => {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const ms = date.getUTCMilliseconds();

  // Total UTC seconds since midnight
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds + (ms / 1000);
  const beats = totalSeconds / 86.4;

  return `@${Math.floor(beats).toString().padStart(3, '0')}`;
};
```

### Directory Structure
- `src/index.ts`: CLI entry point and command routing.
- `src/ghs-converter.ts`: Isolated mathematical logic (available as a library).
- `src/display.ts`: Formatting logic for terminal tables and stylized output.
