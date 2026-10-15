import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { kitPicture, research } from '../data.js';
import { Item, MaskLines, Stagger, rise } from '../lib/motion.jsx';

const specimens = [
  { figure: '15×', name: 'Channel-disable scheduling', note: 'Latency for latency-critical LLM requests, kept apart from best-effort work. Up to 15× better.' },
  { figure: '5–12%', name: 'Unified-memory policies', note: 'Throughput from prefetch and oversubscription policies, evaluated on real hardware.' },
];

function Plate() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);
  return (
    <figure>
      <div className="plate" ref={ref}>
        <motion.img style={{ y }} src={kitPicture.src} alt={kitPicture.alt} loading="lazy" decoding="async" width="1920" height="1440" />
      </div>
      <figcaption className="credit">
        Karlsruhe Institute of Technology. <a href={kitPicture.href} target="_blank" rel="noreferrer">{kitPicture.credit}</a>, {kitPicture.licence}.
      </figcaption>
    </figure>
  );
}

export default function Research() {
  return (
    <>
      <section className="section research" id="research" aria-labelledby="research-h">
        <div className="research__top">
          <MaskLines as="h2" id="research-h" className="h2" lines={['Research']} />
          <Stagger className="lede" as="div">
            <Item as="p">
              Alongside industry work I hold two research assistant (HiWi) positions at KIT: GPU resource
              management for LLM inference at the Chair for Embedded Systems, and on-device machine learning
              for wearables at TECO. Before Karlsruhe, I worked on document understanding at DataInsight.
            </Item>
          </Stagger>
        </div>

        <Stagger className="specimens" gap={0.14}>
          {specimens.map((s) => (
            <Item className="specimen" key={s.name}>
              <p className="specimen__label"><strong>{s.name}.</strong> {s.note}</p>
              <div className="specimen__box">
                <motion.p
                  className="specimen__figure"
                  variants={{ hidden: { y: '30%' }, show: { y: '0%', transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}
                >
                  {s.figure}
                </motion.p>
              </div>
            </Item>
          ))}
        </Stagger>

        <div className="record">
          {research.map((r) => (
            <Stagger as="article" className="record__item" key={r.id} aria-labelledby={`r-${r.id}`} gap={0.08}>
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
