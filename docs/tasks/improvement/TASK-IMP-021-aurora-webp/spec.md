---
id: TASK-IMP-021
title: Convert elemental aurora washes PNG→WebP (FIND-016)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): "1. yes" in clearance Q&A.
acceptance_verdict: approved
accepted_at: 2026-08-09T12:48:00+07:00
accepted_by: "@stephencheng"
priority: p2
author: "@cursor-agent"
department: engineering
created_at: 2026-08-09T05:45:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [FIND-016]
assessment_phase: post-5
---

# TASK-IMP-021: Convert elemental aurora washes to WebP

## 1. Description (normative)

Close FIND-016 (deferred from Phase 4 asset-budget gate): serve elemental aurora washes as optimized WebP instead of ~1.5 MB PNGs.

- 1.1 Commit `assets/aurora-{hoa,thuy,moc,kim}.webp` at ≤300 KB each (visual parity with prior PNGs).
- 1.2 Update `.cs-aurora-wash` element rules (generator + `tokens/elements.css` + flattened `dist/styles.min.css`) to reference WebP; remove legacy PNGs from `assets/`.
- 1.3 Retarget asset-weight budget (browser + Node twin) to WebP ceilings and fail on legacy aurora PNGs.
- 1.4 Propagate Expansion Rule surfaces (README/SKILL, quality-gates EN·VI, `_audit` index/README, guidelines specimen).
- 1.5 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — four WebPs present under 300 KB — `ls assets/aurora-*.webp`
- [x] AC for 1.2 — CSS + packs point at WebP; PNGs gone — `tokens:elements` / `build:styles`
- [x] AC for 1.3 — budget gate + `test-docs-consistency` enforce WebP ceilings — unit test
- [x] AC for 1.4 — docs/guidelines/audit prose updated — inspect
- [x] AC for 1.5 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- `aurora-gold.jpg` (Thổ) stays JPEG; not in scope.
- Do not claim Lighthouse/CWV on live without OQ-002 evidence.

## 4. Protected invariants

- Element wash class remains `.cs-aurora-wash`; axis inheritance unchanged.

## 5. Implementation notes (Aug 2026)

`cwebp -q 90` → ~11–12 KB each (~45 KB set). Budget ceilings lowered to 300 KB / 1.2 MB. Legacy PNGs deleted from `assets/`.

*End of TASK-IMP-021.*

## Human acceptance (2026-08-09)

Operator HITL clearance Q&A item 1: **yes** — TASK-IMP-021 accepted. Status set to `done`.
