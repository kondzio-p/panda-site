// =====================================================
// PANDA AUTO DETAILING TORUŃ — uslugi.js (podstrona)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  const prefersReducedMotion = false; // Forced animations active

  /* NAV shrink */
  const nav = document.getElementById('siteNav');
  ScrollTrigger.create({
    start: 'top -10',
    end: 99999,
    onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 10)
  });

  /* Active nav item for this page */
  document.querySelectorAll('.nav-link[href="uslugi.html"], .nav-drawer-link[href="uslugi.html"]').forEach((link) => {
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  });

  /* Back to top smooth scroll */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(window, { duration: 1, scrollTo: { y: 0 }, ease: 'power2.inOut' });
    });
  }

  /* Mobile drawer */
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');
  let drawerOpen = false;
  gsap.set(drawer, { x: '100%' });

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
  document.querySelectorAll('.nav-drawer-link, .nav-drawer-cta').forEach(l => l.addEventListener('click', closeDrawer));

  /* Cursor glow */
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
      glowScaleX(gsap.utils.clamp(0.85, 1.7, 0.85 + velocity * 1.6));
      glowScaleY(gsap.utils.clamp(0.85, 1.7, 0.85 + velocity * 1.6));
      lastX = mouseX; lastY = mouseY; lastT = now;
    });
  }

  /* ============ SCROLL REVEALS (Premium Uslugi Sequences) ============ */
  if (!prefersReducedMotion) {
    // 1. Hero entrance
    gsap.from('.uslugi-hero-inner > *', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      onComplete: () => {
        // Clear properties so CSS hover transitions on the CTA button work
        gsap.set('.uslugi-hero-inner .btn', { clearProps: 'transform,opacity' });
      }
    });

    // 2. Services list rows - staggered dual-axis reveal (number from left, body from bottom)
    gsap.utils.toArray('.uslugi-row').forEach((row) => {
      const num = row.querySelector('.uslugi-row-num');
      const body = row.querySelector('.uslugi-row-body');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 88%',
          once: true
        }
      });

      tl.from(num, {
        opacity: 0,
        x: -24,
        duration: 0.8,
        ease: 'power3.out'
      })
        .from(body, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out'
        }, 0.12);
    });

    // 3. CTA strip entrance
    gsap.from('.uslugi-cta > *', {
      opacity: 0,
      y: 26,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.uslugi-cta',
        start: 'top 80%',
        once: true
      },
      onComplete: () => {
        // Clear properties so CSS hover transitions on the button work
        gsap.set('.uslugi-cta .btn', { clearProps: 'transform,opacity' });
      }
    });
  }

});
