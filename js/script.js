/**
 * Studio Lorraine Oliveira - Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Effect
    const header = document.getElementById('header');

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
        rootMargin: '0px',
        threshold: 0.15 // element becomes visible when 15% is in viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Optional: stop observing once animated
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // 3. Smooth scrolling for anchor links (if browser doesn't support CSS smooth scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Adjust for fixed header offset
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    // 5. Custom Video Play Button
    const playBtn = document.getElementById('play-btn');
    const aboutVideo = document.getElementById('about-video');

    if (playBtn && aboutVideo) {
        const togglePlay = () => {
            if (aboutVideo.paused) {
                aboutVideo.play();
                aboutVideo.setAttribute('controls', 'true');
            } else {
                aboutVideo.pause();
            }
        };

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });



        // State listeners
        aboutVideo.addEventListener('play', () => {
            playBtn.style.display = 'none';
            aboutVideo.setAttribute('controls', 'true');
        });

        aboutVideo.addEventListener('pause', () => {
            playBtn.style.display = 'flex';
        });

        // 6. Auto-pause video when out of view
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && !aboutVideo.paused) {
                    aboutVideo.pause();
                }
            });
        }, { threshold: 0.1 }); // Pause if less than 10% is visible

        videoObserver.observe(aboutVideo);
    }

    // 7. Results Marquee Focus Effect
    const marqueeItems = document.querySelectorAll('.marquee-item');
    
    if (marqueeItems.length > 0) {
        const updateMarqueeFocus = () => {
            const viewportCenterX = window.innerWidth / 2;
            const focusRange = window.innerWidth * 0.8; // Range to affect scaling

            marqueeItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const distanceFromCenter = Math.abs(viewportCenterX - itemCenterX);
                
                // Calculate normalized distance (0 = center, 1 = edges)
                const normalizedDistance = Math.min(1, distanceFromCenter / (focusRange / 2));
                
                // Apply dynamic values
                // Scale from 1.15 (center) to 0.85 (edges)
                const scale = 1.15 - (normalizedDistance * 0.3);
                
                // Add a slight rotation that mirrors the direction from center
                // 0 degrees at center, 15 degrees at edges
                const rotationY = normalizedDistance * 15;
                const sign = itemCenterX < viewportCenterX ? 1 : -1;
                
                // Apply the transform
                item.style.transform = `perspective(1000px) scale(${scale}) rotateY(${rotationY * sign}deg)`;
                
                // Adjust Z-index so centered items are always on top
                item.style.zIndex = Math.round((1 - normalizedDistance) * 10);
            });
            
            requestAnimationFrame(updateMarqueeFocus);
        };
        
        // Start the focus update loop
        window.requestAnimationFrame(updateMarqueeFocus);
    }
});
