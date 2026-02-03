/* =========================================================
   Contact form (PROD)
   - Validación campos (client)
   - Anti-bot: honeypot + time-trap + Proof-of-Work (sin Cloudflare)
   - Envío a Apps Script (JSON)
   - SweetAlert2 (mantener)  ✅
   - Sin modal custom (NO ui-modal) ✅
========================================================= */

const POW_DIFFICULTY = 4;     // 4 hex zeros => "0000" (balance móvil/perf)
const POW_MAX_ITERS = 180000; // límite para evitar congelar
const POW_STATUS_EVERY = 2500;

// Helpers SweetAlert (requiere SweetAlert2 cargado: window.Swal)
function toast_(icon, title) {
  if (!window.Swal) return;
  return window.Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true
  });
}

function alert_(icon, title, text) {
  if (!window.Swal) return;
  return window.Swal.fire({
    icon,
    title,
    text,
    confirmButtonText: "OK",
    buttonsStyling: true
  });
}

export function initContactForm() {
  const form = document.querySelector("#quoteForm");
  if (!form) return;

  const endpoint = form.getAttribute("data-endpoint") || "";
  const btn = form.querySelector(".form__submit");

  // Time-trap anti-bot (mínimo 2.5s ya lo valida servidor)
  const formTs = Date.now();

  function setButtonEnabled(enabled) {
    if (!btn) return;
    btn.disabled = !enabled;
  }

  // Inicial: habilitado (ya no dependemos de captcha externo)
  setButtonEnabled(true);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    // Honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") {
      alert_("error", "Error", "Something went wrong. Please try again.");
      return;
    }

    const payload = serializeForm_(form);
    const errors = validate_(payload);

    renderErrors_(errors);
    if (Object.keys(errors).length) {
      alert_("warning", "Check your details", "Please fix the highlighted fields and try again.");
      return;
    }

    if (!endpoint || !/^https?:\/\//i.test(endpoint)) {
      alert_("error", "Missing endpoint", "Set the Apps Script Web App URL in data-endpoint.");
      return;
    }

    // UI lock
    setButtonEnabled(false);
    const prevText = btn ? btn.textContent : "";
    if (btn) btn.textContent = "Verifying...";

    try {
      // Proof of Work (sin servicios externos)
      const powTs = Date.now();
      const powBase = `${payload.email}|${powTs}`;
      const pow = await computePow_(powBase, POW_DIFFICULTY, POW_MAX_ITERS);

      if (!pow) {
        alert_("error", "Verification failed", "Please try again. If the issue persists, refresh the page.");
        return;
      }

      if (btn) btn.textContent = "Sending...";
      toast_("info", "Sending...");

      const body = {
        ...payload,
        form_ts: formTs,
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        page_id: document.body.getAttribute("data-page") || "contact",

        // PoW
        pow_ts: powTs,
        pow_nonce: pow.nonce,
        pow_hash: pow.hash,
        pow_difficulty: POW_DIFFICULTY
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
        keepalive: true
      });

      const text = (await res.text()).trim();

      if (text === "OK") {
        form.reset();
        toast_("success", "Request sent!");
        alert_("success", "Request sent", "Thanks. We received your details and will reply soon.");
      } else {
        alert_("error", "Could not send", "Please try again in a moment.");
      }
    } catch (err) {
      alert_("error", "Network error", "Please try again in a moment.");
    } finally {
      if (btn) btn.textContent = prevText;
      setButtonEnabled(true);
    }
  });
}

/* ================================
   Serialize: DEBE COINCIDIR CON TU HTML
================================ */
function serializeForm_(form) {
  const get = (name) => (form.elements[name]?.value || "").trim();
  return {
    name: get("name"),
    phone: get("phone"),
    email: get("email"),
    service: get("service"),
    timeline: get("timeline"),
    message: get("message")
  };
}

/* ================================
   Validate (keys = data-error-for)
================================ */
function validate_(p) {
  const errors = {};
  if (!p.name || p.name.length < 2) errors.name = "Enter your full name.";
  if (!p.phone || p.phone.length < 7) errors.phone = "Enter a valid phone number.";
  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.email = "Enter a valid email address.";
  if (!p.service) errors.service = "Select a service.";
  if (!p.timeline) errors.timeline = "Select a timeline.";
  if (!p.message || p.message.length < 10) errors.message = "Add a short project description (min 10 characters).";
  return errors;
}

function renderErrors_(errors) {
  document.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
    el.hidden = true;
  });

  Object.keys(errors).forEach((k) => {
    const el = document.querySelector(`[data-error-for="${k}"]`);
    if (el) {
      el.textContent = errors[k];
      el.hidden = false;
    }
  });
}

/* ================================
   Proof-of-Work (client)
   - Busca nonce para que sha256(base|nonce) empiece con N ceros hex
================================ */
async function computePow_(base, difficulty, maxIters) {
  const prefix = "0".repeat(Math.max(1, Number(difficulty) || 4));
  let lastStatusAt = 0;

  for (let i = 0; i < maxIters; i++) {
    const nonce = `${i}-${Math.random().toString(16).slice(2, 8)}`;
    const hash = await sha256Hex_(`${base}|${nonce}`);

    if (hash.startsWith(prefix)) {
      return { nonce, hash };
    }

    // Micro-respiro para no matar móviles
    if (i % POW_STATUS_EVERY === 0) {
      const now = Date.now();
      if (now - lastStatusAt > 250) {
        lastStatusAt = now;
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  return null;
}

async function sha256Hex_(str) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
