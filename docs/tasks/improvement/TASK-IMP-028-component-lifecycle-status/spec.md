---
id: TASK-IMP-028
title: Component lifecycle status field (G4 / CDS-COV-001)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-24): approved TASK-IMP-025/028/029 (HITL accept).
acceptance_verdict: approved
accepted_at: 2026-08-24T03:00:00+0000
accepted_by: "@stephencheng"
priority: p3
author: "@cursor-agent"
department: engineering
created_at: 2026-08-24T04:00:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: [CDS-COV-001]
assessment_phase: post-5
---

# TASK-IMP-028: Component lifecycle status field

## 1. Description (normative)

Add a non-breaking lifecycle status (`stable` | `preview` | `deprecated`) to component metadata (prompt frontmatter and/or `_ds_manifest` extension) without changing public React props contracts.

- 1.1 Choose one metadata surface (docs-first acceptable for v1).
- 1.2 Document how Storybook / Atomic View surfaces the status.
- 1.3 Leave HITL for final acceptance.

## 2. Acceptance criteria

- [x] AC for 1.1 — status field present for all public primaries (`components/lifecycle.json`, gated by `test-component-lifecycle`)
- [x] AC for 1.2 — consumer-visible docs updated EN·VI (`docs/conventions.md` + VI; quality-gates rows)
- [x] AC for 1.3 — human review + final acceptance — HITL only (operator 2026-08-24)

## 3. Implementation notes (2026-08-24)

- Registry: `components/lifecycle.json` — one entry per `_ds_manifest.json` export.
- Default `stable`; `Editor` is `preview` (schema HTML model; contentEditable remains).
- Surfacing v1: Conventions docs + JSON. Atomic View badge deferred (documented).
- No React prop changes.

*End of TASK-IMP-028.*

## Human acceptance (2026-08-24)

Operator instruction: **approved TASK-IMP-025/028/029** (HITL accept). Status set to `done`.
