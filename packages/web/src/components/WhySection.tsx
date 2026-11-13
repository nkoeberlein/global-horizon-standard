import type { ReactNode } from 'react';
import { MathFormula } from './MathFormula';

const ETYMOLOGY_MONTHS = [
  {
    name: 'September',
    latinTex: '\\text{septem} = 7',
    gregorianNum: '09',
    ghsNum: '07',
  },
  {
    name: 'October',
    latinTex: '\\text{octo} = 8',
    gregorianNum: '10',
    ghsNum: '08',
  },
  {
    name: 'November',
    latinTex: '\\text{novem} = 9',
    gregorianNum: '11',
    ghsNum: '09',
  },
  {
    name: 'December',
    latinTex: '\\text{decem} = 10',
    gregorianNum: '12',
    ghsNum: '10',
  },
];

interface ComparisonRow {
  topic: string;
  legacy: ReactNode;
  ghs: ReactNode;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    topic: 'Month lengths',
    legacy: '28, 29, 30, or 31 days (irregular Roman lengths)',
    ghs: (
      <>
        <MathFormula variant="plain" tex="13 \times 28\text{ d}" /> — identical 4-week grids
      </>
    ),
  },
  {
    topic: 'Weekday alignment',
    legacy: 'Shifts by 1–2 weekdays every year',
    ghs: 'Locked forever — the 1st is always Monday',
  },
  {
    topic: 'Start of the year',
    legacy: '1 January (mid-winter political date)',
    ghs: 'Northern spring equinox (17–25 March)',
  },
  {
    topic: 'Leap correction',
    legacy: 'Single leap day (29 Feb) fractures the week',
    ghs: 'Aurora Week (A.1–A.7) keeps 7-day continuity',
  },
  {
    topic: 'Global timekeeping',
    legacy: (
      <>
        24+ time zones, DST &amp; <MathFormula variant="plain" tex="24 \times 60 \times 60" />{' '}
        base-60
      </>
    ),
    ghs: (
      <>
        @Beats decimal time (<MathFormula variant="plain" tex="1\text{ d} = 1{,}000\text{ beats}" />
        , UTC)
      </>
    ),
  },
  {
    topic: 'Historical timeline',
    legacy: 'BC / AD split with backward counting',
    ghs: (
      <>
        <MathFormula variant="plain" tex="Y_{\text{HE}} = Y_{\text{Greg}} + 10{,}000" /> — one
        positive scale
      </>
    ),
  },
];

export function WhySection() {
  return (
    <section id="why" className="px-6 md:px-8 py-24 border-t border-[#1f1b16]/8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mb-12">
          <p className="font-mono text-xs text-[#7b7266] mb-2">01 · Legacy timekeeping</p>
          <h2 className="section-heading mb-4">
            A 2,000-year-old patchwork of imperial decrees and colonial meridians
          </h2>
          <p className="section-sub">
            Planetary infrastructure still runs on Roman month lengths, Babylonian base-60 time, and
            19th-century meridians. GHS replaces them from first principles.
          </p>
        </div>

        {/* Block 1: The Etymology Paradox */}
        <div className="surface-card p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div className="max-w-xl">
              <p className="font-mono text-xs text-[#7b7266] mb-2">Restored Latin etymology</p>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] font-normal mb-2">
                Why is September the 9th month when septem means seven?
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Starting the year at the March equinox and adding{' '}
                <span className="text-[#1f1b16] font-medium">Luna</span> as Month 13 restores every
                Latin-numbered month to its true position.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono shrink-0">
              <span className="ghs-token">01 March</span>
              <span className="text-[#7b7266]">→</span>
              <span className="ghs-token">07 Sept … 10 Dec</span>
              <span className="text-[#7b7266]">→</span>
              <span className="ghs-token">13 Luna</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ETYMOLOGY_MONTHS.map((m) => (
              <div
                key={m.name}
                className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-[18px] text-[#1f1b16]">{m.name}</span>
                  <MathFormula tex={m.latinTex} />
                </div>
                <div className="pt-3 border-t border-[#1f1b16]/8 flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-[#7b7266] line-through">Gregorian #{m.gregorianNum}</span>
                  <span className="text-[#1f1b16] font-medium">GHS Month {m.ghsNum}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 2: Specification Comparison Table */}
        <div className="surface-card overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-3 text-xs font-mono text-[#7b7266] bg-[#efe9df] border-b border-[#1f1b16]/8">
            <div className="md:col-span-3">Dimension</div>
            <div className="md:col-span-4 hidden md:block">Gregorian legacy</div>
            <div className="md:col-span-5 text-[#1f1b16] font-medium hidden md:block">
              Global Horizon Standard
            </div>
          </div>

          <div className="divide-y divide-[#1f1b16]/8">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.topic}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 px-6 py-3.5 items-baseline font-sans text-[14px] leading-[20px]"
              >
                <div className="md:col-span-3 font-medium text-[#1f1b16]">{row.topic}</div>
                <div className="md:col-span-4 text-[#7b7266]">{row.legacy}</div>
                <div className="md:col-span-5 text-[#1f1b16]">{row.ghs}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Block 3: Historical precedent vs GHS solution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 surface-card p-6 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs text-[#7b7266] mb-2">League of Nations, 1931</p>
              <h3 className="font-serif text-[20px] leading-[1.25] text-[#1f1b16] mb-2">
                Why 1930s calendar reform failed
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a] mb-4">
                The International Fixed Calendar inserted dateless “World Days” outside the week —
                breaking the 7-day cycle and modulo-7 scheduling.
              </p>
            </div>
            <MathFormula variant="box" tex="365 \bmod 7 = 1 \neq 0 \quad (\text{week drifts})" />
          </div>

          <div className="md:col-span-7 surface-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="font-mono text-xs text-[#b57924]">Continuity invariant</p>
                <MathFormula tex="364 \equiv 371 \equiv 0 \pmod{7}" />
              </div>
              <h3 className="font-serif text-[20px] leading-[1.25] text-[#1f1b16] mb-2">
                How the Aurora Week preserves the 7-day week forever
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a] mb-4">
                GHS accumulates the annual solar remainder into a full 7-day{' '}
                <span className="ghs-token">Aurora Week (A.1–A.7)</span> 71 times every 400 years.
                Monday follows Sunday without a single interruption across millennia.
              </p>
            </div>
            <MathFormula
              variant="box"
              tex="52 \times 7 = 364\text{ d} \qquad \text{and} \qquad 53 \times 7 = 371\text{ d}"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
