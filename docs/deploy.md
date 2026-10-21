# Deploying the live Atomic site (Vercel / VPS / any static host)

Published on Storybook **Docs** at `design.cyberskill.world`.

Two tracks:

1. **Portable design system (consumers)** — HTML consumers can link the reviewed `styles.css` and optional `_ds_bundle.js`, or use the browser legacy entry `_esm/cs.mjs`, without a bundler. The default npm import (`dist/esm/_esm/react.mjs`) is compiled ESM with React peers; React apps need a compatible module resolver. Source JSX remains available through the explicit source export. Storybook is host tooling. The npm portable payload follows `package.json` → `files`; public hosting uses the reviewed allowlist in `scripts/public-site-policy.json`.
2. **Host site (`design.cyberskill.world`)** — static output packaged for Vercel. Packaging **does** run Node once at deploy time so Storybook ships as the product surface at `/`. There is still no long-running app server.

Production **`/`** is the Storybook static build. Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, and `/playground/:path*` redirect to `/`.

## Vercel (recommended)

1. Push the repo (see `docs/sync.md`) to GitHub.
2. Vercel → **Add New Project** → import the repo.
3. **Framework preset: "Other"** (not Next.js/CRA). Prefer trusting `vercel.json` rather than typing commands in the dashboard.
4. Deploy. `/` serves Storybook. Old hub/playground URLs 308 to `/`.
5. Custom domain: Project → Settings → Domains, add it, point DNS per Vercel's instructions.

**`vercel.json` pins the host packaging path:**

| Field | Value | Why |
|---|---|---|
| `framework` | `null` | No framework auto-detect |
| `installCommand` | `npm ci` | Host-only: install Storybook/dev tooling for the static product build |
| `buildCommand` | `npm run build:site` | `build:storybook` then `scripts/vercel-static-output.mjs` |
| Build Output API | `.vercel/output/static` + `config.json` | Final static bytes and exact per-HTML CSP routes, emitted after Storybook exists |
| Routing authority | `scripts/site-deployment-policy.json` | Existing legacy redirects stay first; generated directory indexes preserve relative navigation |

Local review: `npm ci && npm run build:site`, then run `node _audit/ci/test-site-csp-browser.mjs` against the generated response policy. `.vercel-static/` remains a portable mirror; a plain file server does not apply its CSP manifest automatically. Local packaging and testing are not deployment or redistribution approval.

Consumers cloning this repo still open files directly — they do **not** run `build:site`.

## Social preview image (OG)

Shipped for production (`design.cyberskill.world`):
- Storybook manager head (`.storybook/manager-head.html`) and the legacy `dashboard.html` redirect stub include:
  - `og:image` → `https://design.cyberskill.world/assets/og-dashboard.png`
  - `twitter:card` = `summary_large_image`
  - `twitter:image` (same URL)
  - `og:url` / canonical → `https://design.cyberskill.world/`

If you host under a **different** domain, change the absolute URLs in those meta tags to match your origin, or re-export the PNG and keep the path `assets/og-dashboard.png`.

**Common misconfig:** picking a JS framework preset (Next/CRA) — Vercel then runs the wrong build graph and may 404 root docs. The preset must stay **"Other"** and `vercel.json` must own install/build configuration; generated Build Output API files own final static routes and headers (see table above). `package.json` is publishable (`"private": false`) for the npm path; it also carries **host-only** scripts (`build:storybook`, `build:site`, verify/test) that product apps should not depend on (see `docs/consuming.md` and `docs/storybook.md`). Packaging validates a fresh Storybook build staged from the explicit inventory in `scripts/public-site-policy.json`, then writes `.vercel-static/` with a per-file audience/hash manifest. Listed portable paths such as `/styles.css`, audit gates and guidelines stay available beside Storybook assets; internal task/history/revision records and maintenance scripts are excluded. Run `npm run test:public-site` against this packaged output before deployment. **Allowlisted audit pages stay public on purpose** — Storybook Status embeds `_audit/run.html` full-bleed; removing it would break the product surface. **How to tell a hosting misconfig from a real docs bug:** open `/_audit/docs-consistency.html` on the *deployed* URL — the gate detects an HTML/error body where a raw `.md`/`.json` was expected and reports "hosting is intercepting this path".

## Generic VPS / nginx / any static host

**Without Storybook:** after provenance review and explicit deployment approval, serve the reviewed portable inventory as the webroot.

**With Storybook at `/`:** `npm run build:site` writes a reviewed portable mirror to `.vercel-static/` and the Vercel deployment artifact to `.vercel/output/`. Vercel uses the latter's `config.json`; do not supply an old Output Directory override or rewrite `vercel.json` during a build to predict hashes that do not exist yet.

Other static hosts need an adapter that maps each final HTML path and its aliases to the exact CSP in `public-site-csp.json`, retains the security headers and legacy redirects from `scripts/site-deployment-policy.json`, and denies inline scripts on unknown paths. Hashes must come from the final emitted bytes, including the deterministic template logic wrapper. A single copied CSP string cannot represent these page-specific permissions.

