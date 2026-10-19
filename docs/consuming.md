# Consuming & upgrading the CyberSkill Design System

How any project — human-driven or agent-driven — adopts this HTML-first design system, and how to take updates safely. Published on Storybook **Docs** at `design.cyberskill.world`.

**Package name:** `@cyberskill/design` (see `package.json`). Do not treat historical `@cyberskill/react` as the install path for this monolith.

## When to use

You are installing, linking, or upgrading the system in another product. Maintainers extending the system start at `docs/doctrine.md`.

## Component state ownership

A change callback does not by itself make a component controlled. For a component that supports both modes, omit its control prop to let it own the value; adding a callback observes changes while the component continues updating. Supply the control prop to let the parent own the committed value. The callback then proposes a change, and the displayed value follows the next parent render.

```jsx
<NumberField onChange={recordQuantityChange} />
<NumberField value={quantity} onChange={setQuantity} />
```

The dual-mode components are NumberField, SearchField, PromptInput, InputGroup, InputOTP, InlineEdit, TagInput, Mentions and Rating (`value`), Toggle (`pressed`), and Menu, Popover, AlertDialog and Collapsible (`open`). Keep ownership mode stable for a mounted instance. Omit the control prop for uncontrolled use; `null` is not a declared control value. Defaults seed the initial mount where the API provides them. Changing a default does not reset an edited value; remount with a new React key, or update the controlled prop.

Native wrappers—TextField, Textarea, Checkbox, Radio, Switch, Slider, Select and NativeSelect—retain React's native `value`/`checked`, default props and event callbacks. Read `event.target.value` or `event.target.checked`; custom value callbacks receive the value directly. Native form reset resets uncontrolled native fields. It does not automatically reset custom React state.

Other controls may require parent-owned values even when their value prop is optional. Calendar, picker selection, RadioGroup, SegmentedControl, Tabs, Pagination, Transfer, Tree selection, Sortable order and DataGrid selection follow their declarations. Local search text, expansion, sort or popup state does not make the committed value uncontrolled. Dialog, Drawer, CommandPalette and Tour require the parent to handle dismissal and update `open`. Use only disabled/read-only props that the component declares.

Form owns its registered field/array values and restores the mount-time `initialValues` on native reset. It combines native named entries, including dotted names, with top-level controller values; FormWizard submits its controller object. FormWizard resets through remounting. Editor's `defaultValue`/`unsafeHtml` are mount-time HTML seeds; remount to replace an edited draft, retaining the documented HTML trust boundary. FileUpload reports browser-selected or dropped files; it has no controlled value prop.

Built-in language resolves from an explicit `lang` prop, then the nearest DOM `[lang]` scope, then the document language, then Vietnamese. Empty or whitespace-only props inherit and continue responding to scope changes. Delayed roots resolve on mount; portals inherit the destination DOM scope. Unsupported locale tables fall back to English, then Vietnamese, then the key. Caller-provided titles, labels and content remain the caller's translation responsibility. Japanese remains a partial spike, not complete product-language coverage.

## Capability paths (DC-capable vs static)

| Consumer | Start here | Available path and validation boundary | Do not |
|---|---|---|---|
| **Claude Code** | `SKILL.md` → `README.md` → `styles.css` + bundler `@cyberskill/design` / legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve) | Repository rules, components and prompts; verify skill loading and a representative task in the host | Hardcode the bundle suffix; treat Storybook host as the portable contract; import `_esm/cs.mjs` or `@cyberskill/design/legacy` into Next/SSR bundlers |
| **Google Stitch** | `DESIGN.md` → `llms.txt` → `tokens/tokens.dtcg.json` | Doctrine, tokens and static `.cs-*` HTML; verify the tool's generated output separately | Treat `templates/**/*.dc.html` as SoT — no tweaks / `__dcSetProps` / DC compiler |
| **Claude Design** | Full repo + available DC compiler | DC authoring sources for tweaks, `x-import` and declared language controls; verify compiler availability, preview and each required export | Skip the sync loop in `docs/sync.md` |
| **npm** | `@cyberskill/design` | Repository version and registry publication are separate: auto-bump → tag validation → authorized dispatch → verified publication; grant in `docs/consumer-grant.md` | Treat registry install as a public license (still UNLICENSED) |

