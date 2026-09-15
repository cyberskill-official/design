---
batch: task-imp-030-enterprise-audit
members:
  - TASK-IMP-030
verdict_by: "@operator"
recorded_at: 2026-09-15T03:00:00+0000
branch: cursor/task-imp-025-enterprise-audit
pr: https://github.com/cyberskill-official/design/pull/98
---

# HITL acceptance — TASK-IMP-030

Operator message (2026-09-15): **"/goal continue until finish everything, you have my permission to approve all HITL (temporary for this session)"**

This utterance records both human-acceptance gates for TASK-IMP-030:

1. **Review acceptance** — `reviewing → ready_to_test`
2. **Final acceptance** — `testing → done`, after `npm run test:unit` passed on this tree

## In-repo evidence accepted

- Gate contract: `npm test` aliases `test:unit`; Playwright Chromium bootstrap; inclusive matrix
- License posture: `UNLICENSED` + `LICENSE` + `docs/consumer-grant.md` + decisions §16
- CODEOWNERS + `docs/export-registry.json` (owner, maturity, support, deprecation, package)
- Strict `tsc` declarations + React 18/19 SSR canaries (`@cyberskill/themes` compiled path)
- Compiled workspace packages (`npm run build:workspaces`) with no raw JSX / templates / `_audit/` in slim tarballs
- `forwardRef` on interactive public exports; providers skipped
- Changeset note + `scripts/release-bind.mjs` SHA-256 of the real tarball bytes
- Upgrade rehearsal under 15 minutes
- AT protocol, SLO, telemetry docs (EN+VI) + opt-in `reportAdoption`
- Lint gate: `npm run lint` (`_audit/ci/lint-cyberskill.mjs`)
- Quarterly support-matrix review dated 2026-09-15

## Explicitly not claimed

- Live NVDA / JAWS / VoiceOver / TalkBack operator speech sessions (empty AT-RUN cells are not passes)
- Live production traffic ≥80% (in-repo Stable-package hosts exist; council live inventory is still out of band)
- Support-ticket downward trend (Q3 2026 baseline is zero GitHub issues; second count is due 2026-12-15)
- Live Figma Variables write (soft-skip remains explicit)
- Push, deploy, or merge (still requires a separate operator instruction)
