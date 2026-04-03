# GHS Browser Extension

A browser extension that displays live GHS time — @Beats decimal time and 13-month calendar — directly in your browser toolbar.

## Features

- Live @Beats display, updated every ~10 centibeats (≈8.64 seconds)
- Current GHS date: month, weekday, and Human Era year
- Aurora Year indicator
- Link to the GHS web dashboard

## Build

```bash
# From repo root
npm install
npm run build:core

# Build the extension
cd packages/extension
npm run build
```

The output is in `dist/`. Load it as an unpacked extension in your browser.

## Installation (Developer Mode)

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder

## Tech Stack

- React 18, Vite, Tailwind CSS 4
- Manifest V3
- [`ghs-time`](../core/) for all calendar and time logic
- Background service worker using the `alarms` API for periodic updates
