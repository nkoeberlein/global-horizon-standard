<div align="center">

  <h1>🌍 Global Horizon Standard (GHS)</h1>
  <p>One World. One Pulse. One Human Era.</p>

  <img src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/nkoeberlein/ea238f96af6f644ffe06415ee941e7a6/raw/ghs-time.json&style=for-the-badge" alt="Live GHS Time" />

  <br />

  <img src="https://img.shields.io/badge/Leap-Aurora_Week-yellow?style=for-the-badge" alt="Leap Mechanism" />
  <img src="https://img.shields.io/badge/Calendar-13_×_28-orange?style=for-the-badge" alt="Calendar Structure" />
  <img src="https://img.shields.io/badge/Standard-GHS_1.0-brightgreen?style=for-the-badge" alt="GHS Version" />

</div>

<br />

> **GHS is a planetary calendar and decimal time system.** It resolves the chaos of time zones, irregular months, and archaic leap rules by introducing a perfectly symmetrical 13-month calendar and a universal decimal time protocol (@Beats).

The Global Horizon Standard is an open-source time protocol that corrects the logical errors of our current timekeeping. By combining a 13-month fixed calendar, the 12,000-year Human Era (HE), and a decimal world time (@Beats), GHS creates a universal standard for a digital and global society — providing algorithmic stability and borderless synchronization.

---

## ⚙️ Key Features

| Feature | Specification |
|---------|-------------|
| **Calendar** | 13 months × 28 days = 364 days. Every month starts on a Monday. |
| **Era** | Human Era (HE): +10,000 years to the Gregorian calendar. |
| **Time** | @Beats: 1,000 decimal beats per day. Zero time zones. |
| **Leap Mechanism** | Aurora Week: A 7-day intercalary week every 5–6 years. |
| **Year Start** | The spring equinox (21 March Gregorian). |
| **Timestamp** | `12026.01.15 @685` (GHS Core standard). |

---

## 💡 The "Why"

Our current calendar is a patchwork of Roman emperors, papal decrees, and colonial power. GHS fixes the core architectural flaws of legacy timekeeping:

* **Illogical Months:** "September" literally means "7th month", yet it is currently the 9th. GHS heals this etymology — September is month 7 again.
* **Asymmetrical Lengths:** Memorizing 28, 29, 30, and 31 days is obsolete. In GHS, every month is exactly 4 weeks (28 days).
* **Arbitrary Year Start:** 1 January has no astronomical significance. GHS starts the year when nature does — at the northern spring equinox.
* **Time Zone Chaos:** 24+ local time zones, daylight saving switches, and geopolitical borders dictate our clocks. GHS replaces it all with a single, borderless global pulse.
* **Divided History:** The BC/AD split fractures human civilization around a single religious event. The Human Era (HE) unites 12,000 years of progress into one continuous timeline.

---

## 📊 Quick Reference

### The 13-Month Architecture

| #  | Name      | Season | Gregorian (Approx.)   | Note |
|----|-----------|--------|-----------------------|------|
| 01 | March     | Spring | 21 Mar – 17 Apr       | Year begins |
| 02 | April     | Spring | 18 Apr – 15 May       | |
| 03 | May       | Spring | 16 May – 12 Jun       | |
| 04 | June      | Summer | 13 Jun – 10 Jul       | |
| 05 | July      | Summer | 11 Jul – 7 Aug        | |
| 06 | August    | Summer | 8 Aug – 4 Sep         | |
| 07 | September | Autumn | 5 Sep – 2 Oct         | *septem = 7* |
| 08 | October   | Autumn | 3 Oct – 30 Oct        | *octo = 8* |
| 09 | November  | Autumn | 31 Oct – 27 Nov       | *novem = 9* |
| 10 | December  | Winter | 28 Nov – 25 Dec       | *decem = 10* |
| 11 | January   | Winter | 26 Dec – 22 Jan       | |
| 12 | February  | Winter | 23 Jan – 19 Feb       | |
| 13 | **Luna** | Winter | 20 Feb – 19 Mar       | The 13th month |
| —  | **Aurora**| —      | *(A1–A7)* | *Leap years only* |

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
$ ghs convert "2026-12-25"  # Gregorian to GHS
$ ghs cal 13 12026    # Perfectly symmetrical calendar
```

---

> *"The time has come to heal time itself."*
