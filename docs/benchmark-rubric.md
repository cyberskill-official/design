# Design System Benchmark Rubric

Self-audit checklist for evolving CyberSkill Design System — external standards plus CDS-owned rules. Pair with [`docs/quality-gates.md`](quality-gates.md) (deterministic gates) and [`docs/design-styles.md`](design-styles.md) (Element colour contract). Published on Storybook **Docs** at `design.cyberskill.world`.

## External standards

| Domain | Standard / practice | How we measure |
|---|---|---|
| WCAG contrast targets | [WCAG 2.2](https://www.w3.org/TR/WCAG22/): 4.5:1 normal text / 3:1 large text; applicable UI non-text ≥ 3:1 | `contrast-guard` checks selected source/token pairs; theme-overflow and axe inspect bounded fixtures. These do not certify every rendered state or legal compliance. |
| Perceptual readability | CDS body-text floor: APCA Lc ≥ 75 on actual surfaces. Elemental report pairs have their own stated 60/75 floors. | [`docs/contrast-report.md`](contrast-report.md) is a token-pair measurement; `apca-dark-preview` compares current packs with an advisory proposal. Neither is a whole-product body-text audit or a maximum-Lc gate. |
| Color space | OKLCH luminance-first ramps; hue preserved across modes | `element-geometry` + `npm run tokens:elements` |
| Token interoperability | [DTCG 2025.10 Format](https://www.designtokens.org/tr/2025.10/format/) emitted-value profile: supported base types, typed aliases and provenance counts | `dtcg-typing` / `npm run test:dtcg-profile` check the emitted profile. Scoped overrides and raw CSS extensions need adapters; format parity does not establish general reader/resolver conformance or design-tool import. |
| Dual-mode theming | Same hue family light↔dark; role remap (not invert-everything) | `element-geometry` hue-lock |
| Dual-standard audit | Classify pairs: pass-both / fail-both / WCAG-only / APCA-only | Document in contrast-report workflow after token changes |
| Gamut safety | Prefer sRGB-safe chroma; clamp before emit | Generator + geometry gate |

## CDS-owned rules

| Rule | Enforcement |
|---|---|
| Axes = Theme × Element × Language × Style until a Style Expansion Rule pass | `axis-guard` rejects the retired Expression/density-pack surface; `data-cs-density` and `data-cs-contrast` remain supported Theme attributes, not extra identity axes |
| Text never on mid `-accent`; composite focus indicator never becomes elemental; status colours never remapped | `elements.css` contract · contrast-report · conventions |
| One element per surface; Tương sinh gradients only | products registry · conventions |
| Product→element registry locked; UI kits Thổ-faithful | [`docs/products.md`](products.md) |
| Expansion Rule completeness + `_audit/run.html` green + docs EN·VI parity | `docs/doctrine.md` · docs-consistency · docs-lang-parity · docs-storybook-coverage |
| VERSION tracks file (auto-bump on main) | version-stamp · docs-consistency |
| Element packs from seeds only (30 sets) | `element-geometry` · `tokens:elements` |

## Style expansion checklist (`data-cs-style`)

Sole pack today: **liquid-glass** (`tokens/styles.css`, gate `_audit/style-contract.html`). When adding a style pack beyond liquid-glass:

1. Token overlay that **consumes** the existing 10 `--cs-accent-*` roles, including `--cs-accent-on-strong` (do not invent parallel Element packs).
2. Specimen card + Storybook / Atomic View wiring if the style is product-selectable.
3. Template / kit adoption only where the style is intentional — UI kits stay Thổ-faithful unless a decision says otherwise.
4. Regenerate contrast surfaces if the style remaps backgrounds that host text.
5. Expansion Rule grep for the new enum across templates, docs EN+VI, gates.
6. Extend the style-contract allowlist; keep `_audit/run.html` green.
7. Record the decision in [`docs/decisions.md`](decisions.md) (+ VI).

## How to run a benchmark pass

1. If seeds or shared token inputs changed, run `npm run tokens:generate` for the complete token/export, native-copy, CSS and reference pipeline. Run its targeted checks and `npm run test:unit`; generated native parity is separate from toolchain/device validation.
2. Fast board: open `_audit/run.html` (or CI `fast-gates`) — all hard gates green, including **Element geometry**
3. Whole-set Atomic View / Elements Geometry: all **30** sets (soft/middle/deep × light/dark × five elements) — soft reads as a washed pastel, middle intensity syncs across elements, deep is clearly darker, roles feel harmonious, and light↔dark keeps hue identity. Geometry gate requires **both** `minDeltaE` and `minDeltaL` (plus monotonic L) from `tokens/element-seeds.json`
4. Update this rubric only when standards or CDS doctrine change — keep EN·VI parity
