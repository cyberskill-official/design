# Container-query migration (G1 / CDS-RESP-001)

Status: **wave 3 started** (2026-09-15) — interactive shells use named CQ classes; print/deck substring selectors remain as fallback.  
Owner: design-system maintainer.  
Task: `TASK-IMP-025`

## Decision

Begin container-query adoption **behind a compatibility CSS opt-in**, without rewriting every template grid in one pass.

1. Hosts opt in with `.cs-cq` (`container-type: inline-size`) **or** equivalent host rules.
2. Children may use `@container cs (max-width: …)` rules; helpers: `.cs-cq-stack`, `.cs-cq-cols-{2,3,4}`, `.cs-cq-hide-narrow`.
3. Existing `@media` rules remain the **viewport fallback** until generated layout classes land. CQ and media may both fire — that is intentional.

### Progress

| Date | What |
|---|---|
| 2026-08-08 | Compatibility CSS in `base/responsive.css` (`.cs-cq` + `.cs-cq-stack`) |
| 2026-08-24 | Low-risk hosts: website `.container`, status-hub `.wrap` |
| 2026-08-24 | **Wave 2 (TASK-IMP-025):** helpers `.cs-cq-cols-*` / `.cs-cq-hide-narrow`; website home grids + work results; status-hub deck/lenses + settings fields + project `.pd` host |
| 2026-09-15 | **Wave 3 (TASK-IMP-030):** `.cs-cols-sidebar`; Settings, App Shell, campaign brief, invite, investor update opt in; interactive inline `1fr 1fr` / `248px 1fr` / `repeat(2–6)` grids must carry a named class (`test-template-landmarks.mjs`) |

### Media-only exceptions (permanent for now)

- Website `.nav` hide stays `@media` only — chrome tied to viewport chrome, not content column.
- Deck / social `.cs-canvas-desk` grids stay media-exempt (export geometry; see `base/responsive.css` §5).
- Template inline `grid-template-columns` collapses remain `@media` in `base/responsive.css` until a template CQ pass.

## Acceptance

- Kit card grids and Status Hub lenses can size from parent width, not only viewport.
- No regression on `_audit/responsive-overflow-320.html` or zoom-text-spacing (`npm run test:audit-probe`).
- Document any permanent media-only exceptions in this file (above).
