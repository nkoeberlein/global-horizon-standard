const ETYMOLOGY_MONTHS = [
  {
    name: 'September',
    latin: 'septem = 7',
    gregorianNum: '09',
    ghsNum: '07',
  },
  {
    name: 'October',
    latin: 'octo = 8',
    gregorianNum: '10',
    ghsNum: '08',
  },
  {
    name: 'November',
    latin: 'novem = 9',
    gregorianNum: '11',
    ghsNum: '09',
  },
  {
    name: 'December',
    latin: 'decem = 10',
    gregorianNum: '12',
    ghsNum: '10',
  },
];

const COMPARISON_ROWS = [
  {
    topic: 'Month lengths',
    legacy: '28, 29, 30, or 31 days — altered to flatter Roman emperors (July and August).',
    ghs: '13 months × 28 days. Every month is an identical 4-week grid.',
  },
  {
    topic: 'Weekday alignment',
    legacy: 'Dates shift by 1–2 weekdays every year. Requires a new calendar annually.',
    ghs: 'Locked forever. The 1st, 8th, 15th, and 22nd of every month are always Mondays.',
  },
  {
    topic: 'Start of the year',
    legacy: '1 January — a Roman political appointment date in the middle of winter.',
    ghs: 'Northern spring equinox (17–25 March) — aligned with Earth’s astronomical renewal.',
  },
  {
    topic: 'Leap correction',
    legacy: 'Single leap day (29 Feb) fractures quarterly math and weekday periodicity.',
    ghs: 'Aurora Week (A.1–A.7): a full 7-day intercalary week that never breaks the 7-day cycle.',
  },
  {
    topic: 'Global timekeeping',
    legacy: '24+ political time zones, Daylight Saving switches, and base-60 (24×60×60) math.',
    ghs: '@Beats decimal time: 1 day = 1,000 beats worldwide. Zero time zones, zero DST.',
  },
  {
    topic: 'Historical timeline',
    legacy: 'BC/AD split forces backward counting across the first 10,000 years of civilization.',
    ghs: 'Human Era (+10,000 years): one continuous, positive timeline from Göbekli Tepe to today.',
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
            We run 21st-century planetary infrastructure on a calendar stitched together from
            Babylonian base-60 arithmetic, Egyptian star decans, Roman political vanity, and 1884
            naval trade routes. GHS corrects these structural flaws from first principles.
          </p>
        </div>

        {/* Block 1: The Etymology Paradox */}
        <div className="surface-card p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[#7b7266] mb-2">Restored Latin etymology</p>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] font-normal mb-2">
                Why is September the 9th month when septem means seven?
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                The original Roman year began in March. When January and February were moved to the
                front of the calendar, every numbered month shifted two places out of alignment. By
                anchoring New Year to the March equinox and placing{' '}
                <span className="text-[#1f1b16] font-medium">Luna</span> as Month 13 at year’s end,
                GHS restores the numbered months to their true positions.
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
                  <span className="ghs-token">{m.latin}</span>
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
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 px-6 py-4 items-baseline font-sans text-[14px] leading-[20px]"
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
          <div className="md:col-span-5 surface-card p-6">
            <p className="font-mono text-xs text-[#7b7266] mb-2">League of Nations, 1931</p>
            <h3 className="font-serif text-[20px] leading-[1.25] text-[#1f1b16] mb-3">
              Why 20th-century calendar reform failed
            </h3>
            <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
              The International Fixed Calendar (IFC) was used internally by Eastman Kodak for 60
              years, yet failed at the League of Nations because it inserted standalone “World Days”
              outside the week. Breaking the 7-day cycle disrupted Sabbath, Sunday, and Friday
              observance and broke modulo-7 scheduling.
            </p>
          </div>

          <div className="md:col-span-7 surface-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="font-mono text-xs text-[#b57924]">Continuity invariant</p>
                <span className="ghs-token">364d / 371d = 0 (mod 7)</span>
              </div>
              <h3 className="font-serif text-[20px] leading-[1.25] text-[#1f1b16] mb-3">
                How the Aurora Week preserves the 7-day week forever
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Instead of dateless leap days, GHS accumulates the annual solar remainder and
                inserts a complete 7-day <span className="ghs-token">Aurora Week (A.1–A.7)</span> 71
                times every 400 years. Every GHS year contains an exact integer number of weeks (52
                or 53). Monday follows Sunday without a single interruption across millennia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
