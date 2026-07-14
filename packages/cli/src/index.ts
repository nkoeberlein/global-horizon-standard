#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Command } from 'commander';
import {
  formatGHS,
  GHS_FORMATS,
  getGHSDate,
  getHolidaysForYear,
  isAuroraYear,
  isGHSFormat,
  MONTH_NAMES_GHS,
  parseGHSString,
} from 'ghs-time';

const { version } = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as {
  version: string;
};

const program = new Command();

function fail(message: string): never {
  console.error(`❌ Error: ${message}`);
  process.exit(1);
}

// --- CLI CONFIGURATION ---
program
  .name('ghs')
  .description('🌍 Global Horizon Standard (GHS) - The Time Protocol for a Synchronized World')
  .version(version, '-v, --version', 'Outputs the current version')
  .helpOption('-h, --help', 'Displays help and the manual')
  .showHelpAfterError('(Type "ghs --help" for a list of all commands)')
  .showSuggestionAfterError();

program.addHelpText(
  'after',
  `
---------------------------------------------------
📖 GHS MANUAL & QUICK START:
  GHS is based on 13 months of 28 days each (364 days).
  Every month starts on a Monday.
  Leap years (Aurora Years) append the "Aurora Week" (A1-A7).
  Time is measured in @Beats (1000 Beats = 1 day).

Examples:
  $ ghs                 # Shows the current GHS time (Default)
  $ ghs --json          # Outputs the current time as pure JSON
  $ ghs clock           # Starts a live terminal clock
  $ ghs convert "2026-12-24"     # Gregorian -> GHS
  $ ghs convert "12026.10.04"    # GHS -> Gregorian
  $ ghs cal 13 12026    # Shows the 13th month of 12026
  $ ghs holidays 12026  # Lists the fixed holidays of a year
---------------------------------------------------
`,
);

// --- COMMANDS ---

/**
 * Command: default (now)
 * Wenn der User nur "ghs" eintippt.
 */
program
  .option('-f, --format <type>', `Format output: ${GHS_FORMATS.join(', ')}`, 'core')
  .option('-j, --json', 'Output strictly as JSON')
  .option('-c, --compare', 'Compare with Gregorian ISO time')
  .action((options: { format: string; json?: boolean; compare?: boolean }) => {
    const now = new Date();
    const ghs = getGHSDate(now);

    if (options.json) {
      console.log(JSON.stringify(ghs, null, 2));
      return;
    }

    if (options.compare) {
      console.log(`GHS: ${formatGHS(ghs, 'core')}  |  ISO: ${now.toISOString()}`);
      return;
    }

    if (!isGHSFormat(options.format)) {
      fail(`Unknown format '${options.format}'. Allowed: ${GHS_FORMATS.join(', ')}`);
    }

    console.log(`\n  🌍 GHS: ${formatGHS(ghs, options.format)}`);
    console.log(`  📅 ${ghs.weekday}, ${formatGHS(ghs, 'text')}\n`);
  });

/**
 * Command: convert
 * Bidirektional: Erkennt GHS (YYYYY.MM.DD) oder Gregorianisch
 */
program
  .command('convert <dateString>')
  .description('Bidirectional converter (Gregorian <-> GHS)')
  .action((dateString: string) => {
    // GHS Date -> Gregorian (parseGHSString validates ranges)
    let ghsInput: ReturnType<typeof parseGHSString>;
    try {
      ghsInput = parseGHSString(dateString);
    } catch (err) {
      fail(err instanceof Error ? err.message : String(err));
    }

    if (ghsInput) {
      console.log(`\n  🗓️  GHS Input:  ${dateString}`);
      console.log(`  🌍 Gregorian:  ${ghsInput.date.toISOString()}\n`);
      return;
    }

    // Gregorian Date -> GHS
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      fail('Invalid date format. Use ISO (YYYY-MM-DD) or GHS (YYYYY.MM.DD).');
    }
    const ghs = getGHSDate(date);
    console.log(`\n  🌍 Gregorian:  ${date.toISOString()}`);
    console.log(`  🗓️  GHS Output: ${formatGHS(ghs, 'core')} (${formatGHS(ghs, 'ui')})\n`);
  });

/**
 * Command: clock
 * A live updating digital clock in the terminal
 */
