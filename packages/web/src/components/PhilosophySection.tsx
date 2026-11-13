const PERPETUAL_WEEKDAYS = [
  { day: 'Mon', dates: ['01', '08', '15', '22'], isWeekend: false },
  { day: 'Tue', dates: ['02', '09', '16', '23'], isWeekend: false },
  { day: 'Wed', dates: ['03', '10', '17', '24'], isWeekend: false },
  { day: 'Thu', dates: ['04', '11', '18', '25'], isWeekend: false },
  { day: 'Fri', dates: ['05', '12', '19', '26'], isWeekend: false },
  { day: 'Sat', dates: ['06', '13', '20', '27'], isWeekend: true },
  { day: 'Sun', dates: ['07', '14', '21', '28'], isWeekend: true },
];

const HUMAN_ERA_TIMELINE = [
  {
    he: '00500 HE',
    gregorian: '9500 BCE',
    title: 'Göbekli Tepe',
    desc: 'Oldest known monumental sanctuary and dawn of settled agriculture.',
    highlight: false,
  },
  {
    he: '07500 HE',
    gregorian: '2500 BCE',
    title: 'Great Pyramid',
    desc: 'Early urban civilizations across Egypt, Mesopotamia, and the Indus.',
    highlight: false,
  },
  {
    he: '09247 HE',
    gregorian: '0753 BCE',
    title: 'Founding of Rome',
    desc: 'Classical antiquity placed on a forward-moving timeline.',
    highlight: false,
  },
  {
    he: '11760 HE',
    gregorian: '1760 CE',
    title: 'Industrial Age',
    desc: 'Steam power, railways, and global telegraph synchronization.',
    highlight: false,
  },
  {
    he: '11969 HE',
    gregorian: '1969 CE',
    title: 'Apollo 11',
    desc: 'Humanity steps onto another world in the late 12th millennium HE.',
    highlight: false,
  },
  {
    he: '12026 HE',
    gregorian: '2026 CE',
    title: 'Planetary era',
    desc: 'Twelve millennia of shared human history in one positive count.',
    highlight: true,
  },
];

