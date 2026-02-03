export function footerEnhancements() {
  // Año
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Active link (footer)
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".footer-link[data-nav-link]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const cleanHref = href.split("#")[0];
    if (cleanHref && cleanHref === path) a.classList.add("is-active");
  });
}
