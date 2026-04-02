#!/usr/bin/env node

import { Command } from 'commander';
import { getGHSDate, MONTH_NAMES_GHS, isAuroraYear } from './ghs-converter';

const program = new Command();

// --- CLI CONFIGURATION ---
program
    .name('ghs')
    .description('Global Horizon Standard (GHS) - The Time Protocol for a Synchronized World')
    .version('1.0.0', '-v, --version', 'Outputs the current version')
    .helpOption('-h, --help', 'Displays help and the manual')
    .showHelpAfterError('(Type "ghs --help" for a list of all commands)')
    .showSuggestionAfterError(); // Shows suggestions for typos (e.g., "ghs cl" -> "Did you mean cal?")

// Extended manual for the help page
program.addHelpText('after', `
---------------------------------------------------
📖 GHS MANUAL & QUICK START:
  GHS is based on 13 months of 28 days each (364 days).
  Every month starts on a Monday.
  Leap years (Aurora Years) append the "Aurora Week"
  (A1-A7) to the end of the year.
  Time is measured in @Beats (1000 Beats = 1 day).

Examples:
  $ ghs                 # Shows the current GHS time
  $ ghs -u              # Outputs only the current @Beats
  $ ghs convert "2026-12-24"  # Converts a specific date
  $ ghs cal 13 12026    # Shows the 13th month of 12026
  $ ghs cal A 12026     # Shows the Aurora Week directly
---------------------------------------------------
`);

// --- COMMANDS ---

/**
 * Command: ghs (Default)
 */
program
    .option('-u, --unix', 'Output strictly in @Beats')
    .option('-c, --compare', 'Compare with Gregorian ISO time')
    .action((options: { unix?: boolean; compare?: boolean }) => {
        const now = new Date();
        const ghs = getGHSDate(now);

        // Extreme minimization for scripts
        if (options.unix) {
            console.log(ghs.beats);
            return;
        }

        if (options.compare) {
            console.log(`GHS: ${ghs.fullDate} ${ghs.beats}  |  ISO: ${now.toISOString()}`);
            return;
        }

        // Standard output (Clean and elegant)
        const dayPrefix = ghs.isAuroraWeek ? 'A.' : '';
        const monthDisplay = ghs.isAuroraWeek ? '(Aurora Week)' : ghs.monthName;
        const yearType = ghs.isAuroraYear ? '[Aurora Year]' : '';

        console.log(`\n  GHS: ${ghs.fullDate} ${ghs.beats}`);
        console.log(`  ${ghs.weekday}, ${dayPrefix}${String(ghs.day).padStart(2, '0')} ${monthDisplay} ${ghs.era} HE ${yearType}\n`);
    });

/**
 * Command: convert
 */
program
    .command('convert <dateString>')
    .description('Converts a Gregorian date into GHS')
    .action((dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("❌ Error: Invalid date format. Please use ISO format (e.g., YYYY-MM-DD).");
            process.exit(1);
        }
        const ghs = getGHSDate(date);
        const dayStr = ghs.isAuroraWeek ? `A.${String(ghs.day).padStart(2, '0')}` : `${String(ghs.day).padStart(2, '0')}. ${ghs.monthName}`;
        console.log(`GHS: ${ghs.fullDate} ${ghs.beats} (${ghs.weekday}, ${dayStr})`);
    });

/**
 * Command: beats
 */
program
    .command('beats')
    .description('Outputs strictly the current global time in @Beats')
    .action(() => {
        console.log(getGHSDate(new Date()).beats);
    });

/**
 * Command: cal
 */
program
    .command('cal [month] [year]')
    .description('Displays a symmetrical GHS calendar (Use "A" for the Aurora Week)')
    .action((monthArg?: string, yearArg?: string) => {
        const nowGHS = getGHSDate(new Date());

        let targetYear = yearArg ? parseInt(yearArg, 10) : nowGHS.era;
        let targetMonth = nowGHS.month === null ? 13 : nowGHS.month;
        let isExplicitAurora = false;

        if (monthArg) {
            if (monthArg.toUpperCase() === 'A' || monthArg.toUpperCase() === 'AURORA') {
                targetMonth = 13;
                isExplicitAurora = true;
            } else {
                targetMonth = parseInt(monthArg, 10);
            }
        }

        if (isNaN(targetYear) || isNaN(targetMonth) || targetMonth < 1 || targetMonth > 13) {
            console.error("❌ Error: Month must be between 1-13 (or 'A'), year must be a number.");
            process.exit(1);
        }

        const isAurora = isAuroraYear(targetYear);

        if (isExplicitAurora && !isAurora) {
            console.log(`\n⚠️  Note: The year ${targetYear} HE is NOT an Aurora Year (no leap week). Displaying regular month Luna...\n`);
        }

        // Calendar Output
        console.log(`\n   ${MONTH_NAMES_GHS[targetMonth - 1]} ${targetYear} HE`);
        console.log(`Mo Tu We Th Fr Sa Su`);
        console.log(`01 02 03 04 05 06 07`);
        console.log(`08 09 10 11 12 13 14`);
        console.log(`15 16 17 18 19 20 21`);
        console.log(`22 23 24 25 26 27 28`);

        if (targetMonth === 13 && isAurora) {
            console.log(`\n  ~ Aurora Week ~ `);
            console.log(`A1 A2 A3 A4 A5 A6 A7`);
        }
        console.log('');
    });

// Catch all for unknown commands
program.on('command:*', function (operands) {
    console.error(`❌ Error: Unknown command '${operands[0]}'`);
    const availableCommands = program.commands.map(cmd => cmd.name()).join(', ');
    console.error(`Available commands: ${availableCommands}\n`);
    process.exit(1);
});

program.parse();