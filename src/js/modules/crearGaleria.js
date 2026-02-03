export function crearGaleria() {
  const lightbox = document.querySelector("[data-lightbox]");
  if (!lightbox) return;

  const img = lightbox.querySelector("[data-lightbox-img]");
  const title = lightbox.querySelector("[data-lightbox-title]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");

  const closeEls = Array.from(lightbox.querySelectorAll("[data-lightbox-close]"));
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");

  let items = [];
  let index = 0;

  const open = (i) => {
    index = i;
    const el = items[index];

    const src = el.getAttribute("data-src") || "";
    const t = el.getAttribute("data-title") || "";
    const c = el.getAttribute("data-caption") || "";

    img.src = src;
    img.alt = t;
    title.textContent = t;
    caption.textContent = c;

    lightbox.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("lb-open");
  };

  const close = () => {
    lightbox.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("lb-open");
    img.src = "";
  };

  const prev = () => open((index - 1 + items.length) % items.length);
  const next = () => open((index + 1) % items.length);

  // Delegación: abre desde cualquier tile dentro de un grid
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-proj-open]");
    if (!btn) return;

    const card = btn.closest("[data-proj]");
    if (!card) return;

    const grid = card.closest("[data-proj-grid]") || document;
    items = Array.from(grid.querySelectorAll("[data-proj]"));

    const i = items.indexOf(card);
    if (i >= 0) open(i);
  });

  closeEls.forEach((c) => c.addEventListener("click", close));
  prevBtn?.addEventListener("click", prev);
  nextBtn?.addEventListener("click", next);

  window.addEventListener("keydown", (e) => {
    if (lightbox.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
}
