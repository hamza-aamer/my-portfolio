# Design

The site reads like a magazine feature on one engineer: large type on white paper, real pictures, and one colour moment. It deliberately avoids the newsprint look of the previous version (cream paper, italic display, tracked monospace labels, mastheads, marquees).

## Tokens (`src/styles.css`, `:root`)

| Role | Token | Value | Use |
|---|---|---|---|
| Ground | `--paper` | `#FFFFFF` | Page. It matches the portrait's background, so the photo melts into the page. |
| Panel | `--paper-2` | `#F1F1F1` | Experience band, tags, filters, case-study bar buttons |
| Panel step | `--paper-3` | `#E6E6E6` | Timeline track, hover state of panels |
| Ink | `--ink` | `#111111` | Text, the primary button, footer ground |
| Soft ink | `--ink-soft` | `#575757` | Secondary text (7.2:1 on paper, 6.4:1 on panel) |
| Accent | `--accent` | `#2433FF` | Contact field, active filter, list markers, résumé link, button hover |
| Accent deep | `--accent-ink` | `#1A26CC` | Alternate contact rows, base of the Ascend stack diagram |
| Accent tint | `--accent-tint` | `#DFE2FF` | About highlights, diagram stages |
| On accent | `--on-accent` / `--on-accent-soft` | `#FFFFFF` / `#C9CDFF` | Text on the ultramarine field (7.0:1 / 4.56:1) |

Surfaces are separated by steps in tone, never by rules or shadows. Corners are square throughout. The only round shape is the arrow button in Contact.

## Type

- **Gelasio** 500/600 for display, headings, statements and figures. Tracking is −0.045em at display size and −0.015em at lead size.
- **Schibsted Grotesk Variable** for text, UI and captions.
- There are five sizes and no others: `--t-xxl` clamp(84px, 12.5vw, 204px), `--t-xl` clamp(36px, 5vw, 76px), `--t-l` clamp(22px, 2.15vw, 32px), `--t-m` 17px, `--t-s` 14px.
- Headlines are two lines at most at every width. Statements are `<p>` elements at `--t-l`.
- There is no monospace, no eyebrow labels and no index numbering. Dates use tabular figures (`.num`).

## Layout

- Margins `--m` are 24px (16px on phones). The gutter `--gap` is 16px. Sections are spaced `--section` apart: clamp(112px, 13vw, 200px).
- Each section has its own composition:
  - **Hero:** stepped two-line name over the portrait.
  - **Figures:** results set inside a sentence.
  - **Work:** staggered 4-column tiles with deliberately empty cells. The heading owns the empty cell in row 1.
  - **Research:** two giant figures compared, then the record.
  - **Experience:** line-up rows with span bars on a 2020–2027 axis.
  - **About:** two columns of lead-size prose with highlights.
  - **Contact:** display-size rows on ultramarine.
  - **Footer:** inverted, with a fitted full-width wordmark.
- Below 860px each section switches to its own phone composition. It is not a squeezed version of the desktop layout.

## Imagery

- **Portrait:** `public/images/portrait.jpg`, with the near-white background lifted to pure white. The original is `profile.jpg`.
- **Projects:** no pictures, by the owner's choice. The portrait is the only image of him, and the work is shown as information rather than imagery. Each tile is a typographic plate on `--paper-2` carrying the lead result (where one exists) and the one-line problem, and it turns accent-tint on hover. The plate morphs into the case study's opening "Problem" band.
- **KIT campus:** `public/world/kit.jpg`, an open-licence photograph used as the one full-bleed image between Research and Experience. It is credited in its caption, the footer and `public/world/credits.json`.
- **Process diagrams:** drawn in CSS from the stage labels of the original infographics (`design/reference/`):
  - Artisan: stages that widen.
  - Ant-AI: a staircase.
  - Ascend: a stack of layers that darkens toward the base.

## Motion (`src/lib/motion.jsx`, Motion 14)

- **Easing:** expo-out `[0.22, 1, 0.36, 1]` for every arrival. Press springs use 380/32, layout springs 260/30.
- **Signature:** the hero name lines rise out of masks, 110ms apart. The portrait opens like a shutter, settles from a 1.1 scale, and drifts slower than the page on scroll.
- **Case studies:** View Transitions API with shared `pic-<id>` (tile plate → problem band) and `title-<id>` names. Tiles only carry the names while no case study is open. Browsers without View Transitions get a Motion fade and rise.
- **Reveals:** each section reveals its parts in order, once:
  - Headings use mask lines.
  - Prose, lists and tags use staggered rises 60–90ms apart.
  - Pictures use the shutter.
  - Figures count up.
  - Timeline bars grow along X.
- **Layout:** filter reflow uses `AnimatePresence mode="popLayout"` with layout springs. Experience panels expand on the layout spring.
- **Rules:** only transforms, opacity and clip-path animate. `MotionConfig reducedMotion="user"` plus CSS fallbacks keep content and drop the travel, and view transitions are skipped under reduced motion.

## Components

- **Buttons:** `.button` is solid ink and square, at least 52px tall. It turns accent on hover and scales to 0.97 on press. `.filter`, `.case__step` and `.copy` are 44px panel buttons.
- **Links:** `.link` underlines at 35% opacity, rising to full on hover.
- **Case study:** `role="dialog"`, Esc closes, Tab is trapped, and focus moves to the title on open and back to the tile on close. Moving between case studies replaces the history entry, so one Back always leaves the overlay.
