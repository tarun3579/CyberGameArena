// Advanced Animations Controller for CyberGame Arena
(function() {
    'use strict';

    // Animation configuration
    const ANIMATION_CONFIG = {
        duration: {
            fast: 300,
            normal: 600,
            slow: 1000
        },
        easing: {
            easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
    };

    // Performance monitoring
    let animationFrameId = null;
    let performanceMode = 'high'; // high, medium, low

    // Initialize animations
    function initAnimations() {
        detectPerformanceMode();
        setupAdvancedScrollAnimations();
        setupMouseTracker();
        setupTypewriterEffect();
        setupGlitchEffects();
        setupEnergyEffects();
        setupHologramEffects();
        setupDataVisualization();
        startBackgroundAnimations();
    }

    // Detect device performance capabilities
    function detectPerformanceMode() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            performanceMode = 'low';
            return;
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Basic performance detection based on common patterns
        if (renderer.includes('Intel') && !renderer.includes('Iris')) {
            performanceMode = 'medium';
        } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            performanceMode = 'medium';
        } else if (window.innerWidth < 768) {
            performanceMode = 'medium';
        }

        // Apply performance optimizations
        applyPerformanceOptimizations();
    }

    // Apply performance optimizations based on device capabilities
    function applyPerformanceOptimizations() {
        const root = document.documentElement;
        
        switch (performanceMode) {
            case 'low':
                root.style.setProperty('--animation-duration', '0.1s');
                root.style.setProperty('--particles-count', '10');
                break;
            case 'medium':
                root.style.setProperty('--animation-duration', '0.3s');
                root.style.setProperty('--particles-count', '25');
                break;
            default:
                root.style.setProperty('--animation-duration', '0.6s');
                root.style.setProperty('--particles-count', '50');
        }
    }

    // Advanced scroll-based animations
    function setupAdvancedScrollAnimations() {
        const scrollTriggerElements = document.querySelectorAll('[data-scroll-trigger]');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.dataset.scrollTrigger;
                    
                    switch (animationType) {
                        case 'fade-up':
                            animateFadeUp(element);
                            break;
                        case 'slide-left':
                            animateSlideLeft(element);
                            break;
                        case 'slide-right':
                            animateSlideRight(element);
                            break;
                        case 'scale-in':
                            animateScaleIn(element);
                            break;
                        case 'rotate-in':
                            animateRotateIn(element);
                            break;
                        case 'cyber-glitch':
                            animateCyberGlitch(element);
                            break;
                    }
                    
                    scrollObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        scrollTriggerElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }

    // Mouse tracking for interactive effects
    function setupMouseTracker() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update CSS custom properties for mouse position
            document.documentElement.style.setProperty('--mouse-x', mouseX + 'px');
            document.documentElement.style.setProperty('--mouse-y', mouseY + 'px');
        });

        // Create cursor trail effect
        createCursorTrail();
        
        // Interactive elements that respond to mouse
        const interactiveElements = document.querySelectorAll('.interactive-hover');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                createMagneticEffect(element, mouseX, mouseY);
            });
        });
    }

    // Typewriter effect for text elements
    function setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 50;
            element.textContent = '';
            
            let i = 0;
            const typewriterInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typewriterInterval);
                    element.classList.add('typewriter-complete');
                }
            }, speed);
        });
    }

    // Glitch effects for cyberpunk aesthetic
    function setupGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch-effect');
        
        glitchElements.forEach(element => {
            // Random glitch trigger
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance every interval
                    triggerGlitch(element);
                }
            }, 3000);
            
            // Hover glitch effect
            element.addEventListener('mouseenter', () => {
                triggerGlitch(element);
            });
        });
    }

    // Energy field effects
    function setupEnergyEffects() {
        const energyElements = document.querySelectorAll('.energy-field');
        
        energyElements.forEach(element => {
            createEnergyField(element);
        });
    }

    // Hologram effects
    function setupHologramEffects() {
        const hologramElements = document.querySelectorAll('.hologram-effect');
        
        hologramElements.forEach(element => {
            applyHologramEffect(element);
        });
    }

    // Data visualization animations
    function setupDataVisualization() {
        const dataElements = document.querySelectorAll('[data-animate-value]');
        
        const dataObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetValue = parseInt(element.dataset.animateValue);
                    animateCounter(element, 0, targetValue, 2000);
                    dataObserver.unobserve(element);
                }
            });
        });

        dataElements.forEach(element => {
            dataObserver.observe(element);
        });
    }

    // Background animations
    function startBackgroundAnimations() {
        // Animated background particles
        if (performanceMode !== 'low') {
            createFloatingParticles();
        }
        
        // Circuit board animation
        createCircuitAnimation();
        
        // Energy pulses
        startEnergyPulses();
    }

    // Animation functions
    function animateFadeUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    function animateSlideLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    function animateSlideRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.easeOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    function animateScaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.5)';
        element.style.transition = `all ${ANIMATION_CONFIG.duration.normal}ms ${ANIMATION_CONFIG.easing.bounce}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    function animateRotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-180deg) scale(0.5)';
        element.style.transition = `all ${ANIMATION_CONFIG.duration.slow}ms ${ANIMATION_CONFIG.easing.easeInOut}`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }

    function animateCyberGlitch(element) {
        element.classList.add('cyber-glitch-active');
        setTimeout(() => {
            element.classList.remove('cyber-glitch-active');
        }, 1000);
    }

    function triggerGlitch(element) {
        element.classList.add('glitching');
        setTimeout(() => {
            element.classList.remove('glitching');
        }, 300);
    }

    function createCursorTrail() {
        const trail = [];
        const trailLength = performanceMode === 'high' ? 10 : 5;

        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, age: 0 });
            
            if (trail.length > trailLength) {
                trail.shift();
            }
        });

        function updateTrail() {
            trail.forEach((point, index) => {
                point.age++;
                
                const trailElement = document.getElementById(`trail-${index}`) || createTrailElement(index);
                const opacity = 1 - (point.age / 30);
                const size = 10 - (point.age / 3);
                
                if (opacity > 0) {
                    trailElement.style.left = point.x + 'px';
                    trailElement.style.top = point.y + 'px';
                    trailElement.style.opacity = opacity;
                    trailElement.style.width = size + 'px';
                    trailElement.style.height = size + 'px';
                    trailElement.style.display = 'block';
                } else {
                    trailElement.style.display = 'none';
                }
            });
            
            requestAnimationFrame(updateTrail);
        }
        
        if (performanceMode === 'high') {
            updateTrail();
        }
    }

    function createTrailElement(index) {
        const trailElement = document.createElement('div');
        trailElement.id = `trail-${index}`;
        trailElement.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(trailElement);
        return trailElement;
    }

    function createMagneticEffect(element, mouseX, mouseY) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (mouseX - centerX) * 0.1;
        const deltaY = (mouseY - centerY) * 0.1;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }

    function createEnergyField(element) {
        const energyOverlay = document.createElement('div');
        energyOverlay.className = 'energy-overlay';
        energyOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                rgba(0, 255, 255, 0.2) 0%, transparent 50%);
            pointer-events: none;
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        
        element.style.position = 'relative';
        element.appendChild(energyOverlay);
        
        element.addEventListener('mouseenter', () => {
            energyOverlay.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', () => {
            energyOverlay.style.opacity = '0';
        });
    }

    function applyHologramEffect(element) {
        const holoOverlay = document.createElement('div');
        holoOverlay.className = 'holo-overlay';
        holoOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, 
                transparent 30%, 
                rgba(0, 255, 255, 0.1) 50%, 
                transparent 70%);
            pointer-events: none;
            animation: holoScan 3s linear infinite;
        `;
        
        element.style.position = 'relative';
        element.appendChild(holoOverlay);
    }

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(start + (end - start) * easeOutCubic(progress));
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'floating-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(particleContainer);

        const particleCount = performanceMode === 'high' ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            createFloatingParticle(particleContainer);
        }
    }

    function createFloatingParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: var(--primary-cyan);
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.3};
            animation: floatParticle ${Math.random() * 20 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: 100%;
            box-shadow: 0 0 ${Math.random() * 10 + 5}px var(--primary-cyan);
        `;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (container.contains(particle)) {
                container.removeChild(particle);
                createFloatingParticle(container); // Create new particle
            }
        }, 30000);
    }

    function createCircuitAnimation() {
        const circuitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        circuitSvg.setAttribute('class', 'circuit-background');
        circuitSvg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -2;
            opacity: 0.1;
        `;

        // Create circuit paths
        for (let i = 0; i < 10; i++) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = generateCircuitPath();
            path.setAttribute('d', pathData);
            path.setAttribute('class', 'circuit-line');
            path.style.animationDelay = `${i * 0.5}s`;
            circuitSvg.appendChild(path);
        }

        document.body.appendChild(circuitSvg);
    }

    function generateCircuitPath() {
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const endX = Math.random() * window.innerWidth;
        const endY = Math.random() * window.innerHeight;
        
        return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    function startEnergyPulses() {
        const energyElements = document.querySelectorAll('.energy-pulse');
        
        energyElements.forEach((element, index) => {
            setInterval(() => {
                const pulse = document.createElement('div');
                pulse.className = 'pulse-ring';
                pulse.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 10px;
                    height: 10px;
                    border: 2px solid var(--primary-cyan);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: energyPulse 2s ease-out;
                    pointer-events: none;
                `;
                
                element.style.position = 'relative';
                element.appendChild(pulse);
                
                setTimeout(() => {
                    if (element.contains(pulse)) {
                        element.removeChild(pulse);
                    }
                }, 2000);
            }, 3000 + index * 500);
        });
    }

    // Utility functions
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Add CSS animations
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(50px) rotate(360deg);
                opacity: 0;
            }
        }

        @keyframes holoScan {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }

        @keyframes energyPulse {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }

        .cyber-glitch-active {
            animation: cyberGlitchActive 1s ease-in-out;
        }

        @keyframes cyberGlitchActive {
            0%, 100% {
                transform: translate(0);
                filter: hue-rotate(0deg);
            }
            10% {
                transform: translate(-2px, 2px);
                filter: hue-rotate(90deg);
            }
            20% {
                transform: translate(-4px, -2px);
                filter: hue-rotate(180deg);
            }
            30% {
                transform: translate(4px, 2px);
                filter: hue-rotate(270deg);
            }
            40% {
                transform: translate(-2px, -4px);
                filter: hue-rotate(360deg);
            }
            50% {
                transform: translate(2px, 4px);
                filter: hue-rotate(180deg);
            }
            60% {
                transform: translate(-4px, 2px);
                filter: hue-rotate(90deg);
            }
            70% {
                transform: translate(4px, -2px);
                filter: hue-rotate(270deg);
            }
            80% {
                transform: translate(-2px, 4px);
                filter: hue-rotate(360deg);
            }
        }

        .glitching {
            animation: glitchShake 0.3s ease-in-out;
        }

        @keyframes glitchShake {
            0%, 100% { transform: translate(0); }
            10% { transform: translate(-1px, 1px); }
            20% { transform: translate(-2px, 0px); }
            30% { transform: translate(2px, 2px); }
            40% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 2px); }
            60% { transform: translate(-2px, 1px); }
            70% { transform: translate(2px, 1px); }
            80% { transform: translate(-1px, -1px); }
            90% { transform: translate(1px, 2px); }
        }
    `;
    document.head.appendChild(animationStyles);

    // Initialize animations when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }

})();
