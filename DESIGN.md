# Design

The site is a primary-colour Bauhaus poster that moves. One cloud of coloured points rebuilds itself as you scroll:
- your name;
- your portrait;
- a circle, square and triangle;
- a GPU die;
- a neural network;
- the Karlsruhe fan;
- an @.

Every section floods the page with its own ground colour. The owner asked for bright colours, crazy visuals and no dark sections (2026-10-16). This design replaces the quiet editorial version of 2026-10-15.

## Tokens (`src/styles.css`, `:root`)

| Role | Token | Value |
|---|---|---|
| Cream ground | `--cream` | `#F6F1E7` |
| Red (shapes, points) | `--red` | `#E63322` |
| Red ground (text on it) | `--red-deep` | `#D42A1A` (cream text 4.5:1) |
| Blue | `--blue` | `#1F4BFF` (cream text 5.3:1) |
| Yellow | `--yellow` | `#FFCB05` (ink text 12.4:1) |
| Ink | `--ink` | `#111111` |

**Chapters.** Each section declares `data-chapter` (cream, yellow, blue or red). `src/lib/chapters.js` sets `html[data-chapter]` for the section that crosses the middle of the screen. The page's `--bg`, `--fg`, `--fg-soft` and `--wash` then cross-fade to that chapter, and the mobile browser's theme colour follows. The order is:
1. Hero: cream.
2. Who: yellow.
3. Tapes: yellow.
4. Work: cream.
5. Research and the KIT photograph: blue.
6. Experience: cream.
7. About: yellow.
8. Contact: red.
9. Footer: cream.

## Type

The page uses two families:
- **Archivo Variable** (wdth 62–125, wght 100–900):
  - Display text is set at 900 weight, 125% width and uppercase.
  - Archivo is also the UI and text face.
- **Gelasio**: statements, roles, About prose, case-study problems.

Headings use `<Stretch>` (`src/lib/motion.jsx`). They widen from 62% to 125% width and thicken from 380 to 900 weight as they climb the screen. Their size is capped by `--chars`, so the longest line always fits the page.

## The particle field (`src/lib/field.js`, `src/lib/shapes.js`, `src/components/Field.jsx`)

**Rendering.**
- A single raw WebGL draw call: 15,000 points on desktop, 6,500 on phones. No three.js.
- The canvas is fixed under the page content. Text always reads above it.

**Stages.**
- Any element with `data-stage="name|portrait|bauhaus|chip|network|fan|at"` is a stage. Its shape is fitted inside the element's box, so the points scroll with the page.
- When the next stage comes within a screen of the middle, the points travel to it along curved paths, with a per-point delay.

**Shapes.**
- Text is sampled from Archivo on a canvas.
- The portrait is a stipple of the cut-out photograph (`portrait-cut.webp`): denser where the photo is darker, red for skin, ink and blue for hair and beard, blue for the shirt, and the strong edges in ink.
- The other shapes are generated.

**Colour.**
- Each point carries red, blue, yellow or ink.
- Each chapter remaps them (`PALETTES`), so no point disappears into its ground.

**Motion.**
- At rest the points breathe.
- Fast scrolling stretches them into streaks.
- The mouse pushes them aside (a finger does not: on glass it is a scroll). The push grows with pointer speed and is larger over `[data-reveal]`.
- On first load the points fly in from everywhere.
- Reduced motion snaps between shapes and turns off the breathing, streaks and intro.

## Signature interactions

- **Portrait peek (Who):** over the dotted portrait, a circle of the real photograph opens under the pointer, and the points part around it. On a phone, a tap on the dots opens the photograph from under the finger and another tap closes it. A button does the same for keyboards.
- **Shockwaves (`src/lib/wave.js`):**
  - Tap or click anywhere that is not a control. A ring of primary colour rolls out from that spot, shoves the points it passes and flips them to the next colour for a moment.
  - The hero badge sends the biggest wave, from the middle of the name.
  - Taps only: a swipe is always a scroll. Reduced motion drops the ring and the push.
- **Cursor:** a red dot plus a ring that lags behind and springs. Over controls the ring fills yellow. On `[data-cursor]` targets it shows a label: Open, Look, Boom, Write.
- **Magnetic controls:** anything marked `[data-magnetic]` leans toward the pointer.
- **Tapes:** two crossing strips of real tool names. They speed up and reverse with the scroll, and skew with scroll velocity.
- **Work:** on desktop the section pins, and vertical scroll moves a row of eight generated posters sideways. On phones and tablets nothing pins: the posters sit in a native swipe row that snaps one poster at a time.
  - Each poster's circle, square and triangle are seeded by the project id. They slide and turn at three depths as the poster crosses the screen.
  - Posters tilt in 3D under the pointer.
  - A View Transition grows the poster into the case study's problem plate.
- **15×:** a pinned scrub on desktop; on phones it counts as it travels up the screen, without holding the page. The figure counts from 1× to 15× while the latency bar for a critical request shrinks to one fifteenth.
- **Footer wordmark:** each letter swells in weight and width toward the pointer. When nothing is near, a slow wave runs through the name.
- **Intro curtain:** three primaries pop in and a count runs to 100. Three coloured panels then lift away while the points assemble the name. It shows once per session and never under reduced motion.
- **Smooth scrolling:** Lenis, for mouse and trackpad only. It pauses while a case study is open.

## Imagery

- **Portrait:** `public/images/portrait-cut.webp`, cut out from `portrait.jpg` (which stays as the social-card image). It appears as the dotted stipple and as the photograph revealed beneath it, standing on a blue disc.
- **KIT campus:** `public/world/kit.jpg`, CC BY 3.0, credited in its caption and in the footer. It is printed as a yellow-and-black duotone and opens from an inset as it enters.
- **Projects:** no pictures, by the owner's choice. Each poster's art is a generated composition, and the text sits on a solid ground.

## Rules

- Particle shapes may be abstract. Facts stay exactly as in `data.js`.
- Every effect has a reduced-motion path and a no-WebGL fallback: the h1 shows the real name, and the photograph is shown in full.
- Labels are sentence case, with no tracked micro-caps.

## Phones

`src/lib/media.js` decides: scroll-scrubbed effects need a fine pointer and at least 861px. Without them:
- nothing pins (Work swipes natively, 15× flows);
- `<Stretch>` headings make their widening move once, on arrival, instead of re-laying out on every scroll frame;
- the canvas is sized once to the large viewport (`100lvh`), so the address bar sliding never re-sizes or clears it;
- points in flight between shapes fade and travel a shorter distance, so they never cloud the text.
