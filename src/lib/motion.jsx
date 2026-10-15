import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1];
export const SPRING_PRESS = { type: 'spring', stiffness: 380, damping: 32 };
export const SPRING_LAYOUT = { type: 'spring', stiffness: 260, damping: 30 };

const VIEW = { once: true, margin: '0px 0px -12% 0px' };

// Children arrive one after another, in reading order, once.
export function Stagger({ as = 'div', gap = 0.075, delay = 0, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

// A child that takes part in the parent Stagger.
export function Item({ as = 'div', variants = rise, children, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag variants={variants} {...rest}>
      {children}
    </Tag>
  );
}

// Lines rise from behind their own baseline. Authored line breaks only.
export function MaskLines({ as = 'h2', lines, className, delay = 0, step = 0.11, inView = true, ...rest }) {
  const Tag = motion[as];
  const reduce = useReducedMotion();
  const trigger = inView ? { whileInView: 'show', viewport: VIEW } : { animate: 'show' };
  return (
    <Tag className={className} initial={reduce ? false : 'hidden'} {...trigger} {...rest}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            style={{ display: 'block' }}
            variants={{
              hidden: { y: '108%' },
              show: { y: '0%', transition: { duration: 0.95, ease: EASE, delay: delay + i * step } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// A picture that opens from its lower edge while settling from a slight scale.
export function Shutter({ className, children, delay = 0 }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={VIEW}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay }}
    >
      <motion.div
        style={{ height: '100%' }}
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Counts a figure up once when it scrolls into view. Prefix and suffix
// (−, <, ×, %, M+) stay put; only the digits move.
export function Count({ value, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, VIEW);
  const reduce = useReducedMotion();
  const match = String(value).match(/^([^\d]*)([\d.]+)(.*)$/);
  const [shown, setShown] = useState(reduce || !match ? value : `${match[1]}0${match[3]}`);

  useEffect(() => {
    if (!match || reduce || !inView) {
      if (reduce || !match) setShown(value);
      return undefined;
    }
    const [, pre, digits, post] = match;
    const target = parseFloat(digits);
    const decimals = digits.includes('.') ? digits.split('.')[1].length : 0;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setShown(`${pre}${v.toFixed(decimals)}${post}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

// A display heading whose letters widen and thicken as it climbs the screen:
// condensed and light at the bottom edge, expanded and black by the upper third.
export function Stretch({ as = 'h2', lines, className = '', id, from = 62 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.32'] });
  const wdth = useTransform(scrollYProgress, [0, 1], reduce ? [125, 125] : [from, 125]);
  const wght = useTransform(scrollYProgress, [0, 1], reduce ? [900, 900] : [380, 900]);
  const fvs = useMotionTemplate`'wdth' ${wdth}, 'wght' ${wght}`;
  const Tag = motion[as];
  return (
    <Tag ref={ref} id={id} className={`stretch ${className}`} style={{ fontVariationSettings: fvs, '--chars': Math.max(...lines.map((l) => l.length)) }} initial={reduce ? false : 'hidden'} whileInView="show" viewport={VIEW}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            style={{ display: 'block' }}
            variants={{ hidden: { y: '108%' }, show: { y: '0%', transition: { duration: 0.95, ease: EASE, delay: i * 0.1 } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
