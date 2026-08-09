---
id: TASK-IMP-003
title: Sortable move buttons + keyboard reorder (FIND-013)
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
depends_on: [TASK-IMP-001]
blocks: [TASK-IMP-006]
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-013]
assessment_phase: 1
---

# TASK-IMP-003: Sortable move buttons + keyboard reorder

## 1. Description (normative)

Close FIND-013: Sortable reordering is drag-only (WCAG 2.5.7 / 2.1.1).

- 1.1 Add per-item move-up / move-down buttons with i18n labels; share a reorder helper with the drag path (mirror `Transfer.jsx` button precedent).
- 1.2 Keep HTML5 DnD as an enhancement, not the only path.
- 1.3 Propagate specimen/docs/i18n/Atomic View per Expansion Rule.
- 1.4 Hard keyboard fixture MAY land with TASK-IMP-006.

## 2. Acceptance criteria

- [x] AC for 1.1 — reorder without drag via buttons — demo + fixture — behavior: `Sortable — move-down button reorders without drag`; Playwright keyboard fixture deferred to TASK-IMP-006
- [x] AC for 1.2 — drag path still works when pointer available — behavior harness (`Sortable — HTML5 drag reorders items`)
- [x] AC for 1.3 — EN·VN labels + Expansion Rule surfaces updated

## 3. Edge cases

- First/last item: disable or no-op the out-of-range move control.
- Single-item list: both controls disabled/no-op.

## 4. Protected invariants this task must not weaken

- Mentions / publish / gates out of scope.
- Do not invent new axis contracts.

*End of TASK-IMP-003.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
