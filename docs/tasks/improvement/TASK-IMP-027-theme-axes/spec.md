---
id: TASK-IMP-027
title: Brand/density/contrast axes (G3 / CDS-THEME-002)
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
findings: [CDS-THEME-002]
assessment_phase: post-5
---

# TASK-IMP-027: Brand / density / contrast axes

Deferred from Aug-8 §10.G / Aug-23 P3. **Draft only** until the operator prioritizes density or contrast axes.

## 1. Problem (normative intent)

Immutable axes today: **Theme × Element × Language × Style**. Evolution plan G3 asks for optional **density** (comfortable / compact) and **contrast** (standard / high) without breaking the four-axis contract or inventing a fifth product identity axis.

## 2. Acceptance criteria (when promoted)

- [ ] AC-1 — ADR: density/contrast as **attributes under Theme** vs new `data-cs-density` / `data-cs-contrast` vs Style-pack variants
- [ ] AC-2 — Token plan: which `--cs-*` roles gain density/contrast maps; APCA floors preserved (body Lc ≥ 75)
- [ ] AC-3 — One kit or Atomic View demo proving independent toggling (no Element/Language coupling)
- [ ] AC-4 — Gate plan: contrast-guard / light-contrast still green; docs-consistency stale-phrase checks updated
- [ ] AC-5 — HITL for final acceptance

## 3. Explicit non-goals (this draft)

- Do not redesign Tabs or overlay manager.
- Do not ship a second Style pack under the guise of density.
- Do not weaken focus rings or 44px touch targets for “compact”.

## 4. Operator decision needed

Promote to `ready_to_implement` only after choosing: **(A)** density-only, **(B)** contrast-only, **(C)** both in one wave, or **(D)** defer.

*End of TASK-IMP-027.*
