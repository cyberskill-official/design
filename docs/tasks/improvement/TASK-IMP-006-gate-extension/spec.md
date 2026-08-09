---
id: TASK-IMP-006
title: Extend docs-consistency + keyboard fixtures + asset budget (FIND-018)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phases 0–2 tranche.
acceptance_verdict: approved
accepted_at: 2026-08-09T11:45:00+07:00
accepted_by: "@stephencheng"
priority: p0
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T04:00:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: [TASK-IMP-002, TASK-IMP-003]
blocks: [TASK-IMP-007]
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-018]
assessment_phase: 2
---

# TASK-IMP-006: Extend docs-consistency + keyboard fixtures + asset budget

## 1. Description (normative)

Close FIND-018 — highest-leverage Phase-2 gate extension.

- 1.1 **Doc/token parity** in `_audit/docs-consistency.html`: assert README/SKILL role-token count (incl. `on-strong`), depth-scale tiers, documented default lang vs `components/_i18n/i18n.js`, breakpoint token usage where in scope (closes FIND-003/005/009 recurrence).
- 1.2 **Playwright keyboard fixtures** for Mentions + Sortable (**hard-fail**). Stubs/structure for Rating/Tree/Toolbar may exist but Phase-3 widgets MUST NOT hard-fail this tranche unless those remediations land.
- 1.3 **Asset-weight budget** gate for aurora PNGs (fail on regression / oversized set; conversion itself may stay Phase 4).
- 1.4 Wire new/changed gates into `_audit/index.html` / Status board per Expansion Rule / CLAUDE.md.

## 2. Acceptance criteria

- [x] AC for 1.1 — docs-consistency fails on role/depth/lang drift — gate run (`docs-consistency.html` + Node twin `test-docs-consistency.mjs`)
- [x] AC for 1.2 — Mentions + Sortable keyboard fixtures hard-fail on regression — `a11y-gate.html` (+ behavior harness already covered)
- [x] AC for 1.3 — asset budget gate green on tip; fails if aurora set grows past budget — `asset-weight-budget.html`
- [x] AC for 1.4 — `_audit/index.html` + Status surfaces list the new gates (`run.html` board = 40)

## Implementation notes (2026-08-09)

Landed with TASK-IMP-007 doc/z-index fixes so new assertions stay green. Rating/Tree/Toolbar APG intentionally not hard-failed (Phase 3).

## 3. Edge cases

- Rating/Tree/Toolbar: TODO/skip only if product policy forbids failing unfinished widgets; prefer structure without hard-fail until Phase 3.
- Do not weaken existing fast gates while extending.

## 4. Protected invariants this task must not weaken

- Expansion Rule: new gates appear on browsable + health surfaces.
- Deep verification: whole-set assertions, not spot-checks.

*End of TASK-IMP-006.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
