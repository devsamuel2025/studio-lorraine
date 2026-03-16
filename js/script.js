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

    // 4. Audio Control for About Video
    const aboutVideo = document.getElementById('about-video');
    
    if (aboutVideo) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start audio when in view
                    // Note: Browser policies may block this if the user hasn't interacted with the page yet
                    aboutVideo.muted = false;
                    
                    // Optional: Try to play in case it was paused
                    aboutVideo.play().catch(e => console.log("Autoplay with sound blocked until user interaction"));
                } else {
                    // Mute when out of view to save resources and avoid confusion
                    aboutVideo.muted = true;
                }
            });
        }, { threshold: 0.5 }); // Unmute when at least 50% of the video is visible

        videoObserver.observe(aboutVideo);
    }
});
