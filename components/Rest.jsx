// Timeline, Playground, Contact

const TIMELINE = [
  { year: '2025 — PRES.', role: 'Data Science Team Lead', co: 'ADEPT TECH SOLUTIONS', body: 'Spearheading advanced data synthesis & analysis systems. Engineered proprietary DNA Signature Technology with 99.5% fidelity.', chips: ['PySpark','DNA Signatures','Computer Vision','Open3D'] },
  { year: '2024 — 2025', role: 'AI Engineer', co: 'ANTEMATTER', body: 'Built multi-agent frameworks across CrewAI, LangChain, ELIZA, Phidata — boosting company outreach 10×. Authored Ant-AI, a genetic multi-agent prompt-optimization framework.', chips: ['CrewAI','LangChain','ELIZA','Genetic Algos'] },
  { year: '2023 — 2023', role: 'Research Analyst', co: 'DATAINSIGHT', body: '$90K ML project. Built a YOLO + image-processing pipeline for handwritten/printed text recognition — 2.5× dataset acquisition speed.', chips: ['Python','TensorFlow','YOLO','TrOCR'] },
  { year: '2020 — 2021', role: 'Project Trainee', co: 'AFINITI SOFTWARE SOLUTIONS', body: 'NLP and Speech-to-Text systems powered by AI. Client-facing technical delivery.', chips: ['NLP','Speech-to-Text'] },
];

function Timeline() {
  const [open, setOpen] = React.useState(0);
  return (
    <section id="timeline" className="timeline-sec" data-screen-label="04 Timeline">
      <SectionHead idx="04" label="TIMELINE"/>
      <h2 className="sec-h">Five years<br/><em>of shipping<br/>intelligence.</em></h2>
      <div className="tl">
        <div className="tl-rail"/>
        {TIMELINE.map((t, i) => (
          <Reveal key={i} delay={i * 80} className="tl-item">
            <div className="tl-node" style={{ background: open === i ? 'var(--accent)' : 'var(--bg)' }}/>
            <div className="mono tl-year">{t.year}</div>
            <button className={"tl-card" + (open === i ? ' is-open' : '')} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="tl-card-top">
                <h4 className="tl-role">{t.role}</h4>
                <Icon.ChevD className="tl-chev" style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}/>
              </div>
              <div className="mono tl-co">{t.co}</div>
              <div className="tl-expand" style={{ maxHeight: open === i ? 400 : 0 }}>
                <p className="tl-body">{t.body}</p>
                <div className="chips">{t.chips.map(c => <span key={c} className="chip">{c}</span>)}</div>
              </div>
            </button>
          </Reveal>
        ))}
        <div className="tl-item tl-edu-item">
          <div className="tl-node edu"/>
          <div className="mono tl-year">EDUCATION</div>
          <div className="tl-edu">
            <div className="edu-block">
              <div className="edu-h">MS Computer Science</div>
              <div className="mono edu-p">KARLSRUHE INST. OF TECH · 2025—2027</div>
            </div>
            <div className="edu-block">
              <div className="edu-h">BS Computer Science</div>
              <div className="mono edu-p">NUCES · 2021—2025</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PLAY = [
  { tag: 'VR / GAUSSIAN SPLATS', title: 'Archeon', body: 'Capture real-world spaces with a phone, reconstruct as Gaussian splats, explore in VR. The seam between atoms and pixels.', year: '2024', href: 'https://github.com/hamza-aamer/Archeon' },
  { tag: 'GRAPHICS / OPTIMIZATION', title: 'F1 Game', body: 'Physics, rendering and AI opponents in a lightweight racing sandbox — a love letter to tight feedback loops.', year: '2023', href: 'https://github.com/hamza-aamer/F1-Car-Game' },
  { tag: 'MULTIMODAL AI', title: 'CaptureCart', body: 'Erases the seam between online and in-store shopping. Real-time recognition, unified catalogs, a single cart.', year: '2023', href: 'https://github.com/hamza-aamer/CaptureCart-A-Cognitive-Shopping-Fusion-Framework-for-the-Future' },
  { tag: 'SYSTEMS', title: 'NN-OS', body: 'Multi-core operating system running a neural network across processes & threads. OS and ML in one codebase.', year: '2022', href: 'https://github.com/hamza-aamer/Multi-Core-Neural-Network-Operating-System-in-C-' },
];

function GhGraph() {
  // 7 rows × 16 cols
  const cells = React.useMemo(() => {
    const out = [];
    let seed = 42;
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = 0; i < 7 * 16; i++) {
      const r = rand();
      out.push(r > 0.7 ? 3 : r > 0.5 ? 2 : r > 0.3 ? 1 : 0);
    }
    return out;
  }, []);
  return (
    <div className="gh-graph">
      {cells.map((l, i) => <div key={i} className="gh-cell" data-lvl={l || undefined}/>)}
    </div>
  );
}

