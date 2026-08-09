---
id: TASK-IMP-012
title: Recommend dist/styles.min.css as static default (FIND-017)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 3 tranche ("continue all").
acceptance_verdict: approved
accepted_at: 2026-08-09T11:55:00+07:00
accepted_by: "@stephencheng"
priority: p2
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
findings: [FIND-017]
assessment_phase: 3
---

# TASK-IMP-012: Recommend dist/styles.min.css as static default

## 1. Description (normative)

Close FIND-017: documented static default is the 25-file `@import` waterfall (`styles.css`) while flattened `dist/styles.min.css` already exists.

- 1.1 `docs/consuming.md` static-adoption step SHALL recommend `dist/styles.min.css` (or `@cyberskill/design/styles.min.css`) for production; keep `styles.css` as readable source/dev.
- 1.2 `examples/static-hello/index.html` (+ README) SHALL link the flattened stylesheet by default.
- 1.3 VI consuming docs updated if they mirror the static path.
- 1.4 This task MUST NOT be marked `done` without HITL.

## 2. Acceptance criteria

- [x] AC for 1.1 — consuming.md static path recommends flattened CSS — inspect
- [x] AC for 1.2 — static-hello links `dist/styles.min.css` — inspect
- [x] AC for 1.3 — VI parity if file exists
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Bundler npm path may still import `styles.css` or `styles.min.css`; do not break `exports["./styles.css"]`.
- Kitchen-sink / templates that already use flattened via `ds-base.js` need no change.

## 4. Protected invariants this task must not weaken

- Token/`styles.css` source tree remains the authoring source of truth.

*End of TASK-IMP-012.*

## Human acceptance (2026-08-09)

Operator HITL: **"continue all of them"** — Phase 3 tranche (TASK-IMP-009…012) accepted. Status set to `done`.
