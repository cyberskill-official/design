---
id: TASK-IMP-029
title: Editor schema-based rich text (SEC-001 / CDS-SEC-001)
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
findings: [CDS-SEC-001]
assessment_phase: post-5
---

# TASK-IMP-029: Editor schema-based rich text

## 1. Description (normative)

Containment landed 2026-08-24: `Editor` sanitizes `defaultValue`; trusted seed is opt-in via `unsafeHtml` (documented trust boundary). This wave adds a **schema allowlist** for the HTML value model. Full TipTap/ProseMirror-class replacement of contentEditable remains a future product decision (not in this task’s delivered scope).

- 1.1 Constrain the HTML value model with an allowlist of nodes/marks (`EDITOR_SCHEMA`).
- 1.2 Keep `unsafeHtml` / sanitize API stable (plus exported `sanitizeHtml` / `EDITOR_SCHEMA`).
- 1.3 Unit + docs; leave HITL for final acceptance.

## 2. Acceptance criteria

- [x] AC for 1.1 — schema allowlist ships; no raw HTML injection by default (`editor-schema.js` + sanitize on seed and emit)
- [x] AC for 1.2 — API / docs migration notes EN·VI (prompt + d.ts + Conventions lifecycle note)
- [x] AC for 1.3 — human review + final acceptance — HITL only (operator 2026-08-24)

## 3. Implementation notes (2026-08-24)

- `components/forms/editor-schema.js` — `EDITOR_SCHEMA` + `sanitizeHtml` (DOM + Node paths).
- Emitted `onChange` HTML is re-sanitized.
- Gate: `_audit/ci/test-editor-sanitize.mjs`.
- Follow-up (new task if prioritized): replace contentEditable/`execCommand` with a schema editor library.

*End of TASK-IMP-029.*

## Human acceptance (2026-08-24)

Operator instruction: **approved TASK-IMP-025/028/029** (HITL accept). Status set to `done`.
