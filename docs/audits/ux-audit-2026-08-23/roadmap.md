# Design system roadmap — updated 2026-08-24 (tip continuation)

This file updates the phased program in [ux-audit-2026-08-08 §10](../ux-audit-2026-08-08/ux-audit-2026-08-08.md) and `docs/tasks/BACKLOG.md` after the **2026-08-23 re-audit** and the **2026-08-24 continuation tranche**.

## Completed since Aug-8 UX audit

| Item | Evidence |
|---|---|
| Light contrast on accent-strong (`--cs-accent-on-strong`) | `light-contrast` gate 85/85 PASS |
| 320px reflow (UX-003) | `overflow-320` gate 88/88 PASS |
| VN overflow + EN leak scan | `language-overflow` gate 85/85 PASS |
| Zoom 200%/400% + text-spacing 1.4.12 | `zoom-text-spacing` PASS |
| Pack contract v2 / system-dark parity | TASK-IMP-001…021 done |
| CSP-safe export + DOCX parity | TASK-IMP-022 done |
| iOS print + HTML-faithful export | **TASK-IMP-023/024 done** (operator HITL 2026-08-24) |
| Probe suite promotion | `_audit/ci/audit-probe-suite.mjs` |
| Scroll-padding tokens + global skip-link CSS | 2026-08-23 — `tokens/spacing.css`, `base/reset.css` |
| Audit-probe `__language` global fix | 2026-08-23 — `_audit/ci/audit-probe-suite.mjs` |
| **UX-031** kit/template skip → `.cs-skip` | 2026-08-24 — inline styles removed |
| **UX-032** artifact-head + main landmark | 2026-08-24 — `ds-base` ensureLandmark + gate checks `main` |
| **UX-033** per-shell scroll-padding | 2026-08-24 — website `.site`, status-hub `.sh`, status `.bar` |
| **UX-034** status CSS token dedupe | 2026-08-24 — shared `cs-tokens.css` @import on regen |
| **UX-035** status-legacy palette tokenize | 2026-08-24 — page-local roles → CDS vars (rgba residuals documented) |
| **ADOPT-001** consumer bump guidance | 2026-08-24 — `docs/consuming.md` (+ observed sibling pins) |
| **SEC-001 containment** | 2026-08-24 — Editor sanitize + `unsafeHtml` boundary |
| **G1 CQ hosts (partial)** | 2026-08-24 a.m. — website `.container`, status-hub `.wrap` |
| **G1 CQ wave 2** | 2026-08-24 p.m. — kit grids + helpers → **TASK-IMP-025 done** (operator HITL 2026-08-24) |
| **G4 lifecycle registry** | 2026-08-24 — `components/lifecycle.json` → **TASK-IMP-028 done** (operator HITL 2026-08-24) |
| **SEC-001 schema allowlist** | 2026-08-24 — `editor-schema.js` → **TASK-IMP-029 done** (operator HITL 2026-08-24) |
| **AT automation proxies** | 2026-08-24 — `at-automation-coverage.md`, `at-kit-probe`, a11y-gate AT-06, `test-at-coverage-map` |

## Prioritized backlog (remaining)

### P0 — Human gates (cannot automate)

| ID | Work | Owner |
|---|---|---|
| AT-001 | Manual NVDA/VoiceOver matrix — automated proxies done ([`at-automation-coverage.md`](../at-automation-coverage.md)); human speech scripts: [`at-manual-checklist.md`](../at-manual-checklist.md) (16 ☐×2 AT rows) | Stephen Cheng |

### P1 — Done this tranche

UX-031…033 closed in code — `npm run test:audit-probe` PASS (2026-08-24).

### P2 — Remaining / light follow-up

| ID | Work | Notes |
|---|---|---|
| UX-036 | Further kit → shared `.cs-*` composition | Skip links done; kit CTAs (e.g. `.btn-gold`) left intentional to avoid visual regression |
| ADOPT-001 | Execute bumps in Finance / SachViet / Landing / Strategem repos | Checklist + exact pins in `docs/consuming.md`; **deferred by operator 2026-08-24** |

### P3 — Improvement tasks

| ID | Task | Status |
|---|---|---|
| G1 remainder | TASK-IMP-025 | **done** (operator HITL 2026-08-24) |
| G2 | TASK-IMP-026 | **`ready_to_implement`** — operator **B**: third-locale spike (**ja**); ADR at implementation start |
| G3 | TASK-IMP-027 | **`ready_to_implement`** — operator **C**: density + contrast one wave; update `axis-guard` at implementation |
| G4 | TASK-IMP-028 | **done** (operator HITL 2026-08-24) |
| SEC-001 schema | TASK-IMP-029 | **done** (operator HITL 2026-08-24; contentEditable library swap deferred) |

## Phase alignment (Aug-24 tip)

| Phase | Aug-8 target | Aug-24 status |
|---|---|---|
| 0 Baseline gates | Advisory → hard | **Done** |
| 1 Critical a11y/contrast | axe serious = 0, 320 green | **Done** at tip |
| 2 DS normalization | tokens, flat CSS, overlay manager | **Done** |
| 3 Core flows | kit recomposition, Storybook polish | **Done** for skip/landmarks; CTA composition optional |
| 4 Responsive/content | CQ layer, zoom gate, AT schedule | **CQ wave 2 done**; **AT automated proxies done**; human matrix open |
| 5 Final polish | probe suite, watermark, prose | **Done** + Aug-23/24 hardening |

**Next operator actions:** execute AT matrix human sessions ([`at-manual-checklist.md`](../at-manual-checklist.md)) → `ship-tasks` picks **026** then **027** → consumer bumps (ADOPT-001) when ready.
