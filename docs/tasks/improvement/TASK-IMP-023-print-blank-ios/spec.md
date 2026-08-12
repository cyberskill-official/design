---
id: TASK-IMP-023
title: Fix blank iOS/Safari print preview for document templates
template: task@1
type: improvement
module: improvement
status: ready_to_review
priority: p1
author: "@cursor-agent"
department: engineering
created_at: 2026-08-12T21:10:21+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: [TASK-IMP-022]
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: []
assessment_phase: post-5
---

# TASK-IMP-023: Blank print preview on iOS/Safari

## 1. Description (normative)

After TASK-IMP-022 export landing, operator print preview (iOS Options → PDF) shows a blank white page (Page 1 of 1) while on-screen content is present. Chromium `page.pdf` CI still passes — this is a print-layout / iframe capture bug, not missing content.

- 1.1 Strengthen `@media print` so `html` / `body` / `#dc-root` / `.sc-host` use `height: auto !important` and `overflow: visible !important` (FULL_PAGE_CSS `height:100%` must not clip the sheet in Safari print).
- 1.2 PDF toolbar action: when running inside an iframe (Storybook), open the same document URL top-level and print from there so iOS Safari does not capture an empty iframe viewport; fall back to `window.print()`.
- 1.3 Extend `test-doc-export` to assert print-media computed heights are unconstrained; keep support-runtime identity + no-eval gates green.
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — print CSS unlocks height/overflow on root chain — vendor support.js + sync (85 copies)
- [x] AC for 1.2 — PDF button uses top-level print when framed — `printPdf()` in doc-export.js
- [x] AC for 1.3 — `test-doc-export` asserts print height auto; 62/62 green — CI
- [ ] AC for 1.4 — human review + final acceptance — HITL only

## 3. Edge cases

- Popup blockers: fall back to in-frame `window.print()` if `window.open` fails.
- Do not reintroduce `unsafe-eval`.
- Decks stay PPTX; this task only touches print-doc path / shared DC print baseline.

## 4. Protected invariants

- `templates/*/support.js` remain byte-identical.
- Site CSP unchanged.

## 5. Implementation notes (Aug 2026)

- Root cause: `FULL_PAGE_CSS` (`html,body,#dc-root,.sc-host{height:100%}`) left the print root at viewport height; Safari/iOS print clipped to that box (often blank), especially from Storybook iframes.
- Fix: print baseline unlocks the root chain; export chrome duplicates the rule; PDF click prefers `window.open(location.href)` + print when framed.

*End of TASK-IMP-023.*
