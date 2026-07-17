// Footer gradient — soft glow that drifts toward the cursor. Lerped
// rather than snapping directly to the pointer so it reads as ambient
// drift, and only animated while the section is on screen. Shared across
// the homepage and all project pages (loaded via <script src>).
(function () {
  const cta = document.querySelector('.cta');
  if (!cta) return;

  let targetX = 50, targetY = 20, curX = 50, curY = 20;
  let ctaRaf = null;

  function animateGlow() {
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;
    cta.style.setProperty('--mx', curX.toFixed(2) + '%');
    cta.style.setProperty('--my', curY.toFixed(2) + '%');
    ctaRaf = requestAnimationFrame(animateGlow);
  }

  window.addEventListener('mousemove', e => {
    const rect = cta.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * 100;
    targetY = ((e.clientY - rect.top) / rect.height) * 100;
  }, { passive: true });

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !ctaRaf) {
      ctaRaf = requestAnimationFrame(animateGlow);
    } else if (!entry.isIntersecting && ctaRaf) {
      cancelAnimationFrame(ctaRaf);
      ctaRaf = null;
    }
  }, { threshold: 0 }).observe(cta);
})();
