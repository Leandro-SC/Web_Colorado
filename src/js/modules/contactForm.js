const POW_DIFFICULTY = 4;     // 4 hex zeros => "0000" (balance móvil/perf)
const POW_MAX_ITERS = 180000; // límite para evitar congelar
const POW_STATUS_EVERY = 2500;

// Helpers SweetAlert (requiere SweetAlert2 cargado: window.Swal)
function toast_(icon, title) {
  if (!window.Swal) {
    console.log(`[toast:${icon}] ${title}`);
    return;
  }
  return window.Swal.fire({ toast:true, position:"top-end", icon, title, showConfirmButton:false, timer:2200, timerProgressBar:true });
}

function alert_(icon, title, text) {
  if (!window.Swal) {
    alert(`${title}\n\n${text || ""}`);
    return;
  }
  return window.Swal.fire({ icon, title, text, confirmButtonText:"OK", buttonsStyling:true });
}

function initContactForm() {
  const form = document.querySelector("#quoteForm");
  if (!form) return;

  console.log("initContactForm OK");

  const endpoint = form.getAttribute("data-endpoint") || "";
  const btn = form.querySelector(".form__submit");
  const formTs = Date.now();

  const setButtonEnabled = (enabled) => { if (btn) btn.disabled = !enabled; };
  setButtonEnabled(true);

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== "") {
      alert_("error", "Error", "Something went wrong. Please try again.");
      return;
    }

    const payload = serializeForm_(form);
    const errors = validate_(payload);
    renderErrors_(errors);
    console.log("payload:", payload);
    console.log("errors:", errors);


    if (Object.keys(errors).length) {
      alert_("warning", "Check your details", "Please fix the highlighted fields and try again.");
      return;
    }

    if (!endpoint || !/^https?:\/\//i.test(endpoint)) {
      alert_("error", "Missing endpoint", "Set the Apps Script Web App URL in data-endpoint.");
      return;
    }

    setButtonEnabled(false);
    const prevText = btn ? btn.textContent : "";
    if (btn) btn.textContent = "Verifying...";

    try {
      const powTs = Date.now();
      const powBase = `${payload.email}|${powTs}`;
      const pow = await computePow_(powBase, 4, 180000);
      if (!pow) {
        alert_("error", "Verification failed", "Please try again.");
        return;
      }

      if (btn) btn.textContent = "Sending...";

      const body = {
        ...payload,
        form_ts: formTs,
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        page_id: document.body.getAttribute("data-page") || "contact",
        pow_ts: powTs,
        pow_nonce: pow.nonce,
        pow_hash: pow.hash,
        pow_difficulty: 4
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify(body),
        cache: "no-store"
      });

      

      const text = (await res.text()).trim();
      console.log("AppsScript response:", res.status, text);

      if (text === "OK") {
        form.reset();
        alert_("success", "Request sent", "Thanks. We received your details and will reply soon.");
      } else {
        alert_("error", "Could not send", `Server said: ${text || "Unknown"}`);
      }
    } catch (err) {
      console.error(err);
      alert_("error", "Network error", String(err?.message || err));
    } finally {
      if (btn) btn.textContent = prevText;
      setButtonEnabled(true);
    }
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);


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
