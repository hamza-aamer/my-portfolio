# Hamza Aamer: portfolio

Source for [its-hamza.com](https://its-hamza.com). It is a single page with full-screen case studies at `#/work/<id>`.

## Stack

- Vite + React 19
- [Motion](https://motion.dev) for scroll reveals, layout springs (filter reflow, timeline) and the hero entrance
- The View Transitions API for the shared-element morph into a case study. Browsers without it fall back to a Motion crossfade, and `prefers-reduced-motion` turns both off.
- Gelasio (display) and Schibsted Grotesk (text), self-hosted through Fontsource

## Running locally

```
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview
```

## Where things live

```
src/data.js              all content: projects, research, experience, education
src/components/          one file per section, plus CaseStudy.jsx
src/lib/motion.jsx       reveal, mask-line, shutter and count-up primitives
src/lib/route.js         hash routing for case studies, wrapped in view transitions
src/styles.css           tokens first, then sections in page order
public/world/            the KIT campus photograph and its credit (credits.json)
design/reference/        the original process infographics, redrawn in the case studies
PRODUCT.md               product facts and content rules
DESIGN.md                the visual system
```

Facts come from `public/resume.pdf`. Where the résumé and older copy disagree, the résumé wins. Every case-study section is optional: if a field is missing, that section is left out rather than filled with placeholder text.

## Deploying

`.github/workflows/deploy.yml` builds `dist/` and publishes it to GitHub Pages. Under Settings → Pages, the repository's source must be **GitHub Actions**. `public/CNAME` keeps the custom domain.
