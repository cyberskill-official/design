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

- Live NVDA / JAWS / VoiceOver / TalkBack / IME operator run (protocol exists; empty cells are not passes)
- ≥80% product adoption (out-of-band council inventory)
- Two completed non-React web-component pilots
- Live Figma Variables write (soft-skip remains explicit)
- Push, deploy, or merge (still requires a separate operator instruction)
