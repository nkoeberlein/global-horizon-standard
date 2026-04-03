import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getGHSDate, parseGHSDate, formatGHS } from 'ghs-time';

const app = new Hono();

// CORS aktivieren, damit jede Website (auch dein Dashboard) die API anfragen darf
app.use('/*', cors());

// 1. Root / Healthcheck
app.get('/', (c) => {
    return c.json({
        status: 'online',
        protocol: 'Global Horizon Standard (GHS)',
        endpoints: {
            now: '/now',
            convert: '/convert?date=YYYY-MM-DD'
        }
    });
});

// 2. Endpoint: Aktuelle Zeit (/now)
app.get('/now', (c) => {
    const format = c.req.query('format'); // Optional: ?format=ui
    const ghs = getGHSDate(new Date());

    return c.json({
        timestamp_iso: new Date().toISOString(),
        ghs: {
            era: ghs.era,
            month: ghs.month,
            monthName: ghs.monthName,
            day: ghs.day,
            beats: ghs.beats,
            isAuroraWeek: ghs.isAuroraWeek,
            fullDate: ghs.fullDate,
            formatted: format ? formatGHS(ghs, format as any) : formatGHS(ghs, "core")
        }
    });
});

// 3. Endpoint: Konvertierung (/convert?date=...)
app.get('/convert', (c) => {
    const dateQuery = c.req.query('date');

    if (!dateQuery) {
        return c.json({ error: "Missing 'date' parameter. Example: /convert?date=2026-04-02" }, 400);
    }

    // Check if it's a GHS Date (e.g. 12026.01.15)
    const ghsRegex = /^(\d{5})\.(A|\d{2})\.(\d{2})(?:\s+@([\d.]+))?$/i;
    const match = dateQuery.match(ghsRegex);

    if (match) {
        // Convert GHS -> Gregorian
        const era = parseInt(match[1], 10);
        const month = match[2].toUpperCase() === 'A' ? 'A' : parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        const beats = match[4] ? parseFloat(match[4]) : 0;

        const gregorian = parseGHSDate(era, month, day, beats);
        return c.json({
            input_ghs: dateQuery,
            gregorian_utc: gregorian.toISOString()
        });
    }

    // Convert Gregorian -> GHS
    const date = new Date(dateQuery);
    if (isNaN(date.getTime())) {
        return c.json({ error: "Invalid date format. Use ISO format (YYYY-MM-DD) or GHS (YYYYY.MM.DD)." }, 400);
    }

    const ghs = getGHSDate(date);
    return c.json({
        input_gregorian: date.toISOString(),
        ghs: {
            era: ghs.era,
            fullDate: ghs.fullDate,
            beats: ghs.beats,
            formatted: formatGHS(ghs, "ui")
        }
    });
});

// Server starten
const port = parseInt(process.env.PORT ?? '3000', 10);
console.log(`🌍 GHS API is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port
});