**Stitch DC rule:** Stitch (and any non-DC tool) must **not** consume `*.dc.html` as source of truth. Use static export patterns, `templates/kitchen-sink.html`, `examples/static-hello/`, and `.cs-*` classes from `styles.css`.

**Release signal:** `VERSION` (auto-bump on `main`; no CHANGELOG). Treat the **git tip SHA** as technical truth; read curated product highlights in `docs/release-notes.md`.

## Quick path for AI agents (DC-capable authoring, or driving one)

**What you get:** `styles.css` (public CSS tokens + `.cs-*` classes + Liquid Glass surfaces, `@import`s `tokens/` + `base/`) · `_ds_bundle.js` (compiled React components, no build step) · `_esm/react.mjs` (bundler-native React entry — React as peerDependency; default `exports["."]`) · `_esm/cs.mjs` (browser / no-build legacy via `exports["./legacy"]`) · `_ds_manifest.json` (machine-readable inventory) · per-component `Name.d.ts` (API) + `Name.prompt.md` (usage brief) · `tokens/tokens.dtcg.json` (DTCG 2025.10) + `tokens.json`/`tokens.js`.

**Repo checkout** — clone or copy the whole tree; everything is relative-path static. Entry points: Storybook on the host site (`/` / `npm run storybook`) · `guidelines/atomic-view.html` (every component live, portable) · `templates/<slug>/` (copyable starting points — DC when a compiler is present; kitchen-sink / `.cs-*` for Stitch / static). Read `SKILL.md` before authoring anything on-brand; Stitch readers start at `DESIGN.md`. Deeper maps live in `llms.txt` (inventory) and this file (full adoption + upgrade guide below).

**After import — run the checks.** Open `_audit/run.html` and let every fast gate finish. A pass covers the gate's implemented scope and tested source/environment. Inspect skipped, N/A, advisory and waiver results; then run the relevant consumer, interaction and export checks for your product. Complete accessibility, visual quality and host behavior require their own evidence and human review. Full-clone only — `_audit/` is not in the npm tarball.

**Transfer checks:**
- Never hardcode the bundle namespace suffix (see "Resolve by prefix" below — gate-enforced).

- Never recreate/recolour the logo — use `assets/logo-mark.svg` / the `Logo` component.

- Every UI string ships EN + VN via the registry; don't inline one-language strings in components.

- Anchors (Umber/Ochre), `.cs-*` class names, `--cs-*` token names are stable contracts.

- Extending the system? Follow `docs/doctrine.md` and `CONTRIBUTING.md` (Expansion Rule: propagate to every deliverable in one change; verify via `_audit/`).

## Adopt via npm (optional)

The package is publishable (`private: false`; version equals root `VERSION`). License remains **UNLICENSED** — installing from the registry does **not** grant redistribution rights by itself. **Package version equals root `VERSION`**. Approved use is recorded in **`docs/consumer-grant.md`** (CyberSkill portfolio products from `docs/products.md`). See `docs/decisions.md` and `docs/ci-cd.md`.

**Consumer grant (owner policy — not a secret).** Written and in force at `docs/consumer-grant.md` (+ `docs/vi/consumer-grant.md`). External teams need a dated stanza appended there; redistribution outside granted products needs a further written grant.

```bash
npm install @cyberskill/design@<VERSION>
```

Then link styles and import components. **Next.js / Vite / SSR apps** use the default entry (bundler-native):

```ts
import { Button, TextField } from "@cyberskill/design";
// equivalent: import { Button } from "@cyberskill/design/react";
import "@cyberskill/design/styles.css";
```