The existing root `_headers` file is a compatibility policy for hosts that understand that format. It retains its previous inline-script behavior and is **not** the hardened Vercel policy. No Netlify, Cloudflare Pages or nginx adapter has been certified by this change. Preserve existing controls until an adapter and its real served-header tests are reviewed; do not silently replace them with a weaker policy. For generic hosting, use `.vercel-static/` only with that reviewed header adapter. Portable files remain real resources, and Storybook owns `/` and `/index.html`.

## Post-deploy checklist
1. Open `/` — confirm Storybook loads (not a 404, directory listing, or the old dashboard shell).
2. Open `/_audit/run.html` — let the board finish, confirm all fast gates pass on the *deployed* copy (CDN caching, MIME types, or a missed file can surface here even when local checks were clean).
3. If anything is red, read the failed gate row and open that gate page for detail — see `docs/consuming.md` → "After import — run the checks."
4. Check `/guidelines/atomic-view.html` directly loads (it's the heaviest page — React + the compiled bundle over the network).
5. Confirm `/dashboard.html` and `/playground/` redirect to `/`, and a story still renders (e.g. Components/Button).

## What NOT to do
- Use the chosen consumer route: static HTML links reviewed CSS and an optional browser bundle; React consumers follow the build and transpilation setup in `docs/consuming.md`. Host-site packaging (`build:site`) prepares the Storybook shell at `/` and the static host layout.
- Don't switch Vercel framework preset away from "Other" / `framework: null`.
- Keep required source files tracked, **including underscore-prefixed paths such as `_esm/`**; do not use new ignore rules to hide source changes. Source tracking does not grant publication: npm contents follow `package.json` → `files`, and public hosting follows `scripts/public-site-policy.json`. See `docs/sync.md`.
- Don't put Storybook under `/playground/` again — `base: '/'` in `.storybook/main.js` expects domain-root assets.


## Post-deploy Health re-run protocol (release gate)

After every production deploy:
1. Open `docs/viewer.html#README.md` — body must not stay on Loading…
2. `curl -sS https://<host>/VERSION` must return plain semver text, not HTML.
3. `curl -sS -I https://<host>/package.json` must be `application/json` or `text/plain`, not an SPA shell.


## Content-Security-Policy notes

The authored policy is `scripts/site-deployment-policy.json`. Final HTML-specific script hashes are generated into `public-site-csp.json`; `.vercel/output/config.json` applies each page's policy. The script policy permits self-hosted scripts and exact executable-body hashes, rejects native inline event handlers, and grants no `unsafe-inline`, `unsafe-eval`, invented nonce or CDN script origin. Style elements and style attributes retain the existing `style-src 'self' 'unsafe-inline'` policy because components and Storybook use inline CSS; this is bounded script hardening, not removal of every inline mechanism.

Template `text/x-dc` blocks are inert source data. Their executable wrapper is serialized by the same authored function projected into the runtime and imported by the CSP builder. Native template events use interpreted `data-cs-on-*` bindings; preview forms use event listeners. The build never hashes arbitrary blocked runtime code to make a check pass.

The generator checks a local 4 KiB per-response CSP budget and a 2,048-route budget. These source-bound records are not security approval or live deployment evidence. `test-site-csp-browser.mjs` verifies real built Storybook, bilingual docs and all 85 templates in three engines, plus alias/query behavior and unknown-script/handler rejection. Explicit deployment approval and live served-header validation remain required after any authorized deployment. See [the implementation decision](decisions/static-script-csp.md).

## Multi-domain OG

Production meta points at `https://design.cyberskill.world/assets/og-dashboard.png`. On another host, replace the absolute origin in `.storybook/manager-head.html` (and the `dashboard.html` stub) `og:image` / `twitter:image` / `og:url` — keep the path `/assets/og-dashboard.png`.

## Storybook product surface (host-only)

Production path: **`/`** (Storybook static export overlaid on `.vercel-static/`).

| Command | Result |
|---|---|
| `npm run storybook` | Dev server (local only) |
| `npm run build:storybook` | Writes `storybook-static/` with `base: '/'` |
| `npm run build:site` | Storybook + classified portable mirror → `.vercel-static/`; static deployment routes/bytes → `.vercel/output/` |

See `docs/storybook.md`. Portable consumers never need this path — they use `styles.css` + `_ds_bundle.js` / ESM.

Generated directory index URLs use a trailing slash so relative links stay inside that directory; their slashless aliases redirect once to that URL. Other trailing-slash paths retain legacy slash removal, including `/docs/viewer.html/` and asset URLs; `.html` extensions remain visible. Dashboard/playground redirects and query strings remain supported. The generated fixed and same-origin `/$1` redirect vocabulary is checked locally; this does not certify hosted Vercel execution. The static response headers retain `nosniff` and `strict-origin-when-cross-origin`; script permissions use hashes of final HTML instead of blanket inline-script permission.
