# GHS Timestamp Format Specification

## 1. Standard Format (Data & Logistics)

The official GHS timestamp follows **Big-Endian** ordering (largest unit first), consistent with ISO 8601:

```
YYYY.MM.DD @beats
```

**Example:**

```
12026.01.09 @875
```

This reads: Year 12,026 HE, 1st month (March), 9th day (a Tuesday), at @875 (late afternoon/evening UTC).

### Design Rationale

| Criterion      | YYYY.MM.DD (Big-Endian) | DD.MM.YYYY (Little-Endian) |
|----------------|-------------------------|----------------------------|
| Sorting        | Chronological by default | Chaos (all 9th days cluster)|
| Logic          | Largest to smallest      | Mixed                      |
| Globality      | International standard   | Regional (EU vs. US clash) |

### Formatting Rules

- **Dots (.)** separate date components — modern and clean, avoiding slash/dash ambiguity.
- **Leading zeros** are mandatory: month and day are always two digits (`01`, not `1`), ensuring fixed-width timestamps.
- **The @ symbol** marks the transition from date to time. It is the established glyph for decimal time (from Swatch Internet Time) and instantly signals: "this is a global time value."

## 2. Short Format (Chat & Everyday Use)

When the year is obvious from context:

```
MM.DD @beats
```

**Example:**

```
01.09 @875
```

Since every month has exactly 28 days, the reader immediately knows: 01.09 = the second Tuesday of the first month.

## 3. Human-Readable Format (Cultural & Editorial)

For invitations, publications, and formal communication:

```
Weekday, DD. MonthName YYYY @beats
```

**Example:**

```
Tue, 09. March 12026 @875
```

The weekday is technically redundant (the 9th is always a Tuesday in GHS), but its inclusion reinforces the system's signature predictability.

## 4. Machine Formats (Programming & URLs)

For code, databases, and URL-safe contexts:

| Format   | Example              | Use Case          |
|----------|----------------------|-------------------|
| URL-safe | `12026-01-09_875`    | File names, URLs  |
| Compact  | `120260109@875`      | Log entries, IDs  |

## 5. Precision Extension

For sub-beat precision, append **centibeats** after a decimal point:

```
12026.01.09 @875.50
```

This indicates @875 and 50 centibeats — a precision of ~0.43 seconds.

For scientific or computing applications, **millibeats** can be used:

```
12026.01.09 @875.503
```

## 6. Dual-Date Transition Format

During the adoption period, GHS timestamps can be shown alongside Gregorian dates (similar to price tags during the Euro introduction):

```
GHS 12026.01.09 @875  (29 Mar 2026, 21:00 UTC)
```

The **GHS prefix** prevents confusion between the two systems.
