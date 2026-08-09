---
id: TASK-IMP-013
title: Converge responsive CSS breakpoints on token scale (FIND-007)
template: task@1
type: improvement
module: improvement
status: done
# Human acceptance (operator 2026-08-09): review + final acceptance approved for Phase 4–5 tranche ("accept all, continue").
acceptance_verdict: approved
accepted_at: 2026-08-09T12:22:00+07:00
accepted_by: "@stephencheng"
priority: p1
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
findings: [FIND-007]
assessment_phase: 4
---

# TASK-IMP-013: Converge responsive breakpoints on token scale

## 1. Description (normative)

Close FIND-007.

- 1.1 Every `max-width` / `min-width` pixel stop in `base/**/*.css` (and `@container` max-width used as a breakpoint) SHALL be drawn from the sanctioned breakpoint set in `tokens/spacing.css` / `tokens.json`, plus any explicitly documented extension tokens (e.g. phone `360px` for the 320 reflow band).
- 1.2 Collapse near-duplicate ad-hoc stops (600/620 → one token stop; 760→md; 900→md or lg; 1120→xl) so responsive behavior matches `guidelines/spacing-breakpoints.html`.
- 1.3 Extend `docs-consistency` (Node + browser) to fail on any off-scale `@media`/`@container` width in `base/`.
- 1.4 Leave HITL for final acceptance — land at `ready_to_review`.

## 2. Acceptance criteria

- [x] AC for 1.1 — media/container widths ⊆ sanctioned set — inspect `base/**` + tokens
- [x] AC for 1.2 — near-duplicates gone; guideline matches — `spacing-breakpoints.html` + responsive.css
- [x] AC for 1.3 — gate fails on invented widths — `test:docs-consistency` / docs-consistency.html
- [x] AC for 1.4 — human review + final acceptance — HITL only (operator 2026-08-09)

## 3. Edge cases

- Preference queries (`prefers-*`, `pointer`, `print`, `forced-colors`) are not width stops — leave untouched.
- Justified phone stop (360) must be a named token if retained.

## 4. Protected invariants

- Do not weaken 320px reflow (UX-003) coverage.
- Expansion Rule: update guideline + docs when the scale gains a tier.

## 5. Implementation notes (Aug 2026)

Converged base media/container widths onto token scale; added `--cs-breakpoint-phone: 360px`; docs-consistency Node+browser assert sanctioned widths.

*End of TASK-IMP-013.*


## Human acceptance (2026-08-09)

Operator HITL: **"accept all, continue"** — Phase 4–5 tranche (TASK-IMP-013…020) accepted. Status set to `done`.
