class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupInteractions();
        this.setupCarousel();
        // Remove or disable the problematic function
        // this.setupMobileAffiliationsCarousel();
        this.handlePageLoad();
    }

    handlePageLoad() {
        setTimeout(() => {
            document.body.classList.add('loaded');
            this.animateHeroElements();
        }, 500);
    }

    animateHeroElements() {
        const affiliations = document.querySelectorAll('.affiliation-item');
        const floatElements = document.querySelectorAll('.float-element');
        
        affiliations.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
            }, 1200 + (index * 100));
        });

        floatElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
            }, 800 + (index * 300));
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const nav = document.querySelector('.nav');
            
            if (scrollTop > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.value.trim()) {
                input.parentElement.classList.add('focused');
            }

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    handleFormSubmit(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all fields correctly', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused', 'error', 'success');
            });

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    }

    setupInteractions() {
        document.querySelectorAll('.badge, .skill-tag, .tech-tag').forEach(element => {
            element.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    setupCarousel() {
        const track = document.getElementById('projectsTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const container = document.querySelector('.projects-container');
        
        if (!track || !prevBtn || !nextBtn || !container) return;

        const cards = track.querySelectorAll('.project-card');
        const totalCards = cards.length;
        let currentIndex = 0;
        let isTransitioning = false;
        const isMobile = window.innerWidth <= 768;

        // Mobile: Simple scroll behavior with auto-scroll
        if (isMobile) {
            // Remove clones for mobile and duplicate cards for infinite scroll
            track.innerHTML = '';
            const originalCards = Array.from(cards);
            
            // Add cards multiple times for infinite effect
            for (let i = 0; i < 3; i++) {
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    track.appendChild(clone);
                });
            }
            
            let autoScrollSpeed = 1; // pixels per frame
            let isUserInteracting = false;
            let autoScrollRAF;
            
            // Auto-scroll function
            const autoScroll = () => {
                if (!isUserInteracting) {
                    container.scrollLeft += autoScrollSpeed;
                    
                    // Reset scroll position for infinite loop
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    if (container.scrollLeft >= maxScroll * 0.66) {
                        container.scrollLeft = maxScroll * 0.33;
                    }
                }
                autoScrollRAF = requestAnimationFrame(autoScroll);
            };
            
            // Start auto-scroll
            autoScroll();
            
            // Pause auto-scroll on user interaction
            const pauseAutoScroll = () => {
                isUserInteracting = true;
                setTimeout(() => {
                    isUserInteracting = false;
                }, 3000); // Resume after 3 seconds of inactivity
            };
            
            // Touch/swipe support with auto-scroll pause
            let startX = 0;
            let scrollLeft = 0;
            let isDown = false;

            container.addEventListener('touchstart', (e) => {
                isDown = true;
                pauseAutoScroll();
                startX = e.touches[0].pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });

            container.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.touches[0].pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });

            container.addEventListener('touchend', () => {
                isDown = false;
            });

            // Mouse drag support for desktop testing
            container.addEventListener('mousedown', (e) => {
                isDown = true;
                pauseAutoScroll();
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
                container.style.cursor = 'grabbing';
            });

            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });

            container.addEventListener('mouseup', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });

            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
            
            // Cleanup on page unload
            window.addEventListener('beforeunload', () => {
                if (autoScrollRAF) {
                    cancelAnimationFrame(autoScrollRAF);
                }
            });

            return;
        }

        // Desktop: Keep existing carousel behavior
        const cloneCards = () => {
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                track.appendChild(clone);
            });
        };

        cloneCards();

        const updateCarousel = (direction = 'next') => {
            if (isTransitioning) return;
            isTransitioning = true;

            const cardWidth = cards[0].offsetWidth;
            const gap = 32;
            const moveDistance = cardWidth + gap;

            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % totalCards;
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                track.style.transform = `translateX(-${(currentIndex + totalCards) * moveDistance}px)`;
            } else {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                track.style.transform = `translateX(-${(currentIndex + totalCards) * moveDistance}px)`;
            }

            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = `translateX(-${(currentIndex + totalCards) * moveDistance}px)`;
                isTransitioning = false;
            }, 500);
        };

        prevBtn.addEventListener('click', () => updateCarousel('prev'));
        nextBtn.addEventListener('click', () => updateCarousel('next'));

        const cardWidth = cards[0].offsetWidth;
        const gap = 32;
        track.style.transform = `translateX(-${totalCards * (cardWidth + gap)}px)`;

        window.addEventListener('resize', () => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                location.reload(); // Reload on mobile/desktop switch
                return;
            }
            
            if (!newIsMobile) {
                const newCardWidth = cards[0].offsetWidth;
                const newGap = 32;
                track.style.transition = 'none';
                track.style.transform = `translateX(-${(currentIndex + totalCards) * (newCardWidth + newGap)}px)`;
            }
        });
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444', 
            info: '#3b82f6'
        };

        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // REMOVED THE PROBLEMATIC FUNCTION ENTIRELY
    // The affiliations now use pure CSS grid layout from the CSS file
    // No JavaScript manipulation needed for mobile affiliations
}

document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});