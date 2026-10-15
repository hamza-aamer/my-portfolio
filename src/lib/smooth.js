import Lenis from 'lenis';

// Inertial scrolling for mouse and trackpad. Touch keeps the phone's own
// scrolling, and reduced motion keeps the browser's.
let lenis = null;

export function startSmooth() {
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce || lenis) return () => {};
  lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 1 });
  document.documentElement.classList.add('is-smooth');
  return () => {
    lenis?.destroy();
    lenis = null;
    document.documentElement.classList.remove('is-smooth');
  };
}

export const pauseSmooth = () => lenis?.stop();
export const resumeSmooth = () => lenis?.start();

// In-page anchors glide; case-study routes (#/work/...) are left to the router.
export function scrollToHash(hash) {
  if (!hash || hash.startsWith('#/')) return false;
  const el = hash === '#top' ? document.body : document.getElementById(hash.slice(1));
  if (!el) return false;
  if (lenis) lenis.scrollTo(hash === '#top' ? 0 : el, { duration: 1.4 });
  else if (hash === '#top') window.scrollTo({ top: 0, behavior: 'smooth' });
  else el.scrollIntoView({ behavior: 'smooth' });
  return true;
}

export function smoothAnchors() {
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (scrollToHash(hash)) {
      e.preventDefault();
      history.pushState(null, '', hash === '#top' ? window.location.pathname : hash);
    }
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
