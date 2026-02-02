// Responsabilidad única: lazy-load de imágenes y source srcset usando IntersectionObserver.
export function lazyLoadImages() {
  const pictures = document.querySelectorAll("picture");
  const imgs = document.querySelectorAll("img[data-src]");
  const sources = document.querySelectorAll("source[data-srcset]");

  const hasIO = "IntersectionObserver" in window;
  if (!hasIO) {
    sources.forEach((s) => s.setAttribute("srcset", s.getAttribute("data-srcset")));
    imgs.forEach((img) => img.setAttribute("src", img.getAttribute("data-src")));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const root = entry.target;

        const pic = root.tagName.toLowerCase() === "picture" ? root : root.closest("picture");
        if (pic) {
          const picSources = pic.querySelectorAll("source[data-srcset]");
          picSources.forEach((s) => s.setAttribute("srcset", s.getAttribute("data-srcset")));

          const img = pic.querySelector("img[data-src]");
          if (img) img.setAttribute("src", img.getAttribute("data-src"));
        }

        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "200px 0px", threshold: 0.01 }
  );

  // Observa pictures si tienen sources diferidos; si no, observa imgs.
  pictures.forEach((p) => {
    if (p.querySelector("source[data-srcset]") || p.querySelector("img[data-src]")) io.observe(p);
  });

  sources.forEach((s) => {
    const pic = s.closest("picture");
    if (!pic) io.observe(s);
  });

  imgs.forEach((img) => io.observe(img));
}
