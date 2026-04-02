## CLI Commands

The `ghs` CLI tool provides a set of commands to interact with the Global Horizon Standard directly from your terminal.

### `ghs` (or `ghs now`)
The primary command. It outputs the current moment in its full GHS representation, including contextual information.
* **Output Example:** `12026.01.13 @685`
* **Context:** "Date: Tuesday, 13. March 12026 HE | Year Info: Normal Year (52 weeks)"

### `ghs convert <date>`
Converts any Gregorian date into the GHS time protocol.
* **Input Example:** `ghs convert 1995-08-15`
* **Output Example:** `11995.06.01 @000 (Tuesday, 01. August)`
* **Features:** Supports standard ISO strings (e.g., `YYYY-MM-DD`) and Unix timestamps.

### `ghs cal [month] [year]`
Displays a perfectly symmetrical terminal calendar, inspired by the classic Linux `cal` command.
* **Symmetry by Design:** Since every GHS month consists of exactly 28 days (starting on Monday and ending on Sunday), the terminal grid is always perfectly aligned.
* **Aurora Check:** Automatically detects leap years and visually highlights the 7-day "Aurora Week" (A.01 to A.07) at the end of the year.

### `ghs beats` (via `ghs --unix`)
Outputs strictly the current global time in `@Beats`.
* **Output Example:** `@685`
* **Use Case:** Designed for seamless integration into server logs, custom shell scripts, or desktop status bars (e.g., i3status, Polybar, Waybar).