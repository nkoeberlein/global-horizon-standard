#!/usr/bin/env node

import { Command } from 'commander';
import { getGHSDate, parseGHSDate, formatGHS, MONTH_NAMES_GHS, isAuroraYear } from 'ghs-time';
import type { GHSFormat } from 'ghs-time';

const program = new Command();

// --- CLI CONFIGURATION ---
program
    .name('ghs')
    .description('🌍 Global Horizon Standard (GHS) - The Time Protocol for a Synchronized World')
    .version('1.0.0', '-v, --version', 'Outputs the current version')
    .helpOption('-h, --help', 'Displays help and the manual')
    .showHelpAfterError('(Type "ghs --help" for a list of all commands)')
    .showSuggestionAfterError();

program.addHelpText('after', `
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
---------------------------------------------------
`);

// --- COMMANDS ---

/**
 * Command: default (now)
 * Wenn der User nur "ghs" eintippt.
 */
program
    .option('-f, --format <type>', 'Format output: core, ui, text, short', 'core')
    .option('-j, --json', 'Output strictly as JSON')
    .option('-c, --compare', 'Compare with Gregorian ISO time')
    .action((options) => {
        const now = new Date();
        const ghs = getGHSDate(now);

        if (options.json) {
            console.log(JSON.stringify(ghs, null, 2));
            return;
        }

        if (options.compare) {
            console.log(`GHS: ${formatGHS(ghs, "core")}  |  ISO: ${now.toISOString()}`);
            return;
        }

        // Standard Output using the core formatter
        const formatted = formatGHS(ghs, options.format as GHSFormat);
        console.log(`\n  🌍 GHS: ${formatted}`);
        console.log(`  📅 ${ghs.weekday}, ${formatGHS(ghs, "text")}\n`);
    });

/**
 * Command: convert
 * Bidirektional: Erkennt GHS (YYYYY.MM.DD) oder Gregorianisch
 */
program
    .command('convert <dateString>')
    .description('Bidirectional converter (Gregorian <-> GHS)')
    .action((dateString: string) => {
        // Regex check for GHS format (e.g., 12026.01.15 @685 or 12026.A.03)
        const ghsRegex = /^(\d{5})\.(A|\d{2})\.(\d{2})(?:\s+@([\d.]+))?$/i;
        const match = dateString.match(ghsRegex);

        if (match) {
            // It's a GHS Date -> Convert to Gregorian
            const era = parseInt(match[1], 10);
            const month = match[2].toUpperCase() === 'A' ? 'A' : parseInt(match[2], 10);
            const day = parseInt(match[3], 10);
            const beats = match[4] ? parseFloat(match[4]) : 0;

            const gregorian = parseGHSDate(era, month, day, beats);
            console.log(`\n  🗓️  GHS Input:  ${dateString}`);
            console.log(`  🌍 Gregorian:  ${gregorian.toISOString()}\n`);
            return;
        }

        // It's a Gregorian Date -> Convert to GHS
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("❌ Error: Invalid date format. Use ISO (YYYY-MM-DD) or GHS (YYYYY.MM.DD).");
            process.exit(1);
        }
        const ghs = getGHSDate(date);
        console.log(`\n  🌍 Gregorian:  ${date.toISOString()}`);
        console.log(`  🗓️  GHS Output: ${formatGHS(ghs, "core")} (${formatGHS(ghs, "ui")})\n`);
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
            process.stdout.write(`\r  ⏱️  ${formatGHS(now, "ui")}`);
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

        let targetYear = yearArg ? parseInt(yearArg, 10) : nowGHS.era;
        let targetMonth: number | 'A' = nowGHS.month === null ? 'A' : nowGHS.month;

        if (monthArg) {
            if (monthArg.toUpperCase() === 'A' || monthArg.toUpperCase() === 'AURORA') {
                targetMonth = 'A';
            } else {
                targetMonth = parseInt(monthArg, 10);
            }
        }

        if (isNaN(targetYear) || (typeof targetMonth === 'number' && (targetMonth < 1 || targetMonth > 13))) {
            console.error("❌ Error: Month must be between 1-13 (or 'A'), year must be a 5-digit HE number.");
            process.exit(1);
        }

        const isAurora = isAuroraYear(targetYear);

        if (targetMonth === 'A' && !isAurora) {
            console.log(`\n⚠️  Note: ${targetYear} HE is NOT an Aurora Year (no leap week). Displaying Luna (Month 13)...\n`);
            targetMonth = 13;
        }

        // Calendar Output
        const monthName = targetMonth === 'A' ? '~ Aurora Week ~' : MONTH_NAMES_GHS[(targetMonth as number) - 1];
        console.log(`\n   ${monthName} ${targetYear} HE`);
        console.log(` Mo Tu We Th Fr Sa Su`);

        if (targetMonth === 'A') {
            console.log(` A1 A2 A3 A4 A5 A6 A7`);
        } else {
            console.log(` 01 02 03 04 05 06 07`);
            console.log(` 08 09 10 11 12 13 14`);
            console.log(` 15 16 17 18 19 20 21`);
            console.log(` 22 23 24 25 26 27 28`);
        }
        console.log('');
    });

// Catch all
program.on('command:*', function (operands) {
    console.error(`❌ Error: Unknown command '${operands[0]}'`);
    console.error(`Available commands: ${program.commands.map(cmd => cmd.name()).join(', ')}\n`);
    process.exit(1);
});

program.parse(process.argv);