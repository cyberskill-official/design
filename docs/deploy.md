# Deploying the live Atomic site (Vercel / VPS / any static host)

Two tracks:

1. **Portable design system (consumers)** — still a static file tree: no bundler required. Link `styles.css` + optionally `_ds_bundle.js` / ESM. Claude Design, Google Stitch, and product apps never need Node or Storybook.
2. **Host site (`design.cyberskill.world`)** — static output packaged for Vercel. Packaging **does** run Node once at deploy time so Storybook ships as the product surface at `/`. There is still no long-running app server.

Production **`/`** is the Storybook static build. Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, and `/playground/:path*` redirect to `/`.

## Vercel (recommended)

1. Push the repo (see `docs/sync.md`) to GitHub.
2. Vercel → **Add New Project** → import the repo.
3. **Framework preset: "Other"** (not Next.js/CRA). Prefer trusting `vercel.json` rather than typing commands in the dashboard.
4. Deploy. `/` serves Storybook. Old hub/playground URLs 301 to `/`.
5. Custom domain: Project → Settings → Domains, add it, point DNS per Vercel's instructions.

**`vercel.json` pins the host packaging path:**

| Field | Value | Why |
|---|---|---|
| `framework` | `null` | No framework auto-detect |
| `installCommand` | `npm install` | Host-only: install Storybook/dev tooling for the static product build |
| `buildCommand` | `npm run build:site` | `build:storybook` then `scripts/vercel-static-output.mjs` |
| `outputDirectory` | `.vercel-static` | Packaged webroot (portable tree + Storybook overlaid at root) |
| `redirects` | `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/` | Retire the old HTML hub and subdirectory Storybook path |

Local equivalent: `npm install && npm run build:site`, then serve `.vercel-static/`.

Consumers cloning this repo still open files directly — they do **not** run `build:site`.

## Social preview image (OG)

Shipped for production (`design.cyberskill.world`):
- Storybook manager head (`.storybook/manager-head.html`) and the legacy `dashboard.html` redirect stub include:
  - `og:image` → `https://design.cyberskill.world/assets/og-dashboard.png`
  - `twitter:card` = `summary_large_image`
  - `twitter:image` (same URL)
  - `og:url` / canonical → `https://design.cyberskill.world/`

If you host under a **different** domain, change the absolute URLs in those meta tags to match your origin, or re-export the PNG and keep the path `assets/og-dashboard.png`.

**Common misconfig:** picking a JS framework preset (Next/CRA) — Vercel then runs the wrong build graph and may 404 root docs. The preset must stay **"Other"** and `vercel.json` must own install/build/output (see table above). `package.json` is publishable (`"private": false`) for the npm path; it also carries **host-only** scripts (`build:storybook`, `build:site`, verify/test) that product apps should not depend on (see `docs/consuming.md` and `docs/storybook.md`). Packaging copies the portable webroot then overlays Storybook at `.vercel-static/` root (portable paths like `/styles.css`, `/_audit/`, `/guidelines/` stay available beside Storybook assets). **`_audit/` stays public on purpose** — Storybook Status embeds `_audit/run.html` full-bleed; removing it would break the product surface. **How to tell a hosting misconfig from a real docs bug:** open `/_audit/docs-consistency.html` on the *deployed* URL — the gate detects an HTML/error body where a raw `.md`/`.json` was expected and reports "hosting is intercepting this path".

## Generic VPS / nginx / any static host

**Without Storybook:** serve the repo root as the webroot (portable tree only).

**With Storybook at `/`:** run `npm run build:site` on the host or CI, then serve `.vercel-static/` as the webroot. Configure the same redirects as `vercel.json` (`/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/`) if your host supports them.

Nginx example (`.vercel-static` as `root`) — **same security headers as `vercel.json`** (FIND-019):
```nginx
server {
  server_name design.cyberskill.world;
  root /var/www/design-system/.vercel-static;
  index index.html;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self'" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  location = /dashboard { return 301 /; }
  location = /dashboard/ { return 301 /; }
  location = /dashboard.html { return 301 /; }
  location ^~ /dashboard/ { return 301 /; }
  location = /playground { return 301 /; }
  location /playground/ { return 301 /; }
}
```
Portable paths remain real files (`guidelines/atomic-view.html`, `_audit/run.html`, `styles.css`, etc.). Storybook owns `/` and `/index.html`.

