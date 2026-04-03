# GHS UI

Shared React component library for the Global Horizon Standard.

## Exports

- `GHSAnalogClock` — Analog @Beats clock visualization (10-segment dial, 0–9, each segment = 100 beats)

## Usage

No build step required — consumed directly from TypeScript source by `ghs-web`.

```ts
import { GHSAnalogClock } from 'ghs-ui';
```

## Tech Stack

- React 19 (peer dependency)
- [`ghs-time`](../core/) for @Beats data
