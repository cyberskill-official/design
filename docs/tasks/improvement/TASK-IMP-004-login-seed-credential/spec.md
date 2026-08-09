---
id: TASK-IMP-004
title: Clear Status Hub login seed credential (FIND-011)
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
depends_on: [TASK-IMP-001]
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-011]
assessment_phase: 1
---

# TASK-IMP-004: Clear Status Hub login seed credential

## 1. Description (normative)

Close FIND-011: Status Hub login ships a seed password and Remember-me default.

- 1.1 Clear `value="wishgranted"` from `ui_kits/status-hub/login.html` password field.
- 1.2 Uncheck Remember me by default (remove `checked` on that switch).
- 1.3 Sweep twin auth patterns/templates that copy the same seed string.

## 2. Acceptance criteria

- [x] AC for 1.1–1.2 — login.html has empty password value and Remember me unchecked — grep + inspect
- [x] AC for 1.3 — repo grep for `wishgranted` is clean (or only archive/docs historical cites) — grep (only TASK/audit historical cites remain; `templates/auth` already opt-in)

## 3. Edge cases

- Placeholder dots (`••••••••`) may remain; do not put a real or demo password in `value`.
- Auth template i18n strings for “Remember me” stay; only default checked state / seed value change.

## 4. Protected invariants this task must not weaken

- No Mentions / Sortable / publish behavior in this task.
- Do not invent full auth error-state flows (FLOW-013 deferred).

*End of TASK-IMP-004.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
