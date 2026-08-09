---
id: TASK-IMP-011
title: Auth pattern error/loading/invalid variants (FLOW-013 / NV-9.2)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 3 tranche ("continue all").
acceptance_verdict: approved
accepted_at: 2026-08-09T11:55:00+07:00
accepted_by: "@stephencheng"
priority: p1
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
findings: [FLOW-013, NV-9.2]
assessment_phase: 3
---

# TASK-IMP-011: Auth pattern error/loading/invalid variants

## 1. Description (normative)

Close FLOW-013 / NV-9.2: the copyable auth pattern is happy-path-only.

- 1.1 `templates/auth/Auth.dc.html` SHALL expose a `formState` (or equivalent) tweak: `default` | `loading` | `error` | `invalid` with production-honest UI (loading CTA, error alert, invalid field messaging) EN·VI.
- 1.2 `ui_kits/status-hub/login.html` SHALL demonstrate the same state variants (tweak control or clearly labeled demo states) so kit consumers can copy non-happy paths.
- 1.3 Related guideline/kit card copy updated if it claims happy-path-only completeness.
- 1.4 This task MUST NOT be marked `done` without HITL.

## 2. Acceptance criteria

- [x] AC for 1.1 — Auth template enum switches all four states — inspect + Storybook/template render
- [x] AC for 1.2 — Status Hub login shows error/loading/invalid — inspect `login.html`
- [x] AC for 1.3 — no stale "happy path only" claim left in touched docs
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Remember-me stays default-off (FIND-011).
- Invalid state uses field `aria-invalid` / error text; error state uses a status/alert live region.

## 4. Protected invariants this task must not weaken

- No seed password values; bilingual EN·VI for template strings.

*End of TASK-IMP-011.*

## Human acceptance (2026-08-09)

Operator HITL: **"continue all of them"** — Phase 3 tranche (TASK-IMP-009…012) accepted. Status set to `done`.
