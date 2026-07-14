# packages/ui — ghs-ui

Shared React component library. **No build step** — consumed directly from TypeScript source (`main: src/index.ts`); Vite in the consuming app transpiles it.

## Key files
- `src/GHSAnalogClock.tsx` — canvas-based decimal clock (day hand = 1000 beats/rev, beat hand = 100 beats/rev)
- `src/index.ts` — public exports

## Patterns
- Peer deps: React 19 — don't add runtime dependencies lightly, both web and (React 18) extension may consume components
- Canvas sizing (width/height/DPR) happens in a `useEffect` keyed on `size`, never inside the draw loop
- Repaint via `setInterval(100ms)`, not `requestAnimationFrame` — the beat hand only moves visibly ~1×/s

## Gotchas
- Draw functions must reset the transform (`ctx.setTransform`) and `clearRect` since the backing store is no longer recreated per frame
