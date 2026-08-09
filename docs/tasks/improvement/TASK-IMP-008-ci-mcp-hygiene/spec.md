---
id: TASK-IMP-008
title: Re-gate token auto-commit + resolve .mcp.json (FIND-021/024)
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
findings: [FIND-021, FIND-024]
assessment_phase: 2
---

# TASK-IMP-008: Re-gate token auto-commit + resolve .mcp.json

## 1. Description (normative)

Close FIND-021 and FIND-024.

- 1.1 Prefer: remove `[skip ci]` from `regenerate-tokens-push` **or** drop auto-push and rely on PR fail-closed regen (assessment preference: PR-required freshness). Document the chosen policy in `docs/ci-cd.md` / decisions if needed.
- 1.2 Confirm branch protection out-of-band (NV-18.1) — document observed state; do not invent GitHub settings.
- 1.3 Resolve tracked `.mcp.json` dangling `.cyberos/` MCP ref via gitignore-safe local override or a tracked stub that does not point at a missing vendored path.

## 2. Acceptance criteria

- [x] AC for 1.1 — tip either has no `[skip ci]` on regen push, or auto-push removed with PR freshness path documented — workflow + docs
- [x] AC for 1.2 — NV-18.1 note recorded (observed / unknown) — task notes or ci-cd.md
- [x] AC for 1.3 — `.mcp.json` no longer references a broken required path for fresh clones — inspect + optional soft-skip docs

## 3. Edge cases

- Local operators may still need a private MCP override — prefer untracked / example file over a broken tracked command.
- Do not disable regenerate-tokens PR fail-closed check while changing the push job.

## 4. Protected invariants this task must not weaken

- No Mentions / Sortable / publish classifier changes here (owned by 002/003/005).
- Never push/merge without operator instruction.

## 5. Implementation notes (Aug 2026)

- **FIND-021 policy chosen:** safer minimal change — remove `[skip ci]` from `regenerate-tokens-push` so auto-pushed tips re-enter the gate board. PR twin stays fail-closed (contributor freshness path). Documented in `docs/ci-cd.md` (+ VI) and `docs/decisions.md` §5.
- **NV-18.1:** recorded as **unknown / confirm out-of-band** under `docs/ci-cd.md` Branch protection — no invented GitHub Settings values.
- **FIND-024:** tracked `.mcp.json` → `scripts/mcp/cyberos-mcp.mjs` stub; forwards when `.cyberos/` present after install; clean exit on fresh clone. Shape mirrored in `.mcp.json.example`; CONTRIBUTING documents the contract.

*End of TASK-IMP-008.*

## Human acceptance (2026-08-09)

Operator HITL: **"i accept all, continue"** — Phases 0–2 tranche (TASK-IMP-001…008) accepted. Status set to `done`.
