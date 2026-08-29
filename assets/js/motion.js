// Shared motion behavior: scroll-triggered reveals + nav scroll shadow
document.addEventListener('DOMContentLoaded', () => {
  // Nav gains a shadow once the page scrolls, for depth continuity
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Hamburger menu holding Home + Contact
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && nav && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('is-menu-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // close after tapping a menu link, or when tapping outside
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        nav.classList.remove('is-menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll reveal: quiet supporting motion for sections as they enter view
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // no IntersectionObserver support: show content immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
});
