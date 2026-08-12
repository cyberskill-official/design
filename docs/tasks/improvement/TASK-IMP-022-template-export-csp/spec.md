---
id: TASK-IMP-022
title: CSP-safe DC runtime + PDF/DOCX export + HR DOCX source audit
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-12): "I accept, go" after #81/#82/#84 on main.
acceptance_verdict: approved
accepted_at: 2026-08-12T20:54:00+0000
accepted_by: "@stephencheng"
priority: p1
author: "@cursor-agent"
department: engineering
created_at: 2026-08-12T18:38:19+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: []
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: []
assessment_phase: post-5
---

# TASK-IMP-022: Template CSP fix, PDF/DOCX export, source audit

## 1. Description (normative)

Restore Design Component logic under the site CSP (no `unsafe-eval`), add in-iframe PDF + editable DOCX export for print documents, and audit zip-mapped HR instruments against original Word sources.

- 1.1 Replace both `new Function` sites in the DC runtime (`evalDcLogic` + x-import JSX loader) with synchronous inline `<script>` evaluation; introduce canonical `templates/_vendor/support.js` + `scripts/sync-support-runtime.mjs`; keep `vercel.json` CSP unchanged.
- 1.2 Add print-stripped PDF (`window.print` / Playwright `page.pdf`) + editable OOXML DOCX toolbar for every `omelette-owns-print` / `@page` document; decks stay PPTX; no CDN.
- 1.3 Diff every Templates.zip-mapped instrument (+ framework agreement outside zip) against source DOCX text; fix DC content gaps; commit plain-text fixtures under `_audit/fixtures/hr-suite-docx-text/`; update `docs/hr-suite-sources.md` EN+VI sync status.
- 1.4 Wire unit tests (`test-support-no-eval`, `test-doc-export`, `test-docx-source-parity`); expand `print-smoke` to all print docs; Expansion Rule docs (conventions EN·VI, SKILL, quality-gates EN·VI, `_audit/README`).
- 1.5 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — no `new Function`/`eval(` in any `templates/*/support.js`; identity gate still one hash — unit + support-runtime-identity
- [x] AC for 1.2 — every print template loads without EvalError; PDF `%PDF` + A4/Letter; DOCX ZIP + `word/document.xml`; toolbar present — `test-doc-export.mjs`
- [x] AC for 1.3 — DC text parity vs committed fixtures for every mapped instrument — `test-docx-source-parity.mjs`
- [x] AC for 1.4 — `npm run test:unit` includes new scripts; docs/gates updated — inspect
- [x] AC for 1.5 — human review + final acceptance — HITL only (operator 2026-08-12)

## 3. Edge cases

- Do **not** reintroduce site-wide `unsafe-eval`.
- Do **not** commit `.docx` / `.pdf` binaries or `Templates.zip`.
- Word may reflow page breaks; PDF remains the pagination-faithful artifact.
- Framework agreement source is outside Templates.zip (Downloads / scraps adapted path).

## 4. Protected invariants

- CSP remains `script-src 'self' 'unsafe-inline'` (no eval).
- `support.js` copies stay byte-identical across all templates.
- Decks continue to use PPTX; documents use PDF + DOCX.

## 5. Implementation notes (Aug 2026)

- Inline classic `<script>` replaces both Function-constructor sites; sync via `scripts/sync-support-runtime.mjs`.
- Export chrome: `templates/_vendor/doc-export.js` (CompressionStream ZIP OOXML) loaded from `ds-base.js` when `omelette-owns-print` is present.
- 41 HR fixtures + `test-docx-source-parity` (≥85%); 62/62 print templates pass `test-doc-export` under site CSP.
- Landed via #81 (HR fixtures), #82 (CSP runtime), #84 (PDF/DOCX export; #83 had stacked onto the CSP branch and missed `main`).
- Framework agreement sample artifacts (local only): `.tmp-doc-export/VnFrameworkAgreement.{pdf,docx}` (4 PDF pages).

*End of TASK-IMP-022.*

## Human acceptance (2026-08-12)

Operator instruction after #84 merged: **"I accept, go"** — review + final acceptance approved. Status set to `done`.
Acceptance smoke (agent): `test-support-no-eval` 85/85, `test-docx-source-parity` 41/41, `test-doc-export` 62/62 on `main` @ 1.6.0.
