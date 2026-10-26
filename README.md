# quang-tran-site

Personal site: **About me**, **Projects**, **Connect**. Plain HTML/CSS/JS on Cloudflare Pages, with one Pages Function that sends contact-form messages through Resend.

```
public/            the site (no build step)
  index.html       all three tabs
  styles.css
  app.js           tab routing, project cards, contact form
  projects.js      project list — edit this to add/change projects
  resume.pdf       shown on Connect (desktop)
  resume.webp      same resume as an image (phones can't show PDFs inline)
functions/
  api/contact.js   POST /api/contact → Resend → your inbox
wrangler.toml      Pages config + non-secret env vars
```

## Deploy (Cloudflare Pages + GitHub)

1. Push this folder to a new GitHub repo (e.g. `quangt0213/site`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `public`
3. Project → **Settings → Variables and Secrets** → add `RESEND_API_KEY` as a **Secret** (Production and Preview).
4. Redeploy. The site is live at `<project>.pages.dev`; `functions/` is picked up automatically.
5. Optional: **Custom domains** → add your domain.

Or from the terminal: `npm i`, then `npx wrangler pages deploy` and `npx wrangler pages secret put RESEND_API_KEY`.

## Resend

1. Create a key at resend.com → **API Keys** (Sending access is enough).
2. **Before you verify a domain:** the default sender `onboarding@resend.dev` can only deliver to the email you signed up to Resend with, so sign up with `quangt0213@gmail.com` (or change `TO_EMAIL` in `wrangler.toml` to match).
3. **After you add a domain:** verify it in Resend → **Domains** (if the domain is on Cloudflare, Resend can add the DNS records for you). Then set `FROM_EMAIL = "Quang Tran <hello@yourdomain.com>"`.
4. Optional: set `SEND_CONFIRMATION = "true"` to email visitors a "got your message" copy. Needs the verified domain from step 3.
5. Optional, receiving: turn on receiving for the domain in Resend so mail to `hello@yourdomain.com` arrives too (Resend posts it to an `email.received` webhook). Not needed for the contact form, since every message is sent with **Reply-To** set to the visitor, so you just hit Reply in Gmail.

## Spam protection

- A hidden honeypot field is on by default.
- To add Cloudflare Turnstile: create a widget (Cloudflare → Turnstile), put the **site key** in `CONFIG.turnstileSiteKey` in `public/app.js`, and add the **secret key** as a `TURNSTILE_SECRET` secret.
- For a hard cap, add a rate-limiting rule for `/api/contact` under the domain's **Security → WAF** (custom domain required).

## Local testing

```bash
npm i
cp .dev.vars.example .dev.vars   # add your real key
npm run dev                      # http://localhost:8788
```

## Updating

- **Projects:** edit `public/projects.js`. `type` is `hardware`, `hackathon` or `software`; add `live:` for a demo link.
- **Resume:** replace `public/resume.pdf`, then regenerate the phone image:
  `pdftoppm -png -r 160 -singlefile public/resume.pdf public/resume && cwebp -q 88 public/resume.png -o public/resume.webp && rm public/resume.png`
  (or export a PNG/WebP of the first page with any tool and name it `resume.webp`).
