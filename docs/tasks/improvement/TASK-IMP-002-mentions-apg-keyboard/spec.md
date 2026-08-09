---
id: TASK-IMP-002
title: Mentions APG editable-combobox keyboard (FIND-012)
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
findings: [FIND-012]
assessment_phase: 1
---

# TASK-IMP-002: Mentions APG editable-combobox keyboard

## 1. Description (normative)

Close FIND-012: the Mentions suggestion listbox is keyboard-inoperable at tip (`onMouseDown` only).

- 1.1 Implement the APG editable-combobox pattern over the existing listbox: track `activeIndex`; set `aria-activedescendant` on the textarea; stable option `id`s.
- 1.2 ArrowUp/Down navigate; Enter → existing `pick()`; Escape closes; mouse path remains (`onClick`/`onMouseDown` with focus retention).
- 1.3 Propagate `.d.ts` / `.prompt.md` / Atomic View / behavior harness per Expansion Rule.
- 1.4 Hard keyboard fixture MAY land with TASK-IMP-006; a stub fixture is acceptable here if 006 follows immediately.

## 2. Acceptance criteria

- [x] AC for 1.1–1.2 — keyboard-only open → arrow → select a mention — demo + fixture (or stub linked to 006) — behavior: `Mentions — keyboard arrow + Enter picks` / Escape; Playwright keyboard fixture deferred to TASK-IMP-006
- [x] AC for 1.3 — specimen/docs/Atomic View/behavior coverage updated — Expansion Rule checklist
- [x] AC for 1.4 — no regression of mouse pick path — behavior harness (`Mentions — type @ filters suggestions` still green)

## 3. Edge cases

- Empty hits / closed popup: no activedescendant; arrows no-op or reopen per APG choice documented in § notes.
- IME composition: do not steal keys during composition.

## 4. Protected invariants this task must not weaken

- Do not remove the listbox role or break existing `pick()` consumers.
- Sortable / publish / gates out of scope.

*End of TASK-IMP-002.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
