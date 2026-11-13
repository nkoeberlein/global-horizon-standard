import { MathFormula } from './MathFormula';

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
    desc: 'Dawn of settled agriculture',
    highlight: false,
  },
  {
    he: '07500 HE',
    gregorian: '2500 BCE',
    title: 'Great Pyramid',
    desc: 'Early urban civilizations',
    highlight: false,
  },
  {
    he: '09247 HE',
    gregorian: '0753 BCE',
    title: 'Founding of Rome',
    desc: 'Classical antiquity',
    highlight: false,
  },
  {
    he: '11760 HE',
    gregorian: '1760 CE',
    title: 'Industrial Age',
    desc: 'Steam & global telegraph',
    highlight: false,
  },
  {
    he: '11969 HE',
    gregorian: '1969 CE',
    title: 'Apollo 11',
    desc: 'First lunar landing',
    highlight: false,
  },
  {
    he: '12026 HE',
    gregorian: '2026 CE',
    title: 'Planetary era',
    desc: '12 millennia in one count',
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
              Four mathematical rules eliminate calendar drift, statistical distortion, and
              time-zone arithmetic.
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-mono text-xs text-[#7b7266]">13-month symmetry</span>
                <MathFormula tex="\text{weekday}(d) = (d - 1) \bmod 7" />
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                Know the date, know the weekday forever
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Every month is 4 complete weeks (1st = Monday, 28th = Sunday), so birthdays,
                holidays, and billing cycles fall on the same weekday every year.
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-mono text-xs text-[#7b7266]">13-period accounting</span>
                <MathFormula tex="13 \times 28\text{ d} = 4 \times 91\text{ d}" />
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                Zero statistical noise in analytics
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Gregorian months vary by up to 10.7% in length; GHS gives analytics 13 identical
                28-day months and four 91-day quarters.
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
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-mono text-xs text-[#7b7266]">Decimal time</span>
                <MathFormula tex="1\text{ beat} = \frac{86{,}400\text{ s}}{1{,}000} = 86.4\text{ s}" />
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                @Beats — decimal arithmetic, zero time zones
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                One day is divided into 1,000 UTC-anchored @Beats — @500 occurs at the exact same
                instant in Berlin, Tokyo, and New York.
              </p>
            </div>

            <div className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 font-mono text-xs tabular-nums space-y-2">
              <div className="flex items-center justify-between text-[#7b7266]">
                <span className="font-sans">Legacy duration</span>
                <span className="line-through">16:20 CET − 09:45 EST</span>
              </div>
              <div className="pt-2 border-t border-[#1f1b16]/8 flex items-center justify-between text-[#1f1b16] font-medium">
                <span className="font-sans">GHS duration</span>
                <span className="text-[#b57924]">
                  <MathFormula variant="plain" tex="@625 - @350 = 275\text{ beats } (27.5\%)" />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 surface-card p-6 md:p-8 flex flex-col justify-between">
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-mono text-xs text-[#7b7266]">Intercalary week</span>
                <MathFormula tex="(71Y + 286) \bmod 400 < 71" />
              </div>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                The Aurora Week — a global maintenance and festival pause
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Every 5–6 years, a 7-day <span className="ghs-token">Aurora Week (A.1–A.7)</span>{' '}
                follows Luna — sitting outside months and quarters for a planetary pause.
              </p>
            </div>

            <div className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-sans font-medium text-[#1f1b16] mb-0.5">
                  146,097-day solar cycle lock
                </div>
                <div className="text-[#5e554a]">
                  <MathFormula
                    variant="plain"
                    tex="400 \times 364\text{ d} + 71 \times 7\text{ d} = 146{,}097\text{ d}"
                  />
                </div>
              </div>
              <span className="ghs-token shrink-0">365.2425 d / yr</span>
            </div>
          </div>
        </div>

        {/* Row 3: Full-width Human Era Timeline */}
        <div className="surface-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="max-w-xl">
              <p className="font-mono text-xs text-[#7b7266] mb-2">Continuous chronology</p>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16] mb-2">
                12,026 years of civilization on a single positive timeline
              </h3>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a]">
                Adding 10,000 years replaces the BC/AD split with one monotonic scale across all
                recorded human history.
              </p>
            </div>
            <MathFormula
              tex="Y_{\text{HE}} = Y_{\text{Greg}} + 10{,}000"
              className="self-start md:self-auto"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                <p className="font-sans text-xs text-[#7b7266]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
