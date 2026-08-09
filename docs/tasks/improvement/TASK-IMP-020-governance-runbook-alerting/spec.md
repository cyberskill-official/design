---
id: TASK-IMP-020
title: Product↔CyberOS boundary, release runbook, schedule alerting
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 4–5 tranche ("accept all, continue").
acceptance_verdict: approved
accepted_at: 2026-08-09T12:22:00+07:00
accepted_by: "@stephencheng"
priority: p2
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
findings: [AREA-28, AREA-21, AREA-23, AREA-27]
assessment_phase: 5
---

# TASK-IMP-020: Boundary note + release runbook + schedule alerting

## 1. Description (normative)

Close Phase 5 polish items from areas 21/23/27/28.

- 1.1 Add an explicit product-vs-CyberOS boundary note (what ships as `@cyberskill/design` vs orchestration under `.cyberos/`).
- 1.2 Consolidate one authoritative release runbook (trigger → version → tag → npm OIDC publish → Vercel; success signals; recovery).
- 1.3 Add scheduled-job failure alerting as feasible in-repo (workflow `concurrency`/failure notification step, docs for GitHub Actions email/Slack, or `on: failure` notice job for the nightly cron).
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — boundary note in docs — docs/decisions or docs/products + AGENTS pointer
- [x] AC for 1.2 — single release runbook page — docs/release-runbook.md (+ index links)
- [x] AC for 1.3 — nightly failure surfaces to operators — workflow and/or docs
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Do not require external Slack secrets; document the GitHub-native path if secrets are absent.
- Never push/merge/deploy in this task.

## 4. Protected invariants

- CyberOS HITL gates unchanged; no auto-done.

## 5. Implementation notes (Aug 2026)

`docs/decisions.md` §13 boundary; `docs/release-runbook.md`; nightly `notify-schedule-failure` job + docs.

*End of TASK-IMP-020.*

## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.

