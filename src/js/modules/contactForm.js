/* =========================================================
   Contact form
   - Valida campos
   - Requiere Turnstile token (sin checkbox)
   - Envia a Apps Script (JSON)
   - Modal tipo SweetAlert (custom)
========================================================= */

let turnstileToken = "";

export function initContactForm() {
  const form = document.querySelector("#quoteForm");
  if (!form) return;

  const endpoint = form.getAttribute("data-endpoint") || "";
  const btn = form.querySelector(".form__submit");
  const captchaHint = document.getElementById("captchaHint");

  // Marca de tiempo anti-bot (time-trap)
  const formTs = Date.now();

  // Modal UI (custom)
  const modal = createModal_();

  function setCaptchaStatus(msg, ok) {
    if (!captchaHint) return;
    captchaHint.textContent = msg || "";
    captchaHint.style.color = ok ? "rgba(15, 23, 42, 0.72)" : "rgba(185, 28, 28, 0.90)";
  }

  function setButtonEnabled(enabled) {
    if (!btn) return;
    btn.disabled = !enabled;
  }

  // Inicial: sin token => botón deshabilitado
  setButtonEnabled(false);
  setCaptchaStatus("Complete the verification to enable sending.", false);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    // Honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") {
      modal.open("Error", "Something went wrong. Please try again.");
      return;
    }

    // Validación básica
    const payload = serializeForm_(form);
    const errors = validate_(payload);

    renderErrors_(errors);
    if (Object.keys(errors).length) {
      modal.open("Check your details", "Please fix the highlighted fields and try again.");
      return;
    }

    // Captcha obligatorio
    if (!turnstileToken) {
      setCaptchaStatus("Verification is required before sending.", false);
      modal.open("Verification required", "Please complete the verification and try again.");
      return;
    }

    if (!endpoint || !/^https?:\/\//i.test(endpoint)) {
      modal.open("Missing endpoint", "Set the Apps Script Web App URL in data-endpoint.");
      return;
    }

    // Bloquea UI
    setButtonEnabled(false);
    const prevText = btn.textContent;
    btn.textContent = "Sending...";

    try {
      const body = {
        ...payload,
        captcha: turnstileToken,
        form_ts: formTs,
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        page_id: document.body.getAttribute("data-page") || "contact"
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        keepalive: true
      });

      const text = await res.text();

      if (String(text).trim() === "OK") {
        form.reset();
        turnstileToken = "";
        setCaptchaStatus("Complete the verification to enable sending.", false);

        // Si Turnstile está presente, reset visual
        if (window.turnstile && typeof window.turnstile.reset === "function") {
          window.turnstile.reset();
        }

        modal.open("Request sent", "Thanks. We received your details and will reply soon.");
      } else {
        modal.open("Could not send", "Please try again in a moment.");
      }
    } catch (err) {
      modal.open("Network error", "Please try again in a moment.");
    } finally {
      btn.textContent = prevText;
      // Se vuelve a habilitar solo si hay token; como reseteamos token en OK, queda disabled
      setButtonEnabled(Boolean(turnstileToken));
    }
  });

  // Exponer hooks para Turnstile callbacks
  window.onTurnstileSuccess = (token) => {
    turnstileToken = String(token || "");
    setCaptchaStatus("Verification complete. You can send the form.", true);
    setButtonEnabled(true);
  };

  window.onTurnstileExpired = () => {
    turnstileToken = "";
    setCaptchaStatus("Verification expired. Please verify again.", false);
    setButtonEnabled(false);
  };

  window.onTurnstileError = () => {
    turnstileToken = "";
    setCaptchaStatus("Verification error. Please try again.", false);
    setButtonEnabled(false);
  };
}

function serializeForm_(form) {
  const get = (name) => (form.elements[name]?.value || "").trim();
  return {
    fullName: get("fullName"),
    phone: get("phone"),
    email: get("email"),
    service: get("service"),
    message: get("message")
  };
}

function validate_(p) {
  const errors = {};
  if (!p.fullName || p.fullName.length < 2) errors.fullName = "Enter your full name.";
  if (!p.phone || p.phone.length < 7) errors.phone = "Enter a valid phone number.";

  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!p.service) errors.service = "Select a service.";
  if (!p.message || p.message.length < 10) errors.message = "Add a short project description (min 10 characters).";

  return errors;
}

function renderErrors_(errors) {
  document.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
  Object.keys(errors).forEach((k) => {
    const el = document.querySelector(`[data-error-for="${k}"]`);
    if (el) el.textContent = errors[k];
  });
}

function createModal_() {
  let root = document.querySelector(".ui-modal");
  if (!root) {
    root = document.createElement("div");
    root.className = "ui-modal";
    root.innerHTML = `
      <div class="ui-modal__card" role="dialog" aria-modal="true" aria-labelledby="uiModalTitle" aria-describedby="uiModalText">
        <h3 class="ui-modal__title" id="uiModalTitle"></h3>
        <p class="ui-modal__text" id="uiModalText"></p>
        <div class="ui-modal__actions">
          <button class="btn btn--primary" type="button" data-modal-ok>OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);
  }

  const titleEl = root.querySelector("#uiModalTitle");
  const textEl = root.querySelector("#uiModalText");
  const okBtn = root.querySelector("[data-modal-ok]");

  function close() {
    root.classList.remove("is-open");
    document.documentElement.classList.remove("is-locked");
  }

  okBtn.addEventListener("click", close);
  root.addEventListener("click", (e) => {
    if (e.target === root) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) close();
  });

  return {
    open(title, text) {
      titleEl.textContent = title || "";
      textEl.textContent = text || "";
      root.classList.add("is-open");
      document.documentElement.classList.add("is-locked");
      okBtn.focus();
    },
    close
  };
}
