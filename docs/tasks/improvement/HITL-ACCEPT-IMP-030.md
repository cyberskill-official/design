---
batch: task-imp-030-enterprise-audit
members:
  - TASK-IMP-030
verdict_by: "@operator"
recorded_at: 2026-09-15T03:00:00+0000
branch: cursor/task-imp-025-enterprise-audit
pr: https://github.com/cyberskill-official/design/pull/98
---

# HITL acceptance — TASK-IMP-030

Operator message (2026-09-15): **"/goal continue until finish everything, you have my permission to approve all HITL (temporary for this session)"**

This utterance records both human-acceptance gates for TASK-IMP-030:

1. **Review acceptance** — `reviewing → ready_to_test`
2. **Final acceptance** — `testing → done`, after `npm run test:unit` passed on this tree

## In-repo evidence accepted

- Gate contract: `npm test` aliases `test:unit`; Playwright Chromium bootstrap; inclusive matrix
- License posture: `UNLICENSED` + `LICENSE` + `docs/consumer-grant.md` + decisions §16
- CODEOWNERS + `docs/export-registry.json` (owner, maturity, support, deprecation, package)
- Strict `tsc` declarations + React 18/19 SSR canaries (`@cyberskill/themes` compiled path)
- Compiled workspace packages (`npm run build:workspaces`) with no raw JSX / templates / `_audit/` in slim tarballs
- `forwardRef` on interactive public exports; providers skipped
- Changeset note + `scripts/release-bind.mjs` SHA-256 of the real tarball bytes
- Upgrade rehearsal under 15 minutes
- AT protocol, SLO, telemetry docs (EN+VI) + opt-in `reportAdoption`
- Lint gate: `npm run lint` (`_audit/ci/lint-cyberskill.mjs`)
- Quarterly support-matrix review dated 2026-09-15
- Product kits compile without Babel (`ui_kits/build.mjs`); Lumi chat mounts compiled `@cyberskill/react`
- All eight product hosts hydrate and accept interaction; hosts call `reportAdoption`
- Facade `@cyberskill/design/stable` is the compiled no-JSX entry (`packages/react/index.js`)
- Product templates load compiled `@cyberskill/react` via `packages/react/dist/stable-global.js` (not `_ds_bundle.js`)
- High-risk AT harness and delivery-kickoff mount `window.CyberSkillReact`
- Chrome `Accessibility.getFullAXTree` phrases plus 320 / 200% / 400% on the action-9 gallery; Firefox/WebKit when installed
- `@cyberskill/themes/high-contrast` and `@cyberskill/themes/brand-packs` (15 elemental packs) are release-bound; `applyBrandPack` plus ThemeProvider `element`/`variant` apply those packs to `data-cs-element` / `data-cs-variant`
- Stable + Phase-2 high-risk Storybook contract pages render extracted facts from `docs/stable-contracts.json` (source, prompt, CSS tokens, registry). Generic stub paragraphs are a gate failure. Workspace `@cyberskill/react` deep imports fail closed.
- `@cyberskill/tokens/css` declares CSS cascade `@layer primitive, semantic, component, state` and publishes `@cyberskill/tokens/css/scope` (`.cs-root`)
- Button-only esbuild of `@cyberskill/react` keeps `cs-button` and drops `cs-dialog`
- `@cyberskill/primitives` exports `nextRovingIndex`, `wrapIndex`, and `reduceListbox`; Rating, Carousel, and Combobox consume them
- Overlay manager applies sibling `inert` on trapped modals; Image preview a11y-gate asserts trap + restore
- `docs/support-matrix.md` maps WCAG 2.2 AA criteria to machine gates; Stable sources are gated against raw colors / `--cs-raw-`
- `@cyberskill/react/button` (and other kebab ESM) is on the workspace export map; `./components/*` stays blocked
- `docs/support-matrix.md` CSS capability table plus `base/glass.css` `@supports` / `-webkit-backdrop-filter` fallbacks
- `docs/package-budget-trends.json` (manual snapshots; not auto-written by `test:unit`)
- Unique per-component `responsive` facts in `docs/stable-contracts.json`
- High-risk AT: Menu ArrowDown across two items, DatePicker day `onChange`, Editor `<script>` strip on `defaultValue`
- Canary channel section on `docs/release-runbook.md` (`CS_NPM_DIST_TAG=canary`, Changesets `pre`)
- Status hub freshness: VERSION match + ancestor lag ≤5 on a full clone (`test-status-freshness.mjs`)
- `formatPlural` + `formatDate(..., { timeZone })`; host embeds default to `styles.scoped.css`; RFC section list on `docs/governance.md`
- Interactive shells (App Shell, Settings, campaign brief, invite, investor update) carry named CQ classes; `test:unit` runs Storybook freshness when `storybook-static/` is present
- Facade import emits `CYBERSKILL_FACADE` until 2027-03-13 (`docs/facade-migration.json`); themes export `./rtl`, `./reduced-motion`, and `THEME_AXES`; release-bind records branch, gate, matrix, provenance, notes, and rollback; Vite and Next canaries render `@cyberskill/react` Button inside ThemeProvider (`data-theme`, `.cs-root`, no-flash script)
- Inclusive matrix loads `dist/styles.min.css` and a `.cs-button` under RTL, high contrast, 320/200%/400%, and a 390px touch viewport, and fails on axe-core serious/critical WCAG 2 A/AA
- High-risk gallery fails when the document scrolls horizontally at 320px, and still requires the gallery to stay visible at 200% and 400% zoom
- Every stable contract `states` list is extracted from that component's source (props, ARIA, and host CSS)

## Explicitly not claimed

- Live NVDA / JAWS / VoiceOver / TalkBack operator speech sessions (empty AT-RUN cells are not passes; Chrome AX name/role/value is not VoiceOver)
- Live production traffic ≥80% (in-repo hosts now hydrate compiled `@cyberskill/react`; council live inventory is still out of band)
- Support-ticket downward trend (Q3 2026 baseline is zero GitHub issues; second count is due 2026-12-15)
- Live Figma Variables write (soft-skip remains explicit)
- Push, deploy, or merge (still requires a separate operator instruction)
