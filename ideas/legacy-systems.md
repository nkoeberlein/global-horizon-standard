# Legacy Systems Challenge

Unix time (seconds since January 1, 1970) would continue ticking in the background. A conversion script theoretically only needs to change how those seconds are displayed. But the devil is in the infrastructure.

## 1. Hard-Coded Reality

There is no single "ISO script" that all computers use. Date values are deeply buried in billions of lines of code — often in ways that cannot simply be "recalculated."

**COBOL & Banking**: Banks and insurance companies often run on 40-year-old COBOL code. Dates are frequently stored as fixed text structures (DDMMYYYY), not flexible objects. Changing this is open-heart surgery on the global financial system.

**Embedded Systems**: Traffic lights, satellites, medical devices, elevators — many have hard-coded calendar chips. Physical hardware would need to be replaced.

## 2. Interval Logic Chaos

A conversion script can display dates differently, but it cannot heal the logic behind contracts and calculations.

**Rent**: "Payable on the 1st of each month." With 13 months, who pays the 13th monthly rent? The landlord (more income) or the tenant (lower per-month cost)?

**Interest**: Bank interest is calculated on a 360- or 365-day basis. A 13-month year with leap weeks would break every financial model until all contracts are renegotiated.

**Subscriptions**: Netflix, Spotify, gym memberships — all would need to adjust their billing cycles worldwide simultaneously.

## 3. The Y2K Parallel

The Y2K crisis cost an estimated $300 billion globally, and that was just changing a two-digit year to four digits. A 13-month calendar would require changes of similar or greater magnitude — but with the advantage that the underlying Unix timestamp remains unchanged.

## 4. Migration Strategy

The most realistic approach:

1. **Display layer first**: Operating systems and applications show GHS dates while calculating in Gregorian internally.
2. **API standards**: Define a GHS date interchange format so systems can communicate in the new standard.
3. **Contract harmonization**: Governments define legal conversion rules (e.g., "13 monthly payments at 1/13 of annual rent").
4. **Hardware lifecycle**: Embedded systems convert naturally as hardware is replaced over 10–20 years.

The Aurora Week provides a natural window for major system updates — a global maintenance period built into the calendar itself.

## 5. The "13-Period" Advantage for Business

While 13 is a prime number and cannot be divided into quarters of months, it perfectly aligns with **13-period accounting** — a system used successfully by companies like **Eastman Kodak Company** for over 60 years (1928–1989).

### The Problem with Gregorian Months

Today's accounting is plagued by "asymmetrical months":
- October has 31 days, November 30, February 28.
- Some months have 4 weekends, others 5.
- Comparing "October this year" to "October last year" is often flawed because the number of working days and weekends differs.

### The GHS Solution

In GHS, every month (period) is exactly 28 days:
- **Perfect Comparability**: Every month has exactly 4 weekends and 20 workdays.
- **Scalable Analytics**: Payroll, rent, and revenue can be compared MoM (Month-over-Month) with zero statistical noise.
- **Simplified Quarters**: A business quarter is defined as exactly **13 weeks** (91 days). While it ends mid-month (in the 4th month), it ensures every quarter has the exact same number of days and weeks.

GHS doesn't just fix the calendar; it fixes the data quality of the global economy.