function Playground() {
  return (
    <section id="playground" className="pg" data-screen-label="05 Playground">
      <SectionHead idx="05" label="PLAYGROUND"/>
      <h2 className="sec-h">Small experiments,<br/><em>big questions.</em></h2>
      <div className="pg-list">
        {PLAY.map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <a className="pg-card" href={p.href} target="_blank" rel="noopener">
              <div className="mono pg-tag">{p.tag}</div>
              <h3 className="pg-h">{p.title}</h3>
              <p className="pg-p">{p.body}</p>
              <div className="pg-foot">
                <span className="mono">{p.year}</span>
                <span className="pg-arrow">↗</span>
              </div>
            </a>
          </Reveal>
        ))}
        <Reveal delay={240} className="pg-card pg-gh">
          <div className="mono pg-tag">LIVE / GITHUB</div>
          <h3 className="pg-h">Contribution Rhythm</h3>
          <p className="pg-p">A year of commits — every square a day in the life of this codebase.</p>
          <GhGraph/>
          <div className="pg-foot">
            <span className="mono">@hamza-aamer</span>
            <span className="mono">UPDATED LIVE</span>
          </div>
        </Reveal>
        <Reveal delay={300} className="pg-card pg-now">
          <div className="mono pg-tag">NOW</div>
          <h3 className="pg-h">Currently reading</h3>
          <ul className="now-list">
            <li>Building ML Systems — Chip Huyen</li>
            <li>The Annotated Transformer — Harvard NLP</li>
            <li>CUDA by Example — NVIDIA</li>
          </ul>
          <div className="pg-foot">
            <span className="mono">UPDATED APR 2026</span>
            <span className="mono">KARLSRUHE, DE</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [data, setData] = React.useState({ name: '', email: '', message: '' });
  const [errs, setErrs] = React.useState({});
  const [state, setState] = React.useState('idle'); // idle | sending | sent

  const submit = (e) => {
    e.preventDefault();
    const newErrs = {};
    if (!data.name.trim()) newErrs.name = 'required';
    if (!data.email.trim()) newErrs.email = 'required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrs.email = 'invalid';
    if (!data.message.trim()) newErrs.message = 'required';
    setErrs(newErrs);
    if (Object.keys(newErrs).length) return;
    setState('sending');
    setTimeout(() => setState('sent'), 1200);
  };

  return (
    <section id="contact" className="contact" data-screen-label="06 Contact">
      <SectionHead idx="06" label="CONTACT"/>
      <h2 className="contact-lead">Have a problem<br/>worth solving?</h2>
      <a href="mailto:hamzaaamer6@gmail.com" className="contact-mail">
        <span className="cm-ser">hamzaaamer6</span>
        <span className="cm-at">@</span>
        <span className="cm-ser">gmail.com</span>
        <Icon.Arrow className="cm-arr"/>
      </a>

      <div className="contact-block">
        <div className="mono cb-k">(A) CHANNELS</div>
        <ul className="cb-list">
          <li><a href="mailto:hamzaaamer6@gmail.com"><span>Email</span><span className="mono cb-v">hamzaaamer6@gmail.com</span></a></li>
          <li><a href="tel:+4915203017132"><span>Phone</span><span className="mono cb-v">+49 152 0301 7132</span></a></li>
          <li><a href="https://linkedin.com/in/hamza-aamer" target="_blank" rel="noopener"><span>LinkedIn</span><span className="mono cb-v">/hamza-aamer ↗</span></a></li>
          <li><a href="https://github.com/hamza-aamer" target="_blank" rel="noopener"><span>GitHub</span><span className="mono cb-v">/hamza-aamer ↗</span></a></li>
        </ul>
      </div>

      <div className="contact-block">
        <div className="mono cb-k">(B) LOCATION</div>
        <ul className="cb-list static">
          <li><span>Karlsruhe, Germany</span><span className="mono cb-v">CET · UTC+1</span></li>
          <li><span>Open to remote & on-site</span></li>
          <li><span>Available for research collaborations</span></li>
        </ul>
      </div>

      <div className="contact-block">
        <div className="mono cb-k">(C) BRIEF</div>
        {state === 'sent' ? (
          <div className="cf-sent">
            <div className="mono cf-ok">✓ TRANSMITTED</div>
            <p>Thanks, {data.name.split(' ')[0] || 'friend'}. I'll reply within 48 hours.</p>
            <button className="btn-out" onClick={() => { setState('idle'); setData({ name:'', email:'', message:'' }); }}>
              <span>Send another</span>
            </button>
          </div>
        ) : (
          <form className="cf" onSubmit={submit}>
            {[
              { k: 'NAME', n: 'name', type: 'text' },
              { k: 'EMAIL', n: 'email', type: 'email' },
            ].map(f => (
              <label key={f.n} className={"cf-row" + (errs[f.n] ? ' has-err' : '')}>
                <span className="mono cf-k">{f.k}</span>
                <input type={f.type} value={data[f.n]} onChange={(e) => { setData({...data, [f.n]: e.target.value}); setErrs({...errs, [f.n]: null}); }}/>
                {errs[f.n] && <span className="mono cf-err">{errs[f.n]}</span>}
              </label>
            ))}
            <label className={"cf-row" + (errs.message ? ' has-err' : '')}>
              <span className="mono cf-k">MSG</span>
              <textarea rows="3" value={data.message} onChange={(e) => { setData({...data, message: e.target.value}); setErrs({...errs, message: null}); }}/>
              {errs.message && <span className="mono cf-err">{errs.message}</span>}
            </label>
            <button type="submit" className="cf-submit" disabled={state === 'sending'}>
              <span>{state === 'sending' ? 'Sending…' : 'Send brief'}</span>
              <Icon.Arrow/>
            </button>
          </form>
        )}
      </div>

      <footer className="footer">
        <div className="mono">© 2026 HAMZA AAMER</div>
        <div className="mono">BUILT IN KARLSRUHE · CRAFTED WITH OBSESSION</div>
        <div className="mono">v4.2.0 · <a href="#home" onClick={(e)=>{e.preventDefault();document.getElementById('home').scrollIntoView({behavior:'smooth'})}}>RETURN TO TOP ↑</a></div>
      </footer>
    </section>
  );
}

Object.assign(window, { Timeline, Playground, Contact });
