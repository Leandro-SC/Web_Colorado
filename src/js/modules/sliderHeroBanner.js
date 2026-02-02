export function sliderHeroBanner() {
  const root = document.querySelector("[data-hero-fade]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
  const dotsWrap = root.querySelector("[data-hero-dots]");
  const btnPrev = root.querySelector("[data-hero-prev]");
  const btnNext = root.querySelector("[data-hero-next]");
  const content = root.querySelector("[data-hero-content]");

  if (!slides.length || !dotsWrap || !content) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  let isDragging = false;
  let startX = 0;
  let lastX = 0;

  const setActive = (nextIndex) => {
    const prev = index;
    index = (nextIndex + slides.length) % slides.length;

    slides[prev].classList.remove("is-active");
    slides[index].classList.add("is-active");

    // Animación de contenido en cada cambio (reinicio controlado)
    content.classList.remove("is-anim");
    // reflow para reiniciar animación
    void content.offsetWidth;
    content.classList.add("is-anim");

    // Dots
    const dots = dotsWrap.querySelectorAll("button");
    dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));

    // Lazy load del slide activo
    lazyLoadSlide(slides[index]);
  };

  const lazyLoadSlide = (slide) => {
    const sources = slide.querySelectorAll("source[data-srcset]");
    const img = slide.querySelector("img[data-src]");

    sources.forEach((s) => s.setAttribute("srcset", s.getAttribute("data-srcset")));
    if (img) img.setAttribute("src", img.getAttribute("data-src"));
  };

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero-dot";
      b.setAttribute("aria-label", `Go to slide ${i + 1}`);
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        stop();
        setActive(i);
        start();
      });
      dotsWrap.appendChild(b);
    });
  };

  const next = () => setActive(index + 1);
  const prev = () => setActive(index - 1);

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

  // Swipe (tipo app)
  const onDown = (e) => {
    stop();
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX = startX;
  };

  const onMove = (e) => {
    if (!isDragging) return;
    lastX = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const onUp = () => {
    if (!isDragging) return;
    isDragging = false;

    const delta = lastX - startX;
    const threshold = 45;

    if (delta <= -threshold) next();
    else if (delta >= threshold) prev();

    start();
  };

  // Controls
  btnNext?.addEventListener("click", () => { stop(); next(); start(); });
  btnPrev?.addEventListener("click", () => { stop(); prev(); start(); });

  // Pause on hover (desktop)
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  // Touch/pointer
  root.addEventListener("touchstart", onDown, { passive: true });
  root.addEventListener("touchmove", onMove, { passive: true });
  root.addEventListener("touchend", onUp);

  root.addEventListener("pointerdown", onDown);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerup", onUp);
  root.addEventListener("pointercancel", onUp);

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { stop(); next(); start(); }
    if (e.key === "ArrowLeft") { stop(); prev(); start(); }
  });

  // Init
  buildDots();
  content.classList.add("is-anim");
  lazyLoadSlide(slides[0]);
  start();
}
