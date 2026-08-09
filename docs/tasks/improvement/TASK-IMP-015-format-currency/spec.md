---
id: TASK-IMP-015
title: Language-independent formatCurrency (FIND-025)
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
findings: [FIND-025]
assessment_phase: 4
---

# TASK-IMP-015: Language-independent formatCurrency

## 1. Description (normative)

Close FIND-025.

- 1.1 `formatCurrency(amount, { currency, locale } | lang)` SHALL use `Intl.NumberFormat` with `style: 'currency'`; currency MUST NOT be forced by language alone when an explicit currency is provided.
- 1.2 Backward-compatible defaults: when called as `formatCurrency(n, lang)` with a string lang, preserve prior EN→USD / VI→VND presentation.
- 1.3 Finance templates (`finance-invoice`, `finance-quote`, `finance-expense-report`, `finance-dunning-email`) SHALL state transaction currency independently of Language (label/code or helper), so EN+VND and VI+USD are expressible.
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — VND in EN / USD in VI via options — unit test
- [x] AC for 1.2 — string-lang call shape unchanged in output — unit test
- [x] AC for 1.3 — finance templates declare currency ≠ language — inspect templates
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Null/NaN amounts still return `""`.
- Bundle regeneration must pick up i18n.js changes.

## 4. Protected invariants

- Bilingual EN·VI finance draft banners unchanged.

## 5. Implementation notes (Aug 2026)

`formatCurrency(amount, {currency, locale})` via Intl; legacy string-lang unchanged; finance templates declare VND transaction currency; `test-format-currency`.

*End of TASK-IMP-015.*

## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.