export function PhilosophySection() {
  return (
    <section id="advantages" className="px-6 md:px-8 py-24 border-t border-[#1f1b16]/8">
      <div className="max-w-6xl mx-auto">
        {/* Heading & mark */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-[#7b7266] mb-2">02 · Structural advantages</p>
            <h2 className="section-heading mb-4">
              Built for human memory, economic comparability, and clean software
            </h2>
            <p className="section-sub">
              Every structural rule in GHS removes a recurring source of cognitive friction,
              statistical distortion, or timezone edge cases.
            </p>
          </div>
          <div className="shrink-0 hidden md:block">
            <img
              src="/logo-rectangular.png"
              alt="Global Horizon Standard"
              className="w-48 opacity-85 object-contain"
            />
          </div>
        </div>

        {/* Row 1: Asymmetric 7 / 5 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* 7 cols: Perpetual Calendar Matrix */}
          <div className="lg:col-span-7 surface-card p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-mono text-xs text-[#7b7266]">13-month symmetry</span>
                <span className="ghs-token">(day − 1) mod 7 = weekday</span>
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                Know the date, know the weekday forever
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Every month has 28 days (4 complete weeks). The 1st of every month is a Monday; the
                28th is a Sunday. Birthdays, public holidays, and billing dates fall on the exact
                same weekday every year.
              </p>
            </div>

            <div className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8">
              <div className="flex items-center justify-between text-xs font-mono text-[#7b7266] mb-3">
                <span>Perpetual month layout (Months 01–13)</span>
                <span>20 workdays · 8 weekend days</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center font-mono tabular-nums">
                {PERPETUAL_WEEKDAYS.map((col) => (
                  <div
                    key={col.day}
                    className="rounded-[6px] p-2 border border-[#1f1b16]/6"
                    style={{
                      background: col.isWeekend ? '#efe9df' : '#fdfbf7',
                    }}
                  >
                    <div className="text-xs font-sans font-medium text-[#1f1b16] mb-2">
                      {col.day}
                    </div>
                    <div className="space-y-1 text-xs text-[#5e554a]">
                      {col.dates.map((d) => (
                        <div key={d}>{d}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 cols: Economic & Quarterly Precision */}
          <div className="lg:col-span-5 surface-card p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-mono text-xs text-[#7b7266]">13-period accounting</span>
                <span className="ghs-token">4 × 91d quarters</span>
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                Zero statistical noise in analytics
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Comparing Gregorian February (28 days, 4 weekends) to October (31 days, 5 weekends)
                distorts Month-over-Month revenue and payroll by up to 10.7%. In GHS, every month
                and every 13-week quarter (91 days) is identical in length.
              </p>
            </div>

            <div className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 space-y-4 font-sans text-xs">
              <div>
                <div className="flex justify-between text-[#7b7266] mb-2">
                  <span>Gregorian months (28–31d)</span>
                  <span className="font-mono tabular-nums">±10.7% length vs Feb</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-2 rounded-[4px] bg-[#c8c0b4] w-full" />
                  <div className="h-2 rounded-[4px] bg-[#c8c0b4] w-[90%]" />
                  <div className="h-2 rounded-[4px] bg-[#c8c0b4] w-[96%]" />
                  <div className="h-2 rounded-[4px] bg-[#c8c0b4] w-full" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1f1b16]/8">
                <div className="flex justify-between text-[#1f1b16] font-medium mb-2">
                  <span>GHS quarters (13 weeks each)</span>
                  <span className="font-mono tabular-nums text-[#b57924]">0.0% variance</span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono tabular-nums">
                  {['Q1 · 91d', 'Q2 · 91d', 'Q3 · 91d', 'Q4 · 91d'].map((q) => (
                    <div
                      key={q}
                      className="py-1.5 px-2 rounded-[4px] text-center bg-[#efe9df] text-[#1f1b16] border border-[#1f1b16]/8"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: 6 / 6 split for Decimal Time & Aurora Week */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-6 surface-card p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-mono text-xs text-[#7b7266]">Decimal time</span>
                <span className="ghs-token">1 beat = 86.4 SI s</span>
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                @Beats — decimal arithmetic, zero time zones
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                A day is divided into 1,000 @Beats, with 1 centibeat lasting 0.864 seconds. Because
                @Beats are anchored globally to UTC, @500 occurs at the exact same instant in
                Berlin, Tokyo, and New York.
              </p>
            </div>

            <div className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 font-mono text-xs tabular-nums space-y-2">
              <div className="flex items-center justify-between text-[#7b7266]">
                <span className="font-sans">Legacy duration</span>
                <span className="line-through">16:20 CET − 09:45 EST</span>
              </div>
              <div className="pt-2 border-t border-[#1f1b16]/8 flex items-center justify-between text-[#1f1b16] font-medium">
                <span className="font-sans">GHS duration</span>
                <span className="text-[#b57924]">@625 − @350 = 275 beats (27.5% of day)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 surface-card p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="font-mono text-xs text-[#7b7266]">Intercalary week</span>
                <span className="ghs-token">71 weeks / 400 yrs</span>
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                The Aurora Week — a global maintenance and festival pause
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Every 5–6 years, an Aurora Year adds one 7-day week (
                <span className="ghs-token">A.1–A.7</span>) after Month 13 (Luna). Sitting outside
                months and financial quarters, it provides a scheduled planetary pause for
                celebration and system migrations without billing drift.
              </p>
            </div>

            <div className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-sans font-medium text-[#1f1b16]">
                  146,097-day solar cycle lock
                </div>
                <div className="font-sans text-[#7b7266]">400 × 364d + 71 × 7d = 146,097 days</div>
              </div>
              <span className="ghs-token shrink-0">(71Y + 286) mod 400 &lt; 71</span>
            </div>
          </div>
        </div>

        {/* Row 3: Full-width Human Era Timeline */}
        <div className="surface-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[#7b7266] mb-2">Continuous chronology</p>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                12,026 years of civilization on a single positive timeline
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Splitting history into BC and AD forces backward counting across the first ten
                millennia of human settlement. Adding 10,000 years places all recorded history on a
                single monotonic scale.
              </p>
            </div>
            <span className="ghs-token self-start md:self-auto">Year HE = Gregorian + 10,000</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {HUMAN_ERA_TIMELINE.map((item) => (
              <div
                key={item.he}
                className="rounded-[8px] p-4 flex flex-col justify-between border"
                style={{
                  background: item.highlight ? '#efe9df' : '#f7f4ee',
                  borderColor: item.highlight
                    ? 'rgba(181, 121, 36, 0.4)'
                    : 'rgba(31, 27, 22, 0.08)',
                }}
              >
                <div>
                  <div
                    className="font-mono text-[13px] font-medium tabular-nums mb-0.5"
                    style={{ color: item.highlight ? '#b57924' : '#1f1b16' }}
                  >
                    {item.he}
                  </div>
                  <div className="font-mono text-xs text-[#7b7266] tabular-nums mb-3">
                    {item.gregorian}
                  </div>
                  <div className="font-sans text-[14px] font-medium text-[#1f1b16] mb-1">
                    {item.title}
                  </div>
                </div>
                <p className="font-sans text-xs text-[#5e554a] leading-[18px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
