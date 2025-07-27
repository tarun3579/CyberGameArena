// Advanced Particle System for CyberGame Arena
(function() {
    'use strict';

    // Particle system configuration
    const PARTICLE_CONFIG = {
        maxParticles: {
            high: 150,
            medium: 75,
            low: 30
        },
        colors: {
            primary: '#00ffff',
            secondary: '#ff00ff',
            tertiary: '#39ff14',
            accent: '#0099ff'
        },
        types: {
            FLOAT: 'float',
            ENERGY: 'energy',
            CIRCUIT: 'circuit',
            SPARK: 'spark',
            DATA: 'data'
        }
    };

    // Performance detection
    let performanceLevel = 'high';
    let animationFrameId = null;
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;

    // Particle class
    class Particle {
        constructor(x, y, type = 'float', options = {}) {
            this.x = x || Math.random() * window.innerWidth;
            this.y = y || Math.random() * window.innerHeight;
            this.type = type;
            this.life = 1.0;
            this.maxLife = options.maxLife || 1.0;
            this.age = 0;
            this.size = options.size || Math.random() * 4 + 2;
            this.opacity = options.opacity || Math.random() * 0.8 + 0.2;
            this.color = options.color || this.getRandomColor();
            
            // Movement properties
            this.vx = options.vx || (Math.random() - 0.5) * 2;
            this.vy = options.vy || (Math.random() - 0.5) * 2;
            this.ax = 0;
            this.ay = 0;
            
            // Visual properties
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.glowIntensity = Math.random() * 0.5 + 0.5;
            
            // Interaction properties
            this.magneticStrength = options.magneticStrength || 0;
            this.repulsionRadius = options.repulsionRadius || 50;
            
            this.initializeType();
        }

        initializeType() {
            switch (this.type) {
                case PARTICLE_CONFIG.types.ENERGY:
                    this.size = Math.random() * 6 + 3;
                    this.glowIntensity = 1.0;
                    this.pulseSpeed = 0.1;
                    this.color = PARTICLE_CONFIG.colors.primary;
                    break;
                    
                case PARTICLE_CONFIG.types.CIRCUIT:
                    this.size = 2;
                    this.opacity = 0.6;
                    this.color = PARTICLE_CONFIG.colors.tertiary;
                    this.vx = Math.random() > 0.5 ? 1 : -1;
                    this.vy = 0;
                    break;
                    
                case PARTICLE_CONFIG.types.SPARK:
                    this.size = Math.random() * 3 + 1;
                    this.maxLife = 0.3;
                    this.life = this.maxLife;
                    this.vy = Math.random() * -3 - 1;
                    this.vx = (Math.random() - 0.5) * 4;
                    this.color = PARTICLE_CONFIG.colors.accent;
                    break;
                    
                case PARTICLE_CONFIG.types.DATA:
                    this.size = 1;
                    this.opacity = 0.8;
                    this.color = PARTICLE_CONFIG.colors.secondary;
                    this.dataPattern = Math.random() > 0.5 ? '1' : '0';
                    break;
                    
                default: // FLOAT
                    this.vy = -Math.random() * 0.5 - 0.2;
                    this.vx = (Math.random() - 0.5) * 0.3;
                    break;
            }
        }

        getRandomColor() {
            const colors = Object.values(PARTICLE_CONFIG.colors);
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update(deltaTime) {
            this.age += deltaTime;
            this.life = Math.max(0, this.maxLife - this.age);
            
            if (this.life <= 0) {
                return false; // Particle should be removed
            }

            // Update position
            this.vx += this.ax;
            this.vy += this.ay;
            this.x += this.vx;
            this.y += this.vy;
            
            // Update rotation
            this.rotation += this.rotationSpeed;
            
            // Update pulse phase
            this.pulsePhase += 0.05;
            
            // Apply type-specific behaviors
            this.updateTypeBehavior(deltaTime);
            
            // Apply mouse interaction
            if (isMouseActive) {
                this.applyMouseInteraction();
            }
            
            // Boundary checks
            this.handleBoundaries();
            
            // Reset acceleration
            this.ax = 0;
            this.ay = 0;
            
            return true;
        }

        updateTypeBehavior(deltaTime) {
            switch (this.type) {
                case PARTICLE_CONFIG.types.ENERGY:
                    // Pulsing glow effect
                    this.glowIntensity = 0.5 + Math.sin(this.pulsePhase) * 0.5;
                    // Slight gravitational drift
                    this.ay += 0.001;
                    break;
                    
                case PARTICLE_CONFIG.types.CIRCUIT:
                    // Maintain horizontal movement
                    if (Math.abs(this.vx) < 0.5) {
                        this.vx = Math.sign(this.vx) * 0.5;
                    }
                    break;
                    
                case PARTICLE_CONFIG.types.SPARK:
                    // Gravity and fade
                    this.ay += 0.05;
                    this.opacity = this.life / this.maxLife;
                    break;
                    
                case PARTICLE_CONFIG.types.DATA:
                    // Binary flickering
                    if (Math.random() < 0.01) {
                        this.dataPattern = this.dataPattern === '1' ? '0' : '1';
                    }
                    break;
            }
        }

        applyMouseInteraction() {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.repulsionRadius) {
                // Repulsion force
                const force = (this.repulsionRadius - distance) / this.repulsionRadius;
                this.ax -= (dx / distance) * force * 0.1;
                this.ay -= (dy / distance) * force * 0.1;
            } else if (distance < 150 && this.magneticStrength > 0) {
                // Magnetic attraction
                const force = this.magneticStrength / (distance * distance);
                this.ax += (dx / distance) * force;
                this.ay += (dy / distance) * force;
            }
        }

        handleBoundaries() {
            const margin = 50;
            
            if (this.x < -margin) {
                if (this.type === PARTICLE_CONFIG.types.CIRCUIT) {
                    this.x = window.innerWidth + margin;
                } else {
                    this.x = -margin;
                    this.vx = Math.abs(this.vx);
                }
            } else if (this.x > window.innerWidth + margin) {
                if (this.type === PARTICLE_CONFIG.types.CIRCUIT) {
                    this.x = -margin;
                } else {
                    this.x = window.innerWidth + margin;
                    this.vx = -Math.abs(this.vx);
                }
            }
            
            if (this.y < -margin) {
                this.y = window.innerHeight + margin;
            } else if (this.y > window.innerHeight + margin) {
                if (this.type === PARTICLE_CONFIG.types.SPARK) {
                    this.life = 0; // Remove spark particles that fall off screen
                } else {
                    this.y = -margin;
                }
            }
        }

        render(ctx) {
            ctx.save();
            
            // Apply transformations
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Set opacity
            ctx.globalAlpha = this.opacity * (this.life / this.maxLife);
            
            // Render based on type
            switch (this.type) {
                case PARTICLE_CONFIG.types.ENERGY:
                    this.renderEnergyParticle(ctx);
                    break;
                case PARTICLE_CONFIG.types.CIRCUIT:
                    this.renderCircuitParticle(ctx);
                    break;
                case PARTICLE_CONFIG.types.SPARK:
                    this.renderSparkParticle(ctx);
                    break;
                case PARTICLE_CONFIG.types.DATA:
                    this.renderDataParticle(ctx);
                    break;
                default:
                    this.renderFloatParticle(ctx);
            }
            
            ctx.restore();
        }

        renderFloatParticle(ctx) {
            // Create glow effect
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.7, this.color + '80');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Core particle
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        renderEnergyParticle(ctx) {
            // Pulsing glow
            const glowSize = this.size * (2 + this.glowIntensity);
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(0.5, this.color + '60');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Energy core with pulse
            const coreSize = this.size * (0.8 + Math.sin(this.pulsePhase) * 0.3);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
            ctx.fill();
        }

        renderCircuitParticle(ctx) {
            // Circuit node
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
            ctx.stroke();
            
            // Connection lines
            ctx.beginPath();
            ctx.moveTo(-this.size * 3, 0);
            ctx.lineTo(this.size * 3, 0);
            ctx.stroke();
        }

        renderSparkParticle(ctx) {
            // Spark trail
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.vx * 3, -this.vy * 3);
            ctx.stroke();
            
            // Spark core
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        renderDataParticle(ctx) {
            // Data character
            ctx.fillStyle = this.color;
            ctx.font = `${this.size * 4}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.dataPattern, 0, 0);
        }
    }

    // Particle System Manager
    class ParticleSystem {
        constructor() {
            this.canvas = null;
            this.ctx = null;
            this.lastTime = 0;
            this.isRunning = false;
            
            this.init();
        }

        init() {
            this.createCanvas();
            this.setupEventListeners();
            this.detectPerformance();
            this.start();
        }

        createCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'particle-canvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                opacity: 0.8;
            `;
            
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            // Insert canvas after particle field
            const particleField = document.getElementById('particle-field');
            if (particleField) {
                particleField.parentNode.insertBefore(this.canvas, particleField.nextSibling);
            } else {
                document.body.appendChild(this.canvas);
            }
        }

        setupEventListeners() {
            // Mouse tracking
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                isMouseActive = true;
                
                // Create spark particles on rapid movement
                if (this.lastMouseX && this.lastMouseY) {
                    const dx = e.clientX - this.lastMouseX;
                    const dy = e.clientY - this.lastMouseY;
                    const speed = Math.sqrt(dx * dx + dy * dy);
                    
                    if (speed > 50 && Math.random() < 0.3) {
                        this.createSpark(e.clientX, e.clientY);
                    }
                }
                
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
            });

            document.addEventListener('mouseleave', () => {
                isMouseActive = false;
            });

            // Click effects
            document.addEventListener('click', (e) => {
                this.createClickEffect(e.clientX, e.clientY);
            });

            // Window resize
            window.addEventListener('resize', () => {
                this.resizeCanvas();
            });

            // Visibility change
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            });
        }

        detectPerformance() {
            // Simple performance detection
            const startTime = performance.now();
            let testOperations = 0;
            
            while (performance.now() - startTime < 10) {
                testOperations++;
                Math.random() * Math.random();
            }
            
            if (testOperations < 100000) {
                performanceLevel = 'low';
            } else if (testOperations < 500000) {
                performanceLevel = 'medium';
            } else {
                performanceLevel = 'high';
            }
            
            console.log(`Particle system performance level: ${performanceLevel}`);
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.lastTime = performance.now();
            
            // Initialize particles
            this.initializeParticles();
            
            // Start animation loop
            this.animate();
        }

        pause() {
            this.isRunning = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }

        resume() {
            if (!this.isRunning) {
                this.start();
            }
        }

        initializeParticles() {
            const maxParticles = PARTICLE_CONFIG.maxParticles[performanceLevel];
            
            // Create floating particles
            for (let i = 0; i < maxParticles * 0.6; i++) {
                particles.push(new Particle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    PARTICLE_CONFIG.types.FLOAT
                ));
            }
            
            // Create energy particles
            for (let i = 0; i < maxParticles * 0.2; i++) {
                particles.push(new Particle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    PARTICLE_CONFIG.types.ENERGY,
                    { magneticStrength: 0.1 }
                ));
            }
            
            // Create circuit particles
            if (performanceLevel !== 'low') {
                for (let i = 0; i < maxParticles * 0.1; i++) {
                    particles.push(new Particle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight,
                        PARTICLE_CONFIG.types.CIRCUIT
                    ));
                }
            }
            
            // Create data particles
            if (performanceLevel === 'high') {
                for (let i = 0; i < maxParticles * 0.1; i++) {
                    particles.push(new Particle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight,
                        PARTICLE_CONFIG.types.DATA
                    ));
                }
            }
        }

        createSpark(x, y) {
            if (particles.length < PARTICLE_CONFIG.maxParticles[performanceLevel] * 1.5) {
                for (let i = 0; i < 3; i++) {
                    particles.push(new Particle(x, y, PARTICLE_CONFIG.types.SPARK));
                }
            }
        }

        createClickEffect(x, y) {
            // Create burst of particles
            const burstCount = performanceLevel === 'high' ? 15 : performanceLevel === 'medium' ? 10 : 5;
            
            for (let i = 0; i < burstCount; i++) {
                const angle = (i / burstCount) * Math.PI * 2;
                const speed = Math.random() * 3 + 2;
                
                particles.push(new Particle(x, y, PARTICLE_CONFIG.types.ENERGY, {
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    maxLife: 2.0,
                    size: Math.random() * 4 + 2
                }));
            }
        }

        animate(currentTime = 0) {
            if (!this.isRunning) return;
            
            const deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and render particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                
                if (!particle.update(deltaTime)) {
                    particles.splice(i, 1);
                } else {
                    particle.render(this.ctx);
                }
            }
            
            // Maintain particle count
            this.maintainParticleCount();
            
            // Continue animation
            animationFrameId = requestAnimationFrame((time) => this.animate(time));
        }

        maintainParticleCount() {
            const targetCount = PARTICLE_CONFIG.maxParticles[performanceLevel];
            const currentFloatingParticles = particles.filter(p => p.type === PARTICLE_CONFIG.types.FLOAT).length;
            
            if (currentFloatingParticles < targetCount * 0.6) {
                // Add new floating particles
                const needed = Math.ceil(targetCount * 0.6) - currentFloatingParticles;
                for (let i = 0; i < needed && i < 5; i++) {
                    particles.push(new Particle(
                        Math.random() * window.innerWidth,
                        window.innerHeight + 50,
                        PARTICLE_CONFIG.types.FLOAT
                    ));
                }
            }
        }

        // Public methods for external control
        addParticle(x, y, type, options) {
            particles.push(new Particle(x, y, type, options));
        }

        setPerformanceLevel(level) {
            if (['low', 'medium', 'high'].includes(level)) {
                performanceLevel = level;
                console.log(`Particle system performance set to: ${level}`);
            }
        }

        getParticleCount() {
            return particles.length;
        }

        clearParticles() {
            particles = [];
        }
    }

    // Initialize particle system when DOM is ready
    let particleSystem = null;

    function initParticleSystem() {
        if (!particleSystem) {
            particleSystem = new ParticleSystem();
        }
    }

    // Expose global API
    window.ParticleSystem = {
        init: initParticleSystem,
        addParticle: (x, y, type, options) => {
            if (particleSystem) {
                particleSystem.addParticle(x, y, type, options);
            }
        },
        setPerformance: (level) => {
            if (particleSystem) {
                particleSystem.setPerformanceLevel(level);
            }
        },
        getCount: () => {
            return particleSystem ? particleSystem.getParticleCount() : 0;
        },
        clear: () => {
            if (particleSystem) {
                particleSystem.clearParticles();
            }
        }
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleSystem);
    } else {
        initParticleSystem();
    }

})();
