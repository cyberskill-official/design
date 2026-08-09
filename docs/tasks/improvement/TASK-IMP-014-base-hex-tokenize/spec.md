---
id: TASK-IMP-014
title: Replace theme-following raw hex in base CSS with tokens (FIND-010)
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
findings: [FIND-010]
assessment_phase: 4
---

# TASK-IMP-014: Tokenize theme-following base CSS hex

## 1. Description (normative)

Close FIND-010 rule-by-rule.

- 1.1 Replace theme-/element-following raw hex in `base/*.css` with matching `--cs-color-*` (or role) tokens.
- 1.2 Keep an allowlist for genuine `color-mix` anchors and documented focus-ring fallbacks.
- 1.3 Add a Node gate (or docs-consistency extension) that fails on non-allowlisted bare hex in `base/`.
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — theme-following literals tokenized — inspect base CSS
- [x] AC for 1.2 — allowlist documented for color-mix / ring fallbacks — gate allowlist + comment
- [x] AC for 1.3 — gate enforces allowlist — unit test green
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Dark-only system-theme twins may keep literals only when no token exists; prefer token overrides.
- Do not break glass liquid-glass mixes that require fixed anchors.

## 4. Protected invariants

- Mid-tone `-accent` text-on-fill ban unchanged.
- Contrast-guard / APCA floors stay green.

## 5. Implementation notes (Aug 2026)

Tokenized theme-following surfaces (panel, info-fg); code/terminal chrome → local custom props; on-brand `#fff` allowlisted; `test-base-hex-allowlist` gate.

*End of TASK-IMP-014.*

## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.

