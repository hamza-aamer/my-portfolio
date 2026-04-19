// Hero, Manifesto/About, Affiliations marquee

function Hero() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);
  const wordStyle = (i) => ({
    display: 'inline-block',
    transform: ready ? 'translateY(0)' : 'translateY(100%)',
    opacity: ready ? 1 : 0,
    transition: `transform 1s cubic-bezier(.16,1,.3,1) ${i * 140}ms, opacity 1s cubic-bezier(.16,1,.3,1) ${i * 140}ms`,
  });
  return (
    <section id="home" className="hero" data-screen-label="01 Hero">
      <Reveal delay={200} className="hero-masthead">
        <div className="hm-row">
          <span className="mono hm-edition">EDITION Nº 07</span>
          <span className="mono hm-date">WED · 12 MAR 2026 · 14:32 CET</span>
        </div>
        <div className="hm-rule"/>
        <div className="hm-row hm-row-2">
          <div className="hm-now">
            <span className="mono hm-k">NOW</span>
            <span className="hm-v">Shipping synthetic→real CV pipelines at <em>Ascend</em></span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={400} className="hero-portrait">
        <div className="hp-frame">
          <svg className="hp-sig" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#hp-grid)"/>
            <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.35"/>
            <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.25"/>
            <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
            <g transform="translate(100 100)">
              <path d="M -30 20 Q -15 -25 0 0 Q 15 25 30 -20" fill="none" stroke="var(--accent)" strokeWidth="1.2"/>
              <path d="M -30 0 Q -15 -40 0 -15 Q 15 10 30 -35" fill="none" stroke="var(--accent2)" strokeWidth="1.2" opacity="0.7"/>
            </g>
          </svg>
          <div className="hp-meta-tl"><span className="mono">HA · 28</span></div>
          <div className="hp-meta-tr"><span className="mono">KA / DE</span></div>
          <div className="hp-meta-bl"><span className="mono">REG · 001</span></div>
          <div className="hp-meta-br"><span className="mono">v3.2.1</span></div>
        </div>
      </Reveal>

      <h1 className="hero-title">
        <span className="ht-line">
          <span className="ht-word" style={wordStyle(0)}>Hamza</span>
        </span>
        <span className="ht-line ht-italic">
          <span className="ht-word" style={wordStyle(1)}>Aamer</span>
        </span>
      </h1>

      <Reveal delay={900} className="hero-caption">
        <span className="mono hc-idx">(01)</span>
        <p className="hc-text">
          Data Science Team Lead crafting <em>synthetic data engines</em>, multi-agent frameworks and computer-vision systems that reach production.
        </p>
      </Reveal>

      <Reveal delay={1100} className="hero-stats">
        {[
          { n: '5', s: 'YRS', l: 'Shipping AI' },
          { n: '99.5', s: '%', l: 'DNA Fidelity' },
          { n: '10', s: 'M+', l: 'Rows Synth.' },
          { n: '3', s: 'CO', l: 'Active clients' },
        ].map((s, i) => (
          <div key={i} className="hs-item">
            <div className="hs-n">{s.n}<span className="mono hs-sup">{s.s}</span></div>
            <div className="mono hs-l">{s.l}</div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function About() {
  const [activeCol, setActiveCol] = React.useState('A');
  const cols = {
    A: {
      label: '(A) FIXATIONS',
      body: (
        <ul className="about-list">
          {['Agentic AI frameworks','CUDA optimization','Genetic prompt engineering','3D neural reconstruction','Synthetic data at scale'].map((t,i)=>(
            <li key={i} style={{transitionDelay:`${i*60}ms`}}>{t}</li>
          ))}
        </ul>
      )
    },
    B: {
      label: '(B) STACK',
      body: (
        <div className="skill-groups">
          <div className="skill-group">
            <div className="sg-head mono">AI / ML</div>
            <div className="chips">{['Python','PyTorch','TensorFlow','YOLOv8','Open3D'].map(c=><span key={c} className="chip">{c}</span>)}</div>
          </div>
          <div className="skill-group">
            <div className="sg-head mono">Data</div>
            <div className="chips">{['PySpark','PostgreSQL','Apache Spark','MySQL'].map(c=><span key={c} className="chip">{c}</span>)}</div>
          </div>
          <div className="skill-group">
            <div className="sg-head mono">Agents</div>
            <div className="chips">{['CrewAI','LangChain','ELIZA','Phidata'].map(c=><span key={c} className="chip">{c}</span>)}</div>
          </div>
        </div>
      )
    },
    C: {
      label: '(C) CURRENT',
      body: (
        <div className="current-card">
          {[
            ['STATUS', <span><span className="live-dot"/>Building</span>],
            ['ROLE', 'Data Science Team Lead'],
            ['AT', 'Adept Tech Solutions'],
            ['STUDYING', 'MS CS, KIT Karlsruhe'],
            ['OPEN TO', 'Research collabs, advisory'],
          ].map(([k,v],i)=>(
            <div key={i} className="cc-row"><span className="mono cc-k">{k}</span><span className="cc-v">{v}</span></div>
          ))}
        </div>
      )
    }
  };

  return (
    <section id="about" className="about" data-screen-label="02 Manifesto">
      <SectionHead idx="01" label="MANIFESTO"/>
      <div className="manifesto">
        <Reveal as="p" className="manifesto-line">The real magic happens <em>at the boundaries</em> —</Reveal>
        <Reveal as="p" className="manifesto-line" delay={120}>where research meets reality, where software meets silicon.</Reveal>
        <Reveal as="p" className="manifesto-line dim" delay={240}>I build systems that survive contact with production.</Reveal>
      </div>
      <div className="about-tabs">
        {Object.entries(cols).map(([k, v]) => (
          <button key={k} className={"at-tab mono" + (activeCol === k ? ' is-on' : '')} onClick={() => setActiveCol(k)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="about-panel" key={activeCol}>
        {cols[activeCol].body}
      </div>
    </section>
  );
}

function Affiliations() {
  const items = [
    ['Adept Tech Solutions', 'synthetic data compliance'],
    ['Antematter', 'agentic ai solutions'],
    ['DataInsight', 'ml research laboratory'],
    ['Afiniti', 'enterprise software'],
    ['Nedge Computing', 'edge acceleration'],
    ['Karlsruhe Inst. of Tech', 'ms computer science'],
  ];
  const doubled = [...items, ...items];
  return (
    <section className="affil">
      <SectionHead idx="02" label="AFFILIATIONS"/>
      <div className="marquee">
        <div className="marquee-track">
          {doubled.map((it, i) => (
            <div key={i} className="m-item">
              <span className="mono m-star">★</span>
              <span className="m-name">{it[0]}</span>
              <span className="mono m-desc">{it[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, About, Affiliations });
