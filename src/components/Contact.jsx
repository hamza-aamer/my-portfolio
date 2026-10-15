import { useState } from 'react';
import { person } from '../data.js';
import { Item, Stagger, Stretch } from '../lib/motion.jsx';
import { ArrowRight, ArrowUpRight } from './Icons.jsx';

const rows = [
  { label: 'LinkedIn', text: 'linkedin.com/in/hamza-aamer', href: person.linkedin },
  { label: 'GitHub', text: 'github.com/hamza-aamer', href: person.github },
  { label: 'Résumé', text: 'Résumé, as a PDF', href: person.resume },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-h" data-chapter="red">
      <div className="contact__head">
        <Stretch id="contact-h" className="h2" lines={['Write', 'to me.']} />
        <Stagger><Item as="p">For research collaborations and AI-systems roles. I reply within 48 hours.</Item></Stagger>
        <div className="contact__stage" data-stage="at" aria-hidden="true" />
      </div>
      <Stagger className="contact__rows" gap={0.07}>
        <Item className="contact__row">
          <a className="row-label" href={`mailto:${person.email}`}>{person.email}</a>
          <button type="button" className="copy" onClick={copy} aria-live="polite" data-magnetic>
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </Item>
        {rows.map((r) => (
          <Item as="a" key={r.label} className="contact__row" href={r.href} target="_blank" rel="noreferrer">
            <span className="row-label">{r.text} <ArrowUpRight /></span>
          </Item>
        ))}
        <Item className="contact__row">
          <span className="row-label">{person.city}</span>
        </Item>
        <Item as="a" className="contact__row contact__greet-row" href={`mailto:${person.email}?subject=Hello%20Hamza`} data-cursor="Write">
          <span className="contact__greet">
            Say hello
            <span className="round" aria-hidden="true"><ArrowRight /></span>
          </span>
        </Item>
      </Stagger>
    </section>
  );
}
