/**
 * Formats a Human Era year for machine-readable output.
 *
 * spec/timestamp-format.md requires the full 5-digit year in the core format
 * ("for long-term data integrity"), so that GHS timestamps sort
 * lexicographically and round-trip through `parseGHSString`, whose grammar
 * expects exactly five digits.
 *
 * The sign is handled separately: `String(-101).padStart(5, '0')` would yield
 * "0-101".
 */
export function formatEra(yearHE: number): string {
  const sign = yearHE < 0 ? '-' : '';
  return sign + String(Math.abs(yearHE)).padStart(5, '0');
}