Add `transpilePackages: ["@cyberskill/design"]` in Next.js (JSX ships as source). The default entry (`_esm/react.mjs`) is a **`"use client"` barrel** — App Router Server Components can `import { Button } from "@cyberskill/design"` without per-import client shims. React and react-dom are **peerDependencies** — your app provides them. Published types use `export type *` (**TypeScript 5.0+**). Do **not** import `_esm/cs.mjs` (or `@cyberskill/design/legacy`) into an SSR bundler; that browser path supplies missing React globals from local `_vendor/react/` first, falls back to a pinned CDN only after a local load fails, and side-loads `_ds_bundle.js`.

**Browser / no-build:** import `@cyberskill/design/legacy` (`_esm/cs.mjs`) or continue with the static tree paths below. The published tarball is the **full portable tree** (styles, tokens, components, templates, guidelines, docs, UI kits) — not a minimal “lib-only” subset. Host-only tooling (Storybook, `_audit/`) is not in `files[]`.

**First real install (Lumi).** Copy-paste working **browser** consumer: `examples/npm-hello/` — installs `@cyberskill/design` at the repo `VERSION` from the registry, links `styles.css`, mounts `Button` via the **legacy** browser entry (`_esm/cs.mjs`), scopes **Lumi** with `data-cs-element="hoa" data-cs-variant="plasma"` (locked row in `docs/products.md`). From that folder: `npm install && npm run smoke && npm start` → open `http://127.0.0.1:8766/`. Status Hub teams use the same install and swap to `data-cs-element="thuy"` — do not invent mappings. For Next/SSR product apps (e.g. Lumi landing), use `import { Button } from "@cyberskill/design"` as above — not the npm-hello import map.

**Package contents check (maintainers):** `npm run test:pack-hygiene` checks and validates package contents without publishing. See `docs/ci-cd.md`.

## Adopt (two paths, plus a module shortcut)

**1. Static / prototypes / mocks — link the stylesheet.** For **production static**, link the flattened bundle `dist/styles.min.css` (also `@cyberskill/design/styles.min.css`) — one file, no `@import` waterfall. Keep `styles.css` (+ the `tokens/`, `base/`, `fonts/` it `@import`s) as the readable source/dev path, or serve the whole tree. Either way you get every `--cs-*` token, the `.cs-*` component classes, and the Liquid Glass surfaces. Compose with the classes (see `templates/kitchen-sink.html` and `examples/static-hello/`). Copy any asset you reference from `assets/`.

**2. Classic-script browser React — supply runtimes before the bundle.** The component bundle does not include React or ReactDOM. Load the provided local production runtimes first, then `_ds_bundle.js`; do not use `async` to reorder these scripts. Link styles yourself. Resolve the namespace by prefix rather than copying the manifest/compiler suffix. Replace `<path>` with the URL of the copied design-system tree. This example mounts a Button and exercises its callback:
```html
<link rel="stylesheet" href="<path>/dist/styles.min.css">
<script src="<path>/_vendor/react/react.production.min.js"></script>
<script src="<path>/_vendor/react/react-dom.production.min.js"></script>
<script src="<path>/_ds_bundle.js"></script>
<div id="ds-example"></div>
<script>
 const CS = window[Object.keys(window).find(k => /^CyberSkillDesignSystem_/.test(k))];
 if (!CS || CS.__errors.length) throw new Error('Design-system bundle failed to initialize');
 function Example() {
   const [count, setCount] = React.useState(0);
   return React.createElement(CS.Button, {
     variant: 'primary', onClick: () => setCount(n => n + 1)
   }, 'Wishes: ' + count);
 }
 ReactDOM.createRoot(document.getElementById('ds-example')).render(React.createElement(Example));
</script>
```
The template helper `ds-base.js` also waits for both runtime globals before loading the bundle, then exposes `window.CyberSkillDS`. The classic-script example above is a browser path; bundler consumers use the package entry in 2b.

**2b. Bundler-native React (Next / Vite / SSR) — default package entry.** `import { Button, TextField } from "@cyberskill/design"` resolves to `_esm/react.mjs` (also exported as `@cyberskill/design/react`). The generated file starts with `"use client"` so App Router / RSC consumers import interactive components directly. Re-exports every component from source JSX with **React as an external peer** — no CDN, no `_ds_bundle.js` side-load. Your bundler must transpile the package (Next: `transpilePackages: ["@cyberskill/design"]`). Still link styles yourself (`styles.min.css` recommended for production static sheets). Regenerated with `npm run build:react-entry`; parity is gated by `package-exports-integrity` + `test:react-entry`.

