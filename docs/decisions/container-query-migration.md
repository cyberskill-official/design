# Container-query migration (G1 / CDS-RESP-001)

Status: **started Phase 4** (2026-08-08) — compatibility layer only.  
Owner: design-system maintainer.

## Decision

Begin container-query adoption **behind a compatibility CSS opt-in**, without rewriting every template grid in one pass.

1. Hosts opt in with `.cs-cq` (`container-type: inline-size`).
2. Children may use `@container cs (max-width: …)` rules; first helper: `.cs-cq-stack`.
3. Existing `@media` rules in `base/responsive.css` remain the default authority until generated layout classes land.

## Acceptance for later waves

- Kit card grids and Status Hub lenses can size from parent width, not only viewport.
- No regression on `_audit/responsive-overflow-320.html` or zoom-text-spacing.
- Document any permanent media-only exceptions in this file.
