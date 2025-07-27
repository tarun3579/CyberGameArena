// Main JavaScript functionality for CyberGame Arena
(function() {
    'use strict';

    // DOM elements
    const nav = document.getElementById('main-nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const loadingScreen = document.getElementById('loading-screen');
    const contactForm = document.getElementById('contactForm');

    // Initialize the application
    function init() {
        setupLoading();
        setupNavigation();
        setupScrollEffects();
        setupIntersectionObserver();
        setupContactForm();
        setupParallax();
        setupButtonEffects();
        setupCardAnimations();
        createScanline();
        startMatrixRain();
    }

    // Loading screen functionality
    function setupLoading() {
        const loaderProgress = document.querySelector('.loader-progress');
        const loaderText = document.querySelector('.loader-text');
        const loaderGlitch = document.querySelector('.loader-glitch');
        
        let progress = 0;
        const loadingTexts = ['INITIALIZING...', 'LOADING ASSETS...', 'CONNECTING...', 'SYSTEM READY'];
        let textIndex = 0;

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    loaderGlitch.style.opacity = '1';
                    loaderText.style.opacity = '0';
                    
                    setTimeout(() => {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 500);
                    }, 1000);
                }, 500);
            } else {
                if (progress > textIndex * 25 && textIndex < loadingTexts.length - 1) {
                    textIndex++;
                    loaderText.textContent = loadingTexts[textIndex];
                }
            }
            
            loaderProgress.style.width = progress + '%';
        }, 100);
    }

    // Navigation functionality
    function setupNavigation() {
        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }

                // Close mobile menu
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Navigation background on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(10, 10, 15, 0.98)';
                nav.style.backdropFilter = 'blur(20px)';
            } else {
                nav.style.background = 'rgba(10, 10, 15, 0.95)';
                nav.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // Scroll effects and animations
    function setupScrollEffects() {
        // Update active navigation based on scroll position
        window.addEventListener('scroll', throttle(() => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 100));
    }

    // Intersection Observer for animations
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('game-card')) {
                        entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    }
                    
                    if (entry.target.classList.contains('tournament-card')) {
                        entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    }
                    
                    if (entry.target.classList.contains('leaderboard-item')) {
                        const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.game-card, .tournament-card, .leaderboard-item, .info-card, .section-header'
        );
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }

    // Contact form functionality
    function setupContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                // Basic validation
                if (!name || !email || !message) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="btn-content"><i class="fas fa-spinner fa-spin"></i> SENDING...</span>';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    }

    // Parallax effects
    function setupParallax() {
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        }, 16));
    }

    // Button effects
    function setupButtonEffects() {
        const cyberButtons = document.querySelectorAll('.cyber-btn');
        
        cyberButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                createEnergyWave(button);
            });
            
            button.addEventListener('click', (e) => {
                createClickRipple(e, button);
            });
        });
    }

    // Card animations
    function setupCardAnimations() {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0)';
            });
            
            // Play button click effect
            const playBtn = card.querySelector('.play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    showNotification('Game launching...', 'info');
                });
            }
        });
    }

    // Utility functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function createEnergyWave(element) {
        const wave = document.createElement('div');
        wave.className = 'energy-wave';
        element.appendChild(wave);
        
        setTimeout(() => {
            if (element.contains(wave)) {
                element.removeChild(wave);
            }
        }, 2000);
    }

    function createClickRipple(e, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.5) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (element.contains(ripple)) {
                element.removeChild(ripple);
            }
        }, 600);
    }

    function createScanline() {
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        document.body.appendChild(scanline);
    }

    function startMatrixRain() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const matrixContainer = document.createElement('div');
        matrixContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(matrixContainer);
        
        setInterval(() => {
            if (Math.random() < 0.1) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDuration = Math.random() * 3 + 2 + 's';
                char.style.fontSize = Math.random() * 20 + 10 + 'px';
                char.style.opacity = Math.random() * 0.5 + 0.3;
                
                matrixContainer.appendChild(char);
                
                setTimeout(() => {
                    if (matrixContainer.contains(char)) {
                        matrixContainer.removeChild(char);
                    }
                }, 5000);
            }
        }, 200);
    }

    // Add CSS for notifications and ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(10, 10, 15, 0.95);
            border: 1px solid var(--primary-cyan);
            border-radius: 8px;
            padding: 1rem;
            color: var(--text-primary);
            font-family: var(--font-secondary);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-color: var(--neon-green);
        }
        
        .notification-error {
            border-color: var(--hot-pink);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-success .notification-content i {
            color: var(--neon-green);
        }
        
        .notification-error .notification-content i {
            color: var(--hot-pink);
        }
        
        .notification-info .notification-content i {
            color: var(--primary-cyan);
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
