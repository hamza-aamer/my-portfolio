import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { projectById, projects } from '../data.js';
import { canTransition } from '../lib/route.js';
import { Count, EASE, Item, Stagger } from '../lib/motion.jsx';
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from './Icons.jsx';

const GROUNDS = ['red', 'blue', 'yellow'];

function Approach({ p }) {
  if (!p.approach) return null;
  const variant = p.diagram ? ` approach--${p.diagram}` : '';
  return (
    <section aria-labelledby="case-approach">
      <h2 id="case-approach">Approach</h2>
      <Stagger as="ol" className={`approach${variant}`} gap={0.07}>
        {p.approach.map((a, k) => (
          <Item as="li" key={a.h} style={{ '--k': k }}>
            <h3>{a.h}</h3>
            <p>{a.p}</p>
          </Item>
        ))}
      </Stagger>
    </section>
  );
}

// Moving between case studies replaces the history entry, so a single Back
// (or Close) always leaves the overlay instead of stepping through each one.
const step = (e, to) => {
  e.preventDefault();
  window.location.replace(`#/work/${to}`);
};

export default function CaseStudy({ id, onClose }) {
  const p = projectById[id];
  const index = projects.findIndex((x) => x.id === id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const scroller = useRef(null);
  const heading = useRef(null);
  const reduce = useReducedMotion();
  // When the browser morphs the shared elements itself, Motion stays out of the way.
  const native = useRef(canTransition()).current;

  useEffect(() => {
    document.documentElement.classList.add('is-locked');
    return () => {
      document.documentElement.classList.remove('is-locked');
      document.getElementById(`tile-${id}`)?.focus({ preventScroll: true });
    };
  }, [id]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0;
    heading.current?.focus({ preventScroll: true });
  }, [id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && scroller.current) {
        const f = scroller.current.querySelectorAll('a[href], button:not([disabled])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!p) return null;
  const enter = native || reduce ? false : { opacity: 0, y: 40 };

  return (
    <motion.div
      ref={scroller}
      className={`case case--${GROUNDS[index % GROUNDS.length]}`}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      initial={enter}
      animate={{ opacity: 1, y: 0 }}
      exit={native || reduce ? undefined : { opacity: 0, y: 24, transition: { duration: 0.25, ease: EASE } }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="case__bar">
        <button type="button" className="case__close" onClick={onClose}>
          <Close size={16} /> Close
        </button>
        <nav className="case__steps" aria-label="Other case studies">
          <a className="case__step" href={`#/work/${prev.id}`} onClick={(e) => step(e, prev.id)} aria-label={`Previous: ${prev.title}`}>
            <ArrowLeft size={16} /> <span className="case__step-name">{prev.title}</span><span className="case__step-short">Previous</span>
          </a>
          <a className="case__step" href={`#/work/${next.id}`} onClick={(e) => step(e, next.id)} aria-label={`Next: ${next.title}`}>
            <span className="case__step-name">{next.title}</span><span className="case__step-short">Next</span> <ArrowRight size={16} />
          </a>
        </nav>
      </div>

      <header className="case__head">
        <Stagger as="dl" className="case__meta" gap={0.05}>
          <Item><dt className="sr">Year</dt><dd><strong className="num">{p.date}</strong></dd></Item>
          <Item><dt className="sr">Domain</dt><dd>{p.domainLabel}</dd></Item>
          {p.where && <Item><dt className="sr">Where</dt><dd>{p.where}</dd></Item>}
        </Stagger>
        <h1 id="case-title" ref={heading} tabIndex={-1} className="case__title" style={{ viewTransitionName: `title-${p.id}` }}>
          {p.title}
        </h1>
        <motion.p
          className="case__kind"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
        >
          {p.kind}
        </motion.p>
      </header>

      <section className="case__plate" style={{ viewTransitionName: `pic-${p.id}` }} aria-labelledby="case-problem">
        <h2 id="case-problem">Problem</h2>
        <p className="case__problem">{p.problem}</p>
      </section>

      <div className="case__body">
        <aside className="case__aside" aria-label="Facts">
          {p.role && (
            <section>
              <h2>Role</h2>
              <p>{p.role}</p>
            </section>
          )}
          <section>
            <h2>Stack</h2>
            <ul className="tags">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>
          </section>
          <section>
            <h2>Source</h2>
            {p.href ? (
              <a className="link" href={p.href} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                Code on GitHub <ArrowUpRight size={16} />
              </a>
            ) : p.proprietary ? (
              <p className="case__proprietary">Client work, not public. Details on request.</p>
            ) : (
              <p className="case__proprietary">No public repository.</p>
            )}
          </section>
        </aside>

        <div className="case__main">
          <Approach p={p} />

          {(p.outcome || p.note) && (
            <section aria-labelledby="case-outcome">
              <h2 id="case-outcome">Outcome</h2>
              {p.outcome && (
                <Stagger className="case__outcome" gap={0.1}>
                  {p.outcome.map((o) => (
                    <Item key={o.l}>
                      <b><Count value={o.v} />{o.u && <small>{o.u}</small>}</b>
                      <span className="case__outcome-label">{o.l}</span>
                    </Item>
                  ))}
                </Stagger>
              )}
              {p.note && <p className="case__note">{p.note}</p>}
            </section>
          )}
        </div>
      </div>

      <a className="case__next" href={`#/work/${next.id}`} onClick={(e) => step(e, next.id)}>
        <span>Next case study</span>
        <strong>{next.title}</strong>
      </a>
    </motion.div>
  );
}
