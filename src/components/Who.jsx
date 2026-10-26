import { useState } from 'react';
import { portrait } from '../data.js';
import { Count, Item, Stagger, fade } from '../lib/motion.jsx';

// The portrait arrives as a four-tone halftone of points. Under the mouse
// the points part and the photograph shows through. On a phone, a tap on
// the dots opens the photograph from under the finger, and another closes
// it; the button does the same for keyboards.
function Portrait() {
  const [open, setOpen] = useState(false);
  const place = (el, e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--rx', `${e.clientX - r.left}px`);
    el.style.setProperty('--ry', `${e.clientY - r.top}px`);
  };
  const onTap = (e) => {
    if (e.pointerType === 'mouse' || e.target.closest('button')) return;
    place(e.currentTarget, e);
    setOpen((v) => !v);
  };
  return (
    <div
      className={`who__stage${open ? ' is-open' : ''}`}
      data-stage="portrait"
      data-reveal
      data-cursor="Look"
      onPointerMove={(e) => e.pointerType === 'mouse' && place(e.currentTarget, e)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && e.currentTarget.classList.add('is-peek')}
      onPointerLeave={(e) => e.currentTarget.classList.remove('is-peek')}
      onPointerUp={onTap}
    >
      <span className="who__photo">
        <span className="who__disc" aria-hidden="true" />
        <img src={portrait.src} alt="Portrait of Hamza Aamer" width={portrait.width} height={portrait.height} decoding="async" />
      </span>
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
          <span className="hint-touch">That’s me, in 9,000 points. Tap the dots to see the photograph.</span>
        </p>
      </div>
    </section>
  );
}
