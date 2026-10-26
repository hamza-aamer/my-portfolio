import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { kitEnded, kitPicture, research } from '../data.js';
import { Item, Stagger, Stretch, rise } from '../lib/motion.jsx';
import { useScrub } from '../lib/media.js';

// Scroll is the dial: the latency bar for a critical request shrinks as the
// figure counts up, until it is one fifteenth of where it started. On a
// desktop the block pins while it counts; on a phone it never holds the
// page, and counts as it travels up the screen.
function Fifteen() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const pin = useScrub();
  const { scrollYProgress } = useScroll({ target: ref, offset: pin ? ['start start', 'end end'] : ['start 0.9', 'end 0.55'] });
  const k = useTransform(scrollYProgress, pin ? [0.08, 0.82] : [0.1, 0.9], [1, 15], { clamp: true });
  const [shown, setShown] = useState(reduce ? 15 : 1);
  useMotionValueEvent(k, 'change', (v) => setShown(Math.round(v)));
  const factor = reduce ? 15 : shown;
  const after = useTransform(k, (v) => 1 / (reduce ? 15 : v));
  const tilt = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <div className={`fifteen${pin ? '' : ' fifteen--flow'}`} ref={ref}>
      <div className="fifteen__pin">
        <p className="fifteen__label">
          <strong>Channel-disable scheduling.</strong> Latency for latency-critical LLM requests, kept apart
          from best-effort work on the same GPU.
        </p>
        <motion.p className="fifteen__figure num" style={{ rotate: reduce ? 0 : tilt }} aria-label="Up to 15 times better latency">
          <span aria-hidden="true">{factor}×</span>
        </motion.p>
        <div className="fifteen__bars" aria-hidden="true">
          <div className="fifteen__row">
            <span>Before</span>
            <span className="fifteen__bar fifteen__bar--before" />
          </div>
          <div className="fifteen__row">
            <span>With the policy</span>
            <motion.span className="fifteen__bar fifteen__bar--after" style={{ scaleX: after }} />
          </div>
        </div>
        <p className="fifteen__note">Up to 15× better. Unified-memory prefetch and oversubscription policies added 5–12% throughput.</p>
      </div>
    </div>
  );
}

function Plate() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%']);
  const clip = useTransform(scrollYProgress, [0, 0.35], reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(18% 12% 18% 12%)', 'inset(0% 0% 0% 0%)']);
  return (
    <figure className="kit" data-chapter="blue" ref={ref}>
      <motion.div className="plate" style={{ clipPath: clip }}>
        <motion.img style={{ y }} src={kitPicture.src} alt={kitPicture.alt} loading="lazy" decoding="async" width="1920" height="1440" />
      </motion.div>
      <figcaption className="credit">
        Karlsruhe Institute of Technology. <a href={kitPicture.href} target="_blank" rel="noreferrer">{kitPicture.credit}</a>, {kitPicture.licence}.
      </figcaption>
    </figure>
  );
}

export default function Research() {
  return (
    <>
      <section className="research" id="research" aria-labelledby="research-h" data-chapter="blue">
        <div className="research__top">
          <div>
            <Stretch id="research-h" className="h2" lines={['Research']} />
            <Stagger className="lede" as="div">
              <Item as="p">
                Alongside industry work I {kitEnded ? 'held' : 'hold'} two research assistant (HiWi) positions at KIT,
                from April {kitEnded ? 'to' : 'until'} November 2026: GPU resource
                management for LLM inference at the Chair for Embedded Systems, and on-device machine learning
                for wearables at TECO. Before Karlsruhe, I worked on document understanding at DataInsight.
              </Item>
            </Stagger>
          </div>
          <div className="research__stage" data-stage="chip" aria-hidden="true" />
        </div>

        <Fifteen />

        <div className="record">
          {research.map((r, i) => (
            <Stagger as="article" className={`record__item record__item--${i}`} key={r.id} aria-labelledby={`r-${r.id}`} gap={0.08}>
              <Item className="record__side">
                <h3 className="record__lab" id={`r-${r.id}`}>{r.lab}</h3>
                <p className="record__sub">{r.role}{r.lead.startsWith('Prof') ? `, with ${r.lead}` : `, ${r.lead}`}</p>
                <p className="record__sub num">{r.dates}</p>
              </Item>
              <div className="record__body">
                <Item as="p" className="record__topic">{r.topic}</Item>
                <Stagger as="ul" className="points" gap={0.06}>
                  {r.points.map((pt) => <Item as="li" key={pt} variants={rise}>{pt}</Item>)}
                </Stagger>
                <Item as="ul" className="tags" aria-label="Tools">
                  {r.stack.map((s) => <li key={s}>{s}</li>)}
                </Item>
              </div>
            </Stagger>
          ))}
        </div>
      </section>
      <Plate />
    </>
  );
}
