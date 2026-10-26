import { useEffect, useRef } from 'react';
import { kitPicture, person } from '../data.js';

const credits = [kitPicture];
const WORD = 'HAMZA AAMER';

// The name across the foot of the page, letter by letter. Each letter swells
// toward the pointer (or a finger), and when nothing is near, a slow wave
// passes through the name on its own.
function Wordmark() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const letters = [...el.querySelectorAll('[data-l]')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999, near: 0 };
    const state = letters.map(() => ({ w: 400, s: 90 }));
    let raf = 0;
    let visible = false;

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const box = el.getBoundingClientRect();
      const inside = pointer.y > box.top - 160 && pointer.y < box.bottom + 160;
      pointer.near += ((inside ? 1 : 0) - pointer.near) * 0.08;
      // All the reading happens before any writing, so the browser lays
      // the name out once per frame instead of once per letter.
      const centres = letters.map((l) => {
        const r = l.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      letters.forEach((l, i) => {
        const d = Math.abs(pointer.x - centres[i]) / Math.max(240, box.width * 0.22);
        const hit = Math.max(0, 1 - d) * pointer.near;
        const wave = (Math.sin(now / 700 - i * 0.6) + 1) / 2 * (1 - pointer.near);
        const amt = Math.max(hit, wave * 0.85);
        const tw = 250 + amt * 650;
        const ts = 70 + amt * 55;
        state[i].w += (tw - state[i].w) * 0.18;
        state[i].s += (ts - state[i].s) * 0.18;
        l.style.fontVariationSettings = `'wght' ${state[i].w.toFixed(0)}, 'wdth' ${state[i].s.toFixed(1)}`;
      });
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
    };
  }, []);
  return (
    <p className="footer__mark" ref={ref} aria-label={person.name}>
      {[...WORD].map((c, i) => (
        <span key={i} data-l aria-hidden="true" className={c === ' ' ? 'footer__gap' : undefined}>{c === ' ' ? '\u00a0' : c}</span>
      ))}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="footer" data-chapter="cream">
      <div className="footer__cols">
        <div className="footer__col">
          <span>Contact</span>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <span>{person.city}</span>
        </div>
        <nav className="footer__col" aria-label="Footer">
          <span>Sections</span>
          <a href="#work">Selected work</a>
          <a href="#research">Research</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </nav>
        <div className="footer__col">
          <span>Elsewhere</span>
          <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={person.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
        </div>
        <div className="footer__col">
          <span>Now</span>
          {person.now.map((r) => <span key={r.org}>{r.role}, {r.org}</span>)}
          {person.next && <span>From {person.next.from}: {person.next.role}, {person.next.org}</span>}
        </div>
        <p className="footer__credits">
          Photograph of the KIT campus:{' '}
          {credits.map((c, i) => (
            <span key={c.src}>
              <a href={c.href} target="_blank" rel="noreferrer">{c.credit}</a>, {c.licence}{i < credits.length - 1 ? '; ' : '.'}
            </span>
          ))}{' '}
          Via Wikimedia Commons.
        </p>
      </div>
      <div />
      <div>
        <Wordmark />
        <div className="footer__legal">
          <span>© 2026 {person.name}</span>
          <span>its-hamza.com</span>
        </div>
      </div>
    </footer>
  );
}
