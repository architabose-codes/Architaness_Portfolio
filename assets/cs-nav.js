// Liquid glass case-study tab bar — sliding highlight + scroll-condense +
// scrollspy. Shared across all project pages (loaded via <script src>)
// so the behavior only needs to be maintained in one place. On mobile the
// same #csTabs element is repositioned to a fixed bottom pill by CSS; this
// script doesn't need to know about that, since it only ever measures
// offsets relative to #csTabs itself.
document.addEventListener('DOMContentLoaded', function () {
  const topbar    = document.querySelector('.cs-topbar');
  const tabsEl    = document.getElementById('csTabs');
  const highlight = document.getElementById('csTabsHighlight');
  if (!tabsEl || !highlight) return;

  const links = [...tabsEl.querySelectorAll('a')];
  let activeLink = links[0] || null;

  // Position/size the chip to exactly hug the target link's own box.
  // Layout-based offsets (not getBoundingClientRect) because the condensed
  // state applies a CSS `transform: scale()` to this element — rect-based
  // measurements are already scaled, and re-applying them as raw CSS would
  // double the scaling.
  function moveHighlightTo(el) {
    if (!el) return;
    highlight.style.top    = el.offsetTop + 'px';
    highlight.style.left   = el.offsetLeft + 'px';
    highlight.style.width  = el.offsetWidth + 'px';
    highlight.style.height = el.offsetHeight + 'px';
    highlight.classList.add('is-visible');
  }

  function setActiveLink(el) {
    if (!el) return;
    activeLink = el;
    links.forEach(l => l.classList.toggle('is-active', l === el));
    if (!tabsEl.matches(':hover')) moveHighlightTo(el);
  }

  links.forEach(link => {
    link.addEventListener('mouseenter', () => moveHighlightTo(link));
  });

  // On mouse-leave, the chip returns to the active (scroll-spied) link
  // rather than disappearing — matching persistent tab-bar selection.
  tabsEl.addEventListener('mouseleave', () => moveHighlightTo(activeLink));

  let resizeRaf = null;
  function resync() {
    const hovered = tabsEl.querySelector('a:hover');
    moveHighlightTo(hovered || activeLink);
  }
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resync);
  });

  // Condense the pill based on scroll direction: scrolling down minimizes
  // it, scrolling up restores it immediately (not just once you reach the
  // very top). Direction is only read off scroll deltas bigger than
  // JITTER — trackpad momentum settling and mouse-wheel sub-pixel deltas
  // can otherwise sit right on the line and flip the class every frame,
  // which visibly flickers the real-size resize on .cs-back/.cs-tabs.
  if (topbar) {
    let ticking = false;
    let lastY = window.scrollY;
    const JITTER = 6;
    function updateCondensed() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) > JITTER) {
        if (delta > 0 && y > 40) {
          topbar.classList.add('is-condensed');
        } else if (delta < 0) {
          topbar.classList.remove('is-condensed');
        }
        lastY = y;
      }
      resync();
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateCondensed);
        ticking = true;
      }
    }, { passive: true });
  }

  // Default to the first tab until scrollspy reports otherwise
  setActiveLink(activeLink);
  requestAnimationFrame(() => moveHighlightTo(activeLink));

  // Scrollspy for section tabs
  const sections = links.map(t => document.querySelector(t.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = links.find(l => l.getAttribute('href') === '#' + entry.target.id);
        if (match) setActiveLink(match);
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => spy.observe(s));
});
