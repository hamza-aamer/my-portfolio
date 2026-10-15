import { useState } from 'react';
import { Count, Item, Stagger, fade } from '../lib/motion.jsx';

// The portrait arrives as a four-tone halftone of points. Under the pointer
// the points part and the photograph shows through; on a phone, a tap
// opens the whole photograph.
function Portrait() {
  const [open, setOpen] = useState(false);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--rx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--ry', `${e.clientY - r.top}px`);
  };
  return (
    <div
      className={`who__stage${open ? ' is-open' : ''}`}
      data-stage="portrait"
      data-reveal
      data-cursor="Look"
      onPointerMove={onMove}
      onPointerEnter={(e) => e.pointerType === 'mouse' && e.currentTarget.classList.add('is-peek')}
      onPointerLeave={(e) => e.currentTarget.classList.remove('is-peek')}
    >
      <img className="who__photo" src="/images/portrait.jpg" alt="Portrait of Hamza Aamer" width="1024" height="1536" loading="lazy" decoding="async" />
      <button type="button" className="who__toggle" aria-pressed={open} onClick={() => setOpen((v) => !v)}>
        {open ? 'Back to the dots' : 'Show the photograph'}
      </button>
    </div>
  );
}

export default function Who() {
  return (
    <section className="who" id="who" aria-labelledby="who-h" data-chapter="yellow">
      <Portrait />
      <div className="who__text">
        <h2 className="sr" id="who-h">Results</h2>
        <Stagger as="p" className="who__figures" gap={0.12}>
          <Item as="span" variants={fade}>
            My scheduling policy at KIT cut latency for critical LLM requests by up to{' '}
            <a className="chip chip--red" href="#research"><Count value="15×" /></a>.{' '}
          </Item>
          <Item as="span" variants={fade}>
            Ascend synthesises data at <a className="chip chip--blue" href="#/work/ascend"><Count value="99.5%" /></a> fidelity.{' '}
          </Item>
          <Item as="span" variants={fade}>
            Agent frameworks I helped build lifted outreach <a className="chip chip--ink" href="#experience"><Count value="10×" /></a>.
          </Item>
        </Stagger>
        <p className="who__hint">
          <span className="hint-fine">Move over the dots to see the photograph underneath.</span>
          <span className="hint-touch">That’s me, in 6,500 points. Tap the button to see the photograph.</span>
        </p>
      </div>
    </section>
  );
}
