import { useEffect, useState } from 'react';
import { animate, motion } from 'motion/react';

// The curtain: three primaries pop in, a count runs to 100, and three
// coloured panels lift off the page while the points fly into the name.
// Shown once per visit; never under reduced motion.
const seen = () => {
  try {
    return sessionStorage.getItem('intro') === '1';
  } catch {
    return false;
  }
};

export default function Intro() {
  const [show, setShow] = useState(() => !seen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [count, setCount] = useState(0);
  const [lift, setLift] = useState(false);

  useEffect(() => {
    if (!show) return undefined;
    try {
      sessionStorage.setItem('intro', '1');
    } catch {
      /* private mode: the curtain simply shows again next time */
    }
    document.documentElement.classList.add('is-intro');
    const c = animate(0, 100, { duration: 1, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setCount(Math.round(v)) });
    const t1 = setTimeout(() => setLift(true), 1100);
    const t2 = setTimeout(() => {
      setShow(false);
      document.documentElement.classList.remove('is-intro');
    }, 2100);
    return () => {
      c.stop();
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove('is-intro');
    };
  }, [show]);

  if (!show) return null;
  const pop = (i) => ({
    initial: { scale: 0, rotate: -90 },
    animate: lift ? { scale: 0, rotate: 90, transition: { duration: 0.35, ease: [0.5, 0, 0.75, 0] } } : { scale: 1, rotate: 0 },
    transition: { type: 'spring', stiffness: 420, damping: 18, delay: 0.1 + i * 0.12 },
  });
  return (
    <div className="intro" aria-hidden="true">
      {['red', 'blue', 'yellow'].map((c, i) => (
        <motion.span
          key={c}
          className={`intro__panel intro__panel--${c}`}
          initial={{ y: '0%' }}
          animate={{ y: lift ? '-101%' : '0%' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: lift ? 0.1 + i * 0.08 : 0 }}
        />
      ))}
      <div className="intro__mark">
        <motion.span className="intro__shape intro__shape--circle" {...pop(0)} />
        <motion.span className="intro__shape intro__shape--square" {...pop(1)} />
        <motion.span className="intro__shape intro__shape--tri" {...pop(2)} />
      </div>
      <motion.span className="intro__count num" animate={{ opacity: lift ? 0 : 1 }}>{count}</motion.span>
    </div>
  );
}
