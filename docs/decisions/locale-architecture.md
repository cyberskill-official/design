# Locale architecture beyond EN·VI (G2 / CDS-I18N-001)

Status: **accepted** (2026-08-25) — operator decision **B** (third-locale spike).  
Owner: design-system maintainer.  
Task: `TASK-IMP-026`

## Decision

Keep **Language** as the product axis. Locale values are **BCP-47 primary language subtags** (`en`, `vi`, `ja`, …), not a nested fifth axis and not a hard EN|VI enum.

| Option | Verdict |
|--------|---------|
| A — Extend Language axis to more language codes | **Chosen** (primary-subtag values) |
| B — Nest `locale` under Language | Rejected — invents a sub-axis consumers must learn |
| C — Full BCP-47 tags as the axis (`vi-VN`, `en-US`) | Deferred — region variants are follow-on |

### Registry / `makeT` contract

1. `components/_i18n/strings.js` remains the central registry. Shape per component:
   ```js
   { en: { key: "…" }, vi: { key: "…" }, ja?: { key: "…" } }
   ```
2. **Required:** every registered component keeps `en` + `vi` with identical key sets (Vietnamese-first doctrine; `bilingual-parity` unchanged floor).
3. **Optional spike locales** (today: `ja`) may add a third table. When present, keys must match `en` and values must be non-empty.
4. `resolveLang` normalizes props / `[lang]` / `<html lang>` to a primary subtag. Empty / unset → **`vi`**. Display labels (`Tiếng Việt`, `English`) still resolve.
5. `tr` / `makeT` lookup order: requested locale → `en` → `vi` → key string. Missing spike copy never breaks EN·VI callers.
6. Plural / ICU message forms and region variants (`vi-VN` vs marketing `vi-US`) are **out of scope** for this spike; reopen via a follow-on ADR when needed.

### Third-locale spike

- Spike locale: **Japanese (`ja`)** — distinct script, low collision with EN/VI keys.
- Proof: `Pagination` (+ a small fixture set) carries `ja` strings; `_audit/ci/test-locale-ja-spike.mjs` asserts resolve + lookup; Atomic View / Storybook Language toolbar expose `ja` as a spike option.

## Gate plan

| Gate | After this change |
|------|-------------------|
| `bilingual-parity` | Still requires `en`+`vi` key parity; **also** fails if an optional locale table (e.g. `ja`) drifts from `en` keys or has empty values |
| `docs-lang-parity` | Unchanged — operator docs stay EN·`docs/vi/` mirrors; not product UI locales |
| `template-lang-parity` | Unchanged — templates remain EN·VI tweak chrome for this wave |
| `test-i18n-builtins` | Unchanged wiring rules; spike namespaces still `makeT`-wired |
| `test-locale-ja-spike` | **New** unit gate — `resolveLang('ja'|'ja-JP')`, `makeT` ja strings, default still `vi` |

## Non-goals

- No fourth product identity axis.
- Do not break Vietnamese-first default (`lang` unset → `vi`).
- TipTap / Editor i18n is out of scope.
