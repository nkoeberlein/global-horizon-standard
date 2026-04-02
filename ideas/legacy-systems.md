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
