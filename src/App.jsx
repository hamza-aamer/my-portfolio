import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Figures from './components/Figures.jsx';
import Work from './components/Work.jsx';
import Research from './components/Research.jsx';
import Experience from './components/Experience.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CaseStudy from './components/CaseStudy.jsx';
import { useCaseRoute } from './lib/route.js';

function useNarrow() {
  const query = '(max-width: 860px)';
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

export default function App() {
  const { id, close } = useCaseRoute();
  const narrow = useNarrow();

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main className="main" inert={id ? true : undefined}>
        <Hero />
        <Figures />
        <Work activeId={id} narrow={narrow} />
        <Research />
        <Experience />
        <About />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>{id && <CaseStudy key="case" id={id} onClose={close} />}</AnimatePresence>
    </MotionConfig>
  );
}
