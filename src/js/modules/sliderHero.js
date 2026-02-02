// Responsabilidad única: carrusel hero (autoplay, dots, teclado, swipe, accesible).
export function sliderHero() {
  const root = document.querySelector("[data-hero-slider]");
  if (!root) return;

  const track = root.querySelector("[data-slider-track]");
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const dotsWrap = root.querySelector("[data-slider-dots]");
  const btnPrev = root.querySelector("[data-slider-prev]");
  const btnNext = root.querySelector("[data-slider-next]");

  if (!track || slides.length === 0 || !dotsWrap) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let width = 0;
  let timer = null;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const setWidth = () => {
    width = root.querySelector("[data-slider-viewport]")?.clientWidth || root.clientWidth;
  };

  const render = (i, animate = true) => {
    index = clamp(i, 0, slides.length - 1);
    track.style.transition = animate && !prefersReduced ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    track.style.transform = `translate3d(${-index * width}px, 0, 0)`;

    // Dots a11y
    const dots = Array.from(dotsWrap.querySelectorAll("button"));
    dots.forEach((d, di) => d.setAttribute("aria-current", di === index ? "true" : "false"));

    // Aria label update (opcional pero útil)
    root.setAttribute("aria-label", `Project highlights, slide ${index + 1} of ${slides.length}`);
  };

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "slider__dot";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        stop();
        render(i, true);
      });
      dotsWrap.appendChild(b);
    });
  };

  const next = () => {
    render((index + 1) % slides.length, true);
  };

  const prev = () => {
    render(index - 1 < 0 ? slides.length - 1 : index - 1, true);
  };

  const start = () => {
    if (prefersReduced) return;
    stop();
    timer = window.setInterval(next, 5200);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  // Touch / pointer swipe (tipo app)
  const onPointerDown = (e) => {
    stop();
    isDragging = true;
    track.style.transition = "none";
    startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    currentX = startX;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    currentX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? currentX;
    const delta = currentX - startX;
    track.style.transform = `translate3d(${(-index * width) + delta}px, 0, 0)`;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;

    const delta = currentX - startX;
    const threshold = Math.max(50, Math.round(width * 0.12));

    if (delta <= -threshold) next();
    else if (delta >= threshold) prev();
    else render(index, true);

    start();
  };

  // Controls
  btnNext?.addEventListener("click", () => { stop(); next(); start(); });
  btnPrev?.addEventListener("click", () => { stop(); prev(); start(); });

  // Keyboard
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { stop(); next(); start(); }
    if (e.key === "ArrowLeft") { stop(); prev(); start(); }
  });

  // Pause on hover (desktop)
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  // Pointer events
  const viewport = root.querySelector("[data-slider-viewport]") || root;
  viewport.addEventListener("touchstart", onPointerDown, { passive: true });
  viewport.addEventListener("touchmove", onPointerMove, { passive: true });
  viewport.addEventListener("touchend", onPointerUp);

  viewport.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("pointermove", onPointerMove);
  viewport.addEventListener("pointerup", onPointerUp);
  viewport.addEventListener("pointercancel", onPointerUp);
  viewport.addEventListener("lostpointercapture", onPointerUp);

  // Resize
  window.addEventListener("resize", () => {
    setWidth();
    render(index, false);
  });

  // Init
  buildDots();
  setWidth();
  render(0, false);
  start();
}
