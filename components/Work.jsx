// Work carousel — swipeable case cards

const CASES = [
  {
    id: 'ascend',
    tag: 'ENTERPRISE · 2025—NOW',
    title: 'Ascend.',
    italic: 'a data engine with DNA.',
    body: 'A modular data-engineering framework with proprietary DNA Signature Technology spanning flat-file and relational database synthesis. Terabyte-scale datasets compressed to portable statistical fingerprints — reconstructable with 99.5% fidelity.',
    kvs: [['FIDELITY','99.5','%'],['SCALE','10','M+'],['SPEED','10','×']],
    tech: ['PySpark','PostgreSQL','Apache Spark','Python'],
    fig: 'FIG.01 — DNA SIGNATURE',
    detail: ['TABLE_DNA','REL_DNA','JUNCTION_DNA'],
    metrics: [['φ','0.995'],['σ²','0.002'],['H','7.42 bit'],['DIM','512 → 64'],['ROWS','10⁹+'],['COMP','×127']],
    vis: 'helix',
  },
  {
    id: 'artisan',
    tag: 'COMPUTER VISION · 2024—NOW',
    title: 'Artisan.',
    italic: 'roofs read from the sky.',
    body: 'Satellite imagery fused with LiDAR point clouds. YOLOv8 detection, Open3D reconstruction, multi-stage geometric algorithms that classify ridges, hips, valleys and rakes with contractor-grade tolerance.',
    kvs: [['ACCURACY','95','%'],['TOLERANCE','±2','%'],['RUNTIME','<1','MIN']],
    tech: ['YOLOv8','Open3D','LiDAR','QGIS'],
    fig: 'FIG.02 — AERIAL DECOMPOSITION',
    detail: ['YOLO_V8','OPEN3D','LIDAR_PCD'],
    metrics: [['θ','22.5°'],['PITCH','5:12'],['AREA','2,340 ft²'],['EDGES','14'],['IoU','0.942'],['mAP','0.956']],
    vis: 'roof',
  },
  {
    id: 'antai',
    tag: 'MULTI-AGENT · 2024—2025',
    title: 'Ant-AI.',
    italic: 'prompts that evolve themselves.',
    body: 'A genetic multi-agent framework built on CrewAI. Synthesis, QA, mutation and crossover agents collaborate through evolutionary loops — reducing prompt ambiguity 70% for low-parameter LLMs, fully autonomously.',
    kvs: [['AMBIGUITY','−70','%'],['AUTOMATION','100','%'],['AGENTS','N','DYN']],
    tech: ['CrewAI','LangChain','Genetic Algos','Streamlit'],
    fig: 'FIG.03 — AGENT SWARM',
    detail: ['SYNTHESIS','QA','MUTATION','CROSSOVER'],
    metrics: [['N','14'],['EDGES','38'],['GEN','127'],['FIT','0.87'],['AMBIG','−70%'],['LOSS','0.143']],
    vis: 'swarm',
  },
];

function HelixViz() {
  const rungs = 14;
  return (
    <div className="vis-helix">
      {[...Array(rungs)].map((_, i) => {
        const t = i / (rungs - 1);
        const y = t * 100;
        const x = 50 + Math.sin(t * Math.PI * 3) * 30;
        return <div key={i} className="helix-rung" style={{ top: `${y}%`, left: `${x}%`, animationDelay: `${i * 80}ms` }}/>;
      })}
      <div className="helix-scan"/>
    </div>
  );
}

function RoofViz() {
  return (
    <svg className="vis-roof" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="gridp-m" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(26,25,22,0.08)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="400" height="260" fill="url(#gridp-m)"/>
      <polygon points="100,170 200,70 300,170 300,230 100,230" fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
      <polygon points="100,170 200,70 300,170" fill="rgba(184,80,44,0.1)" stroke="var(--accent)" strokeWidth="1"/>
      <line x1="200" y1="70" x2="200" y2="230" stroke="var(--accent2)" strokeWidth="1.5" strokeDasharray="4 4"/>
      <circle cx="200" cy="70" r="4" fill="var(--accent2)"/>
      <circle cx="100" cy="170" r="3" fill="var(--accent)"/>
      <circle cx="300" cy="170" r="3" fill="var(--accent)"/>
      <g fontFamily="JetBrains Mono" fontSize="8" fill="rgba(26,25,22,0.55)">
        <text x="210" y="65">RIDGE · 24.3m</text>
        <text x="50" y="165">HIP_L</text>
        <text x="308" y="165">HIP_R</text>
      </g>
      <line x1="0" y1="0" x2="0" y2="260" stroke="var(--accent2)" strokeWidth="1" opacity="0.5" className="roof-scan"/>
    </svg>
  );
}

