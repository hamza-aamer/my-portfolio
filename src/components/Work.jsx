import { useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { domains, projects } from '../data.js';
import { EASE, MaskLines, SPRING_LAYOUT } from '../lib/motion.jsx';

// The staggered pattern from the direction sheet, repeated every three rows:
// row 1: wide (cols 1–2) + single (col 4), the heading owns col 3;
// row 2: singles in cols 2 and 3; row 3: wide (cols 3–4) + single (col 1).
const PATTERN = [
  { col: '1 / span 2', ratio: '3 / 2', wide: true },
  { col: '4 / span 1', ratio: '4 / 5' },
  { col: '2 / span 1', ratio: '4 / 5' },
  { col: '3 / span 1', ratio: '4 / 5' },
  { col: '3 / span 2', ratio: '3 / 2', wide: true },
  { col: '1 / span 1', ratio: '4 / 5' },
];

function place(i) {
  const slot = PATTERN[i % PATTERN.length];
  const row = Math.floor(i / 2) + 1;
  return { ...slot, row };
}

function Tile({ p, i, activeId, narrow }) {
  const slot = place(i);
  // Shared-element names exist only while no case study is open, so the
  // picture and title can morph into the full-screen view and back.
  const vt = activeId === null;
  // On a phone every plate runs the full width: the text inside needs it.
  const style = narrow ? { gridColumn: '1 / -1' } : { gridColumn: slot.col, gridRow: slot.row };
  const lead = p.outcome?.[0];

  return (
    <motion.li
      layout
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.22, ease: EASE } }}
      transition={{ layout: SPRING_LAYOUT, opacity: { duration: 0.5, ease: EASE, delay: 0.04 * (i % 4) }, y: { duration: 0.7, ease: EASE, delay: 0.04 * (i % 4) } }}
    >
      <a className="tile" id={`tile-${p.id}`} href={`#/work/${p.id}`} aria-label={`${p.title}: ${p.kind}. Open case study`}>
        <div
          className={`tile__plate${slot.wide ? ' tile__plate--wide' : ''}`}
          style={{ aspectRatio: narrow ? 'auto' : slot.ratio, viewTransitionName: vt ? `pic-${p.id}` : 'none' }}
        >
          {lead && (
            <div>
              <p className="tile__figure num">{lead.v}<small>{lead.u}</small></p>
              <p className="tile__figure-label">{lead.l.split(',')[0]}</p>
            </div>
          )}
          <p className="tile__problem">{p.problem}</p>
        </div>
        <div className="tile__caption">
          <span className="tile__name" style={{ viewTransitionName: vt ? `title-${p.id}` : 'none' }}>
            <span>{p.title}</span>
            <span className="tile__kind">{p.kind}</span>
          </span>
          <span className="tile__meta num">{p.year} · {p.domainLabel}</span>
        </div>
      </a>
    </motion.li>
  );
}

export default function Work({ activeId, narrow }) {
  const [filter, setFilter] = useState('all');
  const reduce = useReducedMotion();
  const counts = useMemo(
    () => Object.fromEntries(domains.map((d) => [d.id, d.id === 'all' ? projects.length : projects.filter((p) => p.domains.includes(d.id)).length])),
    [],
  );
  const shown = filter === 'all' ? projects : projects.filter((p) => p.domains.includes(filter));

  return (
    <section className="section work" id="work" aria-labelledby="work-h">
      <LayoutGroup>
        <ul className="work__grid">
          <motion.li className="work__head" layout="position" transition={{ layout: SPRING_LAYOUT }}>
            <MaskLines as="h2" id="work-h" className="h2" lines={['Selected', 'work']} />
            <div className="filters" role="group" aria-label="Filter by domain">
              {domains.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className="filter"
                  aria-pressed={filter === d.id}
                  onClick={() => setFilter(d.id)}
                >
                  {d.label}
                  <span className="filter__count">{counts[d.id]}</span>
                </button>
              ))}
            </div>
            <p className="sr" aria-live="polite">{shown.length} projects shown</p>
          </motion.li>
          <AnimatePresence mode="popLayout" initial={!reduce}>
            {shown.map((p, i) => (
              <Tile key={p.id} p={p} i={i} activeId={activeId} narrow={narrow} />
            ))}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </section>
  );
}
