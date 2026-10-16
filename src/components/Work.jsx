import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { person, projects } from '../data.js';
import { rng } from '../lib/shapes.js';
import { Stretch } from '../lib/motion.jsx';
import { useScrub } from '../lib/media.js';
import { ArrowRight, ArrowUpRight } from './Icons.jsx';

const GROUNDS = ['red', 'blue', 'yellow'];
const FILLS = {
  red: ['yellow', 'blue', 'cream'],
  blue: ['yellow', 'red', 'cream'],
  yellow: ['red', 'blue', 'ink'],
};

// Every poster gets its own arrangement of the three shapes, seeded by its
// name so it never changes between visits. Each shape sits at its own depth.
function Composition({ id, ground }) {
  const r = rng([...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7));
  const [a, b, c] = FILLS[ground];
  const cx = 18 + r() * 40;
  const cy = 14 + r() * 26;
  const cr = 15 + r() * 12;
  const ss = 16 + r() * 14;
  const sx = 52 + r() * 30;
  const sy = 6 + r() * 24;
  const tx = 30 + r() * 50;
  const th = 22 + r() * 16;
  const rot = Math.round(r() * 60 - 30);
  return (
    <svg className="poster__art" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="poster__layer poster__layer--1"><circle cx={cx} cy={cy} r={cr} className={`f-${a}`} /></g>
      <g className="poster__layer poster__layer--2">
        <rect x={sx} y={sy} width={ss} height={ss} className={`f-${b}`} transform={`rotate(${rot} ${sx + ss / 2} ${sy + ss / 2})`} />
      </g>
      <g className="poster__layer poster__layer--3"><polygon points={`${tx},${62 - th} ${tx + th * 0.62},62 ${tx - th * 0.62},62`} className={`f-${c}`} /></g>
    </svg>
  );
}

function Poster({ p, i, activeId, onFocusCard }) {
  const ground = GROUNDS[i % GROUNDS.length];
  const vt = activeId === null;
  const lead = p.outcome?.[0];
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--tx', 0);
    e.currentTarget.style.setProperty('--ty', 0);
  };
  // Only keyboard focus steers the row; a tap or click must never move the page.
  const onFocus = (e) => {
    if (onFocusCard && e.currentTarget.matches(':focus-visible')) onFocusCard(i);
  };
  return (
    <li className="work__item" data-card>
      <a
        className={`poster poster--${ground}`}
        id={`tile-${p.id}`}
        href={`#/work/${p.id}`}
        aria-label={`${p.title}: ${p.kind}. Open case study`}
        data-cursor="Open"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onFocus={onFocus}
      >
        <span className="poster__face" style={{ viewTransitionName: vt ? `pic-${p.id}` : 'none' }}>
          <span className="poster__art-wrap"><Composition id={p.id} ground={ground} /></span>
          <span className="poster__panel">
            <span className="poster__top">
              <span className="num">{p.year}</span>
              <span>{p.domainLabel}</span>
            </span>
            <span className="poster__title" style={{ viewTransitionName: vt ? `title-${p.id}` : 'none' }}>{p.title}</span>
            <span className="poster__kind">{p.kind}</span>
            {lead && (
              <span className="poster__figure">
                <b className="num">{lead.v}<small>{lead.u}</small></b>
                <span>{lead.l.split(',')[0]}</span>
              </span>
            )}
            <span className="poster__problem">{p.problem}</span>
            <span className="poster__open">Read the case study <ArrowRight size={16} /></span>
          </span>
        </span>
      </a>
    </li>
  );
}

function Intro({ as: Tag = 'li', lede }) {
  return (
    <Tag className="work__intro">
      <Stretch id="work-h" className="h2" lines={['Selected', 'work']} />
      <p className="work__lede">{lede}</p>
      <div className="work__stage" data-stage="bauhaus" aria-hidden="true" />
    </Tag>
  );
}

