import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';

// Two strips of the tools from the work below cross like packing tape. They
// run on their own, speed up and reverse with the scroll, and lean into it.
const TOP = ['eBPF', 'struct_ops', 'CUDA', 'NVML', 'DVFS', 'PyTorch', 'ExecuTorch', 'Kotlin', 'FastAPI', 'Docker'];
const BOTTOM = ['PySpark', 'CrewAI', 'LangChain', 'YOLOv8', 'Open3D', 'LiDAR', 'QGIS', 'CycleGAN', 'Donut', 'TrOCR'];

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Strip({ words, base, className }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [12, -12]);
  const dir = useRef(1);
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.05) dir.current = -1;
    else if (b > 0.05) dir.current = 1;
    x.set(x.get() + dir.current * base * (delta / 1000) * (1 + Math.abs(b)));
  });

  const run = [...words, ...words];
  return (
    <div className={`tape ${className}`}>
      <motion.div className="tape__run" style={{ x: pos, skewX: reduce ? 0 : skew }}>
        {[0, 1].map((k) => (
          <span key={k} className="tape__set">
            {run.map((w, i) => (
              <span key={`${k}-${i}`} className="tape__word" data-w={w}>
                <span className={`tape__mark tape__mark--${i % 3}`} />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Tapes() {
  return (
    <div className="tapes" aria-hidden="true" data-chapter="yellow">
      <Strip words={TOP} base={-2.4} className="tape--red" />
      <Strip words={BOTTOM} base={2} className="tape--blue" />
    </div>
  );
}
