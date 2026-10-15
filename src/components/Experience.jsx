import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { axis, experience, projectById } from '../data.js';
import { EASE, Item, SPRING_LAYOUT, Stagger, Stretch, rise } from '../lib/motion.jsx';
import { ArrowRight, Plus } from './Icons.jsx';

const years = [];
for (let y = axis.from; y <= axis.to; y += 1) years.push(y);
const pct = (v) => ((v - axis.from) / (axis.to - axis.from)) * 100;

function Row({ r, open, onToggle }) {
  const expandable = Boolean(r.owned);
  const panelId = `panel-${r.id}`;
  const left = pct(r.span[0]);
  const width = pct(r.span[1]) - left;

  return (
    <motion.li variants={rise} layout="position" transition={{ layout: SPRING_LAYOUT }} className={`row${open ? ' is-open' : ''}${r.now ? ' row--now' : ''}`}>
      <h3 className="row__h">
        <button
          type="button"
          className="row__button"
          aria-expanded={expandable ? open : undefined}
          aria-controls={expandable ? panelId : undefined}
          disabled={!expandable}
          onClick={onToggle}
        >
          <span className="row__role">
            {r.role}
            {expandable && <span className="row__toggle" aria-hidden="true"><Plus /></span>}
          </span>
          <span className="row__org">{r.org}</span>
          <span className="track" aria-hidden="true">
            <motion.span
              className="track__bar"
              style={{ left: `${left}%`, width: `${width}%` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            />
          </span>
          <span className="row__dates">{r.now ? 'Now · ' : ''}{r.dates}</span>
        </button>
      </h3>
      {r.now && r.href && (
        <p className="row__note">
          My current role.{' '}
          <a className="link" href={r.href} target="_blank" rel="noreferrer">aidenrisk.com</a>
        </p>
      )}
      <AnimatePresence initial={false}>
        {expandable && open && (
          <motion.div
            id={panelId}
            className="panel"
            role="region"
            aria-label={`${r.role}, ${r.org}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: EASE } }}
            transition={{ height: SPRING_LAYOUT, opacity: { duration: 0.4, ease: EASE } }}
          >
            <Stagger className="panel__inner" gap={0.06} whileInView={undefined} animate="show">
              <Item className="panel__owned">
                <h4>What I owned</h4>
                <ul className="points">{r.owned.map((o) => <li key={o}>{o}</li>)}</ul>
              </Item>
              <div className="panel__side">
                {r.impact && (
                  <Item>
                    <div className="impact" aria-label="Impact">
                      {r.impact.map((m) => <div key={m.l}><b>{m.v}</b><span>{m.l}</span></div>)}
                    </div>
                  </Item>
                )}
                <Item>
                  <h4>Stack</h4>
                  <ul className="tags tags--paper">{r.stack.map((s) => <li key={s}>{s}</li>)}</ul>
                </Item>
                {r.built && (
                  <Item>
                    <h4>Built here</h4>
                    <div className="built">
                      {r.built.map((id) => (
                        <a key={id} href={`#/work/${id}`}>
                          {projectById[id].title} <ArrowRight size={16} />
                        </a>
                      ))}
                    </div>
                  </Item>
                )}
              </div>
            </Stagger>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Experience() {
  const [open, setOpen] = useState(() => new Set(['adept']));
  const toggle = (id) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  return (
    <section className="experience" id="experience" aria-labelledby="experience-h" data-chapter="cream">
      <div className="experience__top">
        <Stretch id="experience-h" className="h2" lines={['Experience']} />
        <div className="experience__stage" data-stage="network" aria-hidden="true" />
      </div>
      <div className="lineup__head">
        <div className="axis" aria-hidden="true">
          {years.filter((y) => y < axis.to).map((y) => <span key={y} style={{ left: `${pct(y)}%` }}>{y}</span>)}
        </div>
      </div>
      <LayoutGroup>
        <Stagger as="ol" className="lineup" gap={0.08}>
          {experience.map((r) => (
            <Row key={r.id} r={r} open={open.has(r.id)} onToggle={() => toggle(r.id)} />
          ))}
        </Stagger>
      </LayoutGroup>
    </section>
  );
}
