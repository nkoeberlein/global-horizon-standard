/**
 * GHS Badge Endpoint
 *
 * Returns the current GHS date/time as a shields.io JSON endpoint response.
 * Deploy to any serverless platform (Deno Deploy, Vercel, Cloudflare Workers)
 * and use with: https://img.shields.io/endpoint?url=YOUR_URL
 *
 * Usage:
 *   deno run --allow-net tools/badge-endpoint.ts
 *   # or: npx ts-node tools/badge-endpoint.ts
 */

const MONTH_NAMES = [
  "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December", "January", "February", "Luna"
];

const WEEKDAY_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function isAuroraYear(yearHE: number): boolean {
  return (71 * yearHE + 156) % 400 < 71;
}

function getGHSNow(): { date: string; beats: string; monthName: string } {
  const now = new Date();
  const gregYear = now.getUTCFullYear();
  const yearHE = gregYear + 10000;

  let startOfYear = new Date(Date.UTC(gregYear, 2, 21));
  if (now < startOfYear) {
    startOfYear = new Date(Date.UTC(gregYear - 1, 2, 21));
  }

  const diffDays = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);

  const isAurora = diffDays >= 364;
  const month = isAurora ? "A" : String(Math.floor(diffDays / 28) + 1).padStart(2, "0");
  const day = isAurora ? diffDays - 364 + 1 : (diffDays % 28) + 1;
  const monthName = isAurora ? "Aurora" : MONTH_NAMES[Math.floor(diffDays / 28)];

  const totalSec = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
  const beats = Math.floor(totalSec / 86.4);

  return {
    date: `${yearHE}.${month}.${String(day).padStart(2, "0")}`,
    beats: `@${String(beats).padStart(3, "0")}`,
    monthName,
  };
}

/**
 * Returns a shields.io endpoint JSON object.
 * See: https://shields.io/badges/endpoint-badge
 */
function shieldsEndpoint() {
  const ghs = getGHSNow();
  return {
    schemaVersion: 1,
    label: "GHS Now",
    message: `${ghs.date} ${ghs.beats}`,
    color: "blueviolet",
    style: "for-the-badge",
  };
}

// --- Serve as HTTP endpoint (Deno Deploy / Deno CLI) ---
if (typeof Deno !== "undefined") {
  Deno.serve({ port: 8000 }, (_req: Request) => {
    return new Response(JSON.stringify(shieldsEndpoint()), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  });
} else {
  // Node.js / ts-node: just print the badge JSON
  console.log(JSON.stringify(shieldsEndpoint(), null, 2));
}
