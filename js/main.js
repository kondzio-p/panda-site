// =====================================================
// PANDA AUTO DETAILING TORUŃ — main.js
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  try {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const prefersReducedMotion = false; // Forced animations active

  /* ============ NAV: shrink on scroll ============ */
  const nav = document.getElementById('siteNav');
  ScrollTrigger.create({
    start: 'top -10',
    end: 99999,
    toggleClass: { targets: nav, className: 'is-scrolled' }
  });

  /* ============ NAV: smooth scroll + close drawer on link click ============ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          closeDrawer();
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power2.inOut'
          });
        }
      }
    });
  });

  /* ============ NAV: active section ============ */
  const navItems = [
    ...document.querySelectorAll('.nav-link[href^="#"], .nav-drawer-link[href^="#"]')
  ];
  const sectionIds = ['onas', 'uslugi', 'proces', 'realizacje', 'kontakt'];

  function setActiveNav(id) {
    navItems.forEach((item) => {
      const isActive = item.getAttribute('href') === `#${id}`;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  setActiveNav('onas');

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id)
    });
  });

  /* ============ MARQUEE: keep the loop wider than the viewport ============ */
  const marquee = document.querySelector('.marquee');
  const marqueeTrack = document.querySelector('.marquee-track');
  const marqueeGroup = document.querySelector('.marquee-group');

  if (marquee && marqueeTrack && marqueeGroup) {
    function fillMarquee() {
      const baseContent = marqueeGroup.innerHTML;
      document.querySelectorAll('.marquee-group').forEach((group) => {
        group.innerHTML = baseContent;
      });

      while (marqueeTrack.scrollWidth / 2 < marquee.offsetWidth + 80) {
        document.querySelectorAll('.marquee-group').forEach((group) => {
          group.insertAdjacentHTML('beforeend', baseContent);
        });
      }
    }

    fillMarquee();
    window.addEventListener('resize', () => {
      fillMarquee();
      ScrollTrigger.refresh();
    });
  }

  /* ============ MOBILE DRAWER (GSAP) ============ */
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');
  let drawerOpen = false;

  gsap.set(drawer, { xPercent: 0, x: '100%' });

  function openDrawer() {
    drawerOpen = true;
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (backdrop) backdrop.classList.add('is-active');
    gsap.to(drawer, { x: '0%', duration: 0.55, ease: 'power3.out' });
    gsap.fromTo(drawer.querySelectorAll('.nav-drawer-link, .nav-drawer-cta, .nav-drawer-socials a'),
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.45, stagger: 0.05, delay: 0.15, ease: 'power2.out' }
    );
  }
  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (backdrop) backdrop.classList.remove('is-active');
    gsap.to(drawer, { x: '100%', duration: 0.45, ease: 'power3.in' });
  }
  burger.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());
  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }
  document.querySelectorAll('.nav-drawer-link, .nav-drawer-cta').forEach(l => {
    l.addEventListener('click', closeDrawer);
  });

  /* ============ CURSOR GLOW (velocity-based) ============ */
  const glow = document.getElementById('cursorGlow');
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let lastX = mouseX, lastY = mouseY, lastT = performance.now();

    const glowX = gsap.quickTo(glow, 'x', { duration: 0.5, ease: 'power3.out' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.5, ease: 'power3.out' });
    const glowScaleX = gsap.quickTo(glow, 'scaleX', { duration: 0.35, ease: 'power2.out' });
    const glowScaleY = gsap.quickTo(glow, 'scaleY', { duration: 0.35, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      glowX(mouseX); glowY(mouseY);

      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
      const velocity = dist / dt;
      const scale = gsap.utils.clamp(0.85, 1.7, 0.85 + velocity * 1.6);
      glowScaleX(scale);
      glowScaleY(scale);

      lastX = mouseX; lastY = mouseY; lastT = now;
    });
  }

  /* ============ HERO entrance ============ */
  if (!prefersReducedMotion) {
    const heroTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Clear GSAP properties to avoid interference with CSS hover transition styles
        gsap.set('.hero-actions .btn, .hero-scroll-hint, .hero-eyebrow, .hero-title, .hero-sub', { clearProps: 'transform,opacity' });
      }
    });
    heroTl
      .from('.hero-img--main', { scale: 1.22, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hero-eyebrow', { opacity: 0, y: 16, duration: 0.7 }, 0.3)
      .from('.hero-title', { opacity: 0, y: 40, duration: 0.9 }, 0.42)
      .from('.hero-sub', { opacity: 0, y: 24, duration: 0.8 }, 0.62)
      .from('.hero-actions .btn', { opacity: 0, y: 18, duration: 0.6, stagger: 0.1 }, 0.78)
      .from('.hero-scroll-hint', { opacity: 0, duration: 0.6 }, 1);
  }

  /* ============ STATS counters (triggered once on scroll) ============ */
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((el) => {
    const target = parseInt(el.dataset.countTo, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        let lastRendered = -1;
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            const rounded = Math.round(obj.val);
            if (rounded !== lastRendered) {
              lastRendered = rounded;
              el.textContent = rounded;
            }
          }
        });
      }
    });
  });

  /* ============ SCRAMBLE TEXT: "twoje auto!" ============ */
  const scrambleEl = document.getElementById('scrambleText');
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&*!?';
  const FINAL_TEXT = 'twoje auto!';
  let scrambleStarted = false;

  function runScramble(el, finalText, duration = 1400) {
    const startTime = performance.now();
    const len = finalText.length;

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealCount = Math.floor(progress * len);

      let out = '';
      for (let i = 0; i < len; i++) {
        if (finalText[i] === ' ') { out += ' '; continue; }
        if (i < revealCount) {
          out += finalText[i];
        } else {
          out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = out;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
      }
    }
    requestAnimationFrame(frame);
  }

  if (scrambleEl) {
    ScrollTrigger.create({
      trigger: scrambleEl,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (scrambleStarted) return;
        scrambleStarted = true;
        runScramble(scrambleEl, FINAL_TEXT, 1500);
      }
    });
  }

  /* ============ SCROLL REVEALS (Premium ScrollTrigger Sequences) ============ */
  if (!prefersReducedMotion) {
    const revealGroup = (items, trigger, options = {}) => {
      const targets = gsap.utils.toArray(items);
      if (!targets.length || !trigger) return;

      gsap.fromTo(
        targets,
        {
          autoAlpha: 0,
          y: options.y ?? 40,
          scale: options.scale ?? 1
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: options.duration ?? 0.85,
          stagger: options.stagger ?? 0.12,
          ease: options.ease ?? 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: {
            trigger,
            start: options.start ?? 'top 82%',
            once: true,
            invalidateOnRefresh: true
          }
        }
      );
    };

    // 1. About Section - Media (image and badge)
    const aboutMedia = document.querySelector('.about-media');
    if (aboutMedia) {
      const aboutImg = aboutMedia.querySelector('.about-img');
      const aboutTag = aboutMedia.querySelector('.about-media-tag');

      const aboutMediaTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutMedia,
          start: 'top 85%',
          once: true
        }
      });

      aboutMediaTl
        .from(aboutMedia, {
          opacity: 0,
          x: -40,
          duration: 1.1,
          ease: 'power3.out'
        })
        .from(aboutImg, {
          scale: 1.12,
          filter: 'grayscale(60%)',
          duration: 1.4,
          ease: 'power2.out'
        }, 0)
        .from(aboutTag, {
          opacity: 0,
          scale: 0,
          x: 30,
          duration: 0.85,
          ease: 'back.out(1.4)'
        }, 0.4);
    }

    // 2. About Section - Content Elements
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      gsap.from(aboutContent.children, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutContent,
          start: 'top 82%',
          once: true
        }
      });
    }

    // 3. Services Section - Head
    const servicesHead = document.querySelector('.services-head');
    if (servicesHead) {
      gsap.from(servicesHead.children, {
        opacity: 0,
        y: 30,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: servicesHead,
          start: 'top 85%',
          once: true
        }
      });
    }

    // 4. Services Section - Grid Cards
    /*
    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) {
      revealGroup(servicesGrid.querySelectorAll('.service-card'), servicesGrid, {
        start: 'top 82%',
        scale: 0.95,
        stagger: {
          each: 0.12,
          grid: 'auto'
        }
      });
    }
    */

    // 5. Services Section - Footnote
    const servicesMore = document.querySelector('.services-more');
    if (servicesMore) {
      gsap.from(servicesMore.children, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: servicesMore,
          start: 'top 90%',
          once: true
        }
      });
    }

    // 6. Process Section - Head
    const processHead = document.querySelector('.process-head');
    if (processHead) {
      gsap.from(processHead.children, {
        opacity: 0,
        y: 30,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: processHead,
          start: 'top 85%',
          once: true
        }
      });
    }

    // 7. Process Section - Steps Grid
    /*
    const processGrid = document.querySelector('.process-grid');
    if (processGrid) {
      revealGroup(processGrid.querySelectorAll('.process-step'), processGrid, {
        start: 'top 82%',
        duration: 0.8,
        stagger: 0.18,
        ease: 'power3.out'
      });
    }
    */

    // 8. Gallery Section - Head
    const galleryHead = document.querySelector('.gallery-head');
    if (galleryHead) {
      gsap.from(galleryHead.children, {
        opacity: 0,
        y: 30,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryHead,
          start: 'top 85%',
          once: true
        }
      });
    }

    // 9. Gallery Section - Grid Items
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
      gsap.from('.gallery-item', {
        opacity: 0,
        scale: 0.93,
        y: 40,
        duration: 0.95,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryGrid,
          start: 'top 85%',
          once: true
        }
      });
    }

    // 10. Contact Section - Head
    const contactHead = document.querySelector('.contact-head');
    if (contactHead) {
      gsap.from(contactHead.children, {
        opacity: 0,
        y: 30,
        duration: 0.85,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactHead,
          start: 'top 85%',
          once: true
        }
      });
    }

    // 11. Contact Section - Grid Cards
    /*
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) {
      revealGroup(contactGrid.querySelectorAll('.contact-card'), contactGrid, {
        start: 'top 84%',
        duration: 0.8,
        stagger: 0.14,
        ease: 'power3.out'
      });
    }
    */

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }



  /* ============ Footer year safety (in case of future edits) ============ */
  } catch (e) {
    console.error('GSAP initialisation error:', e);
  }
});
