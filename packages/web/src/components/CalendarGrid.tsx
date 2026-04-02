import { useState, useEffect, useMemo } from 'react';
import { getGHSDate, MONTH_NAMES_GHS, WEEKDAYS_GHS, isAuroraYear } from 'ghs-time';

// GHS months always start on Monday — every month is a perfect 7×4 grid.
const WEEKDAY_ABBR = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface MonthCardProps {
  monthIndex: number; // 0-based (0 = first GHS month = "March")
  currentMonth: number | null; // 1-based, null if aurora week
  currentDay: number;
  isAuroraWeek: boolean;
}

function MonthCard({ monthIndex, currentMonth, currentDay, isAuroraWeek }: MonthCardProps) {
  const name = MONTH_NAMES_GHS[monthIndex];
  const isCurrentMonth = !isAuroraWeek && currentMonth === monthIndex + 1;

  return (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{
        background: isCurrentMonth ? 'rgba(200, 144, 58, 0.06)' : 'rgba(255,254,249,0.6)',
        border: isCurrentMonth ? '1px solid rgba(200, 144, 58, 0.3)' : '1px solid rgba(224,219,210,0.5)',
      }}
    >
      <p
        className="font-serif text-sm mb-3 text-center"
        style={{
          color: isCurrentMonth ? '#c8903a' : '#7a7265',
          fontWeight: isCurrentMonth ? 600 : 400,
        }}
      >
        {name}
      </p>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {WEEKDAY_ABBR.map(d => (
          <div
            key={d}
            className="text-center text-xs"
            style={{ color: '#b0a898', fontWeight: 500, fontSize: '0.6rem' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells: 4 rows × 7 cols = 28 */}
      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === currentDay;
          return (
            <div
              key={day}
              className="flex items-center justify-center rounded-full aspect-square"
              style={{
                fontSize: '0.62rem',
                color: isToday ? '#faf9f6' : isCurrentMonth ? '#2d2926' : '#9b9288',
                background: isToday ? '#c8903a' : 'transparent',
                fontWeight: isToday ? 700 : 400,
                width: '100%',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AuroraWeekCardProps {
  isCurrentAurora: boolean;
  currentDay: number;
}

function AuroraWeekCard({ isCurrentAurora, currentDay }: AuroraWeekCardProps) {
  return (
    <div
      className="rounded-2xl p-4 col-span-full"
      style={{
        background: isCurrentAurora
          ? 'linear-gradient(135deg, rgba(196,181,253,0.2) 0%, rgba(252,165,165,0.15) 50%, rgba(186,230,253,0.2) 100%)'
          : 'rgba(255,254,249,0.6)',
        border: isCurrentAurora ? '1px solid rgba(196,181,253,0.4)' : '1px solid rgba(224,219,210,0.5)',
      }}
    >
      <p
        className="font-serif text-sm mb-3 text-center"
        style={{ color: isCurrentAurora ? '#7c6fb0' : '#7a7265', fontWeight: isCurrentAurora ? 600 : 400 }}
      >
        Aurora Week
        <span className="ml-2 text-xs font-sans" style={{ opacity: 0.6 }}>(intercalary)</span>
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {Array.from({ length: 7 }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentAurora && day === currentDay;
          return (
            <div
              key={day}
              className="flex flex-col items-center"
            >
              <span className="text-xs mb-1" style={{ color: '#b0a898', fontSize: '0.6rem' }}>
                {WEEKDAYS_GHS[i].slice(0, 2)}
              </span>
              <div
                className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium"
                style={{
                  background: isToday
                    ? 'linear-gradient(135deg, #c4b5fd, #fca5a5)'
                    : 'transparent',
                  color: isToday ? '#fff' : '#9b9288',
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarGrid() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Refresh at the next GHS midnight (next multiple of 86400s in UTC)
    function scheduleRefresh() {
      const msUntilMidnight = 86400000 - (Date.now() % 86400000);
      return setTimeout(() => {
        setNow(new Date());
        scheduleRefresh();
      }, msUntilMidnight);
    }
    const t = scheduleRefresh();
    return () => clearTimeout(t);
  }, []);

  const ghs = useMemo(() => getGHSDate(now), [now]);
  const aurora = isAuroraYear(ghs.era);

  return (
    <div>
      {/* Year label */}
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-serif text-2xl text-charcoal">{ghs.era} HE</span>
        {aurora && (
          <span
            className="text-xs font-sans px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #ede9fe, #fce7f3)', color: '#7c6fb0' }}
          >
            Aurora Year
          </span>
        )}
      </div>

      {/* 13 months grid */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
        {Array.from({ length: 13 }, (_, i) => (
          <MonthCard
            key={i}
            monthIndex={i}
            currentMonth={ghs.month}
            currentDay={ghs.day}
            isAuroraWeek={ghs.isAuroraWeek}
          />
        ))}

        {/* Aurora Week */}
        {aurora && (
          <AuroraWeekCard
            isCurrentAurora={ghs.isAuroraWeek}
            currentDay={ghs.day}
          />
        )}
      </div>
    </div>
  );
}
