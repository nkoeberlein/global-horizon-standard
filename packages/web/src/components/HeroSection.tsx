import { formatGHS, getGHSDate } from 'ghs-time';
import { useEffect, useState } from 'react';
import { GitHubIcon } from './GitHubIcon';

// beatsLong only changes every centibeat (864 ms) — no need for a 60 fps loop.
const REFRESH_MS = 250;

export function HeroSection() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const ghs = getGHSDate(now);
  const beatsDisplay = ghs.beatsLong; // "@045.23"
  const shorthand = formatGHS(ghs, 'short');

  return (
    <section className="min-h-screen flex flex-col justify-between px-6 md:px-8 py-6">
      {/* Top navigation: quiet chrome, 4px grid */}
      <header className="w-full max-w-6xl mx-auto h-12 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="GHS" className="w-7 h-7 object-contain" />
          <span className="font-sans text-[15px] font-medium text-[#1f1b16]">
            Global Horizon Standard
          </span>
        </a>

        <nav className="flex items-center gap-6 text-[14px] font-sans text-[#5e554a]">
          <a
            href="#why"
            className="hover:text-[#1f1b16] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hidden md:inline"
          >
            Why GHS
          </a>
          <a
            href="#advantages"
            className="hover:text-[#1f1b16] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hidden md:inline"
          >
            Advantages
          </a>
          <a
            href="#visualizer"
            className="hover:text-[#1f1b16] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hidden sm:inline"
          >
            Calendar
          </a>
          <a
            href="#ecosystem"
            className="hover:text-[#1f1b16] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hidden lg:inline"
          >
            Specification
          </a>
          <a
            href="https://github.com/nkoeberlein/global-horizon-standard"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-[8px] inline-flex items-center gap-2 bg-[#efe9df] hover:bg-[#e5ded2] text-[#1f1b16] text-[13px] font-medium border border-[#1f1b16]/8 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
          >
            <GitHubIcon size={15} />
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      {/* Main asymmetric split hero */}
      <div className="w-full max-w-6xl mx-auto my-auto py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Calm typographic statement */}
        <div className="lg:col-span-6 text-left">
          <p className="font-mono text-xs text-[#7b7266] mb-4">
            Open proposal for planetary timekeeping
          </p>

          <h1
            className="font-serif text-[#1f1b16] mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              fontWeight: 400,
            }}
          >
            13 equal months,
            <br />
            decimal time,
            <br />
            one shared human era
          </h1>

          <p className="font-sans text-[18px] leading-[28px] text-[#5e554a] max-w-[34rem] mb-8">
            GHS replaces irregular months, shifting weekdays, and time zones with a perpetual 13×28
            calendar and @Beats — the same time, everywhere on Earth.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#why"
              className="h-11 px-5 rounded-[8px] inline-flex items-center justify-center text-[14px] font-sans font-medium bg-[#1f1b16] hover:bg-[#332d25] text-[#fdfbf7] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              Why change time
            </a>
            <a
              href="#visualizer"
              className="h-11 px-5 rounded-[8px] inline-flex items-center justify-center text-[14px] font-sans font-medium bg-[#efe9df] hover:bg-[#e5ded2] text-[#1f1b16] border border-[#1f1b16]/8 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              Explore the calendar
            </a>
          </div>
        </div>

        {/* Right: Live Gregorian ↔ GHS Chronometer Instrument */}
        <div className="lg:col-span-6">
          <div className="surface-card p-6 font-sans">
            {/* Instrument header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1f1b16]/8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#b57924]" />
                <span className="text-xs font-mono text-[#7b7266]">Live UTC reference</span>
              </div>
              <span className="ghs-token">
                GHS {ghs.fullDate} {ghs.beats}
              </span>
            </div>

            {/* Column labels */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center px-3 pb-2 text-xs text-[#7b7266]">
              <span>Gregorian legacy</span>
              <span className="px-4" />
              <span className="text-right text-[#1f1b16] font-medium">Global Horizon Standard</span>
            </div>

            <div className="space-y-2">
              {/* Date row */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center p-4 rounded-[8px] bg-[#f7f4ee] border border-[#1f1b16]/6">
                <div>
                  <div className="text-[17px] text-[#5e554a] tabular-nums">
                    {now.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </div>
                  <div className="text-xs text-[#7b7266] mt-1">28–31 day months</div>
                </div>
                <span className="px-4 font-mono text-xs text-[#7b7266]">→</span>
                <div className="text-right">
                  <div className="text-[17px] font-medium text-[#1f1b16] tabular-nums">
                    {ghs.weekday.slice(0, 3)}, {shorthand}
                  </div>
                  <div className="text-xs text-[#7b7266] mt-1 font-mono tabular-nums">
                    {ghs.fullDate} · 13×28d
                  </div>
                </div>
              </div>

              {/* Time row */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center p-4 rounded-[8px] bg-[#f7f4ee] border border-[#1f1b16]/6">
                <div>
                  <div className="font-mono tabular-nums text-[17px] text-[#5e554a]">
                    {now.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'UTC',
                    })}{' '}
                    UTC
                  </div>
                  <div className="text-xs text-[#7b7266] mt-1">24h · 60m · 60s</div>
                </div>
                <span className="px-4 font-mono text-xs text-[#7b7266]">→</span>
                <div className="text-right">
                  <div className="font-mono tabular-nums text-[20px] font-medium text-[#b57924]">
                    {beatsDisplay}
                  </div>
                  <div className="text-xs text-[#7b7266] mt-1">1,000 @beats / day</div>
                </div>
              </div>

              {/* Era row */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center p-4 rounded-[8px] bg-[#f7f4ee] border border-[#1f1b16]/6">
                <div>
                  <div className="text-[17px] text-[#5e554a] tabular-nums">
                    {now.getUTCFullYear()} CE
                  </div>
                  <div className="text-xs text-[#7b7266] mt-1">Common Era</div>
                </div>
                <span className="px-4 font-mono text-xs text-[#7b7266]">→</span>
                <div className="text-right">
                  <div className="text-[17px] font-medium text-[#1f1b16] tabular-nums">
                    {ghs.era} HE
                  </div>
                  <div className="text-xs text-[#7b7266] mt-1">Human Era (+10,000)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline spacer */}
      <div className="w-full max-w-6xl mx-auto h-4" />
    </section>
  );
}
