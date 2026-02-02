// Responsabilidad única: menú móvil (off-canvas) + accesibilidad.
// Considera cambio de viewport: al pasar a desktop, cierra y deshabilita estado móvil.
export function menuMovil() {
  const openBtn = document.querySelector("[data-nav-toggle]");
  const closeBtn = document.querySelector("[data-nav-close]");
  const nav = document.querySelector("[data-mobile-nav]");
  const overlay = document.querySelector("[data-nav-overlay]");

  if (!openBtn || !closeBtn || !nav || !overlay) return;

  const DESKTOP_MIN = 1024; // Debe coincidir con $desktop en _mixins.scss

  const setOpen = (isOpen) => {
    document.body.classList.toggle("nav-open", isOpen);
    openBtn.setAttribute("aria-expanded", String(isOpen));
    nav.hidden = !isOpen;
    overlay.hidden = !isOpen;

    if (isOpen) closeBtn.focus();
    else openBtn.focus();
  };

  const open = () => {
    // En desktop no debería abrirse aunque se llame accidentalmente.
    if (window.innerWidth >= DESKTOP_MIN) return;
    setOpen(true);
  };

  const close = () => setOpen(false);

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!document.body.classList.contains("nav-open")) return;
    close();
  });

  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    close();
  });

  // Si el usuario cambia a desktop con el menú abierto, lo cerramos.
  window.addEventListener("resize", () => {
    if (window.innerWidth >= DESKTOP_MIN && document.body.classList.contains("nav-open")) {
      close();
    }
  });
}
