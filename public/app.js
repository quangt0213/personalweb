// Site config. Set a Cloudflare Turnstile site key to add a bot check to the
// contact form (also set TURNSTILE_SECRET on the Pages project). Leave blank to skip.
const CONFIG = {
  turnstileSiteKey: "",
  contactEndpoint: "/api/contact",
  fallbackEmail: "quangt0213@gmail.com",
};

/* ---------- Tabs (hash routing) ---------- */
const TABS = ["about", "projects", "connect"];
const navCards = document.querySelectorAll(".hand-card");
const panels = document.querySelectorAll("[data-panel]");

function show(tab, { focus = false } = {}) {
  if (!TABS.includes(tab)) tab = "about";
  panels.forEach((p) => (p.hidden = p.dataset.panel !== tab));
  navCards.forEach((c) => {
    if (c.dataset.tab === tab) c.setAttribute("aria-current", "page");
    else c.removeAttribute("aria-current");
  });
  document.title =
    { about: "Quang Tran | Electrical engineering & embedded systems",
      projects: "Projects | Quang Tran",
      connect: "Connect | Quang Tran" }[tab];
  if (focus) {
    const h = document.getElementById(`${tab}-h`);
    if (h) h.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
}

window.addEventListener("hashchange", () => show(location.hash.slice(1), { focus: true }));
show(location.hash.slice(1));

// Deal the hand once on first load
document.body.classList.add("dealing");
setTimeout(() => document.body.classList.remove("dealing"), 1200);

/* ---------- Projects ---------- */
const ICONS = {
  hardware:
    '<svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><rect x="6" y="6" width="12" height="12" rx="1.5" fill="#ffbe0b"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/></svg>',
  hackathon:
    '<svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#e63946"/></svg>',
  software:
    '<svg viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" stroke="#3a86ff"/></svg>',
};
const TYPE_NAME = { hardware: "Hardware", hackathon: "Hackathon", software: "Software" };
const ORDER = { hardware: 0, hackathon: 1, software: 2 };

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderDeck(filter = "all") {
  const deck = document.getElementById("deck");
  const items = (window.PROJECTS || [])
    .slice()
    .sort((a, b) => ORDER[a.type] - ORDER[b.type])
    .filter((p) => filter === "all" || p.type === filter);

  deck.innerHTML = items
    .map(
      (p) => `
    <li class="proj" data-type="${esc(p.type)}">
      <div class="proj-band">
        <h2>${esc(p.title)}</h2>
        <span class="proj-icon" role="img" aria-label="${TYPE_NAME[p.type]}">${ICONS[p.type]}</span>
      </div>
      <p class="proj-kind">${esc(p.kind)}</p>
      <div class="proj-body">
        <p>${esc(p.blurb)}</p>
        <ul class="stack" aria-label="Built with">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </div>
      <div class="proj-links">
        <a href="${esc(p.repo)}" target="_blank" rel="noopener">Code<span class="sr"> for ${esc(p.title)}</span></a>
        ${p.live ? `<a class="live" href="${esc(p.live)}" target="_blank" rel="noopener">Live demo<span class="sr"> of ${esc(p.title)}</span></a>` : ""}
      </div>
    </li>`
    )
    .join("");
}

document.querySelectorAll("[data-filter]").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    renderDeck(btn.dataset.filter);
  })
);
renderDeck();

/* ---------- Email dialog ---------- */
const dialog = document.getElementById("mail-dialog");
const form = document.getElementById("mail-form");
const statusEl = document.getElementById("form-status");
const sendBtn = document.getElementById("send-btn");
let turnstileLoaded = false;

function loadTurnstile() {
  if (!CONFIG.turnstileSiteKey || turnstileLoaded) return;
  turnstileLoaded = true;
  const slot = document.getElementById("turnstile-slot");
  slot.innerHTML = `<div class="cf-turnstile" data-sitekey="${esc(CONFIG.turnstileSiteKey)}" data-theme="light"></div>`;
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  s.async = true;
  document.head.appendChild(s);
}

document.getElementById("open-mail").addEventListener("click", () => {
  loadTurnstile();
  setStatus("");
  dialog.showModal();
  document.getElementById("f-name").focus();
});
dialog.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

function setStatus(msg, kind = "") {
  statusEl.className = "form-status" + (kind ? " " + kind : "");
  statusEl.innerHTML = msg;
}

function validate() {
  const checks = [
    ["f-name", (v) => v.trim().length > 0, "Add your name."],
    ["f-email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "Enter an email address I can reply to."],
    ["f-msg", (v) => v.trim().length >= 10, "Write a message of at least 10 characters."],
  ];
  for (const [id, ok, msg] of checks) {
    const el = document.getElementById(id);
    const good = ok(el.value);
    el.setAttribute("aria-invalid", String(!good));
    if (!good) { el.focus(); return msg; }
  }
  return null;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const problem = validate();
  if (problem) return setStatus(problem, "error");

  const data = Object.fromEntries(new FormData(form));
  sendBtn.disabled = true;
  sendBtn.textContent = "Sending…";
  setStatus("");

  try {
    const res = await fetch(CONFIG.contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "The message didn't go through.");
    form.reset();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    setStatus(`Sent. I'll reply to ${esc(data.email)} soon.`, "ok");
    if (window.turnstile) window.turnstile.reset();
  } catch (err) {
    setStatus(
      `${esc(err.message)} You can email me directly at <a href="mailto:${CONFIG.fallbackEmail}">${CONFIG.fallbackEmail}</a>.`,
      "error"
    );
    if (window.turnstile) window.turnstile.reset();
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send message";
  }
});
