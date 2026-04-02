# Beat Definition: Atomic vs. Solar

How should a @Beat be physically defined? This is the deepest technical question in the GHS system.

## The Core Tension

- **The SI second** is rigid: defined by 9,192,631,770 oscillations of caesium-133 atoms. It never changes, regardless of what Earth does.
- **The solar day** is flexible: Earth's rotation speed varies slightly. A day is sometimes a fraction longer or shorter.

Since @Beats divide the *day* into 1,000 parts, we must choose: does a beat follow the atom or the sun?

## Option A: The "Rubber-Band" Beat

1 @Beat = exactly 1/1,000 of the time between two solar noons at the reference meridian.

**Advantage**: @500 always means the sun is at its highest point at Greenwich. The beat is perfectly synchronized to human experience of daylight.

**Disadvantage**: "1 beat" has no fixed duration. It breathes with Earth's rotation. Physicists and engineers would lose their minds — you can't build GPS satellites or particle accelerators on a unit that wobbles.

## Option B: The "Atom-Beat" (Chosen)

1 @Beat = 86.4 SI seconds = 86.4 × 9,192,631,770 caesium-133 oscillations.

**Advantage**: Absolute precision. The beat is a fixed, invariant unit. All science and technology works seamlessly.

**Disadvantage**: Like the current UTC system, we occasionally need **leap adjustments** when atomic time and solar time drift apart. In GHS, this would be a "leap-beat" rather than a "leap-second."

## Time Inflation

Earth is slowing down due to tidal friction from the Moon, losing approximately 2 milliseconds per century.

In the year 22,026 HE (10,000 years from now), a solar day will be measurably longer. A @Beat defined in SI seconds would no longer divide the day into exactly 1,000 parts. Either:
- The beat gets periodically redefined (unlikely — we don't redefine the meter either)
- Leap-beats accumulate more frequently over millennia

This is the same challenge the SI second already faces. GHS inherits it, not creates it.

## The "Milliday" Naming Idea

Since 1 @Beat = 1/1,000 of a day, it could also be called a **milliday (mDay)**. This makes the unit self-explanatory: "milli" = 1/1,000, "day" = a day.

However, "@Beat" was chosen for its existing cultural recognition (Swatch Internet Time) and its more human, rhythmic connotation. A "beat" is a pulse — the heartbeat of the planet.

## The 1,000 Question

Why 1,000 beats and not some other number?

**Historical context**: The Egyptians used base-12 (finger joints), the Babylonians used base-60 (highly divisible). Our 24×60×60 system is their legacy.

**GHS rationale**: 1,000 is decimal — the language of the modern metric world. @500 = 50% of the day. @250 = 25%. Time becomes a percentage, instantly intuitive.

**Trade-off**: 1,000 is not divisible by 3 (333.33...). The "magic divisibility" of 60 is lost. But the ease of decimal arithmetic — @450 + @150 = @600 — outweighs this for a digital civilization.
