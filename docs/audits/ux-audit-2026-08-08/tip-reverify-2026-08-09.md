# Tip re-verify — 2026-08-09 (TASK-IMP-001)

Assessment pin was `ca3f8545`. Re-checked against tip **`5f600b3`** / **VERSION 1.2.1**.

| Finding | Still present? | Tip evidence |
|---------|----------------|--------------|
| FIND-012 Mentions APG keyboard | **Yes** | `components/forms/Mentions.jsx`: `onMouseDown` = 1, `onKeyDown` = 0, `aria-activedescendant` = 0 |
| FIND-013 Sortable move buttons + keyboard | **Yes** | `components/data/Sortable.jsx`: `draggable` = 1, `onKeyDown` = 0, no move-up/down controls |
| FIND-011 login seed + Remember me | **Yes** | `ui_kits/status-hub/login.html`: `value="wishgranted"`; Remember me `checked` |
| FIND-020 publish soft-skip on 403/EOTP | **Yes** | `_audit/ci/npm-publish.mjs` `isSoftSkippableNpmError` still matches EOTP + `403`; failures call `softSkip` → `process.exit(0)` |
| FIND-021 `[skip ci]` on token regen push | **Yes** | `.github/workflows/design-system-gates.yml` regenerate-tokens-push commit message includes `[skip ci]` |
| FIND-024 `.mcp.json` dangling cyberos MCP | **Yes** | `.mcp.json` → `.cyberos/mcp/cyberos-mcp.mjs` |

Remediation of Mentions / Sortable / publish / gates is **out of scope for Phase 0** — tracked as TASK-IMP-002…008.
