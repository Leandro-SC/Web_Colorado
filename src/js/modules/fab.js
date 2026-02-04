export function initFloatingActions() {
  const root = document.querySelector(".fab");
  if (!root) return;

  const topBtn = root.querySelector("[data-back-to-top]");
  const langBtn = root.querySelector("[data-lang-toggle]");
  const langLabel = root.querySelector(".fab__lang");
  const flagEl = root.querySelector(".fab__flag"); // en tu HTML existe
  // en vez de root.querySelector(...)
  const langToggles = document.querySelectorAll("[data-lang-toggle]");
  langToggles.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // importante si es <a>
    const current = window.i18next.language || "en";
    const next = current === "en" ? "es" : "en";
    window.i18next.changeLanguage(next);
  });
});



  document.addEventListener("DOMContentLoaded", () => {
    const fab = document.querySelector(".fab");
    const topBtn = fab?.querySelector("[data-back-to-top]");
    if (!fab) return;

    const onScroll = () => {
      fab.classList.toggle("is-top-visible", window.scrollY > 500);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    topBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // -------------------------------
  // Back to top visibility
  // -------------------------------
  const onScroll = () => {
    const show = window.scrollY > 500;
    root.classList.toggle("is-top-visible", show);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -------------------------------
  // i18n (i18next)
  // -------------------------------
  if (typeof window.i18next === "undefined") {
    if (langBtn) langBtn.style.display = "none";
    return;
  }

  // ✅ TU resources AQUÍ
  const resources = {}


  function applyTranslations() {
    // data-i18n => textContent (ojo: si el elemento contiene <br>, NO uses data-i18n ahí)
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      // Evita romper nodos con <br> dentro
      if (el.querySelector("br")) return;

      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.textContent = val;
    });

    // data-i18n-html => innerHTML (para casos con <br>)
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.innerHTML = val;
    });

    // placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("placeholder", val);
    });

    // aria-label
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("aria-label", val);
    });

    // title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("title", val);
    });

    // alt
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (!key) return;
      const val = window.i18next.t(key, { defaultValue: "" });
      if (val) el.setAttribute("alt", val);
    });

    // html lang
    document.documentElement.lang = window.i18next.language === "es" ? "es" : "en";

    // FAB label: muestra el idioma al que cambiarás
    if (langLabel) langLabel.textContent = window.i18next.t("fab.lang", { defaultValue: "" });

    // flag
    if (flagEl) flagEl.textContent = window.i18next.language === "es" ? "🇺🇸" : "🇲🇽";

    // year (tu footer usa data-year)
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  const saved = localStorage.getItem("site_lang") || "en";

  window.i18next.init(
    {
      lng: saved,
      fallbackLng: "en",
      resources,
      interpolation: { escapeValue: false }
    },
    () => {
      applyTranslations();
      console.log("[i18n] ready:", window.i18next.language);
    }
  );

  window.i18next.on("languageChanged", (lng) => {
    localStorage.setItem("site_lang", lng);
    applyTranslations();
    console.log("[i18n] changed:", lng);
  });

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const current = window.i18next.language || "en";
      const next = current === "en" ? "es" : "en";
      window.i18next.changeLanguage(next);
    });
  }

 document.addEventListener(
  "click",
  (e) => {
    const hit = e.target.closest?.("[data-lang-toggle]");
    if (hit) console.log("[probe] click detected on lang toggle", hit);
  },
  true // capture
);
 

  
}