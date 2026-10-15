// Colour by chapter: each section names a ground colour, and the whole page
// floods to it as that section crosses the middle of the screen.

export const COLOURS = {
  cream: '#F6F1E7',
  red: '#E63322',
  redDeep: '#D42A1A',
  blue: '#1F4BFF',
  yellow: '#FFCB05',
  ink: '#111111',
  white: '#FFFFFF',
};

const C = COLOURS;

// What each of the four point colours (red, blue, yellow, ink) becomes on
// each ground, so no point ever vanishes into the colour behind it.
export const PALETTES = {
  cream: [C.red, C.blue, C.yellow, C.ink],
  yellow: [C.red, C.blue, C.white, C.ink],
  blue: [C.red, C.cream, C.yellow, C.ink],
  red: [C.cream, C.blue, C.yellow, C.ink],
};

const GROUND = { cream: C.cream, yellow: C.yellow, blue: C.blue, red: C.redDeep };

export function watchChapters(onChange) {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  let current = null;
  const set = (name) => {
    if (!name || name === current) return;
    current = name;
    root.dataset.chapter = name;
    meta?.setAttribute('content', GROUND[name]);
    onChange?.(name);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) set(e.target.dataset.chapter);
      });
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  const observe = () => document.querySelectorAll('[data-chapter]').forEach((el) => io.observe(el));
  observe();
  set(document.querySelector('[data-chapter]')?.dataset.chapter ?? 'cream');
  return () => io.disconnect();
}
