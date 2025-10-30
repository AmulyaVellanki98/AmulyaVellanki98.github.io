// Full-page scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.dot');
    const scrollContainer = document.querySelector('.scroll-container');
    
    let currentSection = 0;
    let isScrolling = false;

    // Update active dot
    function updateActiveDot(index) {
        navDots.forEach(dot => dot.classList.remove('active'));
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
    }

    // Scroll to specific section
    function scrollToSection(index) {
        if (index >= 0 && index < sections.length && !isScrolling) {
            isScrolling = true;
            currentSection = index;
            
            sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            updateActiveDot(index);
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }

    // Handle wheel scroll
    scrollContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (!isScrolling) {
            if (e.deltaY > 0) {
                // Scroll down
                if (currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                }
            } else {
                // Scroll up
                if (currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
            }
        }
    }, { passive: false });

    // Handle navigation dots click
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection(index);
        });
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    });

    // Handle touch events for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    scrollContainer.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    scrollContainer.addEventListener('touchmove', function(e) {
        touchEndY = e.touches[0].clientY;
    }, { passive: true });

    scrollContainer.addEventListener('touchend', function() {
        if (!isScrolling) {
            const swipeDistance = touchStartY - touchEndY;
            
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    // Swipe up - go to next section
                    if (currentSection < sections.length - 1) {
                        scrollToSection(currentSection + 1);
                    }
                } else {
                    // Swipe down - go to previous section
                    if (currentSection > 0) {
                        scrollToSection(currentSection - 1);
                    }
                }
            }
        }
    }, { passive: true });

    // Initialize
    updateActiveDot(0);
});