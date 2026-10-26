// Cloudflare Pages Function: POST /api/contact
// Sends the contact-form message to your inbox through Resend.
//
// Environment (Pages project > Settings > Variables and Secrets):
//   RESEND_API_KEY     secret, required
//   TO_EMAIL           where messages land (default set in wrangler.toml)
//   FROM_EMAIL         sender; "Portfolio <onboarding@resend.dev>" works before you verify a domain
//   SEND_CONFIRMATION  "true" to email the visitor a copy (needs a verified domain in FROM_EMAIL)
//   TURNSTILE_SECRET   optional; when set, the form must pass a Cloudflare Turnstile check

const RESEND_URL = "https://api.resend.com/emails";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const oneLine = (s) => s.replace(/[\r\n]+/g, " ").trim();

async function readBody(request) {
  const type = request.headers.get("Content-Type") || "";
  if (type.includes("application/json")) return await request.json();
  return Object.fromEntries(await request.formData());
}

async function sendEmail(env, payload) {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

export async function onRequestPost({ request, env, waitUntil }) {
  let data;
  try {
    data = await readBody(request);
  } catch {
    return json({ error: "The form data couldn't be read." }, 400);
  }

  // Honeypot: real visitors never see this field. Pretend success so bots move on.
  if (String(data.company || "").trim()) return json({ ok: true });

  const name = oneLine(String(data.name || "")).slice(0, 100);
  const email = String(data.email || "").trim().slice(0, 200);
  const message = String(data.message || "").trim().slice(0, 5000);

  if (!name) return json({ error: "Add your name." }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Enter an email address I can reply to." }, 400);
  if (message.length < 10) return json({ error: "Write a message of at least 10 characters." }, 400);

  if (env.TURNSTILE_SECRET) {
    const token = String(data["cf-turnstile-response"] || "");
    const form = new FormData();
    form.append("secret", env.TURNSTILE_SECRET);
    form.append("response", token);
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) form.append("remoteip", ip);
    const check = await fetch(TURNSTILE_URL, { method: "POST", body: form }).then((r) => r.json()).catch(() => ({}));
    if (!check.success) return json({ error: "The bot check didn't pass. Refresh and try again." }, 400);
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return json({ error: "Email isn't set up on this site yet." }, 500);
  }

  const to = env.TO_EMAIL || "quangt0213@gmail.com";
  const from = env.FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const safe = { name: escapeHtml(name), email: escapeHtml(email), message: escapeHtml(message) };

  try {
    await sendEmail(env, {
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}\n\n-- sent from your portfolio contact form`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1a1a2e">
        <p><strong>${safe.name}</strong> &lt;<a href="mailto:${safe.email}">${safe.email}</a>&gt; wrote:</p>
        <div style="white-space:pre-wrap;border-left:4px solid #ffbe0b;padding:8px 14px;background:#fff6e0">${safe.message}</div>
        <p style="color:#666;font-size:13px">Sent from your portfolio contact form. Reply to this email to answer ${safe.name} directly.</p>
      </div>`,
    });
  } catch (err) {
    console.error(err);
    return json({ error: "The message didn't go through." }, 502);
  }

  if (env.SEND_CONFIRMATION === "true") {
    // Best effort: a failure here shouldn't tell the visitor their message failed.
    const confirmation = sendEmail(env, {
      from,
      to: [email],
      reply_to: to,
      subject: "Got your message",
      text: `Hi ${name},\n\nThanks for reaching out. Your message reached me and I'll reply soon.\n\nQuang Tran`,
    }).catch((err) => console.error("confirmation failed", err));
    if (waitUntil) waitUntil(confirmation);
  }

  return json({ ok: true });
}

export function onRequest() {
  return json({ error: "Use POST." }, 405);
}
