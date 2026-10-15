import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { person } from '../data.js';
import { EASE } from '../lib/motion.jsx';
import { ArrowDown } from './Icons.jsx';

export default function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  // As the hero leaves, the portrait sinks a little slower than the page.
  const drift = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '9%']);

  const lineIn = (i) => ({
    initial: reduce ? false : { y: '108%' },
    animate: { y: '0%' },
    transition: { duration: 1.05, ease: EASE, delay: 0.35 + i * 0.11 },
  });
  const up = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-name">

      <div className="hero__intro">
        <motion.p className="hero__line" {...up(0.85)}>{person.line}</motion.p>
        <motion.p className="hero__now" {...up(0.95)}>
          Senior AI Engineer at{' '}
          <a className="link" href={person.now[0].href} target="_blank" rel="noreferrer">Aiden Risk</a>
          . Research assistant at KIT. Based in Karlsruhe.
        </motion.p>
        <motion.div className="hero__actions" {...up(1.05)}>
          <a className="button" href="#work">
            See the work <ArrowDown />
          </a>
          <a className="link" href={person.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
        </motion.div>
      </div>

      <motion.div
        className="hero__portrait"
        style={{ y: drift }}
        initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.25, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
      >
        <motion.img
          src="/images/portrait.jpg"
          alt="Portrait of Hamza Aamer"
          width="1024"
          height="1536"
          fetchPriority="high"
          initial={reduce ? false : { scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.33, 1, 0.68, 1], delay: 0.05 }}
        />
      </motion.div>

      <motion.p className="hero__now-tag" {...up(1.15)}>
        <strong>Open to</strong>
        {person.openTo.charAt(0).toUpperCase() + person.openTo.slice(1)}.
      </motion.p>

      <h1 className="hero__name" id="hero-name">
        <span className="line">
          <motion.span {...lineIn(0)}>Hamza</motion.span>
        </span>
        <span className="line">
          <motion.span {...lineIn(1)}>Aamer</motion.span>
        </span>
      </h1>
    </section>
  );
}
