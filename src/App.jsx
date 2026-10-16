import { useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Who from './components/Who.jsx';
import Tapes from './components/Tapes.jsx';
import Work from './components/Work.jsx';
import Research from './components/Research.jsx';
import Experience from './components/Experience.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CaseStudy from './components/CaseStudy.jsx';
import Field from './components/Field.jsx';
import Pointer from './components/Pointer.jsx';
import Intro from './components/Intro.jsx';
import { useCaseRoute } from './lib/route.js';
import { pauseSmooth, resumeSmooth, smoothAnchors, startSmooth } from './lib/smooth.js';
import { startWaves } from './lib/wave.js';

export default function App() {
  const { id, close } = useCaseRoute();

  useEffect(() => {
    const stop = startSmooth();
    const off = smoothAnchors();
    const offWaves = startWaves();
    return () => {
      stop();
      off();
      offWaves();
    };
  }, []);

  useEffect(() => {
    if (id) pauseSmooth();
    else resumeSmooth();
  }, [id]);

  return (
    <MotionConfig reducedMotion="user">
      <Field />
      <Header />
      <main className="main" inert={id ? true : undefined}>
        <Hero />
        <Who />
        <Tapes />
        <Work activeId={id} />
        <Research />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>{id && <CaseStudy key="case" id={id} onClose={close} />}</AnimatePresence>
      <Pointer />
      <Intro />
    </MotionConfig>
  );
}