function End() {
  return (
    <li className="work__end">
      <a href={person.github} target="_blank" rel="noreferrer" className="work__more" data-cursor="GitHub">
        <span>More on<br />GitHub</span>
        <ArrowUpRight size={48} />
      </a>
    </li>
  );
}

// Each poster knows where it stands across the screen (−1 left, 0 centre,
// 1 right): its shapes slide and turn by that amount, at three depths.
// Returns the index of the poster nearest the centre.
function place(cards, centreOf) {
  const vw = window.innerWidth;
  let best = 0;
  let bestD = Infinity;
  cards.forEach((c, i) => {
    const p = (centreOf(c) - vw / 2) / vw;
    c.style.setProperty('--p', p.toFixed(3));
    if (Math.abs(p) < bestD) {
      bestD = Math.abs(p);
      best = i;
    }
  });
  return best;
}

// Desktop: the section pins, and the vertical scroll slides the row sideways.
function Pinned({ activeId }) {
  const section = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, (v) => -v * distance);
  const x = useSpring(raw, { stiffness: 400, damping: 60, mass: 0.4 });

  // The section is as tall as the track is wide, so scrolling down moves it sideways.
  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useMotionValueEvent(x, 'change', () => {
    const cards = track.current?.querySelectorAll('[data-card]');
    if (!cards) return;
    setIndex(place(cards, (c) => {
      const r = c.getBoundingClientRect();
      return r.left + r.width / 2;
    }));
  });

  // A keyboard user tabbing along the row brings each poster into view.
  const onFocusCard = (i) => {
    const card = track.current?.querySelectorAll('[data-card]')[i];
    if (!card || !section.current || !distance) return;
    const left = card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2;
    const progress = Math.min(1, Math.max(0, left / distance));
    const top = section.current.offsetTop + progress * (section.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: 'instant' });
  };

  return (
    <section
      className="work work--pinned"
      id="work"
      ref={section}
      aria-labelledby="work-h"
      data-chapter="cream"
      style={{ height: distance ? `calc(${distance}px + 100svh)` : undefined }}
    >
      <div className="work__pin">
        <motion.ol className="work__track" ref={track} style={{ x }}>
          <Intro lede="Eight projects: synthetic data, agents, vision and 3D, and systems in C. Keep scrolling and they slide past." />
          {projects.map((p, i) => (
            <Poster key={p.id} p={p} i={i} activeId={activeId} onFocusCard={onFocusCard} />
          ))}
          <End />
        </motion.ol>
        <div className="work__count num" aria-hidden="true">
          <span className="work__bar"><motion.span style={{ scaleX: scrollYProgress }} /></span>
          <span>{projects[index]?.title}</span>
        </div>
      </div>
    </section>
  );
}

// Phones and tablets: nothing pins. The posters sit in a row the thumb
// swipes natively, snapping one poster at a time; the page keeps scrolling.
function Swipe({ activeId }) {
  const rail = useRef(null);
  const [index, setIndex] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = rail.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      progress.set(max > 0 ? el.scrollLeft / max : 0);
      const cards = el.querySelectorAll('[data-card]');
      setIndex(place(cards, (c) => c.offsetLeft - el.scrollLeft + c.offsetWidth / 2));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [progress]);

  return (
    <section className="work work--swipe" id="work" aria-labelledby="work-h" data-chapter="cream">
      <Intro as="div" lede="Eight projects: synthetic data, agents, vision and 3D, and systems in C. Swipe along the row." />
      <ol className="work__rail" ref={rail} aria-label="Projects">
        {projects.map((p, i) => (
          <Poster key={p.id} p={p} i={i} activeId={activeId} />
        ))}
        <End />
      </ol>
      <div className="work__count num" aria-hidden="true">
        <span className="work__bar"><motion.span style={{ scaleX: progress }} /></span>
        <span>{index + 1} / {projects.length} · {projects[Math.min(index, projects.length - 1)]?.title}</span>
      </div>
    </section>
  );
}

export default function Work({ activeId }) {
  return useScrub() ? <Pinned activeId={activeId} /> : <Swipe activeId={activeId} />;
}
