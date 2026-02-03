// (ES) FAQ accesible y desacoplado:
// - Usa aria-expanded + hidden
// - Animación suave sin librerías
// - Modo "solo uno abierto" para mantener orden premium
export function faq() {
  const root = document.querySelector('[data-faq]');
  if (!root) return;

  const items = Array.from(root.querySelectorAll('[data-faq-item]'));
  if (items.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeItem(item) {
    const btn = item.querySelector('.faq-item__btn');
    const panel = item.querySelector('.faq-item__panel');
    if (!btn || !panel) return;

    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');

    if (reduceMotion) {
      panel.hidden = true;
      panel.style.height = '';
      return;
    }

    const h = panel.scrollHeight;
    panel.style.height = `${h}px`;
    panel.offsetHeight; // reflow
    panel.style.height = '0px';

    const onEnd = () => {
      panel.hidden = true;
      panel.style.height = '';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function openItem(item) {
    const btn = item.querySelector('.faq-item__btn');
    const panel = item.querySelector('.faq-item__panel');
    if (!btn || !panel) return;

    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');

    if (reduceMotion) {
      panel.hidden = false;
      panel.style.height = '';
      return;
    }

    panel.hidden = false;
    panel.style.height = '0px';
    panel.offsetHeight; // reflow
    const h = panel.scrollHeight;
    panel.style.height = `${h}px`;

    const onEnd = () => {
      panel.style.height = '';
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
  }

  // Preparar paneles con transición (solo si hay animación)
  if (!reduceMotion) {
    items.forEach((item) => {
      const panel = item.querySelector('.faq-item__panel');
      if (!panel) return;
      panel.style.overflow = 'hidden';
      panel.style.transition = 'height 260ms ease';
    });
  }

  // Interacciones
  items.forEach((item) => {
    const btn = item.querySelector('.faq-item__btn');
    const panel = item.querySelector('.faq-item__panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Cerrar todos primero (solo uno abierto)
      items.forEach((it) => {
        if (it !== item) closeItem(it);
      });

      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });
}
