# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + Motion (framer-motion), built to static files and deployed to GitHub Pages at its-hamza.com (CNAME) through a GitHub Actions workflow. Chosen by the owner in place of the previous no-build setup (a bundled single-file `index.html` built on React + Babel standalone).

## Users

Two audiences, weighted roughly equally:

- **Hiring managers and recruiters** screening for AI-systems or ML-engineering roles. They need to know quickly what Hamza owned, what it achieved, and what stack he used.
- **Research collaborators and PIs** (KIT and similar labs). They read for method, results, and how the work was validated.

Each case study and role panel has to serve both: impact and scope first, method close behind.

## Product Purpose

Personal portfolio of Hamza Aamer, Senior AI Engineer at Aiden Risk and Research Assistant (HiWi) at KIT. It shows end-to-end AI-systems work, from GPU kernel scheduling to on-device runtimes, vision/3D models, multi-agent systems, and data synthesis. Success means a visitor leaves understanding what he has built, at what depth, and how to reach him (email, résumé PDF, GitHub).

## Positioning

His work spans the whole stack: kernel-level GPU resource management (eBPF/struct_ops, DVFS), edge runtimes (ExecuTorch), production vision and 3D pipelines, multi-agent frameworks, and synthetic-data engines. Each claim is backed by a role or project with a measured result.

## Capabilities and Constraints

- Static site with no backend. Contact goes through mailto, plus links to the résumé PDF and GitHub.
- Roles and projects share one data model. A project may belong to the role that built it, or be independent or academic.
- Client and employer projects (Ascend, Artisan, Ant-AI) are proprietary: no source links. Independent projects link to GitHub.
- The "Ask the notebook" LLM Q&A and the GPU scheduler "Lab" simulation from the previous site are **dropped** in this redesign. The owner did not opt to keep them. The Silicon → Product capability stack and the ⌘K palette are also dropped (owner decision, 2026-10-15).
- Research positions (CES/ITEC and TECO HiWi roles at KIT, and the DataInsight research assistantship) appear in their own Research section, separate from industry work experience. The owner considers them research experience, not work experience. They are not case studies in the projects grid.

## Brand Commitments

- Name: Hamza Aamer. Domain: its-hamza.com. Based in Karlsruhe, Germany.
- Voice: plain, declarative, specific numbers, no marketing superlatives.

## Evidence on Hand

Source of truth for facts is `resume.pdf` (owner-confirmed: where the résumé and the old site disagree, the résumé wins). Aiden Risk (Senior AI Engineer, Sep 2026 – present, https://aidenrisk.com/) comes from the live site and is newer than the résumé.

Roles:
- Aiden Risk: Senior AI Engineer, Sep 2026 – present. No detail beyond title and date.
- CES/ITEC, KIT (Prof. Dr. Jörg Henkel): Research Assistant (HiWi), Apr 2026 – present. ML-driven GPU resource management for LLM inference; extends the gpu_ext eBPF/struct_ops framework; channel-disable scheduling policy (up to 15× latency improvement); unified-memory prefetch/oversubscription policies (5–12% throughput gain); reproduced kernel-level DVFS results; characterised GPU frequency-switching cost via NVML.
- TECO, KIT (Prof. Dr. Michael Beigl): Research Assistant (HiWi), Apr 2026 – present. edge-ml microservice platform (FastAPI, React, Docker) for wearable/IoT sensor time-series; on-device export via ExecuTorch to .pte with auto-generated Kotlin integration code; multi-architecture CI/CD.
- Adept Tech Solutions: AI Engineer & Product Lead, Nov 2024 – Aug 2026. Data synthesis and analysis (10× improvement in data-generation accuracy); built Ascend and Artisan; production CLI tooling on Spark clusters.
- Antematter: AI Engineer, Jan 2023 – Nov 2024. Multi-agent frameworks (CrewAI, LangChain, ELIZA, Phidata), outreach up 10×; built Ant-AI; supervisory agents that spawn function-calling agents; ELIZA personality clones (8× online engagement); Nedge Computing × NVIDIA project on virtual cloud systems with split vGPU access to NVIDIA A16 GPUs.
- DataInsight Research Lab, FAST-NUCES: Research Assistant, May 2023 – Dec 2023. $90K ML project on document understanding; YOLO pipeline (2.5× faster dataset acquisition); OCR on medical prescriptions at 84% accuracy; end-to-end transformer approach (DocParser, Donut) cut compute by 50%.
- Afiniti Software Solutions: Project Trainee, Jun 2020 – Aug 2021. NLP and speech-to-text system; client-facing delivery.

Education: M.Sc. Computer Science (Human-centred Machine Intelligence), KIT, Oct 2025 – Aug 2027 (expected). B.Sc. Computer Science, FAST-NUCES, Aug 2021 – Jun 2025, Gold Medalist, Rector's List of Honor.

Projects: Ascend (04/2025, at Adept), Artisan (03/2025, at Adept), Ant-AI (11/2024, at Antematter), GenSynth (07/2024, CycleGAN/cGAN sketch↔face), Archeon (2024, Gaussian splats → VR, GitHub), NeuroCart (10/2023, GitHub), F1 Game (2023, GitHub), Multi-Core NN OS in C (05/2023, GitHub).

Assets: `assets/images/profile.jpg` (portrait), `assets/images/projects/{ascend,artisan,antai}.png` (process infographics in orange; approved for use), company and education logos in `assets/images/companies/` and `assets/images/education/`, `resume.pdf`.

**Do not fabricate.** The owner did not approve the extra metrics that appear only in the old `assets/js/projects.js` (95% classification, ±2% tolerance, 40% projection gain). "Datasets exceeding 10M rows" is in the résumé and may be used as worded there. No screenshots, demos, or outcome data exist for Aiden Risk, GenSynth, Archeon, NeuroCart, F1 Game, or the Multi-Core OS beyond what is listed above. Ask the owner for missing case-study material rather than inventing it.

## Product Principles

1. Every claim is backed: a number, a role, or a link.
2. Show depth across the stack, not a list of keywords.
3. Each piece of work tells its own story: the problem, what he owned, how he did it, and the result.
4. Plain sentences over adjectives.

## Accessibility & Inclusion

All motion respects `prefers-reduced-motion`. Keyboard access to every interaction (timeline, filters, case-study open/close). WCAG AA contrast.
