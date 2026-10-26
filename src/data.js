// Every fact on the site comes from resume.pdf or the previous live site.
// Where the two disagreed, resume.pdf wins. Nothing here is invented: a case
// study that lacks a field simply leaves that section out.

export const person = {
  name: 'Hamza Aamer',
  email: 'hamzaaamer6@gmail.com',
  github: 'https://github.com/hamza-aamer',
  linkedin: 'https://linkedin.com/in/hamza-aamer',
  resume: '/resume.pdf',
  city: 'Karlsruhe, Germany',
  line: 'I build AI systems from the GPU kernel to the agent loop.',
  now: [
    { role: 'Senior AI Engineer', org: 'Aiden Risk', href: 'https://aidenrisk.com/' },
    { role: 'Research Assistant', org: 'KIT' },
  ],
  openTo: 'research collaborations and AI-systems roles',
};

export const domains = [
  { id: 'all', label: 'All' },
  { id: 'ml', label: 'ML & Vision' },
  { id: 'agents', label: 'Agents' },
  { id: 'data', label: 'Data' },
  { id: 'systems', label: 'Systems' },
];

const pic = (file, alt, credit, href, licence) => ({ src: `/world/${file}`, alt, credit, href, licence });


export const projects = [
  {
    // Confidential client work: the page states the problem and the results,
    // never how the system solves it.
    id: 'sonar',
    title: 'Sonar',
    kind: 'One submission, every carrier',
    domains: ['agents'],
    domainLabel: 'Agents',
    year: '2026',
    date: 'September 2026',
    where: 'Aiden Risk',
    role: 'My idea, designed and built from scratch at Aiden Risk, where I am Senior AI Engineer. I still lead it, and review every change from the team that has since joined it.',
    problem:
      'Commercial insurance is still quoted through carrier portals. A broker quoting one small business types the same client into every insurer’s site, again and again.',
    challenge: [
      { h: 'No shared language', p: 'Every portal asks for the same client differently. One wants the “Named insured”, another the “Legal entity name”, a third the “Business name”. Most have no API, and the ones that do don’t share one.' },
      { h: 'Scripts break', p: 'The usual answer is to map every field of every portal in advance and replay a script. It breaks the day a carrier moves a button, and has to be rebuilt for every new carrier.' },
      { h: 'Safety is not optional', p: 'Software working inside an insurer’s website must only ever ask for quotes, never buy or bind a policy, and must treat every login with care.' },
    ],
    diagram: 'sonar',
    outcome: [
      { v: '50+', u: '', l: 'carriers onboarded on one system' },
      { v: '1', u: '', l: 'submission, quoted on as many carriers as needed, in parallel' },
    ],
    note: 'Sonar is an AI-agent system that takes one submission to every carrier and brings the quotes back. How it does that is confidential.',
    stack: ['Python', 'AI agents', 'LLMs'],
    proprietary: true,
  },
  {
    id: 'ascend',
    title: 'Ascend',
    kind: 'A data engineering framework',
    domains: ['data'],
    domainLabel: 'Data',
    year: '2025',
    date: 'April 2025',
    where: 'Adept Tech Solutions',
    role: 'Built at Adept Tech Solutions, where I was AI Engineer & Product Lead and led the data synthesis and analysis work.',
    problem:
      'Generate synthetic data from real flat files and relational databases without losing the relationships inside them: the statistics of each table, and the keys that tie tables together.',
    approach: [
      { h: 'Flat-file DNA', p: 'Extracts a statistical fingerprint of a file through multiple binning strategies and distributed correlation signatures, with support for time series and PII anonymisation.' },
      { h: 'Database DNA', p: 'Captures three DNA types (table, relationship, junction) with a hybrid multi-type correlation engine: adaptive binning, degree-first child generation, joint parent conditioning for N:N relationships, multi-level fallback chains and encrypted signature packaging.' },
      { h: 'Rule-based synthesis', p: 'Layers configurable business logic over the statistical generator: multi-layered scopes with compound conditions, two-phase generation in topological dependency order, multi-hop join-path conditions and filtered foreign-key resolution with uniqueness tracking.' },
      { h: 'Specialised modules', p: '13+ specialised data engineering modules, including intelligent class balancing that calculates its own scaling factors, outlier detection, time-series standardisation and precision correction.' },
      { h: 'Production CLI on Spark', p: 'Command-line tools with distributed-computing optimisation, so Ascend workloads run as pipelines across multi-node Spark clusters.' },
    ],
    diagram: 'ascend',
    outcome: [
      { v: '99.5', u: '%', l: 'statistical fidelity, with full cross-table relationship preservation' },
      { v: '10M+', u: '', l: 'rows in the datasets processed, with synthesis time cut from hours to minutes' },
      { v: '30+', u: '', l: 'modules for analysis, curation, feature engineering and transformation' },
    ],
    note: 'Terabyte-scale datasets reduce to compact, portable signatures.',
    stack: ['Python', 'PySpark', 'PostgreSQL', 'MySQL', 'Statistical modelling'],
    proprietary: true,
  },
  {
    id: 'ant-ai',
    title: 'Ant-AI',
    kind: 'Prompts that evolve',
    domains: ['agents'],
    domainLabel: 'Agents',
    year: '2024',
    date: 'November 2024',
    where: 'Antematter',
    role: 'Built at Antematter, where I was an AI Engineer.',
    problem:
      'Low-parameter LLMs are sensitive to how a prompt is written. Ant-AI optimises their system prompts automatically, instead of by hand.',
    approach: [
      { h: 'Genetic algorithm engine', p: 'The backbone: prompts evolve through mutation and crossover, carried out by specialised agentic Mutation and Crossover crews.' },
      { h: 'Multi-agent system', p: 'Specialised agents for synthesis, reasoning and quality assurance, built with CrewAI. Supervisory agents can generate additional agents with function-calling abilities when a task needs them.' },
      { h: 'Structured tools', p: 'Tree of Thoughts reasoning and structured prompt tagging give each generation a systematic evaluation.' },
      { h: 'Autonomous optimisation', p: 'Prompt generation and refinement run without a human in the loop.' },
    ],
    diagram: 'antai',
    outcome: [
      { v: '−70', u: '%', l: 'input prompt ambiguity for low-parameter LLMs' },
    ],
    note: 'Prompt engineering is fully automated.',
    stack: ['Python', 'CrewAI', 'Streamlit', 'Poetry', 'Genetic algorithms', 'Tree of Thoughts'],
    proprietary: true,
  },
  {
    id: 'artisan',
    title: 'Artisan',
    kind: 'Aerial roof analysis',
    domains: ['ml'],
    domainLabel: 'ML & Vision',
    year: '2025',
    date: 'March 2025',
    where: 'Adept Tech Solutions',
    role: 'Built at Adept Tech Solutions, where I was AI Engineer & Product Lead.',
    problem:
      'Produce a contractor-grade roof measurement report from above: satellite imagery and LiDAR point clouds in, classified roof components and measurements out.',
    approach: [
      { h: 'Data acquisition and preprocessing', p: 'Gathering and cleaning satellite imagery and LiDAR data for analysis.' },
      { h: '3D reconstruction', p: 'Building a 3D model of the roof from the point cloud with Open3D.' },
      { h: 'Geospatial alignment', p: 'Aligning the 3D model with the imagery in QGIS.' },
      { h: 'Object detection', p: 'Classifying roof components with YOLOv8.' },
      { h: 'Geometric algorithms', p: 'Multi-stage geometric algorithms extract precise measurements.' },
      { h: 'CRM boundary refinement', p: 'Refining accuracy against CRM boundary data.' },
    ],
    diagram: 'artisan',
    outcome: [
      { v: '<1', u: 'min', l: 'for a comprehensive roof analysis and report' },
    ],
    stack: ['Python', 'Flask', 'YOLOv8', 'Open3D', 'QGIS', 'LiDAR'],
    proprietary: true,
  },
  {
    id: 'gensynth',
    title: 'GenSynth',
    kind: 'Sketch to face, and back',
    domains: ['ml'],
    domainLabel: 'ML & Vision',
    year: '2024',
    date: 'July 2024',
    problem:
      'Translate face sketches into photographic images, and photographs back into sketches.',
    approach: [
      { h: 'Adversarial translation', p: 'A generative adversarial framework using CycleGAN and conditional GANs for bidirectional sketch-to-image translation.' },
      { h: 'Losses', p: 'Cycle-consistency and pixel-wise L1 loss keep the synthesis precise in both directions.' },
    ],
    stack: ['Python', 'PyTorch', 'CycleGAN', 'Conditional GANs'],
  },
  {
    id: 'archeon',
    title: 'Archeon',
    kind: 'Rooms, rebuilt in VR',
    domains: ['ml'],
    domainLabel: 'ML & Vision',
    year: '2024',
    date: '2024',
    where: 'Independent',
    problem: 'Capture a real space with a phone, reconstruct it as Gaussian splats, and explore it in VR.',
    stack: ['Gaussian splats', 'VR', '3D reconstruction'],
    href: 'https://github.com/hamza-aamer/Archeon',
  },
  {
    id: 'neurocart',
    title: 'NeuroCart',
    kind: 'One cart, two worlds',
    domains: ['ml'],
    domainLabel: 'ML & Vision',
    year: '2023',
    date: 'October 2023',
    where: 'Independent',
    problem: 'Merge online and in-store shopping into one experience and one cart.',
    approach: [
      { h: 'Real-time recognition', p: 'A trained vision model detects items in real time through the phone’s camera.' },
      { h: 'Unified catalogue', p: 'Online and physical catalogues are unified, so online and in-store shopping share one cart.' },
    ],
    stack: ['Python', 'Java', 'Kotlin', 'XML', 'Colab'],
    href: 'https://github.com/hamza-aamer/CaptureCart-A-Cognitive-Shopping-Fusion-Framework-for-the-Future',
  },
  {
    id: 'multicore-os',
    title: 'Multi-Core NN OS',
    kind: 'An operating system that thinks',
    domains: ['systems'],
    domainLabel: 'Systems',
    year: '2023',
    date: 'May 2023',
    where: 'Independent',
    problem:
      'Run a neural network architecture inside an operating system, spread across separate processes and threads so that every core does parallel work.',
    stack: ['C', 'Processes', 'Threads', 'Neural networks'],
    href: 'https://github.com/hamza-aamer/Multi-Core-Neural-Network-Operating-System-in-C-',
  },
  {
    id: 'f1',
    title: 'F1 Game',
    kind: 'Tight feedback loops',
    domains: ['systems'],
    domainLabel: 'Systems',
    year: '2023',
    date: '2023',
    where: 'Independent',
    problem: 'A lightweight racing sandbox with its own physics, rendering and AI opponents.',
    stack: ['Physics', 'Rendering', 'Game AI'],
    href: 'https://github.com/hamza-aamer/F1-Car-Game',
  },
];

