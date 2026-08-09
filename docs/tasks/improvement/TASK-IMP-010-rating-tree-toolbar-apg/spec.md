---
id: TASK-IMP-010
title: Rating/Tree/Toolbar APG keyboard + a11y fixtures (FIND-014)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 3 tranche ("continue all").
acceptance_verdict: approved
accepted_at: 2026-08-09T11:55:00+07:00
accepted_by: "@stephencheng"
priority: p0
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T05:00:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-014]
assessment_phase: 3
---

# TASK-IMP-010: Rating/Tree/Toolbar APG keyboard + a11y fixtures

## 1. Description (normative)

Close FIND-014: Rating, Tree, and Toolbar declare ARIA interaction roles without the APG keyboard model.

- 1.1 **Rating** — radiogroup roving tabindex + ArrowLeft/Right (and Up/Down) selection; single tab stop when interactive.
- 1.2 **Tree** — tree navigation (ArrowUp/Down, Left/Right expand-collapse, Home/End) + roving tabindex on visible treeitems.
- 1.3 **Toolbar** — arrow navigation among toolbar controls; resolve role mix (menubutton + popup `menu` for overflow is OK; do not nest `menu` as a toolbar peer without keyboard). Escape closes overflow.
- 1.4 Extend `_audit/a11y-gate.html` with hard-fail keyboard fixtures for all three; update lede/`_audit/index.html` copy that currently says Phase-3 not hard-failed.
- 1.5 Propagate Expansion Rule surfaces (`.d.ts` / `.prompt.md` notes, Atomic View if needed, behavior harness where interactive contracts change).
- 1.6 This task MUST NOT be marked `done` without HITL.

## 2. Acceptance criteria

- [x] AC for 1.1–1.3 — each widget matches its APG keyboard model — demo + a11y-gate hard-fail
- [x] AC for 1.4 — fixtures fail if arrow/roving regress — `_audit/a11y-gate.html`
- [x] AC for 1.5 — Expansion Rule checklist for touched components
- [x] AC for 1.6 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Rating `readOnly`: no tab stop / no arrow mutation.
- Tree empty / all-leaf: arrows still move among items; Left/Right no-op when no children.
- Toolbar with only separators or zero items: no crash.

## 4. Protected invariants this task must not weaken

- Existing Rating fill/`aria-checked` contract used by a11y semantics test unless intentionally updated with fixture.
- Mentions/Sortable keyboard fixtures remain green.

*End of TASK-IMP-010.*

## Human acceptance (2026-08-09)

Operator HITL: **"continue all of them"** — Phase 3 tranche (TASK-IMP-009…012) accepted. Status set to `done`.
