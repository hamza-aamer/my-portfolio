import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { person } from '../data.js';
import { EASE } from '../lib/motion.jsx';
import { XRAY_EVENT } from './Pointer.jsx';
import { ArrowDown } from './Icons.jsx';

// Four flat primaries float around the name. Each drifts at its own depth
// with the scroll, and leans away from the pointer (or the phone's tilt).
const SHAPES = [
  { k: 'circle', depth: 0.9, spin: 0 },
  { k: 'square', depth: 0.5, spin: 70 },
  { k: 'tri', depth: 1.3, spin: -40 },
  { k: 'half', depth: 0.3, spin: 180 },
];

function Shape({ s, scroll, px, py }) {
  const y = useTransform(scroll, [0, 1], [0, -340 * s.depth]);
  const rotate = useTransform(scroll, [0, 1], [0, s.spin]);
  const x = useTransform(px, (v) => v * 36 * s.depth);
  const yy = useTransform(py, (v) => v * 36 * s.depth);
  return (
    <motion.span className={`hero__shape hero__shape--${s.k}`} style={{ y, rotate }}>
      <motion.span style={{ x, y: yy, display: 'block', width: '100%', height: '100%' }} />
    </motion.span>
  );
}

function XrayBadge() {
  const [on, setOn] = useState(false);
  const [fine] = useState(() => window.matchMedia('(pointer: fine)').matches);
  useEffect(() => {
    const onState = (e) => setOn(Boolean(e.detail));
    window.addEventListener('xray:state', onState);
    return () => window.removeEventListener('xray:state', onState);
  }, []);
  const text = fine ? 'Hold anywhere to x-ray the page · ' : 'Tap to x-ray the page · drag the lens · ';
  return (
    <button
      type="button"
      className="badge"
      aria-pressed={on}
      onClick={() => window.dispatchEvent(new CustomEvent(XRAY_EVENT))}
      data-magnetic
      data-cursor={on ? 'Off' : 'X-ray'}
    >
      <span className="sr">X-ray lens</span>
      <svg viewBox="0 0 200 200" aria-hidden="true" className="badge__ring">
        <defs>
          <path id="badge-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text><textPath href="#badge-path">{text}</textPath></text>
      </svg>
      <span className="badge__core" aria-hidden="true">{on ? 'On' : 'X'}</span>
    </button>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (reduce) return undefined;
    const onMove = (e) => {
      px.set((e.clientX / window.innerWidth - 0.5) * -2);
      py.set((e.clientY / window.innerHeight - 0.5) * -2);
    };
    const onTilt = (e) => {
      if (e.gamma == null) return;
      px.set(Math.max(-1, Math.min(1, e.gamma / 25)));
      py.set(Math.max(-1, Math.min(1, (e.beta - 45) / 25)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('deviceorientation', onTilt, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('deviceorientation', onTilt);
    };
  }, [px, py, reduce]);

  const up = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-name" data-chapter="cream">
      <div className="hero__shapes" aria-hidden="true">
        {SHAPES.map((s) => <Shape key={s.k} s={s} scroll={scrollYProgress} px={px} py={py} />)}
      </div>

      <h1 className="hero__name" id="hero-name" data-stage="name">
        <span>Hamza</span>
        <span>Aamer</span>
      </h1>

      <div className="hero__foot">
        <motion.p className="hero__line" {...up(1.2)}>{person.line}</motion.p>
        <motion.div className="hero__side" {...up(1.35)}>
          <p className="hero__now">
            Senior AI Engineer at{' '}
            <a className="link" href={person.now[0].href} target="_blank" rel="noreferrer">Aiden Risk</a>.
            Research assistant at KIT. Based in Karlsruhe.
          </p>
          <div className="hero__actions">
            <a className="button" href="#work" data-magnetic>
              See the work <ArrowDown />
            </a>
            <a className="link" href={person.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
          </div>
        </motion.div>
        <motion.div className="hero__badge" {...up(1.5)}>
          <XrayBadge />
        </motion.div>
      </div>
    </section>
  );
}
