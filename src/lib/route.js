import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { projectById } from '../data.js';

// Case studies live at #/work/<id> so links are shareable and Back works.
export function parseCase(hash = window.location.hash) {
  const m = hash.match(/^#\/work\/([\w-]+)$/);
  return m && projectById[m[1]] ? m[1] : null;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const canTransition = () => typeof document !== 'undefined' && 'startViewTransition' in document && !reduced();

// Runs a state change inside a view transition when the browser supports one,
// so elements that share a view-transition-name morph between the two states.
export function transition(update) {
  if (!canTransition()) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
}

export function useCaseRoute() {
  const [id, setId] = useState(() => parseCase());
  const enteredInPage = useRef(false);
  const current = useRef(id);

  useEffect(() => {
    const onHash = () => {
      const next = parseCase();
      if (next === current.current) return;
      if (next && !current.current) enteredInPage.current = true;
      current.current = next;
      transition(() => setId(next));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const close = () => {
    if (enteredInPage.current) {
      enteredInPage.current = false;
      window.history.back();
    } else {
      window.location.hash = '#work';
    }
  };

  return { id, close };
}
