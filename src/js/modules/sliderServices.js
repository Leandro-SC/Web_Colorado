// Carrusel infinito autoplay sin librerías
// - Clona slides para loop perfecto
// - Transición fluida
// - Pausa en hover (desktop) y al tocar (mobile)
// - Respeta prefers-reduced-motion

export function sliderServices() {
  const root = document.querySelector("[data-services-scroller]");
  if (!root) return;

  const viewport = root.querySelector("[data-scroller-viewport]");
  const track = root.querySelector("[data-scroller-track]");
  if (!viewport || !track) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return; // sin autoplay si el usuario lo pide

  let cards = Array.from(track.querySelectorAll(".svc-card"));
  if (cards.length < 2) return;

  // Config
  const AUTOPLAY_DELAY = 2400; // tiempo entre movimientos
  const TRANSITION_MS = 650;   // fluidez de transición
  const PAUSE_AFTER_INTERACTION_MS = 2500;

  let index = 0;
  let timer = null;
  let paused = false;
  let pauseTimeout = null;

  // Para loop: clonaremos los primeros N
  let clonesAdded = false;
  let perView = 1;
  let step = 0;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap || "0");
  };

  const computeMetrics = () => {
    cards = Array.from(track.querySelectorAll(".svc-card"));
    const gap = getGap();

    const cardW = cards[0].getBoundingClientRect().width;
    const viewW = viewport.getBoundingClientRect().width;

    perView = Math.max(1, Math.floor((viewW + gap) / (cardW + gap)));
    step = cardW + gap;
  };

  const setTransition = (on) => {
    track.style.transition = on ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
  };

  const translateToIndex = (i) => {
    track.style.transform = `translate3d(${-i * step}px, 0, 0)`;
  };

  const ensureClones = () => {
    if (clonesAdded) return;

    // Clonamos al menos "perView + 2" para que el loop sea imperceptible
    const cloneCount = Math.min(cards.length, perView + 2);
    const frag = document.createDocumentFragment();

    for (let i = 0; i < cloneCount; i++) {
      const clone = cards[i].cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.tabIndex = -1;
      frag.appendChild(clone);
    }

    track.appendChild(frag);
    clonesAdded = true;
  };

  const goNext = () => {
    if (paused) return;

    index += 1;
    setTransition(true);
    translateToIndex(index);

    // Cuando llegamos a la zona de clones, reseteamos sin transición
    const originalCount = cards.length; // OJO: antes de clones; por eso recalculamos al inicio y guardamos
  };

  const start = () => {
    stop();
    timer = window.setInterval(() => {
      if (paused) return;

      index += 1;
      setTransition(true);
      translateToIndex(index);

      // Cuando pasamos el último original (antes de clones), reseteamos a 0 sin que se note
      // Nota: al track le añadimos clones, pero el "punto de reset" es el final de los originales.
      const originals = originalSlidesCount;
      if (index >= originals) {
        // Espera a que termine la transición, resetea sin transición
        window.setTimeout(() => {
          setTransition(false);
          index = 0;
          translateToIndex(index);
        }, TRANSITION_MS + 20);
      }
    }, AUTOPLAY_DELAY);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const pause = () => {
    paused = true;
    if (pauseTimeout) window.clearTimeout(pauseTimeout);
  };

  const resumeWithDelay = () => {
    if (pauseTimeout) window.clearTimeout(pauseTimeout);
    pauseTimeout = window.setTimeout(() => {
      paused = false;
    }, PAUSE_AFTER_INTERACTION_MS);
  };

  // Recolectamos el conteo original antes de clonar (para reset correcto)
  let originalSlidesCount = cards.length;

  const init = () => {
    // Reset base
    clonesAdded = false;
    index = 0;
    track.style.transform = "translate3d(0,0,0)";
    setTransition(false);

    // Si había clones de una inicialización anterior, los limpiamos
    // (conservamos solo los originales)
    const all = Array.from(track.querySelectorAll(".svc-card"));
    // Si el track ya tiene más de los originales, recortamos
    if (all.length > originalSlidesCount) {
      for (let i = originalSlidesCount; i < all.length; i++) {
        all[i].remove();
      }
    }

    // Recalcular métricas y clonar
    computeMetrics();
    originalSlidesCount = Math.max(2, track.querySelectorAll(".svc-card").length); // originales actuales
    ensureClones();

    // Recalcular porque ahora hay más nodos, pero step no cambia
    setTransition(false);
    translateToIndex(0);

    // Arrancar autoplay
    paused = false;
    start();
  };

  // Pausa en hover (desktop)
  root.addEventListener("mouseenter", () => pause());
  root.addEventListener("mouseleave", () => {
    paused = false;
  });

  // Pausa en interacción táctil (mobile)
  root.addEventListener("touchstart", () => {
    pause();
  }, { passive: true });

  root.addEventListener("touchend", () => {
    resumeWithDelay();
  }, { passive: true });

  // Si cambian tamaños, re-init (muy importante para responsive)
  let resizeTO = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTO);
    resizeTO = window.setTimeout(() => {
      stop();
      init();
    }, 180);
  });

  init();
}
