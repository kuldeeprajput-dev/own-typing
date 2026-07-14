# OwnType

OwnType is a focused typing-speed test built with Next.js. It measures words per minute, raw speed, accuracy, and errors while keeping the interaction responsive enough for fast typists.

## Features

- 15, 30, and 60 second tests
- Optional punctuation, numbers, and capital letters
- Live WPM, accuracy, and countdown stats
- Six keyboard themes with light and dark modes
- Optional key sounds, haptics, and virtual keyboard
- Local result history and performance chart
- Installable web-app manifest and social sharing metadata

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run lint
npm run build
npm run start
```

## Production URL

Vercel deployments use `VERCEL_PROJECT_PRODUCTION_URL` automatically. On other hosts, set `NEXT_PUBLIC_SITE_URL` to the deployed origin so canonical links, the sitemap, robots metadata, and structured data use the correct URL.

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
```

When no deployment URL is available, or the value is invalid, the app falls back to `http://localhost:3000` for local development.

## Project structure

- `app/` — page shell, metadata, manifest, robots, and sitemap
- `components/` — typing interface, keyboard, settings, history, and results
- `hooks/useTypingEngine.ts` — timer, input transitions, counters, and test state
- `context/KeyboardSettingsContext.tsx` — persisted display and feedback preferences
- `utils/` — word generation, statistics, and local storage helpers
- `public/` — favicon set, social preview, and the keyboard sound sprite

The typing engine keeps counters incrementally and publishes the timer once per visible second. The caret is attached directly to the active character, so typing does not trigger layout measurement on every key.

## Replacing temporary brand assets

The current favicon set and `public/og-preview.jpg` are temporary. Replace the files in `public/` while keeping the same names and dimensions:

- `favicon-16x16.png` and `favicon-32x32.png`
- `apple-touch-icon.png` at 180×180
- `own-type-icon-192.png` at 192×192
- `own-type-favicon-512.png` at 512×512
- `og-preview.jpg` at 1200×630

Typing history and preferences stay in the browser's local storage; the app does not send test results to a server.
