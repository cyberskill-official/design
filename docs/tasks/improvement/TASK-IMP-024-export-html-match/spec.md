---
id: TASK-IMP-024
title: HTML-faithful PDF/DOCX download + drop counsel banner
template: task@1
type: improvement
module: improvement
status: ready_to_review
priority: p1
author: "@cursor-agent"
department: engineering
created_at: 2026-08-13T02:10:00+0000
ai_authorship: assisted
eu_ai_act_risk_class: not_ai
client_visible: false
depends_on: [TASK-IMP-023]
blocks: []
routed_back_count: 0
awh: N/A
class: improvement
findings: []
assessment_phase: post-5
---

# TASK-IMP-024: HTML-faithful PDF/DOCX download + drop counsel banner

## 1. Description (normative)

Operator preview of the framework agreement still shows a counsel-review warning banner, and downloaded PDF/DOCX attachments do not match the on-screen HTML. Two separate export buttons are the wrong control: one Download control with a PDF | DOCX menu.

- 1.1 Remove the on-sheet counsel-review banner from `templates/vn-framework-agreement` (the quoted bilingual warning). Keep catalog ⚠ / docs counsel notes that are not that banner. Update the HR fixture so source-parity stays honest.
- 1.2 Downloaded PDF and DOCX must be generated from the live `.cs-sheet` so they match the HTML preview: same visible text, tables, bilingual runs, lockup. PDF prefers a sheet-clone print / raster of the rendered sheet (not Storybook `location.href`); DOCX walks the same sheet without duplicating the lockup into the Word header and without smashing adjacent runs.
- 1.3 Replace the two toolbar buttons with one **Tải / Download** control that opens a menu of **PDF** and **DOCX**. Print chrome stays hidden. No CDN. CSP unchanged.
- 1.4 Extend `test-doc-export` for the single download menu + framework banner absence + DOCX↔sheet text overlap; keep no-eval / source-parity green.
- 1.5 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — framework HTML (and its DOCX export) do not contain the quoted counsel banner
- [x] AC for 1.2 — PDF/DOCX built from `.cs-sheet`; DOCX keeps tables + VN diacritics; PDF still `%PDF` + A4/Letter
- [x] AC for 1.3 — one Download trigger + PDF/DOCX menu; old dual buttons gone
- [x] AC for 1.4 — `test-doc-export` + `test-docx-source-parity` green
- [ ] AC for 1.5 — human review + final acceptance — HITL only

## 3. Edge cases

- Raster PDF may fail on Safari foreignObject — fall back to printing a same-origin sheet clone (not the Storybook URL).
- iOS iframe `a.download` is weak — prefer `navigator.share({ files })` then blob download.
- Word still reflows page breaks; PDF is the pagination-faithful artifact. DOCX must not lose sheet text.
- Do not reintroduce `unsafe-eval`. Do not commit Word/PDF binaries.
- Do not remove counsel notes on other instruments (contractor, compensation) unless they are the quoted banner.

## 4. Protected invariants

- Site CSP unchanged (`script-src 'self' 'unsafe-inline'`).
- `templates/*/support.js` remain byte-identical.
- Decks stay PPTX.

## 5. Implementation notes (Aug 2026)

- Banner lived only on `VnFrameworkAgreement.dc.html` (plus the fixture phrase).
- Prior PDF path opened `location.href` (Storybook iframe / blank capture) and print CSS zeroed sheet padding, so the attachment did not look like the HTML card.
- PDF download now paints the live `.cs-sheet` to canvas (boxes + text + inline SVG) as **one Flate DeviceRGB page** (scale 3) whose MediaBox matches the card aspect. JPEG DCTDecode at scale 2 looked soft. A4 slicing cut tables mid-row and stretched the leftover slice (squashed last page). SVG `foreignObject` taints canvas and is not used. Print of a same-origin sheet clone remains the fallback.
- DOCX: Word header/footer stay empty (sheet already has lockup + footer); yellow `--cs-doc-fill` blanks become highlight; `colspan` becomes `w:gridSpan`. Header flex (logo + lockup + number) is a two-cell table so phrasing after the logo DIV is not dropped; measured `w:sz` / color follow the sheet.
- Prior DOCX dumped the first child into the Word header *and* the body, flattened nested cell labels, and dropped whitespace-only text nodes.

*End of TASK-IMP-024.*
