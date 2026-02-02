export function menuMovil() {
  const openBtn = document.querySelector("[data-nav-toggle]");
  const closeBtn = document.querySelector("[data-nav-close]");
  const nav = document.querySelector("[data-mobile-nav]");
  const overlay = document.querySelector("[data-nav-overlay]");
  if (!openBtn || !closeBtn || !nav || !overlay) return;

  const DESKTOP_MIN = 1024;

  const setOpen = (isOpen) => {
    document.body.classList.toggle("nav-open", isOpen);
    openBtn.setAttribute("aria-expanded", String(isOpen));
    nav.hidden = !isOpen;
    overlay.hidden = !isOpen;
  };

  const open = () => {
    if (window.innerWidth >= DESKTOP_MIN) return;
    setOpen(true);
    closeBtn.focus();
  };

  const close = () => {
    setOpen(false);
    openBtn.focus();
  };

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

  window.addEventListener("resize", () => {
    if (window.innerWidth >= DESKTOP_MIN && document.body.classList.contains("nav-open")) {
      close();
    }
  });
}