export const research = [
  {
    id: 'ces',
    lab: 'Chair for Embedded Systems (CES/ITEC), KIT',
    lead: 'Prof. Dr. Jörg Henkel',
    role: 'Research Assistant (HiWi)',
    dates: 'April 2026 – present',
    topic: 'ML-driven GPU resource management for LLM inference',
    points: [
      'Extending the gpu_ext eBPF/struct_ops framework to expose scheduling, memory and frequency levers on real hardware.',
      'Designed and validated a channel-disable scheduling policy that separates latency-critical from best-effort work: up to 15× better latency.',
      'Evaluated unified-memory prefetch and oversubscription policies: 5–12% more throughput.',
      'Reproduced published kernel-level DVFS results, and characterised GPU frequency-switching cost through NVML, separating API latency from the physical clock transition to find the feasible granularity of frequency control.',
    ],
    stack: ['eBPF', 'struct_ops', 'CUDA', 'NVML', 'DVFS', 'LLM inference'],
  },
  {
    id: 'teco',
    lab: 'TECO, Pervasive Computing Systems, KIT',
    lead: 'Prof. Dr. Michael Beigl',
    role: 'Research Assistant (HiWi)',
    dates: 'April 2026 – present',
    topic: 'edge-ml: machine learning for wearables',
    points: [
      'Full-stack development on edge-ml, a microservice platform for training and deploying ML models on wearable and IoT sensor time-series.',
      'Implemented on-device model export with Google ExecuTorch: trained PyTorch classifiers and their preprocessing compiled into .pte artifacts for mobile and embedded targets, with auto-generated Kotlin integration code.',
      'Built the platform’s multi-architecture CI/CD pipeline.',
    ],
    stack: ['FastAPI', 'React', 'Docker', 'PyTorch', 'ExecuTorch', 'Kotlin'],
  },
  {
    id: 'datainsight',
    lab: 'DataInsight Research Lab, FAST-NUCES',
    lead: 'Islamabad, Pakistan',
    role: 'Research Assistant',
    dates: 'May – December 2023',
    topic: 'Document understanding and text recognition',
    points: [
      'Contributed to a $90,000 machine-learning research project.',
      'Built a YOLO-based detection and image-processing pipeline for handwritten and printed text: dataset acquisition 2.5× faster.',
      'Trained an OCR model for text extraction from medical prescriptions at 84% accuracy.',
      'Replaced a multi-component OCR and language-model stack with an end-to-end transformer approach (DocParser, Donut): 50% less compute, structured output directly.',
    ],
    stack: ['Python', 'TensorFlow', 'YOLO', 'TrOCR', 'Donut'],
  },
];

