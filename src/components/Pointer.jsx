import { useEffect, useRef } from 'react';

// The pointer layer: a cursor dot and ring that follow the mouse, magnetic
// controls, and the x-ray lens. The lens turns whatever is under it into a
// blueprint and reads out the element at its centre: tag, face, size, box.
// Hold anywhere (or switch X-ray on) to open it. On touch, X-ray puts a lens
// in the middle of the screen that can be dragged with a thumb.

export const XRAY_EVENT = 'xray:toggle';

function describe(x, y) {
  const hits = document.elementsFromPoint(x, y);
  const el = hits.find((h) => !h.closest('.lens, .cursor'));
  if (!el) return ['', ''];
  const stage = el.closest('[data-stage]');
  if (stage) {
    const pts = document.documentElement.dataset.points;
    return [`webgl · ${stage.dataset.stage}`, pts ? `${Number(pts).toLocaleString('en')} points, one draw call` : 'particle stage'];
  }
  const target = el.closest('h1, h2, h3, h4, p, a, button, li, dd, dt, span, strong, b, figure, img') ?? el;
  const cs = getComputedStyle(target);
  const face = cs.fontFamily.split(',')[0].replace(/['"]/g, '').replace(' Variable', '');
  const r = target.getBoundingClientRect();
  const tag = target.tagName.toLowerCase();
  const cls = target.classList[0] ? `.${target.classList[0]}` : '';
  return [`${tag}${cls}`, `${face} ${cs.fontWeight} · ${Math.round(parseFloat(cs.fontSize))}px · ${Math.round(r.width)}×${Math.round(r.height)}`];
}

export default function Pointer() {
  const dot = useRef(null);
  const ring = useRef(null);
  const ringLabel = useRef(null);
  const lens = useRef(null);
  const cols = useRef(null);
  const line1 = useRef(null);
  const line2 = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine) root.classList.add('has-cursor');

    const p = { x: window.innerWidth / 2, y: window.innerHeight / 2, rx: window.innerWidth / 2, ry: window.innerHeight / 2 };
    const l = { x: p.x, y: p.y, s: 0, target: 0, on: false, hold: false };
    let label = '';
    let hover = false;
    let magnet = null;
    let holdTimer = 0;
    let raf = 0;
    let frame = 0;
    let shown = false;

    const R = () => (window.innerWidth < 720 ? 92 : 132);

    const setOpen = () => {
      const open = l.on || l.hold;
      l.target = open ? 1 : 0;
      root.classList.toggle('is-xray', open);
      lens.current?.setAttribute('data-open', open ? 'true' : 'false');
    };

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
      hover = Boolean(interactive);
      const nextLabel = interactive?.closest('[data-cursor]')?.dataset.cursor ?? '';
      if (nextLabel !== label) {
        label = nextLabel;
        if (ringLabel.current) ringLabel.current.textContent = label;
      }
      ring.current?.classList.toggle('is-hover', hover);
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
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('a, button, input, textarea, select, label, .case, [data-no-xray]')) return;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        l.hold = true;
        setOpen();
      }, 170);
    };
    const onUp = () => {
      clearTimeout(holdTimer);
      if (l.hold) {
        l.hold = false;
        setOpen();
      }
    };
    const onLeave = () => {
      shown = false;
      root.classList.remove('cursor-in');
    };

    const onToggle = (e) => {
      l.on = typeof e.detail === 'boolean' ? e.detail : !l.on;
      if (l.on && !fine) {
        l.x = window.innerWidth / 2;
        l.y = window.innerHeight * 0.52;
      }
      setOpen();
      window.dispatchEvent(new CustomEvent('xray:state', { detail: l.on }));
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && l.on) onToggle({ detail: false });
    };

    // Touch: the lens itself is the handle.
    let drag = null;
    const onLensDown = (e) => {
      if (fine) return;
      drag = { id: e.pointerId, ox: e.clientX - l.x, oy: e.clientY - l.y };
      lens.current.setPointerCapture(e.pointerId);
    };
    const onLensMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      l.x = e.clientX - drag.ox;
      l.y = e.clientY - drag.oy;
    };
    const onLensUp = () => {
      drag = null;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frame += 1;
      const k = reduce ? 1 : 0.2;
      p.rx += (p.x - p.rx) * k;
      p.ry += (p.y - p.ry) * k;
      if (fine) {
        if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        if (ring.current) ring.current.style.transform = `translate3d(${p.rx}px, ${p.ry}px, 0)`;
        l.x += (p.x - l.x) * (reduce ? 1 : 0.28);
        l.y += (p.y - l.y) * (reduce ? 1 : 0.28);
      }
      l.s += (l.target - l.s) * (reduce ? 1 : 0.2);
      if (l.s < 0.002 && l.target === 0) {
        if (lens.current && lens.current.style.visibility !== 'hidden') lens.current.style.visibility = 'hidden';
        return;
      }
      const r = R();
      if (lens.current) {
        lens.current.style.visibility = 'visible';
        lens.current.style.transform = `translate3d(${l.x - r}px, ${l.y - r}px, 0) scale(${l.s})`;
      }
      // The column guides belong to the page, so they hold still while the lens moves.
      if (cols.current) cols.current.style.transform = `translate3d(${-(l.x - r)}px, ${-(l.y - r)}px, 0)`;
      if (lens.current) lens.current.style.setProperty('--bp', `${-(l.x - r)}px ${-(l.y - r) - window.scrollY}px`);
      if (frame % 4 === 0 && l.target === 1) {
        const [a, b] = describe(l.x, l.y);
        if (line1.current && line1.current.textContent !== a) line1.current.textContent = a;
        if (line2.current && line2.current.textContent !== b) line2.current.textContent = b;
      }
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('blur', onUp);
    window.addEventListener('keydown', onKey);
    window.addEventListener(XRAY_EVENT, onToggle);
    document.documentElement.addEventListener('pointerleave', onLeave);
    const lensEl = lens.current;
    lensEl.addEventListener('pointerdown', onLensDown);
    lensEl.addEventListener('pointermove', onLensMove);
    lensEl.addEventListener('pointerup', onLensUp);
    lensEl.addEventListener('pointercancel', onLensUp);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(holdTimer);
      root.classList.remove('has-cursor', 'cursor-in', 'is-xray');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', onUp);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(XRAY_EVENT, onToggle);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      lensEl.removeEventListener('pointerdown', onLensDown);
      lensEl.removeEventListener('pointermove', onLensMove);
      lensEl.removeEventListener('pointerup', onLensUp);
      lensEl.removeEventListener('pointercancel', onLensUp);
    };
  }, []);

  return (
    <>
      <div className="lens" ref={lens} aria-hidden="true" data-open="false" style={{ visibility: 'hidden' }}>
        <div className="lens__fx" />
        <div className="lens__base" />
        <div className="lens__cols" ref={cols}>
          {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
        </div>
        <div className="lens__cross" />
        <div className="lens__read">
          <span ref={line1} />
          <span ref={line2} />
        </div>
      </div>
      <div className="cursor cursor--ring" ref={ring} aria-hidden="true"><span ref={ringLabel} /></div>
      <div className="cursor cursor--dot" ref={dot} aria-hidden="true" />
    </>
  );
}
