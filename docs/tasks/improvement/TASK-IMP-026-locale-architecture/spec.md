---
id: TASK-IMP-026
title: Locale architecture beyond EN·VI binary (G2 / CDS-I18N-001)
template: task@1
type: improvement
module: improvement
status: reviewing
operator_decision: B
promoted_at: 2026-08-24
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
findings: [CDS-I18N-001]
assessment_phase: post-5
new_files:
  - docs/decisions/locale-architecture.md
  - _audit/ci/test-locale-ja-spike.mjs
modified_files:
  - components/_i18n/i18n.js
  - components/_i18n/strings.js
  - _audit/bilingual-parity.html
  - docs/decisions.md
  - docs/vi/decisions.md
  - docs/conventions.md
  - docs/vi/conventions.md
  - docs/quality-gates.md
  - docs/vi/quality-gates.md
  - .storybook/preview.jsx
  - guidelines/atomic-view.html
  - package.json
---

# TASK-IMP-026: Locale architecture beyond EN·VI

Promoted **2026-08-24** — operator decision **B** (third-locale spike). Deferred from Aug-8 §10.G / Aug-23 P3.

## 1. Problem (normative intent)

Today Language is a hard **EN | VI** binary (component registry + template Language tweak). That blocks:

- Third locales (e.g. ja, ko) without forking the registry shape
- Plural / ICU message forms
- Region variants (vi-VN vs vi-US marketing copy) without inventing a fifth axis

## 2. Acceptance criteria

- [x] AC-1 — Written ADR in `docs/decisions.md` (or `docs/decisions/locale-architecture.md`) choosing: extend Language axis vs nest locale under Language vs BCP-47 tags
- [x] AC-2 — Registry / `makeT` contract sketched so existing EN·VI pairs keep working (migration path, no big-bang rewrite)
- [x] AC-3 — Third-locale **spike** fixture proving registry shape beyond EN·VI (recommend **ja** — distinct script, low collision with EN/VI)
- [x] AC-4 — Gate plan: what `docs-lang-parity` / i18n builtins assert after the change
- [ ] AC-5 — HITL for final acceptance

## 3. Locked scope (operator B — 2026-08-24)

- Spike locale: **Japanese (`ja`)** as the third-locale proof — distinct script, minimal collision with EN/VI string keys.
- ADR (AC-1) **required at implementation start** before code lands.
- Extend `components/_i18n/i18n.js` / `strings.js` registry shape; do **not** break Vietnamese-first default (`lang` unset → VI).
- Plural/ICU-only scope and region variants remain follow-on unless folded into the spike ADR.

## 4. Implementation notes (2026-08-25)

- ADR: `docs/decisions/locale-architecture.md` + decisions §14 (EN·VI).
- `primaryLang` / `resolveLang` use BCP-47 primary subtags; default still `vi`.
- Spike `ja` tables on Pagination, Breadcrumb, SearchField, Dialog; bilingual-parity requires optional locales match `en` keys.
- Unit gate: `_audit/ci/test-locale-ja-spike.mjs` (wired into `npm run test:unit`).
- Storybook + Atomic View Language toolbar expose `ja` spike.

## 5. Explicit non-goals

- Do not invent a fourth product axis.
- Do not break Vietnamese-first default (`lang` unset → VI).
- Do not implement TipTap/Editor i18n as part of this task.

*End of TASK-IMP-026.*
