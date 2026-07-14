# packages/extension — ghs-extension

Browser extension (Manifest V3) showing live GHS time. React 18 + Vite + `vite-plugin-web-extension`.

## Key files
- `src/background.ts` — MV3 service worker; updates the action badge with current beats via `chrome.alarms` (1-min minimum → badge can lag up to ~1 beat)
- `src/popup/popup.tsx` — popup UI (beats, date, Aurora badge)
- `src/popup/index.tsx` — popup entry
- `manifest.json` — permissions: `alarms`, `storage`
- `vite.config.ts` — aliases `ghs-time` to core source (exFAT symlink workaround)

## Patterns
- React 18 here (not 19) — don't import `ghs-ui` components without checking peer-dep compatibility
- Popup polls every 864 ms (≈10 centibeats)

## Gotchas
- Build from within the package: `cd packages/extension && npm run build`
- Buttons need explicit `type="button"` (Biome a11y rule)
