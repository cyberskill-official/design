# Review packet — TASK-IMP-026

Status: **reviewing** — awaiting human review acceptance (`reviewing → ready_to_test`).

## §1 clause → evidence

| AC | Evidence |
|----|----------|
| AC-1 ADR | `docs/decisions/locale-architecture.md` + `docs/decisions.md` §14 (+ VI) |
| AC-2 Registry / makeT | `components/_i18n/i18n.js` (`primaryLang`, `resolveLang`, `tr`/`makeT`); EN·VI unchanged; optional locales fall back en→vi→key |
| AC-3 ja spike | `strings.js` ja tables (Pagination, Breadcrumb, SearchField, Dialog); Storybook + Atomic View Language=`ja` |
| AC-4 Gate plan | ADR gate table; `bilingual-parity` optional-locale key match; `test-locale-ja-spike.mjs` in `npm run test:unit`; docs-lang-parity unchanged |
| AC-5 HITL | This gate — operator verdict required |

## Named tests

- `node _audit/ci/test-locale-ja-spike.mjs` — resolveLang ja/ja-JP, makeT ja, fallback, default vi
- `npm run test:unit` — includes locale spike + docs-consistency (default lang vi)

## Ask

Approve review → flip `reviewing → ready_to_test` with `--verdict-by` + evidence path.
