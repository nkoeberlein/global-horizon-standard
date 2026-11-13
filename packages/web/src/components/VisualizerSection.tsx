import {
  formatGHS,
  getGHSDate,
  getHolidaysForYear,
  getSolarNoonBeat,
  WEEKDAYS_GHS,
} from 'ghs-time';
import { useEffect, useMemo, useState } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { GHSAnalogClock } from './GHSAnalogClock';

const WORLD_CITIES = [
  { city: 'London (0°)', lon: 0 },
  { city: 'Berlin (13°E)', lon: 13.4 },
  { city: 'Tokyo (140°E)', lon: 139.7 },
  { city: 'Sydney (151°E)', lon: 151.2 },
  { city: 'New York (74°W)', lon: -74.0 },
  { city: 'San Francisco (122°W)', lon: -122.4 },
];

const DATE_PRESETS = [
  { label: 'Today', iso: () => new Date().toISOString().slice(0, 10) },
  { label: 'GHS Epoch (2000-03-20)', iso: () => '2000-03-20' },
  { label: '2026 New Year (2026-03-23)', iso: () => '2026-03-23' },
  { label: 'Aurora Week (2031-03-17)', iso: () => '2031-03-17' },
  { label: 'Apollo 11 (1969-07-20)', iso: () => '1969-07-20' },
];

function getLocalPhase(currentBeat: number, noonBeat: number): string {
  const sinceLocalMidnight = (((currentBeat - noonBeat + 500) % 1000) + 1000) % 1000;
  if (sinceLocalMidnight >= 230 && sinceLocalMidnight < 400) return 'Morning';
  if (sinceLocalMidnight >= 400 && sinceLocalMidnight < 620) return 'Midday';
  if (sinceLocalMidnight >= 620 && sinceLocalMidnight < 810) return 'Evening';
  return 'Night';
}

interface VisualizerSectionProps {
  solarNoonFormulaHtml?: string;
}

