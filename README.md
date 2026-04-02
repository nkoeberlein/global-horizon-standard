<div align="center">

  <h1>🌍 Global Horizon Standard (GHS)</h1>
  <p>One World. One Pulse. One Human Era.</p>

  <img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/nkoeberlein/ea238f96af6f644ffe06415ee941e7a6/raw/ghs-time.json&style=for-the-badge" alt="Live GHS Time" />

  <br />

  <img src="https://img.shields.io/badge/Era-12026_HE-blue?style=for-the-badge" alt="Current Era" />
  <img src="https://img.shields.io/badge/Calendar-13_×_28-orange?style=for-the-badge" alt="Calendar Structure" />
  <img src="https://img.shields.io/badge/Standard-GHS_1.0-brightgreen?style=for-the-badge" alt="GHS Version" />

</div>

<br />

> **GHS is a planetary calendar and decimal time system.** It resolves the chaos of time zones, irregular months, and archaic leap rules by introducing a perfectly symmetrical 13-month calendar and a universal decimal time protocol (@Beats).

The Global Horizon Standard is an open-source time protocol that corrects the logical errors of our current timekeeping. By combining a 13-month fixed calendar, the 12,000-year Human Era (HE), and a decimal world time (@Beats), GHS creates a universal standard for a digital and global society — synchronized with nature and freed from colonial boundaries.

---

## ⚙️ Key Features

| Feature | Specification |
|---------|-------------|
| **Calendar** | 13 months × 28 days = 364 days. Every month starts on a Monday. |
| **Era** | Human Era (HE): +10,000 years to the Gregorian calendar. |
| **Time** | @Beats: 1,000 decimal beats per day. Zero time zones. |
| **Leap Mechanism** | Aurora Week: A 7-day intercalary week every 5–6 years. |
| **Year Start** | The spring equinox (March 21 Gregorian). |
| **Timestamp** | `12026.01.09 @875` (Big-Endian, globally unambiguous). |

---

## 💡 The "Why"

Our current calendar is a patchwork of Roman emperors, papal decrees, and colonial power. GHS fixes the core architectural flaws of legacy timekeeping:

* **Illogical Months:** "September" literally means "7th month," yet it is the 9th. GHS heals this etymology — September is the 7th month again.
* **Asymmetrical Lengths:** Memorizing 28, 29, 30, and 31 days is obsolete. In GHS, every month is exactly 4 weeks (28 days).
* **Arbitrary Year Start:** January 1st has no astronomical significance. GHS starts the year when nature does — at the northern spring equinox.
* **Time Zone Chaos:** 24+ time zones, daylight saving switches, and a prime meridian chosen by colonial fiat. GHS replaces it all with a single global pulse.
* **Divided History:** The BC/AD split fractures human civilization around a single religious event. The Human Era (HE) unites 12,000 years of progress into one continuous timeline.

---

## 📊 Quick Reference

### The 13-Month Architecture

| #  | Name      | Season | Gregorian (Approx.)   | Note |
|----|-----------|--------|-----------------------|------|
| 01 | March     | Spring | Mar 21 – Apr 17       | Year begins |
| 02 | April     | Spring | Apr 18 – May 15       | |
| 03 | May       | Spring | May 16 – Jun 12       | |
| 04 | June      | Summer | Jun 13 – Jul 10       | |
| 05 | July      | Summer | Jul 11 – Aug 7        | |
| 06 | August    | Summer | Aug 8 – Sep 4         | |
| 07 | September | Autumn | Sep 5 – Oct 2         | *septem = 7* |
| 08 | October   | Autumn | Oct 3 – Oct 30        | *octo = 8* |
| 09 | November  | Autumn | Oct 31 – Nov 27       | *novem = 9* |
| 10 | December  | Winter | Nov 28 – Dec 25       | *decem = 10* |
| 11 | January   | Winter | Dec 26 – Jan 22       | |
| 12 | February  | Winter | Jan 23 – Feb 19       | |
| 13 | **Luna** | Winter | Feb 20 – Mar 19       | The 13th month |
| —  | **Aurora**| —      | *(A.1–A.7)* | *Leap years only* |

### Decimal Time (@Beats)

| @Beats | UTC Equivalent | Phase of Day |
|--------|----------------|--------------|
| @000   | 00:00          | Midnight |
| @250   | 06:00          | Morning |
| @500   | 12:00          | Noon |
| @750   | 18:00          | Evening |

---

## 📁 Repository Structure & Documentation

Explore the project to understand the math, philosophy, and code behind the standard.

* **[`/spec`](spec/) — The Definitive Rulebook:**
  * [Calendar Structure](spec/calendar.md) (13 months, Aurora algorithm)
  * [Human Era (HE)](spec/era-he.md)
  * [Decimal Time (@Beats)](spec/time-beats.md)
  * [Timestamp Format](spec/timestamp-format.md)
* **[`/ideas`](ideas/) — Open Debates & Explorations:** Read our active discussions on [physics implications](ideas/physics-implications.md), [legacy system migrations](ideas/legacy-systems.md), and [global adoption strategies](ideas/adoption-strategy.md).
* **[`/tools/cli`](tools/cli/) — Codebase:** The official TypeScript Converter and Command Line Interface.
* **[`/data`](data/) — Machine-Readable Data:** Contains the `holidays.json` mapping cultural events to the GHS calendar.
* **[`/docs`](docs/) — Historical Context:** [Why our legacy calendar is broken](docs/historical-context.md).


---

## 🚀 Quick Start: GHS CLI

Experience the Global Horizon Standard directly in your terminal. We provide a fully functional, open-source TypeScript CLI.

**Installation:**
```bash
cd tools/cli
npm install
npm run build
npm link
```

**Usage:**
```bash
$ ghs                 # Outputs the current GHS time and context
$ ghs beats           # Outputs strictly the current @Beats
$ghs convert "2026-12-25"  # Converts a Gregorian date to GHS$ ghs cal 13 12026    # Displays a perfectly symmetrical terminal calendar
```

---

> *"The time has come to heal time itself."*
