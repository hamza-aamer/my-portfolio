import { useLayoutEffect, useRef, useState } from 'react';
import { kitPicture, person } from '../data.js';

const credits = [kitPicture];

// The wordmark runs margin to margin: the viewBox is fitted to the word's
// own measured box once the face has loaded, so the letters are never stretched.
function Wordmark() {
  const text = useRef(null);
  const [box, setBox] = useState('0 0 980 112');
  useLayoutEffect(() => {
    const fit = () => {
      if (!text.current) return;
      const b = text.current.getBBox();
      setBox(`${b.x} ${b.y + b.height * 0.12} ${b.width} ${b.height * 0.8}`);
    };
    fit();
    document.fonts?.ready.then(fit);
  }, []);
  return (
    <svg className="footer__mark" viewBox={box} role="img" aria-label={person.name}>
      <text ref={text} x="0" y="100">{person.name}</text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer on-ink">
      <div className="footer__cols">
        <div className="footer__col">
          <span>Contact</span>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <span>{person.city}</span>
        </div>
        <nav className="footer__col" aria-label="Footer">
          <span>Sections</span>
          <a href="#work">Selected work</a>
          <a href="#research">Research</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </nav>
        <div className="footer__col">
          <span>Elsewhere</span>
          <a href={person.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={person.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
        </div>
        <div className="footer__col">
          <span>Now</span>
          <span>Senior AI Engineer, Aiden Risk</span>
          <span>Research Assistant, KIT</span>
        </div>
        <p className="footer__credits">
          Photograph of the KIT campus:{' '}
          {credits.map((c, i) => (
            <span key={c.src}>
              <a href={c.href} target="_blank" rel="noreferrer">{c.credit}</a>, {c.licence}{i < credits.length - 1 ? '; ' : '.'}
            </span>
          ))}{' '}
          Via Wikimedia Commons.
        </p>
      </div>
      <div />
      <div>
        <Wordmark />
        <div className="footer__legal">
          <span>© 2026 {person.name}</span>
          <span>its-hamza.com</span>
        </div>
      </div>
    </footer>
  );
}