**2c. Browser ESM legacy — one import, no build.** `import { Button, TextField } from "@cyberskill/design/legacy"` (or `"<path>/_esm/cs.mjs"`) — the module checks `window.React` and `window.ReactDOM` separately, loads missing globals from local `_vendor/react/` production files first, and falls back to **umd-react@19.2.8** on the SRI-pinned CDN only when a local load fails, side-loads `_ds_bundle.js` once, resolves the namespace by prefix, and re-exports all components (`_audit/esm-smoke-test.html` keeps the export list in lockstep with the manifest). For a copied subtree, retain `_vendor/react/` with its provided licenses, `_esm/`, `_ds_bundle.js`, CSS and the referenced token/base/font paths; preserve applicable notices. External fallback is not an offline guarantee. `npm run test:subtree-consume` verifies this declared copy and the EN/VI classic-script examples with external requests rejected. Still link `styles.css` yourself. **Not for Next/SSR.** Bundler apps should keep providing their own `react` / `react-dom` peers (`^18 || ^19`).

**Templates.** Each `templates/<slug>/` is a Design Component seeded from `ds-base.js` (one `base` line to rebind the path to wherever this system lives relative to the consuming page). Copy the folder and edit copy/tweaks.

The template helper waits for React and ReactDOM before loading the component bundle, shares one load promise per resolved bundle URL, and rejects module initialization failures before publishing `window.CyberSkillDS`. This prevents duplicate or premature bundle execution when the DC runtime mounts the template head. The standalone script example above requires React and ReactDOM to be loaded first.

**Machine-readable tokens.** `tokens/tokens.json` + `tokens/tokens.js` (ESM) + `tokens/tokens.dtcg.json` (DTCG 2025.10 emitted-value profile; see [extension contract](conventions.md)) expose the exported base categories and CSS-valued theme/element maps — for native/mobile/design-tool pipelines. Live tool imports remain unverified. **Native source files ship pre-generated** in `tokens/native/` (SwiftUI `CSTokens.swift` · Compose `CSTokens.kt` · Flutter `cs_tokens.dart`) with `tokens/provenance.json` (release, source sha-256, conversion rules, per-target sha-256); the `token-pipeline` gate keeps them in lockstep with the DTCG source.

**Static HTML / no React / no build tooling.** Link `dist/styles.min.css` (production) or `styles.css` (source/dev) and compose with `.cs-*` classes — full catalog demonstrated in `templates/kitchen-sink.html`.

**Fonts, including a display face.** All three brand families are self-hosted in `fonts/` and declared by `tokens/fonts.css` (which `styles.css` `@import`s): **Be Vietnam Pro** (`--cs-font-family-ui`), **JetBrains Mono** (`--cs-font-family-mono`), and **Space Grotesk** (`--cs-font-family-display`, variable 300–700, Vietnamese subset included). The display face is **opt-in** — nothing in the DS points at it. A product that wants a headline face adds `class="cs-display-face"` (or sets `--cs-heading-family: var(--cs-font-family-display)`) on the scope; heading utilities follow, body copy stays on the UI face.

Consumers that skip `styles.css` to control font loading (`cyberskill.world` / Lumi imports the token + base sheets individually and keeps its own `font-display: optional` strategy) can switch from their ad-hoc `brand-fonts.css` to the package: either `@import "@cyberskill/design/tokens/fonts.css"` for the packaged faces, or keep the local `@font-face` block and point `--cs-heading-family` at `var(--cs-font-family-display)` so the **role** comes from the DS even when the **bytes** are served locally. Either way the display face stops being a per-product exception. Space Grotesk has no 800 weight, so `--cs-heading-weight-strong` (800) under `.cs-display-face` clamps to 700 within Space Grotesk — CSS does not hop to Be Vietnam Pro for a missing weight.

