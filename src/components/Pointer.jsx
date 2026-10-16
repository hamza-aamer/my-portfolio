import { useEffect, useRef } from 'react';

// The pointer layer, for mice and trackpads only: a cursor dot and a ring
// that lags behind it, labels over targets, and magnetic controls.

export default function Pointer() {
  const dot = useRef(null);
  const ring = useRef(null);
  const ringLabel = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return undefined;
    root.classList.add('has-cursor');

    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2, rx: window.innerWidth / 2, ry: window.innerHeight / 2 };
    let label = '';
    let magnet = null;
    let raf = 0;
    let shown = false;

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      p.x = e.clientX;
      p.y = e.clientY;
      if (!shown) {
        shown = true;
        p.rx = p.x;
        p.ry = p.y;
        root.classList.add('cursor-in');
      }
      const t = e.target instanceof Element ? e.target : null;
      const interactive = t?.closest('a, button, [data-cursor]');
      const nextLabel = interactive?.closest('[data-cursor]')?.dataset.cursor ?? '';
      if (nextLabel !== label) {
        label = nextLabel;
        if (ringLabel.current) ringLabel.current.textContent = label;
      }
      ring.current?.classList.toggle('is-hover', Boolean(interactive));
      ring.current?.classList.toggle('has-label', Boolean(label));

      // Magnetic controls lean toward the pointer while it is over them.
      const m = t?.closest('[data-magnetic]');
      if (magnet && magnet !== m) {
        magnet.style.translate = '';
        magnet = null;
      }
      if (m && !reduce) {
        const r = m.getBoundingClientRect();
        const dx = (p.x - (r.left + r.width / 2)) * 0.32;
        const dy = (p.y - (r.top + r.height / 2)) * 0.32;
        m.style.translate = `${dx}px ${dy}px`;
        magnet = m;
      }
    };
    const onDown = (e) => {
      if (e.pointerType === 'mouse') ring.current?.classList.add('is-down');
    };
    const onUp = () => ring.current?.classList.remove('is-down');
    const onLeave = () => {
      shown = false;
      root.classList.remove('cursor-in');
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const k = reduce ? 1 : 0.2;
      p.rx += (p.x - p.rx) * k;
      p.ry += (p.y - p.ry) * k;
      if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${p.rx}px, ${p.ry}px, 0)`;
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('blur', onUp);
    root.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove('has-cursor', 'cursor-in');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', onUp);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <div className="cursor cursor--ring" ref={ring} aria-hidden="true"><span ref={ringLabel} /></div>
      <div className="cursor cursor--dot" ref={dot} aria-hidden="true" />
    </>
  );
}
