import { DAY_MS, getGHSDate, MONTH_NAMES_GHS, WEEKDAYS_GHS } from 'ghs-time';
import { useEffect, useMemo, useState } from 'react';

// GHS months always start on Monday — every month is a perfect 7×4 grid.
const WEEKDAY_ABBR = WEEKDAYS_GHS.map((w) => w.slice(0, 2));

interface MonthCardProps {
  monthIndex: number; // 0-based (0 = first GHS month = "March")
  currentMonth: number | null; // 1-based, null if aurora week
  currentDay: number;
  isAuroraWeek: boolean;
}

function MonthCard({ monthIndex, currentMonth, currentDay, isAuroraWeek }: MonthCardProps) {
  const name = MONTH_NAMES_GHS[monthIndex];
  const isCurrentMonth = !isAuroraWeek && currentMonth === monthIndex + 1;
  const monthNumber = String(monthIndex + 1).padStart(2, '0');

  return (
    <div
      className="rounded-[12px] p-4 border transition-colors duration-150"
      style={{
        background: isCurrentMonth ? '#fdfbf7' : '#f7f4ee',
        borderColor: isCurrentMonth ? 'rgba(181, 121, 36, 0.45)' : 'rgba(31, 27, 22, 0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-sans text-[13px] font-medium"
          style={{ color: isCurrentMonth ? '#1f1b16' : '#5e554a' }}
        >
          {name}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-[#7b7266]">{monthNumber}</span>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAY_ABBR.map((d) => (
          <div key={d} className="text-center font-mono text-[11px] text-[#7b7266]">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells: 4 rows × 7 cols = 28 */}
      <div className="grid grid-cols-7 gap-0.5 font-mono tabular-nums">
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === currentDay;
          return (
            <div
              key={day}
              className="h-6 flex items-center justify-center rounded-[4px] text-[11px]"
              style={{
                color: isToday ? '#fdfbf7' : isCurrentMonth ? '#1f1b16' : '#7b7266',
                background: isToday ? '#b57924' : 'transparent',
                fontWeight: isToday ? 500 : 400,
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
      className="rounded-[12px] p-4 col-span-full border"
      style={{
        background: isCurrentAurora ? '#efe9df' : '#f7f4ee',
        borderColor: isCurrentAurora ? 'rgba(181, 121, 36, 0.45)' : 'rgba(31, 27, 22, 0.08)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-sans text-[13px] font-medium text-[#1f1b16]">
          Aurora Week (Intercalary)
        </span>
        <span className="ghs-token">A.1–A.7</span>
      </div>
      <div className="grid grid-cols-7 gap-2 font-mono tabular-nums">
        {Array.from({ length: 7 }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentAurora && day === currentDay;
          return (
            <div key={day} className="flex flex-col items-center">
              <span className="text-[11px] text-[#7b7266] mb-1">{WEEKDAYS_GHS[i].slice(0, 2)}</span>
              <div
                className="w-full h-7 flex items-center justify-center rounded-[4px] text-xs"
                style={{
                  background: isToday ? '#b57924' : '#fdfbf7',
                  color: isToday ? '#fdfbf7' : '#5e554a',
                  fontWeight: isToday ? 500 : 400,
                }}
              >
                A.{day}
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
    // Refresh at the next GHS midnight (next multiple of DAY_MS in UTC)
    function scheduleRefresh() {
      const msUntilMidnight = DAY_MS - (Date.now() % DAY_MS);
      return setTimeout(() => {
        setNow(new Date());
        scheduleRefresh();
      }, msUntilMidnight);
    }
    const t = scheduleRefresh();
    return () => clearTimeout(t);
  }, []);

  const ghs = useMemo(() => getGHSDate(now), [now]);
  const aurora = ghs.isAuroraYear;

  return (
    <div>
      {/* Year label */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-[22px] text-[#1f1b16] tabular-nums">{ghs.era} HE</span>
          <span className="font-mono text-xs text-[#7b7266]">
            {aurora ? '371 days (Aurora year)' : '364 days (52 weeks)'}
          </span>
        </div>
        <span className="ghs-token">{ghs.fullDate}</span>
      </div>

      {/* 13 months grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(156px, 1fr))' }}
      >
        {Array.from({ length: 13 }, (_, i) => (
          <MonthCard
            key={MONTH_NAMES_GHS[i]}
            monthIndex={i}
            currentMonth={ghs.month}
            currentDay={ghs.day}
            isAuroraWeek={ghs.isAuroraWeek}
          />
        ))}

        {/* Aurora Week */}
        {aurora && <AuroraWeekCard isCurrentAurora={ghs.isAuroraWeek} currentDay={ghs.day} />}
      </div>
    </div>
  );
}
