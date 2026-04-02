# GHS Timestamp Format Specification

The Global Horizon Standard (GHS) defines three official formatting levels to balance machine precision, formal readability, and everyday brevity. Documentation, software, and human communication must adhere to these standards to ensure global consistency.

## 1. The 3-Letter Month Standard

To save space and ensure global compatibility in programming and user interfaces, GHS uses a strictly English-based 3-letter abbreviation for all months:

| #  | Name      | Abbr. | Note |
|----|-----------|-------|------|
| 01 | March     | Mar   | New Year (Equinox) |
| 02 | April     | Apr   | |
| 03 | May       | May   | |
| 04 | June      | Jun   | |
| 05 | July      | Jul   | |
| 06 | August    | Aug   | |
| 07 | September | Sep   | |
| 08 | October   | Oct   | |
| 09 | November  | Nov   | |
| 10 | December  | Dec   | |
| 11 | January   | Jan   | |
| 12 | February  | Feb   | |
| 13 | Luna      | Lun   | |
| —  | Aurora    | Aur   | Leap Week (A1 – A7) |

> [!IMPORTANT]
> **No Ordinal Suffixes**: The suffixes `-st`, `-nd`, `-rd`, and `-th` are strictly forbidden. Use plain numbers only (e.g., "15 March" instead of "15th of March").

---

## Ebene 1: Official & Machine (GHS Core)

This is the primary standard for IT, databases, logs, contracts, and historical documents. It follows a **Big-Endian** (largest to smallest) structure for perfect chronological sorting. The format is designed to be easily parsed by machines and humans. Time details are in @Beats and are optional. The space between date and time is optional.

- **Standard Year**: `YYYY.MM.DD [@Beats]`
- **Aurora Week**: `YYYY.A.DD [@Beats]`

| Component | Format | Example |
|-----------|--------|---------|
| Standard  | `12026.01.15 @685` | 15 March 12026 at @685 |
| Aurora    | `12026.A.03 @685`  | Aurora 3, 12026 at @685 |

**Rules:**
- **Dots (.)** separate date components.
- **Leading zeros** are mandatory for month and day digits (`01.09`).
- **@ symbol** marks the transition to decimal time (Beats).
- **Human Era (HE)**: The full 5-digit year must be used for long-term data integrity.

---

## Ebene 2: Formal Text (GHS Text)

Designed for documents, articles, letters, and invitations. It uses a **Little-Endian** (smallest to largest) order for natural reading flow and global understanding.

- **Standard Year**: `D Month YYYY`
- **Aurora Week**: `Aurora D, YYYY`

| Component | Format | Example |
|-----------|--------|---------|
| Standard  | `15 March 12026` | Elegant and clean data. |
| Aurora    | `Aurora 3, 12026` | Standalone phrasing for leap weeks. |

**Rules:**
- **Suffix-free**: Do not use "15th" or "of".
- **Month names**: Always capitalized and in English.
- **Spaces**: Use a single space between components.

---

## Ebene 3: Everyday Shorthand (GHS Short)

Used for UI, dashboards, message stamps, widgets, and handwritten notes. It prioritizes brevity and removes leading zeros for a more human feel.

- **Full Short**: `D Mon 'YY`
- **Contextual**: `D Mon` (if the current year is obvious)
- **Aurora**: `AD 'YY` or `AD`

| Component | Format | Example |
|-----------|--------|---------|
| Standard  | `15 Mar '26` | Ultra compact. |
| Aurora    | `A3 '26` | `A` prefix distinguishes it from months. |
| Minimal   | `15 Mar` | Year omitted in context. |

---

## Precision Extension (Centibeats)

For sub-beat precision (scientific or high-frequency applications), append centibeats after a decimal point:

```
12026.01.15 @685.50
```

## Legacy Transition

During the adoption phase, GHS timestamps should be prefixed with **GHS** to avoid confusion with the Gregorian system:

`GHS 12026.01.15 @685  (Gregorian: 15 March 2026)`
