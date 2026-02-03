// (ES) Interacciones específicas de Services:
// - Tap en móvil para abrir/cerrar panel (porque no hay hover real)
// - Animación de entrada de cards con IntersectionObserver (performance-friendly)
export function servicesPage() {
  const grid = document.querySelector('[data-services-grid]');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('[data-svc]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tap-to-expand (solo una abierta a la vez)
  function closeAll(exceptEl = null) {
    cards.forEach((card) => {
      if (exceptEl && card === exceptEl) return;
      card.classList.remove('is-open');
      const btn = card.querySelector('.svc__btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  cards.forEach((card) => {
    const btn = card.querySelector('.svc__btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      closeAll(card);
      card.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Cerrar al tocar fuera
  document.addEventListener('click', (e) => {
    const target = e.target;
    const inside = target && target.closest && target.closest('[data-svc]');
    if (!inside) closeAll();
  }, { passive: true });

  // Animación de entrada (sin librerías)
  if (reduceMotion) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  cards.forEach((card, i) => {
    card.style.setProperty('--d', `${Math.min(i * 60, 420)}ms`);
    io.observe(card);
  });
}
