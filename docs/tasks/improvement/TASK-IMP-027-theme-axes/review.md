# Review packet — TASK-IMP-027

Status: **reviewing** — awaiting human review acceptance (`reviewing → ready_to_test`).

## §1 clause → evidence

| AC | Evidence |
|----|----------|
| AC-1 ADR | `docs/decisions/theme-density-contrast.md` + `docs/decisions.md` §15 (+ VI) — Theme attributes, not a fifth identity axis |
| AC-2 Token plan | `tokens/theme-attributes.css` — density space/padding maps; contrast muted/border; 44px minHeight preserved |
| AC-3 Demo | Storybook Density/Contrast globals; Atomic View Density/Contrast selects — independent of Element/Language |
| AC-4 Gate plan | `_audit/axis-guard.html` allowlists Theme attrs; still bans Expression + retired CSS packs; `test-theme-attributes.mjs` |
| AC-5 HITL | This gate — operator verdict required |

## Named tests

- `node _audit/ci/test-theme-attributes.mjs`
- Fast board `axis-guard` / contrast-guard (run after serve)

## Ask

Approve review → flip `reviewing → ready_to_test` with `--verdict-by` + evidence path.
