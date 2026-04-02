/**
 * Studio Lorraine Oliveira - Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    let musicStarted = false;
    // Helper function for fading audio volume smoothly (shared utility)
    const fadeAudio = (audio, targetVolume, duration = 2000, callback = null) => {
        if (!audio) return;
        const startVolume = audio.volume;
        const startTime = performance.now();

        const animateVolume = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad formula for smoother transition
            const easedProgress = progress * (2 - progress);
            audio.volume = startVolume + (targetVolume - startVolume) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(animateVolume);
            } else if (callback) {
                callback();
            }
        };

        requestAnimationFrame(animateVolume);
    };

    // 1. Header Scroll Effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // 3. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const nav = document.getElementById('nav');
                const menuToggle = document.getElementById('menu-toggle');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // 4. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');

            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // 5. About Video Play Handler & Audio Sync
    const aboutVideo = document.getElementById('about-video');
    const playBtn = document.getElementById('play-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');

    if (aboutVideo && playBtn) {

        // Function to pause background music with fade out
        const pauseBackgroundMusic = () => {
            if (bgMusic && !bgMusic.paused) {
                fadeAudio(bgMusic, 0, 800, () => {
                    bgMusic.pause();
                    if (musicBtn) {
                        musicBtn.classList.remove('playing');
                        musicBtn.querySelector('i').className = 'fas fa-volume-mute';
                    }
                });
            }
        };

        // Function to resume background music with fade in
        const resumeBackgroundMusic = () => {
            if (bgMusic && musicBtn && musicBtn.getAttribute('data-manual-pause') !== 'true') {
                bgMusic.volume = 0;
                bgMusic.play().then(() => {
                    fadeAudio(bgMusic, 0.4, 3000); // Fade in to 40% volume over 3 seconds
                    musicBtn.classList.add('playing');
                    musicBtn.querySelector('i').className = 'fas fa-volume-up';
                }).catch(e => console.log("Resume prevented", e));
            }
        };

        playBtn.addEventListener('click', () => {
            if (aboutVideo.paused) {
                aboutVideo.play();
                playBtn.style.opacity = '0';
                playBtn.style.pointerEvents = 'none';
                pauseBackgroundMusic();
            }
        });

        aboutVideo.addEventListener('click', () => {
            if (!aboutVideo.paused) {
                aboutVideo.pause();
                playBtn.style.opacity = '1';
                playBtn.style.pointerEvents = 'auto';
                resumeBackgroundMusic();
            } else {
                aboutVideo.play();
                playBtn.style.opacity = '0';
                playBtn.style.pointerEvents = 'none';
                pauseBackgroundMusic();
            }
        });

        aboutVideo.addEventListener('ended', () => {
            playBtn.style.opacity = '1';
            playBtn.style.pointerEvents = 'auto';
            resumeBackgroundMusic();
        });
    }

    // 6. Optimized Results Marquee Focus Effect (v2.0)
    const marqueeSection = document.querySelector('.results-marquee-section');
    const marqueeItems = document.querySelectorAll('.marquee-item');

    if (marqueeSection && marqueeItems.length > 0) {
        let isMarqueeActive = false;
        let focalRequestId = null;

        const updateMarqueeFocus = () => {
            if (!isMarqueeActive) return;

            const viewportCenterX = window.innerWidth / 2;
            const focusRange = window.innerWidth * 0.9;

            marqueeItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.right < -50 || rect.left > window.innerWidth + 50) return;

                const itemCenterX = rect.left + rect.width / 2;
                const distanceFromCenter = Math.abs(viewportCenterX - itemCenterX);
                const normalizedDistance = Math.min(1, distanceFromCenter / (focusRange / 2));

                const scale = 1.15 - (normalizedDistance * 0.3);
                const rotationY = normalizedDistance * 10;
                const sign = itemCenterX < viewportCenterX ? 1 : -1;

                item.style.transform = `perspective(1000px) scale(${scale}) rotateY(${rotationY * sign}deg)`;
                item.style.zIndex = Math.round((1 - normalizedDistance) * 10);
            });

            focalRequestId = requestAnimationFrame(updateMarqueeFocus);
        };

        const marqueeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isMarqueeActive = true;
                    if (!focalRequestId) updateMarqueeFocus();
                } else {
                    isMarqueeActive = false;
                    if (focalRequestId) {
                        cancelAnimationFrame(focalRequestId);
                        focalRequestId = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        marqueeObserver.observe(marqueeSection);
    }

    // 7. Custom Cursor Follower (Desktop Only)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth >= 992) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll('a, button, .marquee-item, .social-links a');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
        });
    }

    // 8. Mobile Touch Ripple Effect
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const ripple = document.createElement('div');
        ripple.classList.add('touch-ripple');
        ripple.style.left = `${touch.clientX}px`;
        ripple.style.top = `${touch.clientY}px`;
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    // 9. Luxury Ambient Music Logic with Fade-In
    if (bgMusic && musicBtn) {
        bgMusic.volume = 0; // Start at zero for fade-in

        // 10. Luxury Enter Screen Handler
        const enterScreen = document.getElementById('enter-screen');
        const enterBtn = document.getElementById('enter-btn');
        const particleContainer = document.querySelector('.enter-particles');
        
        // Generate Luxury Particles (Gold Dust)
        if (particleContainer) {
            const createParticle = () => {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Random position and size
                const size = Math.random() * 5 + 2;
                const posX = Math.random() * 100;
                const posY = Math.random() * 100;
                const delay = Math.random() * 5;
                const duration = Math.random() * 5 + 5;
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.animationDelay = `${delay}s`;
                particle.style.animationDuration = `${duration}s`;
                
                particleContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    particle.remove();
                }, (duration + delay) * 1000);
            };
            
            // Initial particles
            for(let i = 0; i < 30; i++) {
                setTimeout(createParticle, i * 100);
            }
            
            // Continuous particles
            const particleInterval = setInterval(createParticle, 300);
            
            // Stop generating when enter screen is gone
            enterBtn?.addEventListener('click', () => clearInterval(particleInterval));
        }

        if (enterScreen && enterBtn) {
            // Force hard scroll lock on body & html
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
            
            enterBtn.addEventListener('click', () => {
                // Unlock audio context
                forceStartMusic();
                
                // Hide screen with animation
                enterScreen.classList.add('hidden');
                
                // Release scroll lock once the screen transition is well underway
                setTimeout(() => {
                    document.documentElement.classList.remove('no-scroll');
                    document.body.classList.remove('no-scroll');
                    window.scrollTo(0, 0); // Reset position just in case
                }, 800);
                
                // Start logic that might need user gesture
                if (bgMusic) {
                    musicStarted = true;
                    bgMusic.volume = 0;
                    bgMusic.play().then(() => {
                        fadeAudio(bgMusic, 0.4, 3000);
                        musicBtn.classList.add('playing');
                    }).catch(e => console.log("Audio failed after enter", e));
                }
            });
        }

        // 11. Ultra-Responsive Visibility Handler (Crucial for iOS/Mobile)
        // We use multiple events to ensure the audio stops immediately on lock/minimize
        const stopAllAudio = () => {
             if (bgMusic && !bgMusic.paused) {
                 bgMusic.pause();
                 // We don't use fadeAudio here because iOS suspends JS execution 
                 // almost instantly when the screen locks.
             }
        };

        const startAllAudio = () => {
             if (musicStarted && bgMusic && musicBtn && 
                musicBtn.getAttribute('data-manual-pause') !== 'true' && 
                (!aboutVideo || aboutVideo.paused)) {
                
                bgMusic.volume = 0;
                bgMusic.play().then(() => {
                    fadeAudio(bgMusic, 0.4, 2000);
                }).catch(e => console.log("Resume blocked", e));
            }
        };

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAllAudio();
            else startAllAudio();
        });

        // Additional events for mobile robustness
        window.addEventListener('pagehide', stopAllAudio);
        window.addEventListener('blur', stopAllAudio);
        window.addEventListener('focus', startAllAudio);

        // Robust State Machine for Audio
        let audioPlayState = 'idle'; // idle, playing, seeking
        
        const forceStartMusic = () => {
            if (musicStarted || audioPlayState === 'playing' || (aboutVideo && !aboutVideo.paused)) return;

            audioPlayState = 'seeking';
            console.log("Iniciando tentativa de áudio (Interação Detectada)");
            
            // Unmute and play attempt
            bgMusic.play().then(() => {
                musicStarted = true;
                audioPlayState = 'playing';
                console.log("Áudio ativado com sucesso!");
                fadeAudio(bgMusic, 0.4, 2000); // Elegant 2s fade-in
                musicBtn.classList.add('playing');
                musicBtn.querySelector('i').className = 'fas fa-volume-up';
                
                // Cleanup all triggers from all events
                const allTriggers = ['click', 'touchstart', 'scroll', 'mousemove', 'wheel', 'mousedown', 'keydown', 'pointerdown'];
                allTriggers.forEach(evt => window.removeEventListener(evt, forceStartMusic));
            }).catch(err => {
                audioPlayState = 'idle';
                console.log("Aguardando interação do usuário para áudio...");
            });
        };

        // Attach to every possible user interaction to catch the "activation"
        ['click', 'touchstart', 'scroll', 'mousemove', 'wheel', 'mousedown', 'keydown', 'pointerdown'].forEach(evt => {
            window.addEventListener(evt, forceStartMusic, { passive: true });
        });

        // Some environments require a very explicit user interaction to "unlock" the AudioContext
        document.body.addEventListener('click', () => {
             if (!musicStarted) forceStartMusic();
        }, { once: true });

        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                musicStarted = true;
                bgMusic.volume = 0;
                bgMusic.play();
                fadeAudio(bgMusic, 0.4, 2000);
                musicBtn.classList.add('playing');
                musicBtn.querySelector('i').className = 'fas fa-volume-up';
                musicBtn.setAttribute('data-manual-pause', 'false');
            } else {
                fadeAudio(bgMusic, 0, 1000, () => {
                    bgMusic.pause();
                    musicBtn.classList.remove('playing');
                    musicBtn.querySelector('i').className = 'fas fa-volume-mute';
                });
                musicBtn.setAttribute('data-manual-pause', 'true');
            }
        });
    }
});
