/**
 * Studio Lorraine Oliveira - Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    let musicStarted = false;
    
    // Elements
    const header = document.getElementById('header');
    const aboutVideo = document.getElementById('about-video');
    const playBtn = document.getElementById('play-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');

    // Helper function for fading audio volume smoothly
    const fadeAudio = (audio, targetVolume, duration = 1000, callback = null) => {
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

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

                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // 4. Mobile Menu Toggle
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 5. Video & Music Interaction Logic
    const pauseBackgroundMusic = () => {
        if (bgMusic && !bgMusic.paused) {
            fadeAudio(bgMusic, 0, 600, () => {
                bgMusic.pause();
                if (musicBtn) {
                    musicBtn.classList.remove('playing');
                    musicBtn.querySelector('i').className = 'fas fa-volume-mute';
                }
            });
        }
    };

    const resumeBackgroundMusic = () => {
        if (bgMusic && musicBtn && musicBtn.getAttribute('data-manual-pause') !== 'true') {
            bgMusic.volume = 0;
            bgMusic.play().then(() => {
                fadeAudio(bgMusic, 0.7, 5000);
                musicBtn.classList.add('playing');
                musicBtn.querySelector('i').className = 'fas fa-volume-up';
            }).catch(err => console.log("Resume blocked", err));
        }
    };

    if (aboutVideo && playBtn) {
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

    // 6. Marquee Focus Effect
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

    // 7. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline && window.innerWidth >= 992) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX, posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });
        document.querySelectorAll('a, button, .marquee-item, .social-links a').forEach(el => {
            el.addEventListener('mouseenter', () => { [cursorDot, cursorOutline].forEach(c => c.classList.add('hover')); });
            el.addEventListener('mouseleave', () => { [cursorDot, cursorOutline].forEach(c => c.classList.remove('hover')); });
        });
    }

    // 8. Mobile Ripple
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = `${touch.clientX}px`;
        ripple.style.top = `${touch.clientY}px`;
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // 9. Background Music Activation
    if (bgMusic && musicBtn) {
        bgMusic.volume = 0;

        const startMusic = () => {
            if (!musicStarted && (!aboutVideo || aboutVideo.paused)) {
                bgMusic.play().then(() => {
                    musicStarted = true;
                    fadeAudio(bgMusic, 0.7, 5000);
                    musicBtn.classList.add('playing');
                    musicBtn.querySelector('i').className = 'fas fa-volume-up';
                }).catch(err => console.log("Autoplay block:", err));
            }
        };

        ['click', 'touchstart', 'scroll', 'mousemove'].forEach(evt => {
            window.addEventListener(evt, startMusic, { once: true });
        });

        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                bgMusic.volume = 0;
                bgMusic.play();
                fadeAudio(bgMusic, 0.7, 5000);
                musicBtn.classList.add('playing');
                musicBtn.querySelector('i').className = 'fas fa-volume-up';
                musicBtn.setAttribute('data-manual-pause', 'false');
            } else {
                fadeAudio(bgMusic, 0, 600, () => {
                    bgMusic.pause();
                    musicBtn.classList.remove('playing');
                    musicBtn.querySelector('i').className = 'fas fa-volume-mute';
                });
                musicBtn.setAttribute('data-manual-pause', 'true');
            }
        });
    }
});
