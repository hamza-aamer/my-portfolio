// Project data - Updated with only 3 main projects
const projects = [
    {
        id: 'ascend',
        title: 'Ascend v2: Enterprise Data Engineering Framework',
        subtitle: 'Proprietary DNA Signature Technology',
        description: 'Revolutionary modular data engineering framework featuring proprietary DNA signature extraction that captures statistical properties of datasets. Enables synthetic data generation preserving complex relationships with 99.5% statistical fidelity.',
        image: 'assets/images/projects/ascend-hero.jpg',
        technologies: ['Python', 'PySpark', 'PostgreSQL', 'MySQL', 'Statistical Modeling', 'Apache Spark'],
        achievements: [
            '99.5% statistical fidelity preservation across massive datasets',
            '13+ specialized modules for intelligent data curation',
            'Processing capabilities exceeding 10M rows with optimized performance',
            'Synthesis time reduced from hours to minutes through advanced algorithms',
            'Adaptive binning algorithms for complex dependency management',
            'Distribution-based transformations preserving database relationships'
        ],
        metrics: {
            'Performance': '10x improvement',
            'Fidelity': '99.5%',
            'Scale': '10M+ rows'
        },
        details: {
            overview: 'Ascend v2 represents a breakthrough in data engineering, featuring proprietary DNA Signature Technology that revolutionizes how we handle massive datasets. The framework extracts and preserves statistical properties through adaptive binning algorithms, enabling rule-based synthetic data generation.',
            keyFeatures: [
                'DNA Signature Technology with statistical property preservation',
                'Intelligent class balancing with optimal scaling factor calculation',
                'Advanced outlier detection and correction mechanisms',
                'Time series standardization and precision correction',
                'Distributed computing optimization across Spark clusters',
                'Enterprise-grade CLI tools for seamless pipeline execution'
            ],
            technicalSpecs: {
                'Architecture': 'Modular microservices with distributed processing',
                'Database Support': 'PostgreSQL, MySQL, Apache Cassandra',
                'Processing Engine': 'Apache Spark with PySpark optimization',
                'Scalability': '10M+ rows, horizontal scaling supported',
                'API': 'RESTful API with GraphQL support',
                'Deployment': 'Docker containers, Kubernetes orchestration'
            }
        },
        featured: true
    },
    {
        id: 'artisan',
        title: 'Artisan Roofing: AI-Powered Aerial Analysis',
        subtitle: 'Computer Vision & 3D Reconstruction',
        description: 'Professional roof measurement system integrating satellite imagery with LiDAR point cloud processing. Automatically classifies roof components and generates contractor-grade reports in under a minute.',
        image: 'assets/images/projects/artisan-demo.jpg',
        technologies: ['Python', 'Flask', 'YOLOv8', 'Open3D', 'QGIS', 'Computer Vision', 'LiDAR Processing'],
        achievements: [
            '95% accuracy in roof component classification (ridge, hip, valley, rake)',
            '±2% tolerance for contractor-grade measurements meeting industry standards',
            'Multi-stage geometric algorithms with CRM boundary refinement',
            'Comprehensive analysis delivered in under 60 seconds',
            'Integration of satellite imagery with LiDAR point cloud data',
            '3D-to-2D projection techniques improving accuracy by 40%'
        ],
        metrics: {
            'Accuracy': '95%',
            'Tolerance': '±2%',
            'Speed': '<1 minute'
        },
        details: {
            overview: 'Artisan Roofing Platform combines cutting-edge computer vision with geospatial analysis to deliver professional-grade roof measurements. The system processes aerial imagery and LiDAR data to automatically identify and measure roof components.',
            keyFeatures: [
                'Automated roof component classification using YOLOv8',
                'LiDAR point cloud processing with Open3D integration',
                '3D reconstruction with multi-stage geometric algorithms',
                'CRM boundary refinement for precise measurements',
                'Contractor-grade report generation with detailed analytics',
                'Real-time processing with distributed computing optimization'
            ],
            technicalSpecs: {
                'Computer Vision': 'YOLOv8, OpenCV, custom CNN architectures',
                '3D Processing': 'Open3D, point cloud analysis, mesh generation',
                'Geospatial': 'QGIS integration, coordinate transformation',
                'Accuracy': '95% classification, ±2% measurement tolerance',
                'Performance': '<60 seconds per roof analysis',
                'Deployment': 'Flask API, Docker containers, cloud scalable'
            }
        },
        featured: true
    },
    {
        id: 'ant-ai',
        title: 'Ant-AI: Multi-Agent Prompt Optimization',
        subtitle: 'Genetic Algorithms & AI Orchestration',
        description: 'Framework for optimizing task prompts using multi-agent systems and genetic algorithms. Implements dynamic agent roles for iterative refinement with Tree of Thoughts reasoning.',
        image: 'assets/images/projects/ant-ai-flow.jpg',
        technologies: ['Python', 'CrewAI', 'Streamlit', 'Poetry', 'Genetic Algorithms', 'LangChain'],
        achievements: [
            '70% reduction in input prompt ambiguity for low-parameter LLMs',
            'Fully automated prompt engineering with genetic optimization',
            'Dynamic agent role generation with function-calling capabilities',
            'Collaborative synthesis and QA agents for iterative improvement',
            'Tree of Thoughts reasoning implementation for enhanced logic',
            'Agentic mutation and crossover crews for adaptive optimization'
        ],
        metrics: {
            'Improvement': '70% less ambiguity',
            'Automation': '100%',
            'Agents': 'Dynamic scaling'
        },
        details: {
            overview: 'Ant-AI represents the first genetic multi-agent framework capable of autonomous prompt optimization. The system uses evolutionary algorithms to refine prompts through collaborative agent interactions, significantly improving LLM performance.',
            keyFeatures: [
                'Genetic algorithm-based prompt optimization',
                'Multi-agent orchestration with CrewAI framework',
                'Dynamic agent generation with specialized roles',
                'Tree of Thoughts reasoning for complex problem solving',
                'Automated mutation and crossover operations',
                'Real-time performance monitoring and adaptation'
            ],
            technicalSpecs: {
                'Framework': 'CrewAI with custom genetic algorithm engine',
                'Agent Types': 'Synthesis, QA, Mutation, Crossover agents',
                'Optimization': 'Genetic algorithms with fitness evaluation',
                'Interface': 'Streamlit dashboard with real-time monitoring',
                'Integration': 'LangChain compatibility, API endpoints',
                'Scalability': 'Horizontal agent scaling, distributed processing'
            }
        },
        featured: true
    }
];

