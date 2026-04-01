/* ============================================
   CANOPY ARBORISTS - MAIN.JS
   Production-Ready JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ─── Sticky Header ─────────────────────── */
  const navbar = document.querySelector('.navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ─── Mobile Hamburger Menu ─────────────── */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── Scroll Animations (Intersection Observer) ─── */
  const animatedEls = document.querySelectorAll('.animate');

  if (animatedEls.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    animatedEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ─── FAQ Accordion ─────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Close all open items
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Keyboard accessibility
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });

    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
  });

  /* ─── Smooth Scroll for Anchor Links ────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  /* ─── Active Nav Link Highlighting ──────── */
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkEls = document.querySelectorAll('.nav-links a:not(.btn)');

    navLinkEls.forEach(function (link) {
      link.classList.remove('active');
      const linkPage = link.getAttribute('href');

      if (
        (currentPage === '' || currentPage === 'index.html') && (linkPage === 'index.html' || linkPage === './')
      ) {
        link.classList.add('active');
      } else if (linkPage && linkPage !== 'index.html' && currentPage.includes(linkPage.replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  }

  setActiveNavLink();

  /* ─── Section Scroll Spy (for #sections) ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinksArr = Array.from(document.querySelectorAll('.nav-links a:not(.btn)'));

  if (sections.length > 0 && navLinksArr.length > 0) {
    function onScrollSpy() {
      const scrollY = window.pageYOffset;
      const navHeight = navbar ? navbar.offsetHeight : 0;

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop - navHeight - 80;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          navLinksArr.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
  }

  /* ─── Contact Form Submission (front-end only) ─── */
  const contactForm = document.querySelector('.contact-form form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      // Simulate async form submission
      setTimeout(function () {
        // Create success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = [
          'background: #d4edda',
          'color: #155724',
          'border: 1px solid #c3e6cb',
          'border-radius: 8px',
          'padding: 16px 20px',
          'margin-top: 16px',
          'font-family: var(--font-heading, sans-serif)',
          'font-size: 0.95rem',
          'font-weight: 600'
        ].join(';');
        successMsg.textContent = '✓ Thank you! We\'ll be in touch within 1 business day.';

        contactForm.appendChild(successMsg);

        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }

        contactForm.reset();

        // Remove success message after 6 seconds
        setTimeout(function () {
          if (successMsg.parentNode) {
            successMsg.remove();
          }
        }, 6000);
      }, 1200);
    });
  }

  /* ─── Stats Counter Animation ────────────── */
  function animateCounter(el, target, duration) {
    const isString = isNaN(parseInt(target));
    if (isString) return;

    const numTarget = parseInt(target);
    const suffix = target.replace(/[0-9]/g, '');
    let start = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * numTarget);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = numTarget + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawText = el.textContent.trim();
          animateCounter(el, rawText, 1800);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

})();