// Timeline span in fractional years, for the experience bars.
export const axis = { from: 2020, to: 2027 };

export const experience = [
  {
    id: 'aiden',
    role: 'Senior AI Engineer',
    org: 'Aiden Risk',
    href: 'https://aidenrisk.com/',
    dates: 'September 2026 – present',
    span: [2026 + 8 / 12, 2027],
    now: true,
    owned: [
      'Conceived Sonar, an AI-agent system that takes one insurance submission to every carrier portal and brings the quotes back.',
      'Designed and built it from scratch, and took it from a research-lab prototype to a service the company’s platform runs on.',
      'Lead the system and review every change from the engineering team that has since joined it.',
    ],
    impact: [
      { v: '50+', l: 'carriers onboarded' },
      { v: '1', l: 'submission to every carrier, in parallel' },
    ],
    stack: ['Python', 'AI agents', 'LLMs'],
    built: ['sonar'],
  },
  {
    id: 'adept',
    role: 'AI Engineer & Product Lead',
    org: 'Adept Tech Solutions',
    dates: 'November 2024 – August 2026',
    span: [2024 + 10 / 12, 2026 + 8 / 12],
    owned: [
      'Led the development of data synthesis and analysis systems built on PySpark, statistical modelling and computer vision.',
      'Engineered the DNA Signature Technology for flat-file and relational-database synthesis.',
      'Designed the rule-based synthesis framework that layers business logic over statistical generation.',
      'Implemented 13+ specialised data engineering modules, from class balancing to time-series standardisation.',
      'Led the deployment of production CLI tools that run Ascend workloads across multi-node Spark clusters.',
    ],
    impact: [
      { v: '10×', l: 'data-generation accuracy' },
      { v: '99.5%', l: 'statistical fidelity' },
      { v: '10M+', l: 'rows in datasets processed' },
    ],
    stack: ['PySpark', 'Statistical modelling', 'Computer vision', 'Open3D', 'YOLOv8'],
    built: ['ascend', 'artisan'],
  },
  {
    id: 'antematter',
    role: 'AI Engineer',
    org: 'Antematter',
    dates: 'January 2023 – November 2024',
    span: [2023, 2024 + 10 / 12],
    owned: [
      'Contributed to multi-agent frameworks built with CrewAI, LangChain, ELIZA and Phidata.',
      'Developed Ant-AI, a genetic multi-agent framework that optimises system prompts for low-parameter LLMs.',
      'Designed supervisory agents that generate additional function-calling agents inside a crew.',
      'Deployed ELIZA-based virtual clones of real personalities that ran social-media presence and lead generation for ICP interactions.',
      'Worked on a project with Nedge Computing, in collaboration with NVIDIA, building virtual cloud systems with divided vGPU access to NVIDIA A16 GPUs.',
    ],
    impact: [
      { v: '10×', l: 'company outreach' },
      { v: '8×', l: 'online engagement' },
      { v: '−70%', l: 'prompt ambiguity' },
    ],
    stack: ['CrewAI', 'LangChain', 'ELIZA', 'Phidata', 'NVIDIA vGPU'],
    built: ['ant-ai'],
  },
  {
    id: 'afiniti',
    role: 'Project Trainee',
    org: 'Afiniti Software Solutions',
    dates: 'June 2020 – August 2021',
    span: [2020 + 5 / 12, 2021 + 7 / 12],
    owned: [
      'Designed and implemented an AI-powered natural language processing and speech-to-text system.',
      'Took part in client meetings and made sure their requirements were met.',
    ],
    stack: ['NLP', 'Speech-to-text'],
  },
];

export const education = [
  { school: 'Karlsruhe Institute of Technology', degree: 'M.Sc. Computer Science, Human-centred Machine Intelligence', dates: 'October 2025 – August 2027 (expected)' },
  { school: 'FAST-NUCES, Islamabad', degree: 'B.Sc. Computer Science, Gold Medalist, Rector’s List of Honor', dates: 'August 2021 – June 2025' },
];

export const kitPicture = pic('kit.jpg', 'The KIT Forum on the Karlsruhe campus, concrete towers in evening light', '“Karlsruher Institut für Technologie, Forum” by David M.', 'https://commons.wikimedia.org/wiki/File:Karlsruher_Institut_f%C3%BCr_Technologie,_Forum,_08.2012_-_panoramio.jpg', 'CC BY 3.0');

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
