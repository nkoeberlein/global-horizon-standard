import { useState, useEffect } from 'react';
import { getGHSDate } from 'ghs-time';
import { ArrowDown } from 'lucide-react';
import { GitHubIcon } from './GitHubIcon';

const MONTH_ABBR = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Lun'];

function toShorthand(d: ReturnType<typeof getGHSDate>): string {
  if (d.isAuroraWeek) return `Aurora '${String(d.era).slice(-2)}`;
  const abbr = MONTH_ABBR[(d.month ?? 1) - 1];
  const yr = String(d.era).slice(-2);
  return `${d.day} ${abbr} '${yr}`;
}

export function HeroSection() {
  const [ghs, setGhs] = useState(() => getGHSDate());

  useEffect(() => {
    let raf: number;
    function tick() {
      setGhs(getGHSDate());
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const beatsDisplay = ghs.beatsLong; // "@045.23"
  const shorthand = toShorthand(ghs);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle radial background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(232,168,32,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Top nav */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="font-serif text-charcoal font-medium tracking-wide text-sm">GHS</span>
          <span className="text-cream-dark text-xs tracking-widest uppercase font-sans" style={{ color: '#b0a898' }}>
            Global Horizon Standard
          </span>
        </div>
        <a
          href="https://github.com/nkoeberlein/global-horizon-standard"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-charcoal-light hover:text-charcoal transition-colors text-sm"
        >
          <GitHubIcon size={16} />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </nav>

      {/* Hero content */}
      <div className="text-center max-w-3xl mx-auto pt-16">

        {/* Tagline */}
        <p
          className="text-xs font-sans tracking-[0.35em] uppercase mb-6"
          style={{ color: '#9b9288' }}
        >
          An open proposal for a better calendar
        </p>

        {/* Headline */}
        <h1
          className="font-serif leading-tight mb-5"
          style={{
            fontSize: 'clamp(2rem, 5.5vw, 3.25rem)',
            fontWeight: 400,
            color: '#2d2926',
            letterSpacing: '-0.02em',
          }}
        >
          13 equal months,<br />decimal time,<br />one shared human era.
        </h1>

        {/* One-liner */}
        <p
          className="font-sans mb-10 mx-auto"
          style={{
            fontSize: '1.05rem',
            color: '#7a7265',
            maxWidth: '32rem',
            lineHeight: 1.7,
          }}
        >
          GHS replaces irregular months and AM/PM with a symmetric 13×28 calendar
          and @Beats — the same time, everywhere on Earth.
        </p>

        {/* Gregorian ↔ GHS comparison */}
        <div
          className="rounded-2xl mb-10 overflow-hidden font-sans"
          style={{ border: '1px solid #e8e4db' }}
        >
          {/* Header row */}
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-3"
            style={{ background: '#f4f1ea', borderBottom: '1px solid #e8e4db' }}
          >
            <span className="text-xs tracking-widest uppercase text-left" style={{ color: '#b0a898' }}>Gregorian</span>
            <span className="px-6" style={{ color: '#d4cfc4' }}>→</span>
            <span className="text-xs tracking-widest uppercase text-right" style={{ color: '#c8903a' }}>GHS</span>
          </div>

          {/* Date row */}
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-6"
            style={{ borderBottom: '1px solid #f0ede6' }}
          >
            <div className="text-left">
              <div className="text-xl" style={{ color: '#5c5650' }}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="text-xs mt-1.5" style={{ color: '#b0a898' }}>Calendar date</div>
            </div>
            <span className="px-6 text-xl" style={{ color: '#d4cfc4' }}>→</span>
            <div className="text-right">
              <div className="text-xl" style={{ color: '#2d2926', fontWeight: 600 }}>
                {ghs.weekday?.slice(0, 3)}, {shorthand}
              </div>
              <div className="text-xs mt-1.5" style={{ color: '#b0a898' }}>13 × 28-day calendar</div>
            </div>
          </div>

          {/* Time row */}
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-6"
            style={{ borderBottom: '1px solid #f0ede6' }}
          >
            <div className="text-left">
              <div className="font-mono tabular-nums text-xl" style={{ color: '#5c5650' }}>
                {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
              </div>
              <div className="text-xs mt-1.5" style={{ color: '#b0a898' }}>24 h · 60 min · 60 sec</div>
            </div>
            <span className="px-6 text-xl" style={{ color: '#d4cfc4' }}>→</span>
            <div className="text-right">
              <div className="font-mono tabular-nums text-xl" style={{ color: '#c8903a', fontWeight: 600 }}>
                {beatsDisplay}
              </div>
              <div className="text-xs mt-1.5" style={{ color: '#b0a898' }}>1 day = 1,000 @beats</div>
            </div>
          </div>

          {/* Era row */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-7 py-6">
            <div className="text-left">
              <div className="text-xl" style={{ color: '#5c5650' }}>
                {new Date().getFullYear()} CE
              </div>
              <div className="text-xs mt-1.5" style={{ color: '#b0a898' }}>Common Era</div>
            </div>
            <span className="px-6 text-xl" style={{ color: '#d4cfc4' }}>→</span>
            <div className="text-right">
              <div className="text-xl" style={{ color: '#2d2926', fontWeight: 600 }}>
                {ghs.era} HE
              </div>
              <div className="text-xs mt-1.5" style={{ color: '#b0a898' }}>Human Era (+10,000)</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/nkoeberlein/global-horizon-standard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-sans font-medium transition-all"
            style={{
              background: '#2d2926',
              color: '#faf9f6',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4a4035')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2d2926')}
          >
            <GitHubIcon size={15} />
            View on GitHub
          </a>
          <a
            href="#visualizer"
            className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-sans font-medium transition-all border"
            style={{
              borderColor: '#d4cfc4',
              color: '#5c5650',
              letterSpacing: '0.03em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#b0a898';
              e.currentTarget.style.color = '#2d2926';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#d4cfc4';
              e.currentTarget.style.color = '#5c5650';
            }}
          >
            Explore the Calendar
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce" style={{ opacity: 0.4 }}>
        <ArrowDown size={18} style={{ color: '#5c5650' }} />
      </div>
    </section>
  );
}