// Rest of the JavaScript code remains the same...
// (keeping all the existing functions for rendering, modal, etc.)

// Render projects
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const featuredProjects = projects.filter(p => p.featured);

    grid.innerHTML = '';

    // Render featured projects first
    featuredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, true);
        projectCard.classList.add('scroll-animate', `stagger-${index + 1}`);
        grid.appendChild(projectCard);
    });
}

function createProjectCard(project, featured = false) {
    const card = document.createElement('div');
    card.className = `project-card ${featured ? 'featured' : ''} hover-lift`;
    
    // Create placeholder for missing images
    const imagePlaceholder = `
        <div style="
            width: 100%; 
            height: 100%; 
            background: linear-gradient(135deg, var(--cream-4) 0%, var(--cream-5) 100%); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: var(--text-primary); 
            font-size: 1.5rem; 
            font-weight: bold;
            text-align: center;
            padding: 20px;
        ">
            ${project.title.split(':')[0]}
        </div>
    `;
    
    card.innerHTML = `
        <div class="project-image">
            ${imagePlaceholder}
            <div class="project-overlay">
                <button class="btn-primary" onclick="openProjectModal('${project.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
        <div class="project-content">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-subtitle">${project.subtitle}</p>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-metrics">
                ${Object.entries(project.metrics).map(([key, value]) => 
                    `<div class="metric">
                        <span class="metric-value">${value}</span>
                        <span class="metric-label">${key}</span>
                    </div>`
                ).join('')}
            </div>
            <div class="project-tech">
                ${project.technologies.slice(0, 4).map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
                ${project.technologies.length > 4 ? `<span class="tech-more">+${project.technologies.length - 4}</span>` : ''}
            </div>
        </div>
    `;

    return card;
}

