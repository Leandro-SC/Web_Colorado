// Responsabilidad única: agregar/quitar estado visual del header al hacer scroll.
export function navegacionFija() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const toggleClass = () => {
    const scrolled = window.scrollY > 8;
    header.classList.toggle("is-scrolled", scrolled);
  };

  window.addEventListener("scroll", toggleClass, { passive: true });
  toggleClass();
}
