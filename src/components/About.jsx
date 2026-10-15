import { education, person } from '../data.js';
import { Item, Stagger, Stretch } from '../lib/motion.jsx';

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-h" data-chapter="yellow">
      <div className="about__top">
        <Stretch id="about-h" className="h2" lines={['About']} />
        <figure className="about__fan">
          <div className="about__stage" data-stage="fan" aria-hidden="true" />
          <figcaption>Karlsruhe, the fan city: 32 streets radiate from the palace tower. I live and study here.</figcaption>
        </figure>
      </div>
      <Stagger className="about__cols" gap={0.1}>
        <Item as="p">
          <strong>I’m Hamza Aamer</strong>, a Senior AI Engineer at <span className="hl">Aiden Risk</span> and a
          research assistant at the Karlsruhe Institute of Technology, where I’m reading for an{' '}
          <span className="hl">M.Sc. in Human-centred Machine Intelligence</span>. I took my B.Sc. in Computer
          Science at FAST-NUCES in Islamabad and graduated in 2025 as <span className="hl hl--grey">Gold Medalist</span>,
          on the Rector’s List of Honor.
        </Item>
        <Item as="p">
          My work runs across the stack: <span className="hl">eBPF policies</span> that schedule GPUs for LLM
          inference, PyTorch classifiers compiled with ExecuTorch for wearables, vision and{' '}
          <span className="hl hl--grey">LiDAR</span> pipelines, multi-agent frameworks, and synthetic-data engines
          on Spark. At Antematter I also worked with Nedge Computing and <span className="hl">NVIDIA</span> on
          virtual cloud systems that split A16 GPUs into vGPUs.
        </Item>
        <Item as="p">
          <a className="hl hl--final" href="#contact">I’m open to {person.openTo}.</a>
        </Item>
      </Stagger>

      <Stagger className="education" gap={0.1}>
        {education.map((e) => (
          <Item key={e.school}>
            <h3>{e.school}</h3>
            <p>{e.degree}</p>
            <p className="num">{e.dates}</p>
          </Item>
        ))}
      </Stagger>
    </section>
  );
}
