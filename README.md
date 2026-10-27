# Personal Website

Personal site: **About me**, **Projects**, **Connect**. Plain HTML/CSS/JS on Cloudflare Pages, with one Pages Function that sends contact-form messages through Resend.

```
public/            the site (no build step)
  index.html       all three tabs
  styles.css
  app.js           tab routing, project cards, contact form
  projects.js      project list — edit this to add/change projects
  resume.pdf       shown on Connect (desktop)
  resume.webp      same resume as an image (phones can't show PDFs inline)
src
  contact.js   POST /api/contact → Resend → your inbox
  worker.js    Direct requests
wrangler.toml      Pages config + non-secret env vars
```

## Optional Spam protection

- A hidden honeypot field is on by default.
- To add Cloudflare Turnstile: create a widget (Cloudflare → Turnstile), put the **site key** in `CONFIG.turnstileSiteKey` in `public/app.js`, and add the **secret key** as a `TURNSTILE_SECRET` secret.
- For a hard cap, add a rate-limiting rule for `/api/contact` under the domain's **Security → WAF** (custom domain required).
- Not enabled because I am not that famous yet.
