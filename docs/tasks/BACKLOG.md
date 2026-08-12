# design-system task backlog

Source of truth for task state = each task's frontmatter `status`. This file indexes them. ONE backlog for ALL work: net-new features (`class: product`, the default) and hardening/refactor/audit-remediation (`class: improvement`) live here together — improvement is not a separate track and never gets a second backlog file. Tag improvement rows with `(improvement)`; untagged rows are product.

Task files live under `docs/tasks/`: flat (`TASK-001-slug.md`) for small repos, or grouped in subfolders by module for larger ones. `improvement/` is a normal subfolder there for cross-cutting hardening tasks.

The `ship-tasks` workflow reads this file, picks the first eligible task (`ready_to_implement` with all `depends_on` done), and drives it through the lifecycle. HITL is required: the agent halts at review acceptance and final acceptance for a recorded human verdict, and never sets `done` itself.

Lifecycle: draft -> ready_to_implement -> implementing -> ready_to_review -> reviewing -> ready_to_test -> testing -> done. Off-ramps: on_hold, closed, cannot_reproduce (`type: bug` only), duplicate (requires `duplicate_of:`). See `.cyberos/cuo/STATUS-REFERENCE.md`.

**Assessment complete (2026-08-09):** Phases 0–5 + FIND-016 WebP accepted HITL (`TASK-IMP-001`…`021`). Evolution-plan adoption: `docs/decisions.md` §12. AT clearance minimum **PASS**. OQ-003 live CSP **PASS** (operator `curl -sSI`). NV-18.1 aborted. Clearance gap-closure finished — no open assessment operator items.

## ready_to_implement

- (none)

## in flight

- [ready_to_review] TASK-IMP-022-template-export-csp - CSP-safe DC runtime + PDF/DOCX export + HR DOCX source audit (improvement)

## done

- [done] TASK-IMP-021-aurora-webp - Convert elemental aurora washes PNG→WebP (FIND-016) (improvement)
- [done] TASK-IMP-020-governance-runbook-alerting - Product↔CyberOS boundary, release runbook, schedule alerting (improvement)
- [done] TASK-IMP-019-hr-suite-provenance - HR-suite provenance or soften claim (FIND-022) (improvement)
- [done] TASK-IMP-018-sbom-scorecard - CycloneDX SBOM + OpenSSF Scorecard (FIND-023) (improvement)
- [done] TASK-IMP-017-nv-rendered-inrepo - In-repo NV rendered checks areas 9/12/14/26 (improvement)
- [done] TASK-IMP-016-csp-headers-portable - Tighten CSP + portable security headers (FIND-015/019) (improvement)
- [done] TASK-IMP-015-format-currency - Language-independent formatCurrency (FIND-025) (improvement)
- [done] TASK-IMP-014-base-hex-polygon - Replace theme-following raw hex in base CSS (FIND-010) (improvement)
- [done] TASK-IMP-013-breakpoint-converge - Converge responsive CSS breakpoints on token scale (FIND-007) (improvement)
- [done] TASK-IMP-009-rsc-use-client - RSC `"use client"` / client barrel (FIND-006) (improvement)
- [done] TASK-IMP-010-rating-tree-toolbar-apg - Rating/Tree/Toolbar APG keyboard + a11y fixtures (FIND-014) (improvement)
- [done] TASK-IMP-011-auth-pattern-states - Auth pattern error/loading/invalid variants (FLOW-013 / NV-9.2) (improvement)
- [done] TASK-IMP-012-styles-min-default - Recommend dist/styles.min.css as static default (FIND-017) (improvement)
- [done] TASK-IMP-001-archive-baseline - Archive AT/UX audit trail + record evolution-plan adoption (FIND-001/002) (improvement)
- [done] TASK-IMP-002-mentions-apg-keyboard - Mentions APG editable-combobox keyboard (FIND-012) (improvement)
- [done] TASK-IMP-003-sortable-move-buttons - Sortable move buttons + keyboard reorder (FIND-013) (improvement)
- [done] TASK-IMP-004-login-seed-credential - Clear Status Hub login seed credential (FIND-011) (improvement)
- [done] TASK-IMP-005-npm-publish-fail-closed - npm-publish fail on 403/EOTP + registry presence (FIND-020) (improvement)
- [done] TASK-IMP-006-gate-extension - Extend docs-consistency + keyboard fixtures + asset budget (FIND-018) (improvement)
- [done] TASK-IMP-007-zindex-doc-parity - Fix z-index fallbacks + doc one-liners (FIND-008/003/005/009) (improvement)
- [done] TASK-IMP-008-ci-mcp-hygiene - Re-gate token auto-commit + resolve .mcp.json (FIND-021/024) (improvement)
- [done] TASK-REL-002-republish-1-1-1 - Republish @cyberskill/design at VERSION 1.1.1
- [done] TASK-REL-001-launch-1-1-0 - LAUNCH design system at VERSION 1.1.0

## on_hold / closed

- (none)
