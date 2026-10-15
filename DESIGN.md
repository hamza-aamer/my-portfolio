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
- The portrait is a four-tone halftone of `portrait.jpg`.
- The other shapes are generated.

**Colour.**
- Each point carries red, blue, yellow or ink.
- Each chapter remaps them (`PALETTES`), so no point disappears into its ground.

**Motion.**
- At rest the points breathe.
- Fast scrolling stretches them into streaks.
- The pointer, or a finger, pushes them aside. The push grows with pointer speed and is larger over `[data-reveal]`.
- On first load the points fly in from everywhere.
- Reduced motion snaps between shapes and turns off the breathing, streaks and intro.

## Signature interactions

- **Portrait peek (Who):** over the dotted portrait, a circle of the real photograph opens under the pointer, and the points part around it. A button shows the whole photograph, for touch and keyboard users.
- **X-ray lens (`src/components/Pointer.jsx`):**
  - Hold anywhere on desktop, or switch on X-ray in the header or with the hero badge.
  - The lens turns whatever is under it into a blue and white blueprint, using a backdrop-filter invert plus a blue screen blend.
  - It overlays the page's 12-column grid and an 8px baseline.
  - It reads out the element at its centre: tag, typeface, weight, size and box, or the WebGL stage and its point count.
  - On touch the lens sits mid-screen and is dragged with a thumb.
  - Esc turns it off.
- **Cursor:** a red dot plus a ring that lags behind and springs. Over controls the ring fills yellow. On `[data-cursor]` targets it shows a label: Open, Look, X-ray, Write.
- **Magnetic controls:** anything marked `[data-magnetic]` leans toward the pointer.
- **Tapes:** two crossing strips of real tool names. They speed up and reverse with the scroll, and skew with scroll velocity.
- **Work:** the section pins, and vertical scroll moves a row of eight generated posters sideways.
  - Each poster's circle, square and triangle are seeded by the project id. They slide and turn at three depths as the poster crosses the screen.
  - Posters tilt in 3D under the pointer.
  - A View Transition grows the poster into the case study's problem plate.
- **15×:** a pinned scrub. The figure counts from 1× to 15× while the latency bar for a critical request shrinks to one fifteenth.
- **Footer wordmark:** each letter swells in weight and width toward the pointer. When nothing is near, a slow wave runs through the name.
- **Intro curtain:** three primaries pop in and a count runs to 100. Three coloured panels then lift away while the points assemble the name. It shows once per session and never under reduced motion.
- **Smooth scrolling:** Lenis, for mouse and trackpad only. It pauses while a case study is open.

## Imagery

- **Portrait:** `public/images/portrait.jpg`. It appears as the dotted halftone and as the photograph revealed beneath it, multiplied onto the yellow.
- **KIT campus:** `public/world/kit.jpg`, CC BY 3.0, credited in its caption and in the footer. It is printed as a yellow-and-black duotone and opens from an inset as it enters.
- **Projects:** no pictures, by the owner's choice. Each poster's art is a generated composition, and the text sits on a solid ground.

## Rules

- Particle shapes may be abstract. Facts stay exactly as in `data.js`.
- Every effect has a reduced-motion path and a no-WebGL fallback: the h1 shows the real name, and the photograph is shown in full.
- Labels are sentence case, with no tracked micro-caps.
