# packages/api — ghs-api

Hono HTTP API serving GHS time, conversions, and holidays. Type-checked with `tsc --noEmit`, run with `tsx`.

## Key files
- `src/app.ts` — the Hono app and all routes (`/`, `/now`, `/convert`, `/holidays`). Exported for tests.
- `src/index.ts` — entrypoint only: `serve(app)` on `PORT` (default 3000)
- `tests/app.test.ts` — endpoint tests via `app.request()`, no server needed

## Patterns
- Input validation via core: `parseGHSString`, `isGHSFormat`; `RangeError` becomes HTTP 400 in `app.onError`
- All error responses are JSON with an `error` field (incl. 404 via `app.notFound`)
- Keep route logic thin — calendar logic belongs in `ghs-time`, not here

## Gotchas
- Tests import `../src/app` but `ghs-time` resolves to `packages/core/dist` — build core before running Vitest
- `npm run build` here only type-checks (includes `tests/`), it emits nothing
