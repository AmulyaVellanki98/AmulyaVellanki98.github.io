// Smooth scroll behavior and navigation management
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const progressBar = document.querySelector('.progress-bar');

  // Mobile menu toggle
  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translateY(7px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });

  // Smooth scroll for navigation links
  function smoothScroll(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
      const offsetTop = target.offsetTop - 70; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // Add click handlers to all nav links
  [...navLinks, ...mobileLinks].forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      smoothScroll(targetId);
    });
  });

  // Update active nav link on scroll
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${index}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  // Update progress bar
  function updateProgressBar() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = progress + '%';
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .education-item, .cert-item, .contact-item');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add stagger animation delay
  document.querySelectorAll('.skill-category').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
  });

  document.querySelectorAll('.project-card').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.15}s`;
  });

  document.querySelectorAll('.cert-item').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.05}s`;
  });

  // Scroll event listeners
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      updateActiveNavLink();
      updateProgressBar();
    }, 10);
  });

  // Initial updates
  updateActiveNavLink();
  updateProgressBar();

  // Add parallax effect to hero background
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    window.addEventListener('scroll', function() {
      const scrolled = window.scrollY;
      const heroSection = document.querySelector('.hero-section');
      if (heroSection && scrolled < heroSection.offsetHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }

  // Typing effect for hero title (optional enhancement)
  const heroTitle = document.querySelector('.hero-title .text-line');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let charIndex = 0;

    function typeWriter() {
      if (charIndex < text.length) {
        heroTitle.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
      }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
  }

  // Add hover effect to timeline dots
  const timelineDots = document.querySelectorAll('.timeline-dot');
  timelineDots.forEach(dot => {
    dot.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(-50%) scale(1.5)';
    });
    dot.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(-50%) scale(1)';
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const currentSection = getCurrentSection();
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const nextSection = sections[currentSection + 1];
      if (nextSection) {
        smoothScroll('#' + nextSection.id);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prevSection = sections[currentSection - 1];
      if (prevSection) {
        smoothScroll('#' + prevSection.id);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      smoothScroll('#hero');
    } else if (e.key === 'End') {
      e.preventDefault();
      smoothScroll('#contact');
    }
  });

  function getCurrentSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    let currentIndex = 0;
    
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      if (scrollPosition >= sectionTop) {
        currentIndex = index;
      }
    });
    
    return currentIndex;
  }

  // Add scroll snap for better section navigation (optional)
  let isScrolling = false;
  let scrollTimer;

  window.addEventListener('wheel', function(e) {
    clearTimeout(scrollTimer);
    
    if (!isScrolling && Math.abs(e.deltaY) > 50) {
      isScrolling = true;
      
      const currentSection = getCurrentSection();
      
      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        // Scrolling down
        smoothScroll('#' + sections[currentSection + 1].id);
      } else if (e.deltaY < 0 && currentSection > 0) {
        // Scrolling up
        smoothScroll('#' + sections[currentSection - 1].id);
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    }
  }, { passive: true });

  // Touch support for mobile
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
      const currentSection = getCurrentSection();
      
      if (diff > 0 && currentSection < sections.length - 1) {
        // Swipe up
        smoothScroll('#' + sections[currentSection + 1].id);
      } else if (diff < 0 && currentSection > 0) {
        // Swipe down
        smoothScroll('#' + sections[currentSection - 1].id);
      }
    }
  }

  // Add copy email functionality
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const email = this.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          // Optional: Show a toast notification
          showNotification('Email copied to clipboard!');
        });
      }
    });
  });

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--primary-color);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  // Add CSS for notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});