---
id: TASK-IMP-030
title: Implement the 2026-09-13 core design system enterprise audit remediations
template: task@1
type: improvement
module: improvement
status: ready_to_review
priority: p0
author: "@cursor-agent"
department: engineering
created_at: 2026-09-13T13:46:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: []
source_pages:
  - docs/audits/core-design-system-enterprise-audit-2026-09-13.md
---

# TASK-IMP-030: Enterprise audit remediations

Renumbered from a colliding `TASK-IMP-025` label after `main` assigned that id to container-query layout migration.

## 1. Description (normative)

Close every deliverable named in `docs/audits/core-design-system-enterprise-audit-2026-09-13.md`: P0–P3 backlog rows, the ten exact next actions, and the target-state package/governance/release contracts. Work stays in this product repo. HITL remains required at review and final acceptance. Do not mark `done` without a recorded human verdict.

- 1.1 Gate contract: `npm test` aliases `test:unit`; Playwright bootstrap is documented and auto-installs Chromium when missing; Storybook static freshness can pass after rebuild.
- 1.2 License/distribution posture is an explicit decision (proprietary `UNLICENSED` + consumer grant) with a root `LICENSE` and complete third-party notices, including the deck-stage vendor.
- 1.3 CODEOWNERS plus a machine-readable export registry cover owner, maturity, support, deprecation, and package for every public export.
- 1.4 Strict TypeScript declaration compile and React 18/19 SSR consumer fixtures are required gates.
- 1.5 Package budgets exist; workspace packages (`tokens`, `primitives`, `react`, `themes`, `icons`, `templates`, `eslint`, `codemods`) plus Storybook/canary apps exist; `@cyberskill/design` remains the time-boxed facade.
- 1.6 Layered token metadata, SSR-safe ThemeProvider, high-contrast/RTL/pseudo-locale, hardened Editor/Image/Sortable/Carousel, inclusive CI matrix, Changesets, and fail-closed release binding land in the same program.

## 2. Acceptance criteria

- [x] AC for 1.1 — `npm test` exists; CyberOS `TEST_CMD` can run; subtree-consume bootstraps Chromium
- [x] AC for 1.2 — `LICENSE` + decisions §16 + resolved deck-stage notice
- [x] AC for 1.3 — registry test 100% of public exports; CODEOWNERS present
- [x] AC for 1.4 — `tsc` declarations gate + canary React 18/19 SSR smoke
- [x] AC for 1.5 — workspace packages publishable; budget gate; facade still `@cyberskill/design`
- [x] AC for 1.6 — token layers, ThemeProvider, widget tests, inclusive matrix, Changesets, release-bind
- [ ] AC HITL — human review + final acceptance — never self-set `done`

## 3. Edge cases

- Do not reintroduce Density/Expression as a **product axis** (`axis-guard`). Theme attributes `data-cs-density` / `data-cs-contrast` from TASK-IMP-027 stay.
- Keep `package.json` `license` as `UNLICENSED` (pack-hygiene contract) while documenting the proprietary grant.
- Do not push, deploy, or merge without an operator instruction.
- Expansion Rule: new operator docs need EN+VI, catalog, viewer, and Storybook coverage.

## 4. Protected invariants

- Umber/Ochre anchors, Vietnamese-first bilingual strings, APCA/focus/44px floors.
- `@cyberskill/design` remains the consumer install name during the migration window.
- Product acceptance must not require `.cyberos/` for npm consumers.

*End of TASK-IMP-030.*
