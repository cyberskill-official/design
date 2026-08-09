---
id: TASK-IMP-001
title: Archive AT/UX audit trail + record evolution-plan adoption (FIND-001/002)
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
depends_on: []
blocks:
  - TASK-IMP-002
  - TASK-IMP-003
  - TASK-IMP-004
  - TASK-IMP-005
  - TASK-IMP-008
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-001, FIND-002]
assessment_phase: 0
---

# TASK-IMP-001: Archive AT/UX audit trail + record evolution-plan adoption

## 1. Description (normative)

Close assessment FIND-001 and FIND-002 for Phases 0–2 by restoring durable audit history and making the CyberOS backlog reflect adopted work.

- 1.1 The Aug-8 UX audit plan, AT matrix, historical task stub, and archive README SHALL be reconstructable from a fresh clone under `docs/audits/ux-audit-2026-08-08/` (with `_audit/archive/ux-audit-2026-08-08/` pointer), recovered from `8646dbf^` when needed.
- 1.2 `docs/decisions.md` (+ VI) SHALL record **archive-don't-delete** and the 12-month evolution-plan adoption status (adopt / defer / supersede) citing `docs/plans/cyberskill-design-system-audit-and-12-month-evolution-plan.md`.
- 1.3 Tip re-verify of Mentions / Sortable / `wishgranted` / npm-publish soft-skip (and related Phase-1/2 findings still in scope) SHALL be recorded in the archive; remediation of those widgets is **not** this task.
- 1.4 Assessment Phases 0–2 work SHALL be indexed as `TASK-IMP-001`…`TASK-IMP-008` in `docs/tasks/BACKLOG.md` with `class: improvement` and the `depends_on` chain from the assessment plan.
- 1.5 This task MUST NOT be marked `done` by an agent — HITL at review + final acceptance.

## 2. Acceptance criteria

- [x] AC for 1.1 — archive folder contains restored UX plan, AT matrix, task stub, and README — inspect: `docs/audits/ux-audit-2026-08-08/`
- [x] AC for 1.2 — decisions §11 archive-don't-delete + §12 evolution-plan status present EN+VI — inspect: `docs/decisions.md`, `docs/vi/decisions.md`
- [x] AC for 1.3 — tip-reverify note at tip SHA with Mentions/Sortable/wishgranted/softSkip still present — inspect: `docs/audits/ux-audit-2026-08-08/tip-reverify-2026-08-09.md`
- [x] AC for 1.4 — BACKLOG lists TASK-IMP-001…008 with statuses and (improvement) tag — inspect: `docs/tasks/BACKLOG.md`
- [x] AC for 1.5 — human review + final acceptance recorded — HITL only (operator 2026-08-09)

## 3. Edge cases

- Do not restore Aug-8 files into live `docs/plans/` as active remediation — archive paths only.
- Do not invent AT pass/fail results; empty matrix slots stay pending.
- Node-gate + `npm audit` clean record (OQ-008) MAY be appended later when the environment allows; absence does not block archive restore.

## 4. Protected invariants this task must not weaken

- No Mentions / Sortable / publish / gate behavior changes in this task.
- No push, merge, or `done` without operator instruction / HITL.
- July `_audit/archive/audit-2026-07.md` convention preserved.

## 5. Implementation notes (Phase 0 execution)

- Restored bodies from `8646dbf^`.
- Evolution-plan decision: **partially superseded** near-term by assessment TASK-IMP-001…008; full 12-month materialization **deferred**; Aug-8 live remediation **superseded** as tasks (evidence in archive).
- Dependents TASK-IMP-002…005/008 are `ready_to_implement` with `depends_on: [TASK-IMP-001]`. `ship-tasks` will not pick them until this task reaches `done` via HITL; that is intentional.

*End of TASK-IMP-001.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
