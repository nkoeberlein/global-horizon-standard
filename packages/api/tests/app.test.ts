import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

interface ApiBody {
  status?: string;
  error?: string;
  year?: number;
  count?: number;
  endpoints?: Record<string, string>;
  timestamp_iso?: string;
  gregorian_utc?: string;
  ghs?: { fullDate?: string; beats?: string; formatted?: string };
  holidays?: Array<{ name: string; gregorian: string }>;
}

async function getJson(path: string): Promise<{ status: number; body: ApiBody }> {
  const res = await app.request(path);
  return { status: res.status, body: (await res.json()) as ApiBody };
}

describe('GET /', () => {
  it('reports status and endpoints', async () => {
    const { status, body } = await getJson('/');
    expect(status).toBe(200);
    expect(body.status).toBe('online');
    expect(body.endpoints?.holidays).toBeDefined();
  });
});

describe('GET /now', () => {
  it('returns the current GHS time', async () => {
    const { status, body } = await getJson('/now');
    expect(status).toBe(200);
    expect(body.ghs?.fullDate).toMatch(/^\d{5}\.(A|\d{2})\.\d{2}$/);
    expect(body.ghs?.beats).toMatch(/^@\d{3}$/);
    expect(body.timestamp_iso).toBeDefined();
  });

  it('honors a valid format parameter', async () => {
    const { status, body } = await getJson('/now?format=text');
    expect(status).toBe(200);
    expect(body.ghs?.formatted).not.toContain('@'); // "text" has no beats
  });

  it('rejects an unknown format with 400', async () => {
    const { status, body } = await getJson('/now?format=xyz');
    expect(status).toBe(400);
    expect(body.error).toContain('xyz');
  });
});

describe('GET /convert', () => {
  it('converts Gregorian → GHS', async () => {
    const { status, body } = await getJson('/convert?date=2026-03-18');
    expect(status).toBe(200);
    expect(body.ghs?.fullDate).toBe('12026.01.01');
  });

  it('converts GHS → Gregorian', async () => {
    const { status, body } = await getJson('/convert?date=12026.01.01');
    expect(status).toBe(200);
    expect(body.gregorian_utc).toBe('2026-03-18T00:00:00.000Z');
  });

  it('converts Aurora dates', async () => {
    const { status, body } = await getJson('/convert?date=12026.A.01');
    expect(status).toBe(200);
    expect(body.gregorian_utc).toBe('2027-03-17T00:00:00.000Z');
  });

  it('rejects a missing date parameter with 400', async () => {
    const { status } = await getJson('/convert');
    expect(status).toBe(400);
  });

  it('rejects out-of-range GHS components with 400', async () => {
    const { status, body } = await getJson('/convert?date=12026.14.01');
    expect(status).toBe(400);
    expect(body.error).toContain('month');
  });

  it('rejects the Aurora Week in a non-Aurora year with 400', async () => {
    const { status, body } = await getJson('/convert?date=12027.A.01');
    expect(status).toBe(400);
    expect(body.error).toContain('Aurora');
  });

  it('rejects unparseable input with 400', async () => {
    const { status } = await getJson('/convert?date=not-a-date');
    expect(status).toBe(400);
  });
});

describe('GET /holidays', () => {
  it('returns holidays for a given year with computed Gregorian dates', async () => {
    const { status, body } = await getJson('/holidays?year=12026');
    expect(status).toBe(200);
    expect(body.year).toBe(12026);
    const newYear = body.holidays?.find((h) => h.name === 'New Year (Equinox)');
    expect(newYear?.gregorian).toBe('2026-03-18');
  });

  it('includes the Aurora Festival only in Aurora years', async () => {
    const aurora = await getJson('/holidays?year=12026');
    const normal = await getJson('/holidays?year=12027');
    const hasAurora = (b: ApiBody) =>
      b.holidays?.some((h) => h.name === 'Aurora Festival') ?? false;
    expect(hasAurora(aurora.body)).toBe(true);
    expect(hasAurora(normal.body)).toBe(false);
  });

  it('defaults to the current year', async () => {
    const { status, body } = await getJson('/holidays');
    expect(status).toBe(200);
    expect(body.year).toBeGreaterThan(12000);
  });

  it('rejects an invalid year with 400', async () => {
    const { status } = await getJson('/holidays?year=abc');
    expect(status).toBe(400);
  });
});

describe('unknown routes', () => {
  it('returns a JSON 404', async () => {
    const { status, body } = await getJson('/nope');
    expect(status).toBe(404);
    expect(body.error).toContain('Not found');
  });
});
