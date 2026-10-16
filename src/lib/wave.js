// Shockwaves: tap or click anywhere that isn't a control and a ring of
// primary colour rolls out from that spot, shoving the points aside and
// recolouring them as it passes. Taps only; a swipe is always a scroll.

export const WAVE_EVENT = 'field:wave';

const COLOURS = ['var(--red)', 'var(--blue)', 'var(--yellow)'];
const SKIP = 'a, button, input, textarea, select, label, summary, [role="button"], .case, .menu, .intro';
let turn = 0;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function wave(x, y, strength = 1) {
  window.dispatchEvent(new CustomEvent(WAVE_EVENT, { detail: { x, y, strength } }));
  if (reduced()) return;
  const ring = document.createElement('span');
  ring.className = 'ripple';
  ring.setAttribute('aria-hidden', 'true');
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.setProperty('--c', COLOURS[turn % COLOURS.length]);
  turn += 1;
  document.body.appendChild(ring);
  const size = Math.hypot(window.innerWidth, window.innerHeight) * 0.9 * Math.min(1.6, strength);
  const run = ring.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: `translate(-50%, -50%) scale(${size / 100})`, opacity: 0 },
    ],
    { duration: 1100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  );
  run.onfinish = () => ring.remove();
  run.oncancel = () => ring.remove();
}

export function startWaves() {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    const t = e.target instanceof Element ? e.target : null;
    if (!t || t.closest(SKIP)) return;
    if (window.getSelection?.().toString()) return;
    wave(e.clientX, e.clientY);
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