export function VisualizerSection({ solarNoonFormulaHtml }: VisualizerSectionProps) {
  const [ghs, setGhs] = useState(() => getGHSDate());
  const [selectedIso, setSelectedIso] = useState(() => new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState<'converter' | 'holidays'>('converter');

  useEffect(() => {
    const timer = setInterval(() => setGhs(getGHSDate()), 250);
    return () => clearInterval(timer);
  }, []);

  const convertedDate = useMemo(() => {
    const parsed = new Date(`${selectedIso}T12:00:00Z`);
    if (!Number.isFinite(parsed.getTime())) {
      return getGHSDate();
    }
    return getGHSDate(parsed);
  }, [selectedIso]);

  const holidays = useMemo(() => getHolidaysForYear(convertedDate.era), [convertedDate.era]);

  return (
    <section id="visualizer" className="px-6 md:px-8 py-24 border-t border-[#1f1b16]/8">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="max-w-3xl mb-12">
          <p className="font-mono text-xs text-[#7b7266] mb-2">03 · Horological reference</p>
          <h2 className="section-heading mb-4">13 months, 28 days, one global pulse</h2>
          <p className="section-sub">
            Inspect the live 13-month grid, follow the 10-segment @Beats dial, or convert any date
            below.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mb-12">
          {/* Left: Calendar Grid */}
          <div className="flex-1 min-w-0 w-full surface-card p-6">
            <CalendarGrid />
          </div>

          {/* Right: Clock card + Global Solar Beats */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6">
            <div className="surface-card p-6 flex flex-col items-center gap-5 w-full">
              <div className="w-full flex items-center justify-between">
                <span className="font-sans text-[14px] font-medium text-[#1f1b16]">
                  Decimal time (@Beats)
                </span>
                <span className="ghs-token">1,000 / day</span>
              </div>

              {/* Analog Clock */}
              <GHSAnalogClock size={240} />

              {/* Digital readout */}
              <div className="text-center">
                <p className="font-mono text-[32px] leading-none font-medium tabular-nums text-[#b57924]">
                  {ghs.beatsLong}
                </p>
                <p className="text-xs mt-2 font-sans text-[#7b7266]">
                  Current planetary beat (UTC)
                </p>
              </div>

              {/* Beats progress bar */}
              <div className="w-full">
                <div className="flex justify-between text-xs mb-2 font-sans text-[#5e554a]">
                  <span>Day progress</span>
                  <span className="font-mono tabular-nums font-medium text-[#1f1b16]">
                    {(ghs.beatsExact / 10).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 rounded-[4px] overflow-hidden bg-[#efe9df]">
                  <div
                    className="h-full bg-[#b57924]"
                    style={{ width: `${ghs.beatsExact / 10}%` }}
                  />
                </div>
              </div>

              {/* Beat legend */}
              <div className="w-full border-t border-[#1f1b16]/8 pt-4 flex justify-between text-xs font-sans text-[#7b7266]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-[2px] bg-[#1f1b16]" />
                  <span>Day (1,000/rev)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 rounded-[2px] bg-[#b57924]" />
                  <span>Beat (100/rev)</span>
                </div>
              </div>
            </div>

            {/* Global Solar Noon Card */}
            <div className="surface-card p-6 w-full font-sans">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium text-[#1f1b16]">Local solar noon</span>
                <span className="ghs-token">{ghs.beats}</span>
              </div>
              {solarNoonFormulaHtml && (
                <div
                  className="ghs-math-box text-xs mb-3 py-2 px-3"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time KaTeX math
                  dangerouslySetInnerHTML={{ __html: solarNoonFormulaHtml }}
                />
              )}
              <div className="space-y-1.5 text-xs">
                {WORLD_CITIES.map((item) => {
                  const noonBeat = getSolarNoonBeat(item.lon);
                  const phase = getLocalPhase(ghs.beatsExact, noonBeat);
                  return (
                    <div
                      key={item.city}
                      className="h-8 px-3 rounded-[6px] bg-[#f7f4ee] border border-[#1f1b16]/6 flex items-center justify-between"
                    >
                      <span className="text-[#1f1b16]">{item.city}</span>
                      <div className="flex items-center gap-3 font-mono tabular-nums">
                        <span className="text-[#7b7266]">
                          Noon @{String(noonBeat).padStart(3, '0')}
                        </span>
                        <span className="w-14 text-right font-sans text-[#5e554a]">{phase}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Date Converter & Holidays Explorer */}
        <div className="surface-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#1f1b16]/8">
            <div>
              <p className="font-mono text-xs text-[#7b7266] mb-1">Bidirectional lookup</p>
              <h3 className="font-serif text-[22px] leading-[1.2] text-[#1f1b16]">
                Date converter and fixed holidays
              </h3>
            </div>

            <div className="inline-flex rounded-[8px] p-1 bg-[#efe9df] border border-[#1f1b16]/8 self-start">
              <button
                type="button"
                onClick={() => setActiveTab('converter')}
                className="h-8 px-4 rounded-[6px] text-xs font-sans font-medium transition-colors duration-150"
                style={{
                  background: activeTab === 'converter' ? '#fdfbf7' : 'transparent',
                  color: activeTab === 'converter' ? '#1f1b16' : '#5e554a',
                }}
              >
                Date converter
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('holidays')}
                className="h-8 px-4 rounded-[6px] text-xs font-sans font-medium transition-colors duration-150 tabular-nums"
                style={{
                  background: activeTab === 'holidays' ? '#fdfbf7' : 'transparent',
                  color: activeTab === 'holidays' ? '#1f1b16' : '#5e554a',
                }}
              >
                Fixed holidays ({convertedDate.era} HE)
              </button>
            </div>
          </div>

          {activeTab === 'converter' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left input controls */}
              <div className="lg:col-span-5 space-y-4 font-sans">
                <div>
                  <label
                    htmlFor="ghs-date-picker"
                    className="block text-xs font-medium text-[#5e554a] mb-2"
                  >
                    Gregorian date (UTC)
                  </label>
                  <input
                    id="ghs-date-picker"
                    type="date"
                    value={selectedIso}
                    onChange={(e) => setSelectedIso(e.target.value)}
                    className="w-full h-10 px-3 rounded-[8px] bg-[#f7f4ee] border border-[#1f1b16]/12 text-[#1f1b16] font-mono text-sm tabular-nums focus:outline-none focus:border-[#b57924]"
                  />
                </div>

                <div>
                  <div className="text-xs text-[#7b7266] mb-2">Reference dates</div>
                  <div className="flex flex-wrap gap-2">
                    {DATE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setSelectedIso(preset.iso())}
                        className="h-8 px-3 rounded-[6px] text-xs bg-[#f7f4ee] hover:bg-[#efe9df] text-[#5e554a] hover:text-[#1f1b16] border border-[#1f1b16]/8 transition-colors duration-150"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right converted result */}
              <div className="lg:col-span-7 rounded-[12px] p-6 bg-[#f7f4ee] border border-[#1f1b16]/8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs text-[#7b7266]">GHS date</span>
                  <span className="ghs-token">GHS {convertedDate.fullDate}</span>
                </div>

                <div className="font-serif text-[28px] md:text-[32px] leading-[1.15] text-[#1f1b16] tabular-nums mb-6">
                  {convertedDate.weekday}, {formatGHS(convertedDate, 'text')} HE
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1f1b16]/8 font-sans text-xs">
                  <div className="p-3 rounded-[8px] bg-[#fdfbf7] border border-[#1f1b16]/6">
                    <div className="text-[#7b7266] mb-1">Weekday</div>
                    <div className="font-medium text-[#1f1b16]">Always {convertedDate.weekday}</div>
                  </div>
                  <div className="p-3 rounded-[8px] bg-[#fdfbf7] border border-[#1f1b16]/6">
                    <div className="text-[#7b7266] mb-1">Day of year</div>
                    <div className="font-mono tabular-nums font-medium text-[#1f1b16]">
                      {convertedDate.dayOfYear} / {convertedDate.isAuroraYear ? 371 : 364}
                    </div>
                  </div>
                  <div className="p-3 rounded-[8px] bg-[#fdfbf7] border border-[#1f1b16]/6">
                    <div className="text-[#7b7266] mb-1">Week</div>
                    <div className="font-mono tabular-nums font-medium text-[#1f1b16]">
                      {convertedDate.weekOfYear !== null
                        ? `W${String(convertedDate.weekOfYear).padStart(2, '0')} / 52`
                        : 'Aurora'}
                    </div>
                  </div>
                  <div className="p-3 rounded-[8px] bg-[#fdfbf7] border border-[#1f1b16]/6">
                    <div className="text-[#7b7266] mb-1">Quarter</div>
                    <div className="font-mono tabular-nums font-medium text-[#1f1b16]">
                      {convertedDate.quarter !== null
                        ? `Q${convertedDate.quarter} (91d)`
                        : 'Intercalary'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-sans text-[14px] leading-[22px] text-[#5e554a] mb-5">
                Fixed GHS holidays fall on the exact same weekday every year — resolved for{' '}
                <span className="font-mono tabular-nums text-[#1f1b16] font-medium">
                  {convertedDate.era} HE
                </span>
                :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans">
                {holidays.map((occ) => {
                  const weekday = WEEKDAYS_GHS[(occ.holiday.day - 1) % 7];
                  return (
                    <div
                      key={occ.holiday.name}
                      className="rounded-[8px] p-4 bg-[#f7f4ee] border border-[#1f1b16]/8 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-sans text-[14px] font-medium text-[#1f1b16]">
                            {occ.holiday.name}
                          </div>
                          <div className="text-xs text-[#7b7266] mt-0.5">
                            {occ.holiday.category}
                          </div>
                        </div>
                        <span className="ghs-token shrink-0">{occ.ghsDate}</span>
                      </div>
                      <div className="pt-2.5 border-t border-[#1f1b16]/8 flex items-center justify-between text-xs font-mono tabular-nums text-[#7b7266]">
                        <span className="font-sans text-[#1f1b16] font-medium">
                          Every {weekday}
                        </span>
                        <span>
                          {occ.gregorian.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