function openProjectModal(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = project.title;
    
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-image-large">
                <div style="
                    width: 100%; 
                    height: 300px; 
                    background: linear-gradient(135deg, var(--cream-4) 0%, var(--cream-5) 100%); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: var(--text-primary); 
                    font-size: 32px; 
                    font-weight: bold;
                    border-radius: 1rem;
                    margin-bottom: 2rem;
                ">
                    ${project.title.split(':')[0]}
                </div>
            </div>
            <div class="project-details">
                <div class="project-subtitle-large">${project.subtitle}</div>
                <p class="project-description-large">${project.description}</p>
                
                ${project.details ? `
                    <div class="project-overview">
                        <h4>Overview</h4>
                        <p>${project.details.overview}</p>
                    </div>
                ` : ''}
                
                <div class="achievements-section">
                    <h4>Key Achievements</h4>
                    <ul class="achievements-list">
                        ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                </div>

                ${project.details && project.details.keyFeatures ? `
                    <div class="features-section">
                        <h4>Key Features</h4>
                        <ul class="features-list">
                            ${project.details.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                <div class="tech-section">
                    <h4>Technologies Used</h4>
                    <div class="tech-list">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>

                <div class="metrics-section">
                    <h4>Performance Metrics</h4>
                    <div class="metrics-grid">
                        ${Object.entries(project.metrics).map(([key, value]) => 
                            `<div class="metric-large">
                                <span class="metric-value-large">${value}</span>
                                <span class="metric-label-large">${key}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>

                ${project.details && project.details.technicalSpecs ? `
                    <div class="technical-specs">
                        <h4>Technical Specifications</h4>
                        <div class="specs-grid">
                            ${Object.entries(project.details.technicalSpecs).map(([key, value]) => 
                                `<div class="spec-item">
                                    <strong>${key}:</strong> ${value}
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Add modal styles (same as before)
    const modalStyles = `
        <style>
        .project-modal-content {
            max-width: 100%;
        }
        
        .project-subtitle-large {
            color: var(--accent);
            font-weight: 600;
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 1rem;
        }
        
        .project-description-large {
            font-size: 1.1rem;
            line-height: 1.7;
            margin-bottom: 2rem;
        }
        
        .project-overview,
        .achievements-section,
        .features-section,
        .tech-section,
        .metrics-section,
        .technical-specs {
            margin-bottom: 2rem;
        }
        
        .project-overview h4,
        .achievements-section h4,
        .features-section h4,
        .tech-section h4,
        .metrics-section h4,
        .technical-specs h4 {
            color: var(--text-primary);
            font-size: 1.3rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--accent);
        }
        
        .achievements-list,
        .features-list {
            list-style: none;
            padding: 0;
        }
        
        .achievements-list li,
        .features-list li {
            position: relative;
            padding-left: 1.5rem;
            margin-bottom: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.6;
        }
        
        .achievements-list li::before,
        .features-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--accent);
            font-weight: bold;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .metric-large {
            text-align: center;
            padding: 1rem;
            background: var(--cream-3);
            border-radius: 0.5rem;
            border: 2px solid var(--cream-4);
        }
        
        .metric-value-large {
            display: block;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }
        
        .metric-label-large {
            font-size: 0.9rem;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .specs-grid {
            display: grid;
            gap: 0.8rem;
            margin-top: 1rem;
        }
        
        .spec-item {
            padding: 0.8rem;
            background: var(--cream-3);
            border-radius: 0.5rem;
            border-left: 4px solid var(--accent);
        }
        
        .spec-item strong {
            color: var(--text-primary);
        }
        </style>
    `;
    
    if (!document.getElementById('modal-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'modal-styles';
        styleElement.innerHTML = modalStyles;
        document.head.appendChild(styleElement);
    }

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('show');
    modal.classList.add('hide');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('hide');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', renderProjects);