## The four axes

Product defaults: `light · tho · vi · liquid-glass`. These defaults describe the product setup; nested scopes inherit unless explicitly reset.

Theme (`data-theme="light|dark|system"`), Element (`data-cs-element` and its matching `data-cs-variant`), Language (`lang`) and Style (`data-cs-style="liquid-glass"`) can be scoped on containers. Unmarked descendants inherit; omitting an attribute does not reset an ancestor. Set `light`, `comfortable` or `standard` explicitly to reset theme, density or contrast. Root theme is light; root contrast follows the OS unless explicitly set to standard. System theme follows the OS color scheme. Theme, element, contrast and density may occupy separate ancestors in either order. Language follows the component resolution rules above.

The neutral root uses the Thổ studio baseline; explicit `data-cs-element="tho"` applies the Thổ element palette. Omitting an element cannot clear an inherited element. Keep an element and its matching variant on the same node. Liquid-glass is the sole supported style. Unknown attribute values, mismatched element/variant pairs and standalone imports of only part of the token CSS have no guaranteed fallback or composition behavior. Use `styles.css` or the generated flattened sheet.

## Upgrading

- **Version tracks `VERSION`.** `package.json` stays equal to the root `VERSION` file. There is no design-system changelog file — treat the **git tip SHA** as the technical truth, and read curated **Release Notes** (Storybook + `docs/release-notes.md`) for product-facing highlights.

- Anchors (Umber/Ochre), the `.cs-*` class names, and the `--cs-*` token names are stable contracts — safe to depend on. Breaking renames of those contracts should be rare and called out in the PR/docs when they happen.

- **Re-run the smoke test after upgrading.** Open `_audit/consumer-smoke-test.html` and the full Health board (`_audit/run.html`) against the new tip — the runner proves the packaged path still resolves.

### ADOPT-001 — bump known consumers to 1.7.x

Portfolio / sibling products that still pin an older `@cyberskill/design` (or a vendored subtree) should bump to **≥ 1.7.2** on their next integration window. Do this **in each consumer repo** — this design-system tree does not modify sibling checkouts.

**Observed pins (local CyberSkill siblings, 2026-08-24):**

| Consumer repo | Manifest path | Current pin | Proposed change |
|---|---|---|---|
| **SachViet** | `sachviet/app/web/package.json` | `^1.0.0` (lock: **1.0.0**) | `npm install @cyberskill/design@1.7.2` |
| **Strategem** | `strategem/apps/web/package.json` | `1.0.0` (exact) | `"@cyberskill/design": "1.7.2"` then install |
| **Finance** | `finance/package.json` | `github:cyberskill-official/design-system` (unpinned SHA) | Prefer registry `@cyberskill/design@1.7.2`, or pin a known SHA of this `design` repo after verifying the GitHub package path still resolves |
| **Landing** | `landing/package.json` | `github:cyberskill-official/design-system#3edeb1350c2e48761bee18f7c10c323e6103ff7d` | Refresh to registry `1.7.2` or a tip SHA of the published design tree |

| Consumer (typical) | Element mapping | Bump notes |
|---|---|---|
| **Finance** (invoice / quote surfaces) | Client delivery / finance templates → Thổ·clay or product row in `docs/products.md` | Prefer `dist/styles.min.css`; re-run print/export smoke if using DC templates |
| **SachViet** (luxury / catalog) | Per product registry — do not invent element | After bump: verify Theme × Element tokens + skip-link / scroll-padding from 1.7.2 |
| **Landing** (cyberskill.world / marketing) | Thổ studio (no attributes) or locked row | Website kit: drop inline skip styles; rely on `.cs-skip` + `--cs-scroll-padding-block-start` |
| **Strategem** (ops / status) | Status Hub → Thủy when applicable | Status hub kit: sticky-bar scroll-padding; regenerate status page after task HITL |

