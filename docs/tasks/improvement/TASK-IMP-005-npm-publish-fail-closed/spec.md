---
id: TASK-IMP-005
title: npm-publish fail on 403/EOTP + registry presence (FIND-020)
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
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-020]
assessment_phase: 1
---

# TASK-IMP-005: npm-publish fail on 403/EOTP + registry presence

## 1. Description (normative)

Close FIND-020: real publish denials currently soft-skip (`process.exit(0)`).

- 1.1 Split soft-skip: keep exit 0 for expected no-ops (`missing_secrets`, already-published / fork cases).
- 1.2 **Fail** (non-zero) on 403 and EOTP (and similar hard auth/permission denials when a publish was attempted).
- 1.3 After a claimed successful publish, verify registry presence via `npm view @cyberskill/design@VERSION`.
- 1.4 Add unit/fixture coverage for the classifier if a publish-runner test pattern exists (extend `_audit/ci/test-code-connect.mjs`-style asserts or a dedicated test).

## 2. Acceptance criteria

- [x] AC for 1.1 — missing_secrets / already-published still soft-skip exit 0 — unit cases
- [x] AC for 1.2 — 403 and EOTP fail closed — unit cases
- [x] AC for 1.3 — successful path runs post-publish `npm view` check — code + dry-run docs
- [x] AC for 1.4 — classifier tests land in CI-visible path — `_audit/ci/`

## 3. Edge cases

- Local non-OIDC without secrets remains soft-skip (not a silent failed publish).
- EPUBLISHCONFLICT / already-published: keep soft-skip (honest report + exit 0); 403/EOTP are hard-fail.

## 4. Protected invariants this task must not weaken

- Trusted Publishing OIDC path remains the only CI auth mode; do not reintroduce classic long-lived tokens.
- Update `docs/decisions.md` §7 soft-skip wording if it still claims soft-skip on 403/EOTP after this change.

*End of TASK-IMP-005.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
