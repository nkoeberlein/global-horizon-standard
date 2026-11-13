import { getGHSDate } from 'ghs-time';
import { useEffect, useState } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { GHSAnalogClock } from './GHSAnalogClock';

export function VisualizerSection() {
  const [ghs, setGhs] = useState(() => getGHSDate());

  useEffect(() => {
    // beatsLong only changes every centibeat (864 ms) — a coarse interval suffices.
    const timer = setInterval(() => setGhs(getGHSDate()), 250);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="visualizer" className="px-6 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="mb-16 text-center">
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3 font-sans"
            style={{ color: '#9b9288' }}
          >
            The Calendar
          </p>
          <h2 className="section-heading">13 Months. 28 Days. One rhythm.</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
          {/* Left: Calendar Grid */}
          <div className="flex-1 min-w-0">
            <CalendarGrid />
          </div>

          {/* Right: Clock card */}
          <div className="w-full lg:w-auto flex flex-col items-center gap-8">
            <div
              className="glass-card rounded-3xl p-8 flex flex-col items-center gap-6"
              style={{ minWidth: 300 }}
            >
              {/* Clock label */}
              <div className="text-center">
                <p className="font-serif text-lg text-charcoal" style={{ fontWeight: 400 }}>
                  Decimal Time
                </p>
                <p className="text-xs tracking-widest uppercase mt-1" style={{ color: '#b0a898' }}>
                  @Beats — 1 day = 1,000 beats
                </p>
              </div>

              {/* Analog Clock */}
              <GHSAnalogClock size={260} />

              {/* Digital readout */}
              <div className="text-center">
                <p
                  className="font-mono text-4xl tabular-nums"
                  style={{ color: '#c8903a', fontWeight: 300, letterSpacing: '-0.01em' }}
                >
                  {ghs.beatsLong}
                </p>
                <p className="text-xs mt-2 font-sans" style={{ color: '#b0a898' }}>
                  current @beats (UTC)
                </p>
              </div>

              {/* Beat legend */}
              <div className="w-full border-t pt-5" style={{ borderColor: '#e8e4db' }}>
                <div
                  className="flex justify-between text-xs font-sans"
                  style={{ color: '#9b9288' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1.5 rounded-full" style={{ background: '#2d2926' }} />
                    <span>Day hand — 1,000 beats/rev</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: '#c8903a' }} />
                    <span>Beat hand — 100 beats/rev</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Beats progress bar */}
            <div className="w-full max-w-xs">
              <div
                className="flex justify-between text-xs mb-2 font-sans"
                style={{ color: '#b0a898' }}
              >
                <span>Day progress</span>
                <span className="font-mono" style={{ color: '#c8903a' }}>
                  {(ghs.beatsExact / 10).toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e8e4db' }}>
                <div
                  className="h-full rounded-full transition-none"
                  style={{
                    width: `${ghs.beatsExact / 10}%`,
                    background: 'linear-gradient(90deg, #e8a820, #c8903a)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