Checklist per consumer:
1. `npm install @cyberskill/design@1.7.2` (or current `VERSION`) — or refresh subtree / `_ds/` bind.
2. Switch static CSS to `dist/styles.min.css` if still on the `@import` waterfall (FIND-017).
3. Smoke: consumer app build + keyboard Tab to skip link → `#main` on shell pages.
4. Record the pin in that repo’s lockfile / release notes — not here.

**PR-ready one-liners (apply in the consumer repo only):**

```diff
// sachviet/app/web/package.json
- "@cyberskill/design": "^1.0.0"
+ "@cyberskill/design": "1.7.2"

// strategem/apps/web/package.json
- "@cyberskill/design": "1.0.0"
+ "@cyberskill/design": "1.7.2"
```

Landing / Finance: prefer switching from the legacy `github:cyberskill-official/design-system#…` pin to the registry package once Trusted Publishing / grant covers that product — do not force-push sibling remotes from this tree.

## Host Storybook (optional)

The live site serves Storybook at `/` as the **product surface** for operators (Theme × Element × Language × Style + control matrices). That is **host-only tooling** — do not depend on Storybook in product apps. Portable Atomic View remains at `guidelines/atomic-view.html`. See `docs/storybook.md` and `docs/live-hub.md`.

## Five-minute consumer spike

**Registry path (preferred for product apps):**

```bash
cd examples/npm-hello
npm install
npm run smoke
npm start
# open http://127.0.0.1:8766/
```

**Clone / static path (no npm):**

```bash
# from monorepo root
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/examples/static-hello/
# then http://127.0.0.1:8765/_audit/consumer-smoke-test.html
```

Edit `examples/static-hello/index.html`: flip `data-theme="dark"` or `data-cs-element="thuy"` on `<body>`. No install, no Storybook.

## Native sample hosts (optional)

Multi-screen samples (Sign in · Home · Settings) live under `examples/native/swiftui`, `compose`, and `flutter`. They sync generated tokens via `node examples/native/sync-tokens.mjs`. Compose opens in **Android Studio** (no committed `gradlew` — the documented CLI configuration uses JDK 17, Gradle 8.2.1 and an Android SDK; see `examples/native/README.md`). Not required for web consumers.

## Extending

If you're changing the system itself (not just consuming it), follow `CONTRIBUTING.md` — the Expansion Rule (propagate to every deliverable in one change) and the verification doctrine (deep checks via `_audit/`).

## Independent SSR roots

For multiple independently hydrated roots on one page, choose a distinct
`identifierPrefix` for each root and use that same value on the server and client:

```jsx
// Server (after transpiling the package JSX as described above).
const markup = renderToString(<App />, { identifierPrefix: 'account-' });
// Client, with the same initial component tree and content.
hydrateRoot(document.getElementById('account'), <App />, {
  identifierPrefix: 'account-',
});
```

Use a different prefix, such as `billing-`, for another root. Prefixes prevent
ID collisions; they do not reconcile different server/client data or language.
Overlay ownership is document-wide: a modal in one root temporarily makes the
other root inert, then restores it on dismissal. This applies when both roots
use the same loaded design-system module; independently bundled copies have not
been certified to coordinate.

`npm run test:packed-ssr` exercises an isolated tarball consumer against pinned
React 18 and 19 runtimes, repeated server renders, two hydration roots, ID
references, independent field/selection state and modal isolation/cleanup. It
also measures the fixture's production JS/CSS output. This is bounded consumer
verification, not framework deployment, performance-budget or human
acceptance. The React 18 fixture installs locked peers into a disposable folder
and therefore needs registry/cache access.

### Streamed Suspense verification boundary

The packed SSR pilot also runs React 18/19 `renderToPipeableStream` with an outer
shell and deferred content inside Suspense. It asserts that pending fallback
precedes completed component content, then hydrates the collected stream output
and exercises both prefixed roots. Run `npm run test:packed-ssr` for synchronous
and streamed-output variants.

The collected-output fixture is supplemented by a live HTTP scenario: a server
renderer emits the shell, waits for an explicit release, then completes the
response. The browser must see the pending fallback while the document is still
loading, then hydrate and select a value after release. Disconnecting while
suspended must terminate the fixture renderer. This tests the isolated Node
consumer, not framework deployment, React Server Components, proxy buffering,
or a production hosting/security configuration.