function SwarmViz() {
  // Deterministic agent swarm
  const nodes = React.useMemo(() => {
    const pts = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const r = 60 + (i % 3) * 25;
      pts.push({ x: 200 + Math.cos(a) * r, y: 130 + Math.sin(a) * r * 0.8, role: i % 4 });
    }
    return pts;
  }, []);
  const edges = React.useMemo(() => {
    const e = [];
    for (let i = 0; i < nodes.length; i++) {
      e.push([i, (i + 3) % nodes.length]);
      e.push([i, (i + 5) % nodes.length]);
    }
    return e;
  }, [nodes]);
  const colors = ['var(--accent)', 'var(--accent2)', 'var(--fg)', 'var(--fg-dim)'];
  return (
    <svg className="vis-swarm" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(26,25,22,0.18)" strokeWidth="0.8" fill="none">
        {edges.map(([a,b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}/>
        ))}
      </g>
      <g>
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={i % 4 === 0 ? 5 : 3} fill={colors[n.role]}>
            <animate attributeName="r" values={`${i%4===0?5:3};${i%4===0?7:5};${i%4===0?5:3}`} dur={`${2+i%3}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </g>
    </svg>
  );
}

function CaseViz({ kind }) {
  return (
    <div className="case-viz">
      <div className="cv-label mono">FIG</div>
      <div className="cv-stage">
        {kind === 'helix' && <HelixViz/>}
        {kind === 'roof' && <RoofViz/>}
        {kind === 'swarm' && <SwarmViz/>}
      </div>
      <div className="cv-corner tl">┌</div>
      <div className="cv-corner tr">┐</div>
      <div className="cv-corner bl">└</div>
      <div className="cv-corner br">┘</div>
    </div>
  );
}

function CaseCard({ c, idx, total, expanded, onToggle }) {
  return (
    <article className={"case-card" + (expanded ? " is-expanded" : "")}>
      <div className="cc-top">
        <span className="mono cc-idx">({String(idx+1).padStart(2,'0')} / {String(total).padStart(2,'0')})</span>
        <span className="mono cc-tag">{c.tag}</span>
      </div>

      <CaseViz kind={c.vis}/>

      <h3 className="cc-title">
        {c.title}
        <span className="cc-italic"> {c.italic}</span>
      </h3>

      <div className="cc-kvs">
        {c.kvs.map((kv, i) => (
          <div key={i} className="ckv">
            <span className="mono ckv-k">{kv[0]}</span>
            <div className="ckv-v">{kv[1]}<span className="ckv-s mono">{kv[2]}</span></div>
          </div>
        ))}
      </div>

      <button className="cc-toggle" onClick={onToggle}>
        <span className="mono">{expanded ? 'COLLAPSE' : 'READ MORE'}</span>
        <Icon.ChevD style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }}/>
      </button>

      <div className="cc-expand" style={{ maxHeight: expanded ? 800 : 0 }}>
        <p className="cc-body">{c.body}</p>
        <div className="cc-metrics">
          {c.metrics.map((m, i) => (
            <div key={i} className="ccm"><span className="mono ccm-k">{m[0]}</span><span className="ccm-v">{m[1]}</span></div>
          ))}
        </div>
        <div className="chips">
          {c.tech.map(t => <span key={t} className="chip">{t}</span>)}
        </div>
        <div className="cc-detail mono">{c.detail.join(' · ')}<span className="blink"> ●</span></div>
      </div>
    </article>
  );
}

function Work() {
  const [active, setActive] = React.useState(0);
  const [expanded, setExpanded] = React.useState(null);
  const trackRef = React.useRef(null);

  const scrollTo = (i) => {
    const track = trackRef.current; if (!track) return;
    const card = track.children[i];
    if (card) track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  };

  const onScroll = () => {
    const track = trackRef.current; if (!track) return;
    const w = track.clientWidth;
    const idx = Math.round(track.scrollLeft / w);
    if (idx !== active && idx >= 0 && idx < CASES.length) setActive(idx);
  };

  return (
    <section id="work" className="work" data-screen-label="03 Work">
      <SectionHead idx="03" label="SELECTED WORK"/>
      <div className="work-intro">
        <h2 className="sec-h">Three systems<br/>in production,<br/><em>spanning synthesis,<br/>perception and agency.</em></h2>
        <div className="mono work-sub">SWIPE → →</div>
      </div>

      <div className="work-track" ref={trackRef} onScroll={onScroll}>
        {CASES.map((c, i) => (
          <div key={c.id} className="work-slide">
            <CaseCard c={c} idx={i} total={CASES.length} expanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)}/>
          </div>
        ))}
      </div>

      <div className="work-dots">
        {CASES.map((_, i) => (
          <button key={i} className={"wd" + (i === active ? ' is-on' : '')} onClick={() => scrollTo(i)} aria-label={`Go to project ${i+1}`}>
            <span className="mono">{String(i+1).padStart(2,'0')}</span>
          </button>
        ))}
      </div>

      <div className="work-end">
        <div className="mono">( END OF SELECTED WORK )</div>
        <h3 className="we-title">More is in flight.<br/><em>Let's build something next.</em></h3>
        <button className="btn-out" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
          <span>Start a conversation</span>
          <Icon.Arrow/>
        </button>
      </div>
    </section>
  );
}

Object.assign(window, { Work });
