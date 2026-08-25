---
id: TASK-IMP-027
title: Brand/density/contrast axes (G3 / CDS-THEME-002)
template: task@1
type: improvement
module: improvement
status: ready_to_implement
operator_decision: C
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
findings: [CDS-THEME-002]
assessment_phase: post-5
---

# TASK-IMP-027: Brand / density / contrast axes

Promoted **2026-08-24** — operator decision **C** (density **and** contrast in one wave). Deferred from Aug-8 §10.G / Aug-23 P3.

## 1. Problem (normative intent)

Immutable axes today: **Theme × Element × Language × Style**. Evolution plan G3 asks for optional **density** (comfortable / compact) and **contrast** (standard / high) without breaking the four-axis contract or inventing a fifth product identity axis.

## 2. Acceptance criteria

- [ ] AC-1 — ADR: density/contrast as **attributes under Theme** via `data-cs-density` / `data-cs-contrast` (not a fifth identity axis)
- [ ] AC-2 — Token plan: which `--cs-*` roles gain density/contrast maps; APCA floors preserved (body Lc ≥ 75)
- [ ] AC-3 — One kit or Atomic View demo proving independent toggling (no Element/Language coupling)
- [ ] AC-4 — Gate plan: contrast-guard / light-contrast still green; docs-consistency stale-phrase checks updated; **`_audit/axis-guard.html` allowlist updated** (today it forbids `data-cs-density`)
- [ ] AC-5 — HITL for final acceptance

## 3. Locked scope (operator C — 2026-08-24)

- Ship **density and contrast together** in one implementation wave.
- ADR must define `data-cs-density` and `data-cs-contrast` as **Theme attributes**, not a fifth product identity axis.
- Implementation **must update `_audit/axis-guard.html`** — the gate currently forbids `data-cs-density`; promotion does not change the allowlist (that happens when `ship-tasks` picks this task).

## 4. Explicit non-goals

- Do not redesign Tabs or overlay manager.
- Do not ship a second Style pack under the guise of density.
- Do not weaken focus rings or 44px touch targets for “compact”.

*End of TASK-IMP-027.*