**Netlify / Cloudflare Pages / similar:** commit root `_headers` (and `public/_headers`) mirrors the same three headers for hosts that read Netlify-style `_headers` files. Keep them byte-aligned with `vercel.json`.

## Post-deploy checklist
1. Open `/` — confirm Storybook loads (not a 404, directory listing, or the old dashboard shell).
2. Open `/_audit/run.html` — let the board finish, confirm all fast gates pass on the *deployed* copy (CDN caching, MIME types, or a missed file can surface here even when local checks were clean).
3. If anything is red, read the failed gate row and open that gate page for detail — see `docs/consuming.md` → "After import — prove health".
4. Check `/guidelines/atomic-view.html` directly loads (it's the heaviest page — React + the compiled bundle over the network).
5. Confirm `/dashboard.html` and `/playground/` redirect to `/`, and a story still renders (e.g. Components/Button).

## What NOT to do
- Don't force **consumers** through a Storybook or app bundler — their contract remains clone-and-link `styles.css` (+ optional bundle). Host-site packaging (`build:site`) is only for this live site's `/` Storybook shell and static package layout.
- Don't switch Vercel framework preset away from "Other" / `framework: null`.
- Don't gitignore any top-level folder beyond what `.gitignore` already lists (`uploads/`, `scraps/`, `_audit/exports/`, `storybook-static/`, `.vercel-static/`) — every other folder, **including underscore-prefixed ones like `_esm/`**, is source and must ship in the portable tree. See `docs/sync.md`.
- Don't put Storybook under `/playground/` again — `base: '/'` in `.storybook/main.js` expects domain-root assets.


## Post-deploy Health re-run protocol (release gate)

After every production deploy:
2. Open `docs/viewer.html#README.md` — body must not stay on Loading…
3. `curl -sS https://<host>/VERSION` must return plain semver text, not HTML.
4. `curl -sS -I https://<host>/package.json` must be `application/json` or `text/plain`, not an SPA shell.


## Content-Security-Policy notes

Canonical CSP lives in `vercel.json` and is mirrored in `_headers` + the nginx snippet above (FIND-015 / FIND-019). Current policy:

`default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:; base-uri 'self'; form-action 'self'`

Rationale:
- **`unsafe-eval` removed** — React is vendored locally; Storybook static export does not need site-wide `eval`.
- **CDN script/connect origins removed** (`unpkg.com`, `cdnjs.cloudflare.com`) — local-first React / `_ds_bundle.js`.
- **`unsafe-inline` retained** — Storybook’s static shell still emits inline scripts/styles; a nonce/hash migration is a follow-on. Do not re-add open CDN allowlists without pinning.
- Prefer self-hosting React next to `_ds_bundle.js` for air-gapped installs.
- Live served-header truth confirmed 2026-08-09 via operator `curl -sSI https://design.cyberskill.world/` (OQ-003 closed — see `docs/audits/nv-rendered-inrepo-2026-08-09.md`).

## Multi-domain OG

Production meta points at `https://design.cyberskill.world/assets/og-dashboard.png`. On another host, replace the absolute origin in `.storybook/manager-head.html` (and the `dashboard.html` stub) `og:image` / `twitter:image` / `og:url` — keep the path `/assets/og-dashboard.png`.

## Storybook product surface (host-only)

Production path: **`/`** (Storybook static export overlaid on `.vercel-static/`).

| Command | Result |
|---|---|
| `npm run storybook` | Dev server (local only) |
| `npm run build:storybook` | Writes `storybook-static/` with `base: '/'` |
| `npm run build:site` | Storybook build + portable tree → `.vercel-static/` (Storybook at root) |

See `docs/storybook.md`. Portable consumers never need this path — they use `styles.css` + `_ds_bundle.js` / ESM.
