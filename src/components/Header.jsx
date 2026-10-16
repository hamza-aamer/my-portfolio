import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { person } from '../data.js';
import { EASE } from '../lib/motion.jsx';
import { Close } from './Icons.jsx';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#research', label: 'Research' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const firstLink = useRef(null);

  // The bar fills in once the page moves, and steps aside while reading downward.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > window.innerHeight * 0.9 && y > prev + 2);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', open);
    const main = document.querySelector('main');
    if (main) main.inert = open;
    if (!open) return undefined;
    firstLink.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <a className="skip" href="#work">Skip to the work</a>
      <motion.header
        className="header"
        initial={false}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.36, ease: EASE }}
      >
        <motion.span
          className="header__bg"
          aria-hidden="true"
          initial={false}
          animate={{ scaleY: solid ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        <a className="wordmark" href="#top" data-magnetic>{person.name}</a>
        <nav className="nav" aria-label="Sections">
          {links.map((l) => (
            <a key={l.href} className="link" href={l.href}>{l.label}</a>
          ))}
          <a className="nav__resume link" href={person.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
        </nav>
        <button
          ref={menuButton}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.32, ease: [0.76, 0, 0.24, 1] } }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__top">
              <a className="wordmark" href="#top" onClick={() => setOpen(false)}>{person.name}</a>
              <button type="button" className="menu-button" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }} onClick={() => { setOpen(false); menuButton.current?.focus(); }}>
                Close <Close size={16} />
              </button>
            </div>
            <nav className="menu__links" aria-label="Sections">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  ref={i === 0 ? firstLink : undefined}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.18 + i * 0.06 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.18 + links.length * 0.06 }}
              >
                Contact
              </motion.a>
            </nav>
            <div className="menu__foot">
              <a className="button" href={person.resume} target="_blank" rel="noreferrer">Résumé (PDF)</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
