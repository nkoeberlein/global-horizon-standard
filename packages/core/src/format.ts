import type { GHSDateResult } from './types';

/** Available output formats for {@link formatGHS}. */
export const GHS_FORMATS = ['core', 'ui', 'text', 'short'] as const;

export type GHSFormat = (typeof GHS_FORMATS)[number];

/** Type guard for validating untrusted format strings (query params, CLI flags). */
export function isGHSFormat(value: string): value is GHSFormat {
  return (GHS_FORMATS as readonly string[]).indexOf(value) !== -1;
}

/**
 * Formats a GHSDateResult into an official human-readable string.
 *
 * | Format  | Example output              | Intended use       |
 * |---------|-----------------------------|--------------------|
 * | "core"  | `12026.01.15 @685`          | Logs / machines    |
 * | "ui"    | `15 Mar 12026 @685`         | Dashboards         |
 * | "text"  | `15 March 12026`            | Formal writing     |
 * | "short" | `15 Mar '26`                | Everyday shorthand |
 */
export function formatGHS(ghsObj: GHSDateResult, format: GHSFormat = 'core'): string {
  const { era, monthName, day, beats, isAuroraWeek, fullDate } = ghsObj;
  const shortYear = String(era).slice(-2);
  const shortMonth = isAuroraWeek ? 'Aur' : monthName.slice(0, 3);

  switch (format) {
    case 'core':
      return `${fullDate} ${beats}`;

    case 'ui':
      return isAuroraWeek
        ? `A${day} ${shortMonth} ${era} ${beats}`
        : `${day} ${shortMonth} ${era} ${beats}`;

    case 'text':
      return isAuroraWeek ? `Aurora ${day}, ${era}` : `${day} ${monthName} ${era}`;

    case 'short':
      return isAuroraWeek ? `A${day} '${shortYear}` : `${day} ${shortMonth} '${shortYear}`;
  }
}
