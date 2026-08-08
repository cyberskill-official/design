# UX audit evidence archive — 2026-08-08

Source plan: `docs/plans/ux-audit-2026-08-08.md` (tree `91d9fd8`, VERSION 1.1.1).

Probe JSON artifacts (`audit-probe.json`, `audit-drill.json`) were session-local under `/tmp` during the audit and are not present in this workspace. This folder records the freeze point for Phase 0: advisory gate baselines and the remediation arc that follows.

Phase 0 advisory baselines (expected known failures before Phase 1 flips hard):
- artifact-head: ~84 templates missing document title / html lang
- responsive-overflow @320: 6 named surfaces + component patterns
- light-mode contrast: ~169 axe serious nodes (retired by on-strong + deck/band sweep)