The local consumer also verifies a CSP with external scripts restricted to self
and inline streaming instructions authorized by a fresh response nonce. Both
React majors pass hydration/interactions; removing that nonce blocks the stream
completion scripts and leaves the fallback unresolved. Styles still permit
inline declarations, and watermark images permit data URLs. This is not a claim
of compatibility with a policy that forbids inline styles. In a real server,
coordinate the nonce passed to React with the response CSP; do not reuse a nonce
across HTML responses. The pilot rewrites its precollected stream nonce per
response and checks they differ. The live scenario instead passes its response
nonce directly to the active server renderer. Production integration remains
consumer-owned.

A separate live scenario calls React stream abort while the boundary is still
pending. The browser must recover through client rendering, remove the fallback,
retain unique IDs across roots and support selection. This path expects exactly
one recoverable-error diagnostic identifying the intentional abort; unexpected
diagnostics still fail. Normal completed streams must have no recovery errors.
The test does not establish framework-specific timeout or retry policy.

### Measure consumer resource costs

Run `npm run measure:consumers -- --output /tmp/cs-consumer-costs.json` to record consumer resource measurements.
The probe extracts a fresh npm tarball into an isolated directory, supplies the
installed peer React runtime, and exercises one mixed EN/VI reference screen
through source CSS, flattened static CSS, the legacy browser entry and a
minified production esbuild React entry. The interactive paths exercise a
TextField and Button; all paths render the three font roles. External requests,
missing resources, browser errors and a compiler in the browser fail the run.
The bundler graph also rejects development React files and the legacy bundle.

The report binds results to the package hash, lockfile, probe and tool versions.
It records every requested response body and groups counts/bytes by resource
type. `productionOutputs` separately lists every emitted bundler file, including
fonts and images that the reference screen did not request. Emitted storage and
loaded bytes are different measurements. The loopback server sends uncompressed
bodies with caching disabled;
`gzipBytes` is an offline per-body estimate, not measured network transfer.
Already-compressed WOFF2 may grow under gzip. Headers, protocol overhead,
latency, CPU, memory, repeat visits and unvisited states are excluded.

This reference fixture complements the SSR/hydration tests. It does not replace
real product pilots, prove adoption, establish performance budgets or authorize
package splitting. Use product traces and agreed budgets before changing those
contracts. Refresh the report after changing the distributed CSS, fonts, runtime
or package graph; retain the recorded source identity when citing older results.

For raw template links, apply `.cs-touch-target` when the surrounding layout does
not already provide a 44 × 44 CSS-pixel activation area. On coarse pointers this
utility supplies the minimum dimensions and inline flex alignment; it does not
change the destination or link text. Use `.cs-check` on wrapping checkbox labels
so the label supplies the touch area without enlarging the native glyph. Shared
DC document export controls also preserve this minimum in the opened menu.
These rules cover the browser preview; they do not establish email-client CSS
support or exported-document interaction behavior.

Run `npm run test:template-touch` for all manifest templates and their declared
language/theme/element choices and all declared boolean/enum prop combinations
at 320, 390 and 1280 CSS pixels, including focused
skip links and opened export menus. Run `npm run test:template-touch-actions`
for native link/label activation and export-menu dismissal. Both accept
`-- --browser=firefox` or `-- --browser=webkit`. `npm run test:template-state-actions` additionally checks dashboard view changes,
settings switches/disclosures and modal focus restoration, and sign-in states.
These checks do not cover arbitrary caller content, every runtime interaction
sequence, or certify human visual acceptance.

External modal openers must establish their focus target before opening. The
Settings template explicitly focuses its activating button in the click handler
so touch activation also gives the overlay manager a reliable return target.

Coarse-pointer sizing also covers speed-dial actions, interactive list rows, small
image previews, context-menu zones, and direct focusable overlay triggers.
`npm run test:touch-supplemental` and `npm run test:trigger-touch` exercise these
optional and fallback surfaces across both languages, densities and themes.
