# packages/cli — ghs-cli

Commander-based terminal CLI (`ghs` binary). CommonJS output via `tsc` (`moduleResolution: nodenext`).

## Key files
- `src/index.ts` — all commands: default (current time), `convert`, `clock`, `cal`, `holidays`
- `src/badge.ts` — minimal `fullDate @beats` output consumed by `.github/workflows/update-badge.yml`

## Patterns
- Parsing/validation comes from `ghs-time` (`parseGHSString`, `isGHSFormat`); errors go through the local `fail()` helper (stderr + exit 1)
- Version is read from `package.json` at runtime (`__dirname/../package.json`) — never hardcode it
- Test manually: `npm run build:cli && node packages/cli/dist/index.js <cmd>`

## Gotchas
- No `"type": "module"` — this package is CJS; `__dirname` is available, don't use `import.meta`
- `badge.ts` output format is consumed by the README badge gist — keep `YYYYY.MM.DD @BBB` stable
