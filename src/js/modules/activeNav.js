// Responsabilidad única: marcar enlace activo en navegación desktop y móvil.
export function activeNav() {
  const links = document.querySelectorAll("[data-nav]");
  if (!links.length) return;

  const path = window.location.pathname.toLowerCase();
  const file = path.split("/").pop() || "index.html";

  const key = (() => {
    if (file === "" || file === "index.html") return "home";
    if (file.includes("services")) return "services";
    if (file.includes("projects")) return "projects";
    if (file.includes("about")) return "about";
    if (file.includes("contact")) return "contact";
    if (file.includes("privacy")) return "privacy";
    return "";
  })();

  if (!key) return;

  links.forEach((a) => {
    const isActive = a.getAttribute("data-nav") === key;
    a.classList.toggle("is-active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}
