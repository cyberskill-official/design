---
id: TASK-IMP-026
title: Locale architecture beyond EN·VI binary (G2 / CDS-I18N-001)
template: task@1
type: improvement
module: improvement
status: draft
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
---

# TASK-IMP-026: Locale architecture beyond EN·VI

Deferred from Aug-8 §10.G / Aug-23 P3. **Draft only** until the operator prioritizes a third locale or plural/region model.

## 1. Problem (normative intent)

Today Language is a hard **EN | VI** binary (component registry + template Language tweak). That blocks:

- Third locales (e.g. ja, ko) without forking the registry shape
- Plural / ICU message forms
- Region variants (vi-VN vs vi-US marketing copy) without inventing a fifth axis

## 2. Acceptance criteria (when promoted)

- [ ] AC-1 — Written ADR in `docs/decisions.md` (or `docs/decisions/locale-architecture.md`) choosing: extend Language axis vs nest locale under Language vs BCP-47 tags
- [ ] AC-2 — Registry / `makeT` contract sketched so existing EN·VI pairs keep working (migration path, no big-bang rewrite)
- [ ] AC-3 — At least one third-locale **spike** fixture (or explicit “no third locale yet — plurals only” scope) agreed by operator
- [ ] AC-4 — Gate plan: what `docs-lang-parity` / i18n builtins assert after the change
- [ ] AC-5 — HITL for final acceptance

## 3. Explicit non-goals (this draft)

- Do not invent a fourth product axis.
- Do not break Vietnamese-first default (`lang` unset → VI).
- Do not implement TipTap/Editor i18n as part of this task.

## 4. Operator decision needed

Promote to `ready_to_implement` only after choosing: **(A)** plurals/ICU on EN·VI only, **(B)** third locale spike, or **(C)** defer another quarter.

*End of TASK-IMP-026.*
