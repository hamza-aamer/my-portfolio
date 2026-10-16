import { useEffect, useRef } from 'react';
import { createField } from '../lib/field.js';
import { PALETTES, watchChapters } from '../lib/chapters.js';
import { WAVE_EVENT } from '../lib/wave.js';
import { bauhausShape, chipShape, DISPLAY_FONT, fanShape, networkShape, portraitShape, textShape } from '../lib/shapes.js';

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const aspectOf = (el) => {
  const r = el.getBoundingClientRect();
  return r.height > 0 ? r.width / r.height : 1;
};

// Builds the point cloud each stage asks for. Text stages take the stage's
// own proportions, so the letters fill the box they stand in for.
async function build(name, el, n) {
  switch (name) {
    case 'name': return textShape(['HAMZA', 'AAMER'], n, aspectOf(el), 3);
    case 'portrait': return portraitShape(await loadImage('/images/portrait.jpg'), n, 7);
    case 'bauhaus': return bauhausShape(n);
    case 'chip': return chipShape(n);
    case 'network': return networkShape(n);
    case 'fan': return fanShape(n);
    case 'at': return textShape(['@'], n, 1.05, 29);
    default: return null;
  }
}

export default function Field() {
  const canvas = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const narrow = window.innerWidth < 720;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = narrow ? 6500 : 15000;
    let field;
    try {
      // On a phone the flick of a thumb is fast; the streaks are kept short.
      field = createField(canvas.current, { n, motion: !reduce, streak: narrow ? 0.35 : 1, compact: narrow });
    } catch {
      field = null;
    }
    const stopChapters = watchChapters((name) => field?.setPalette(PALETTES[name] ?? PALETTES.cream));
    if (!field) return stopChapters;
    root.dataset.points = String(n);

    let alive = true;
    const size = (name) => {
      if (name === 'name') return narrow ? 2.6 : 3.4;
      if (name === 'portrait') return narrow ? 2.4 : 3;
      return narrow ? 2.2 : 2.8;
    };
    const els = [...document.querySelectorAll('[data-stage]')];
    const stages = els.map((el) => ({ el, name: el.dataset.stage, shape: null, size: size(el.dataset.stage) }));
    field.setStages(stages);
    field.setPalette(PALETTES[root.dataset.chapter] ?? PALETTES.cream);

    const fill = (only) => Promise.all(
      stages
        .filter((s) => !only || only.includes(s.name))
        .map(async (s) => {
          const shape = await build(s.name, s.el, n).catch(() => null);
          if (!alive || !shape) return;
          s.shape = shape;
          field.refresh();
        }),
    );

    // The display face must be in before any letters are sampled.
    const fontReady = document.fonts?.load ? document.fonts.load(`900 100px ${DISPLAY_FONT}`).catch(() => {}) : Promise.resolve();
    fontReady.then(() => {
      if (!alive) return;
      root.classList.add('has-field');
      fill();
      field.start();
    });

    // Only a mouse pushes the points. A finger on glass is a scroll, and a
    // hole that stayed where the thumb first landed would tear the shapes;
    // fingers make shockwaves instead (src/lib/wave.js).
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY) / (dt / 16);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
      field.pointer(e.clientX, e.clientY, speed);
      field.boost(e.target.closest?.('[data-reveal]') ? (narrow ? 90 : 150) : 0);
    };
    const onLeave = () => field.leave();
    const onWave = (e) => field.shock(e.detail.x, e.detail.y, e.detail.strength);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener(WAVE_EVENT, onWave);

    // Text stages are re-cut when the window changes shape.
    let timer = 0;
    let width = window.innerWidth;
    const onResize = () => {
      field.resize();
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (Math.abs(window.innerWidth - width) < 40) return;
        width = window.innerWidth;
        fill(['name']);
      }, 220);
    };
    window.addEventListener('resize', onResize);

    const onVisible = () => (document.hidden ? field.stop() : field.start());
    document.addEventListener('visibilitychange', onVisible);

    const onLost = (e) => {
      e.preventDefault();
      root.classList.remove('has-field');
      field.stop();
    };
    canvas.current.addEventListener('webglcontextlost', onLost);

    return () => {
      alive = false;
      stopChapters();
      field.destroy();
      root.classList.remove('has-field');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener(WAVE_EVENT, onWave);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return <canvas ref={canvas} className="field" aria-hidden="true" />;
}
