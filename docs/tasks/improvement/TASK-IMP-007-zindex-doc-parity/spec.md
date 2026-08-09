---
id: TASK-IMP-007
title: Fix z-index fallbacks + doc one-liners (FIND-008/003/005/009)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phases 0–2 tranche.
acceptance_verdict: approved
accepted_at: 2026-08-09T11:45:00+07:00
accepted_by: "@stephencheng"
priority: p1
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T04:00:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: [TASK-IMP-006]
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-008, FIND-003, FIND-005, FIND-009]
assessment_phase: 2
---

# TASK-IMP-007: Fix z-index fallbacks + doc one-liners

## 1. Description (normative)

Land remaining doc/token parity fixes once TASK-IMP-006 gates exist (or fold into 006 if cheaper once gates land).

- 1.1 Fix z-index fallbacks in base CSS to match `tokens/elevation.css` (FIND-008).
- 1.2 Apply README/SKILL/docs one-liners for FIND-003 / FIND-005 / FIND-009 so the new docs-consistency assertions stay green (role count incl. `on-strong`, depth tiers, default lang).
- 1.3 Prefer landing inside TASK-IMP-006 when the gate PR already touches the same files; otherwise keep this task as the dedicated follow-up.

## 2. Acceptance criteria

- [x] AC for 1.1 — elevation fallbacks match token contract — `base/controls.css` + docs-consistency/token-contract assertions
- [x] AC for 1.2 — FIND-003/005/009 doc contradictions gone — README (10 roles + full depth), SKILL/consuming default `vi`
- [x] AC for 1.3 — no duplicate conflicting edits vs 006 — landed together with TASK-IMP-006 gate PR

## 3. Edge cases

- If 006 already closed these items, mark overlapping ACs satisfied with evidence pointers and shrink scope — do not re-litigate.

## 4. Protected invariants this task must not weaken

- Do not invent new elevation layers without Expansion Rule.
- Mid-tone `-accent` text-on-fill ban unchanged.

*End of TASK-IMP-007.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
