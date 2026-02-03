// (ES) Projects: filtros + lightbox + lazyload
// - Sin dependencias
// - Mobile-first
// - Accesible: teclado + aria + focus trap simple
// - Lightbox: abre/cierra/navega

export function crearGaleria() {
  // En este caso la galería es HTML-first (SEO),
  // pero aquí preparamos el dataset para lightbox.
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  // Guardamos el orden visible de items para navegar en lightbox
  const cards = Array.from(gallery.querySelectorAll('.gcard'));
  cards.forEach((card, idx) => {
    card.dataset.index = String(idx);
  });
}

export function filtrosProyectos() {
  const filters = document.querySelector('[data-project-filters]');
  const gallery = document.querySelector('[data-gallery]');
  if (!filters || !gallery) return;

  const buttons = Array.from(filters.querySelectorAll('[data-filter]'));
  const cards = Array.from(gallery.querySelectorAll('.gcard'));

  function setActive(btn) {
    buttons.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function applyFilter(value) {
    cards.forEach((card) => {
      const cat = card.dataset.category || '';
      const show = value === 'all' ? true : cat === value;
      card.classList.toggle('is-hidden', !show);
    });
  }

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;

    const value = btn.dataset.filter || 'all';
    setActive(btn);
    applyFilter(value);
  });

  // Default
  applyFilter('all');
}

export function lightboxProyectos() {
  const gallery = document.querySelector('[data-gallery]');
  const lb = document.querySelector('[data-lightbox]');
  if (!gallery || !lb) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const img = lb.querySelector('[data-lightbox-img]');
  const srcAvif = lb.querySelector('[data-lightbox-avif]');
  const srcWebp = lb.querySelector('[data-lightbox-webp]');
  const titleEl = lb.querySelector('[data-lightbox-title]');
  const descEl = lb.querySelector('[data-lightbox-desc]');

  const btnCloseEls = Array.from(lb.querySelectorAll('[data-lightbox-close]'));
  const btnPrev = lb.querySelector('[data-lightbox-prev]');
  const btnNext = lb.querySelector('[data-lightbox-next]');

  let activeIndex = 0;
  let lastFocus = null;

  const allCards = () => Array.from(gallery.querySelectorAll('.gcard')).filter((c) => !c.classList.contains('is-hidden'));

  function getCardByIndex(idx) {
    const cards = allCards();
    return cards[idx] || null;
  }

  function setImageFromCard(card) {
    if (!card) return;
    const pic = card.querySelector('picture');
    const image = card.querySelector('img');
    if (!pic || !image) return;

    const avif = pic.querySelector('source[type="image/avif"]')?.getAttribute('data-srcset') || '';
    const webp = pic.querySelector('source[type="image/webp"]')?.getAttribute('data-srcset') || '';
    const jpg = image.getAttribute('data-src') || image.getAttribute('src') || '';

    const t = card.dataset.title || '';
    const d = card.dataset.desc || '';

    if (srcAvif) srcAvif.srcset = avif || '';
    if (srcWebp) srcWebp.srcset = webp || '';
    if (img) {
      img.src = jpg;
      img.alt = image.alt || t || 'Project image';
    }
    if (titleEl) titleEl.textContent = t;
    if (descEl) descEl.textContent = d;
  }

  function openAt(index) {
    const cards = allCards();
    if (cards.length === 0) return;

    activeIndex = Math.max(0, Math.min(index, cards.length - 1));
    const card = cards[activeIndex];

    lastFocus = document.activeElement;

    lb.hidden = false;
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('is-open');

    if (!reduceMotion) {
      // permite transiciones CSS
      requestAnimationFrame(() => lb.classList.add('is-open'));
    }

    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    setImageFromCard(card);

    // Focus al botón de cerrar para accesibilidad
    const closeBtn = lb.querySelector('.lightbox__close');
    closeBtn?.focus();
  }

  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');

    // Para que la transición cierre se vea, esperamos un tick
    if (reduceMotion) {
      lb.hidden = true;
    } else {
      window.setTimeout(() => {
        lb.hidden = true;
      }, 180);
    }

    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');

    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function prev() {
    const cards = allCards();
    if (cards.length === 0) return;
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    setImageFromCard(cards[activeIndex]);
  }

  function next() {
    const cards = allCards();
    if (cards.length === 0) return;
    activeIndex = (activeIndex + 1) % cards.length;
    setImageFromCard(cards[activeIndex]);
  }

  // Open handlers
  gallery.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lightbox-open]');
    if (!btn) return;

    const card = btn.closest('.gcard');
    if (!card) return;

    const cards = allCards();
    const idx = cards.indexOf(card);
    openAt(idx >= 0 ? idx : 0);
  });

  // Close handlers
  btnCloseEls.forEach((el) => el.addEventListener('click', close));
  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (lb.hidden) return;

    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();

    // Focus trap simple
    if (e.key === 'Tab') {
      const focusable = lb.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusable).filter((el) => !el.hasAttribute('disabled'));
      if (list.length === 0) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Swipe básico móvil
  let startX = 0;
  let startY = 0;
  let isTouch = false;

  lb.addEventListener('touchstart', (e) => {
    if (lb.hidden) return;
    isTouch = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  lb.addEventListener('touchend', (e) => {
    if (!isTouch || lb.hidden) return;
    isTouch = false;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const dx = endX - startX;
    const dy = endY - startY;

    // swipe horizontal claro
    if (Math.abs(dx) > 46 && Math.abs(dy) < 60) {
      if (dx > 0) prev();
      else next();
    }
  }, { passive: true });
}