program
  .command('clock')
  .description('Displays a live-updating GHS clock')
  .action(() => {
    console.log('\n🌍 GLOBAL HORIZON STANDARD');
    console.log('(Press Ctrl+C to exit)\n');

    // Update every 86ms (approx. 1 Millibeat) for a smooth UI
    setInterval(() => {
      const now = getGHSDate();
      // \r clears the current line and writes over it
      process.stdout.write(`\r  ⏱️  ${formatGHS(now, 'ui')}`);
    }, 86);
  });

/**
 * Command: cal
 */
program
  .command('cal [month] [year]')
  .description('Displays a symmetrical GHS calendar (Use "A" for the Aurora Week)')
  .action((monthArg?: string, yearArg?: string) => {
    const nowGHS = getGHSDate();

    const targetYear = yearArg ? Number.parseInt(yearArg, 10) : nowGHS.era;
    let targetMonth: number | 'A' = nowGHS.month === null ? 'A' : nowGHS.month;

    if (monthArg) {
      if (monthArg.toUpperCase() === 'A' || monthArg.toUpperCase() === 'AURORA') {
        targetMonth = 'A';
      } else {
        targetMonth = Number.parseInt(monthArg, 10);
      }
    }

    if (
      !Number.isInteger(targetYear) ||
      targetYear < 10000 ||
      targetYear > 99999 ||
      (typeof targetMonth === 'number' && (targetMonth < 1 || targetMonth > 13))
    ) {
      fail("Month must be between 1-13 (or 'A'), year must be a 5-digit HE number.");
    }

    const isAurora = isAuroraYear(targetYear);

    if (targetMonth === 'A' && !isAurora) {
      console.log(
        `\n⚠️  Note: ${targetYear} HE is NOT an Aurora Year (no leap week). Displaying Luna (Month 13)...\n`,
      );
      targetMonth = 13;
    }

    // Calendar Output
    const monthName =
      targetMonth === 'A' ? '~ Aurora Week ~' : MONTH_NAMES_GHS[(targetMonth as number) - 1];
    console.log(`\n   ${monthName} ${targetYear} HE`);
    console.log(' Mo Tu We Th Fr Sa Su');

    if (targetMonth === 'A') {
      console.log(' A1 A2 A3 A4 A5 A6 A7');
    } else {
      console.log(' 01 02 03 04 05 06 07');
      console.log(' 08 09 10 11 12 13 14');
      console.log(' 15 16 17 18 19 20 21');
      console.log(' 22 23 24 25 26 27 28');
    }
    console.log('');
  });

/**
 * Command: holidays
 * Fixed GHS holidays of a year, with computed Gregorian dates.
 */
program
  .command('holidays [year]')
  .description('Lists the fixed GHS holidays of a year (default: current year)')
  .action((yearArg?: string) => {
    const era = yearArg ? Number.parseInt(yearArg, 10) : getGHSDate().era;
    if (!Number.isInteger(era) || era < 10000 || era > 99999) {
      fail('Year must be a 5-digit HE number, e.g. 12026.');
    }

    const occurrences = getHolidaysForYear(era);
    const auroraNote = isAuroraYear(era) ? ' (Aurora Year ✨)' : '';
    console.log(`\n  🎉 Fixed GHS holidays in ${era} HE${auroraNote}\n`);

    for (const occ of occurrences) {
      const gregorian = occ.gregorian.toISOString().slice(0, 10);
      const end = occ.gregorianEnd ? `–${occ.gregorianEnd.toISOString().slice(0, 10)}` : '';
      console.log(
        `  ${occ.ghsDate}  ${gregorian}${end}  ${occ.holiday.name} [${occ.holiday.category}]`,
      );
    }
    console.log(
      '\n  ℹ️  Dynamic holidays (Easter, Ramadan, Diwali, …) follow lunar calendars\n     and cannot be fixed to a GHS date. See `ghs --help`.\n',
    );
  });

// Catch all
program.on('command:*', (operands: string[]) => {
  console.error(`❌ Error: Unknown command '${operands[0]}'`);
  console.error(`Available commands: ${program.commands.map((cmd) => cmd.name()).join(', ')}\n`);
  process.exit(1);
});

program.parse(process.argv);
