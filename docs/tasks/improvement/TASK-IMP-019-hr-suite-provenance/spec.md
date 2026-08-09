---
id: TASK-IMP-019
title: HR-suite validation provenance or soften claim (FIND-022)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 4–5 tranche ("accept all, continue").
acceptance_verdict: approved
accepted_at: 2026-08-09T12:22:00+07:00
accepted_by: "@stephencheng"
priority: p1
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T05:30:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-022]
assessment_phase: 5
---

# TASK-IMP-019: HR-suite validation provenance

## 1. Description (normative)

Close FIND-022.

- 1.1 Either add in-repo provenance for the "lawyer-/counsel-validated" HR-suite claim (dated decision / audit note with source + scope), **or** soften README/SKILL/docs wording so the claim matches what the tree can substantiate (client-supplied instruments; counsel review still required before real use).
- 1.2 Apply Expansion Rule: every surface that repeats the claim (README, SKILL, VI mirrors if present) stays consistent.
- 1.3 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — provenance file **or** softened claim — decisions/audits + README
- [x] AC for 1.2 — no divergent "lawyer-validated" overclaim — grep README/SKILL/docs
- [x] AC for 1.3 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Do not invent counsel names/dates without evidence; prefer soften if provenance is unavailable.

## 4. Protected invariants

- Claims-need-provenance (decisions §12) stays in force.

## 5. Implementation notes (Aug 2026)

Softened lawyer-/counsel-validated overclaims to client-supplied + counsel-review reminder (README/SKILL); no invented provenance.

*End of TASK-IMP-019.*

## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.

