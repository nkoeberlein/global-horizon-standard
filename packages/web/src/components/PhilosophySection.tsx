import type { ReactNode } from 'react';
import { Grid3x3, Clock, Globe, Leaf } from 'lucide-react';

interface PillarProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  body: string;
  accentColor: string;
}

function Pillar({ icon, title, subtitle, body, accentColor }: PillarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: `${accentColor}15` }}
      >
        <div style={{ color: accentColor }}>{icon}</div>
      </div>

      {/* Text */}
      <div>
        <p className="text-xs tracking-widest uppercase font-sans mb-1" style={{ color: accentColor }}>
          {subtitle}
        </p>
        <h3 className="font-serif text-xl text-charcoal mb-3" style={{ fontWeight: 500 }}>
          {title}
        </h3>
        <p className="font-sans text-sm leading-relaxed" style={{ color: '#7a7265' }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export function PhilosophySection() {
  return (
    <section className="px-6 py-24 md:py-32" style={{ background: '#f4f1ea' }}>
      <div className="max-w-6xl mx-auto">

        {/* Heading & Logo side-by-side */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16 mb-20 max-w-5xl">
          <div className="shrink-0">
            <img src="/logo-rectangular.png" alt="GHS Logo" className="w-64 md:w-80 opacity-90 object-contain" />
          </div>
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.35em] uppercase mb-3 font-sans" style={{ color: '#9b9288' }}>
              The Philosophy
            </p>
            <h2 className="section-heading mb-5">
              Time redesigned for humanity.
            </h2>
            <p className="section-sub">
              GHS reimagines the calendar from first principles — a system built on mathematical elegance,
              natural rhythm, and a shared sense of history.
            </p>
          </div>
        </div>

        {/* 2×2 Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16">
          <Pillar
            icon={<Grid3x3 size={22} />}
            subtitle="13-Month Symmetry"
            title="Every month is identical"
            accentColor="#6b9e7a"
            body={
              "13 months of exactly 28 days each — that's 364 days. Every month starts on Monday. " +
              "Every month looks the same. The chaos of 30/31-day months and shifting weekdays disappears. " +
              "Schedules, payroll, analytics — all become perfectly periodic."
            }
          />
          <Pillar
            icon={<Clock size={22} />}
            subtitle="Decimal Time"
            title="@Beats — 1 day, 1,000 beats"
            accentColor="#c8903a"
            body={
              "A day is divided into 1,000 beats. One beat lasts 86.4 seconds. " +
              "@500 is always noon. @250 is always dawn. No time zones. No AM/PM. " +
              "Whether you're in Tokyo or Toronto, @500 means the same thing: halfway through the day."
            }
          />
          <Pillar
            icon={<Globe size={22} />}
            subtitle="The Human Era"
            title="12,026 years of recorded history"
            accentColor="#7c9cbf"
            body={
              "By adding 10,000 to the Gregorian year, GHS creates the Human Era — a calendar that " +
              "encompasses the full span of human civilization, from the first settled communities to today. " +
              "2026 CE becomes 12,026 HE. Our history becomes visible."
            }
          />
          <Pillar
            icon={<Leaf size={22} />}
            subtitle="The Aurora Week"
            title="Nature's remainder, celebrated"
            accentColor="#9b7ec8"
            body={
              "71 out of every 400 years are Aurora Years, gaining one extra week (7 days) to keep " +
              "the calendar synchronized with Earth's orbit. This intercalary week — the Aurora Week — " +
              "sits outside the 13-month structure, a pause between years, like an equinox festival."
            }
          />
        </div>

        {/* Divider quote */}
        <div className="mt-24 text-center">
          <blockquote
            className="font-serif text-2xl md:text-3xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#5c5650', fontWeight: 300 }}
          >
            "A calendar is not just a tool for counting days —
            it is a statement about what we value as a civilization."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
