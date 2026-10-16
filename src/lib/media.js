import { useSyncExternalStore } from 'react';

// Scroll-scrubbed effects (pinned rows, headings that stretch with the
// scroll) need a mouse or trackpad and room to breathe. Phones and tablets
// get the native-scrolling versions: nothing pins, nothing holds the thumb.
const QUERY = '(min-width: 861px) and (pointer: fine)';

const mq = typeof window !== 'undefined' ? window.matchMedia(QUERY) : null;
const subscribe = (cb) => {
  mq?.addEventListener('change', cb);
  return () => mq?.removeEventListener('change', cb);
};

export const canScrub = () => Boolean(mq?.matches);
export const useScrub = () => useSyncExternalStore(subscribe, canScrub, () => true);
