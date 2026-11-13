import {
  formatGHS,
  GHS_FORMATS,
  getGHSDate,
  getHolidaysForYear,
  isGHSFormat,
  parseGHSString,
} from 'ghs-time';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const app = new Hono();

// CORS aktivieren, damit jede Website (auch dein Dashboard) die API anfragen darf
app.use('/*', cors());

// GHS-shaped input with out-of-range components (thrown by ghs-time) → 400
app.onError((err, c) => {
  if (err instanceof RangeError) {
    return c.json({ error: err.message }, 400);
  }
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

app.notFound((c) =>
  c.json(
    { error: 'Not found. Available endpoints: /, /now, /convert, /holidays, /badge.json' },
    404,
  ),
);

// 1. Root / Healthcheck
app.get('/', (c) => {
  return c.json({
    status: 'online',
    protocol: 'Global Horizon Standard (GHS)',
    endpoints: {
      now: `/now?format={${GHS_FORMATS.join('|')}}`,
      convert: '/convert?date=YYYY-MM-DD | YYYYY.MM.DD',
      holidays: '/holidays?year=YYYYY',
      badge: '/badge.json (Shields.io live badge)',
    },
  });
});

// 2. Endpoint: Aktuelle Zeit (/now)
app.get('/now', (c) => {
  const format = c.req.query('format') ?? 'core';
  if (!isGHSFormat(format)) {
    return c.json({ error: `Invalid format '${format}'. Allowed: ${GHS_FORMATS.join(', ')}` }, 400);
  }

  const now = new Date();
  const ghs = getGHSDate(now);

  return c.json({
    timestamp_iso: now.toISOString(),
    ghs: {
      era: ghs.era,
      month: ghs.month,
      monthName: ghs.monthName,
      day: ghs.day,
      weekOfYear: ghs.weekOfYear,
      quarter: ghs.quarter,
      beats: ghs.beats,
      isAuroraWeek: ghs.isAuroraWeek,
      fullDate: ghs.fullDate,
      formatted: formatGHS(ghs, format),
    },
  });
});

// 3. Endpoint: Konvertierung (/convert?date=...)
app.get('/convert', (c) => {
  const dateQuery = c.req.query('date');

  if (!dateQuery) {
    return c.json({ error: "Missing 'date' parameter. Example: /convert?date=2026-04-02" }, 400);
  }

  // GHS -> Gregorian (throws RangeError on out-of-range components → onError)
  const ghsInput = parseGHSString(dateQuery);
  if (ghsInput) {
    return c.json({
      input_ghs: dateQuery,
      gregorian_utc: ghsInput.date.toISOString(),
    });
  }

  // Gregorian -> GHS
  const date = new Date(dateQuery);
  if (Number.isNaN(date.getTime())) {
    return c.json(
      { error: 'Invalid date format. Use ISO format (YYYY-MM-DD) or GHS (YYYYY.MM.DD).' },
      400,
    );
  }

  const ghs = getGHSDate(date);
  return c.json({
    input_gregorian: date.toISOString(),
    ghs: {
      era: ghs.era,
      fullDate: ghs.fullDate,
      beats: ghs.beats,
      formatted: formatGHS(ghs, 'ui'),
    },
  });
});

// 4. Endpoint: Feiertage (/holidays?year=12026)
app.get('/holidays', (c) => {
  const yearQuery = c.req.query('year');
  const era =
    yearQuery === undefined
      ? getGHSDate().era
      : /^\d{5}$/.test(yearQuery)
        ? Number(yearQuery)
        : Number.NaN;

  if (!Number.isInteger(era) || era < 10000 || era > 99999) {
    return c.json(
      { error: `Invalid year '${yearQuery}'. Use a 5-digit Human Era year, e.g. 12026.` },
      400,
    );
  }

  const holidays = getHolidaysForYear(era).map((occ) => ({
    name: occ.holiday.name,
    category: occ.holiday.category,
    ghs_date: occ.ghsDate,
    gregorian: occ.gregorian.toISOString().slice(0, 10),
    ...(occ.gregorianEnd && { gregorian_end: occ.gregorianEnd.toISOString().slice(0, 10) }),
    description: occ.holiday.description,
  }));

  return c.json({ year: era, count: holidays.length, holidays });
});

// 5. Endpoint: Live-Badge für Shields.io (/badge.json)
// Liefert das Shields.io-JSON-Schema mit der zum Request-Zeitpunkt
// berechneten GHS-Zeit. `fullDate` rendert Aurora-Wochen bereits als
// `YYYYY.A.DD`, `beats` ist schon `@BBB` gepaddet.
app.get('/badge.json', (c) => {
  const ghs = getGHSDate(new Date());
  return c.json(
    {
      schemaVersion: 1,
      label: 'GHS NOW',
      message: `${ghs.fullDate} ${ghs.beats}`,
      color: 'blueviolet',
      labelColor: '555555',
    },
    200,
    { 'Cache-Control': 'public, max-age=60' },
  );
});
