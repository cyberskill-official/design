---
id: TASK-IMP-025
title: Container-query layout migration (G1 / CDS-RESP-001)
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
findings: [CDS-RESP-001]
assessment_phase: post-5
---

# TASK-IMP-025: Container-query layout migration

## 1. Description (normative)

Extend the `.cs-cq` compatibility layer beyond the 2026-08-24 kit host opt-in (website `.container`, status-hub `.wrap`) to card grids, Status Hub lenses, and template layouts per `docs/decisions/container-query-migration.md`.

- 1.1 Migrate remaining kit grids to `@container cs` where parent width differs from viewport.
- 1.2 Keep `@media` as fallback; no 320 / zoom regressions.
- 1.3 Leave HITL for final acceptance.

## 2. Acceptance criteria

- [x] AC for 1.1 — kit + hub layouts use CQ where beneficial (website home/work; status-hub deck/lenses/settings/project; helpers `.cs-cq-cols-*`)
- [x] AC for 1.2 — overflow-320 + zoom-text-spacing green (`npm run test:audit-probe`)
- [x] AC for 1.3 — human review + final acceptance — HITL only (operator 2026-08-24)

## 3. Implementation notes (2026-08-24)

- `base/responsive.css`: `.cs-cq-cols-{2,3,4}`, `.cs-cq-hide-narrow` at md/sm container stops.
- Kit CSS: `@container cs` mirrors beside existing `@media` (website `site.css`, status-hub `status.css`, work/settings/project pages).
- Project detail `.pd` is a local CQ host (not under `.wrap`).
- Media-only exceptions documented in the decision file (nav chrome, canvas desk).

*End of TASK-IMP-025.*

## Human acceptance (2026-08-24)

Operator instruction: **approved TASK-IMP-025/028/029** (HITL accept). Status set to `done`.
