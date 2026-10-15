import { Count, Item, Stagger, fade } from '../lib/motion.jsx';

// Three true figures, written into one paragraph. Each links to its source.
export default function Figures() {
  return (
    <section className="figures" aria-labelledby="figures-h">
      <h2 className="sr" id="figures-h">Results</h2>
      <Stagger as="p" className="figures__text" gap={0.09}>
        <Item as="span" variants={fade}>
          My scheduling policy at KIT cut latency for critical LLM requests by up to{' '}
          <a href="#research"><Count value="15×" /></a>.{' '}
        </Item>
        <Item as="span" variants={fade}>
          Ascend synthesises data at <a href="#/work/ascend"><Count value="99.5%" /></a> fidelity.{' '}
        </Item>
        <Item as="span" variants={fade}>
          Agent frameworks I helped build lifted outreach <a href="#experience"><Count value="10×" /></a>.
        </Item>
      </Stagger>
    </section>
  );
}
