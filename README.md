# Hamza Aamer — Portfolio

Personal portfolio site with two fully designed versions: an editorial desktop experience and a native-feeling mobile build.

## Versions

- **`desktop.html`** — full desktop / web portfolio. Horizontal-pin work carousel, topographic contour background, editorial typography, affiliations marquee with black inverse band, timeline, playground, contact.
- **`/mobile/`** — mobile build. Full-bleed, stacked sections, tab-bar nav, swipeable work cards, mobile-tuned type scale.
- **`index.html`** — UA-based router: mobile → `/mobile/`, desktop → `desktop.html`.

## Stack

- Vanilla HTML / CSS / JS for desktop
- React 18 + Babel standalone (inline JSX) for mobile build
- Three.js for the topographic contour shader on desktop
- No build step — every page opens directly in a browser

## Layout

```
.
├── index.html               # UA-based router (mobile → /mobile/, desktop → desktop.html)
├── desktop.html             # desktop build
├── mobile/
│   └── index.html           # mobile build
│
├── styles.css               # mobile styles
├── components/              # mobile React components
│   ├── Top.jsx              # hero, manifesto, affiliations
│   ├── Work.jsx             # work carousel
│   ├── Rest.jsx             # timeline, playground, contact
│   └── topo.js              # mobile topo canvas
│
├── portfolio/               # desktop assets
│   ├── styles.css           # desktop styles
│   ├── lib-*.js             # desktop feature scripts
│   └── ...
│
├── assets/                  # shared images, icons, data
├── frames/                  # device-frame starter component
└── screenshots/             # design exploration captures
```

## Running locally

No build. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design notes

- Warm paper palette (`#f3efe6` / `#1a1916`), single orange accent (`#b8502c`) and muted green (`#3b5a4a`).
- Instrument Serif for display, Inter for UI, JetBrains Mono for metadata.
- Editorial rhythm on desktop: paper → black marquee band → paper → black footer band creates visual breathing.
- Mobile treats the whole hero as a newspaper front-page "issue" — edition number, timestamp, now-playing strip, portrait tile, masthead title, and a stats rail above the tab bar.
