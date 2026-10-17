# Theme attributes — density + contrast (G3 / CDS-THEME-002)

Status: **accepted** (2026-08-25) — operator decision **C** (density **and** contrast one wave).  
Owner: design-system maintainer.  
Task: `TASK-IMP-027`

## Decision

Ship **density** and **contrast** as **attributes under Theme**, not a fifth product identity axis.

| Attribute | Values | Default (absent ≡) |
|-----------|--------|--------------------|
| `data-cs-density` | `comfortable` · `compact` | `comfortable` |
| `data-cs-contrast` | `standard` · `high` | `standard` |

Product axes remain **Theme × Element × Language × Style**. Density/contrast compose with `data-theme` (light · dark · system) and never with Element/Language.

Retired Expression/Density **product surface** (pre-four-axis era) stays banned: no `data-cs-expression`, no `tokens/density.css` / `tokens/expressions.css` imports, no Density runner gate. The attribute `data-cs-density` is now an **allowed Theme attribute** — `_audit/axis-guard.html` allowlists it and `data-cs-contrast` while still forbidding Expression and retired CSS packs.

## Token plan

| Role family | Density map | Contrast map |
|-------------|-------------|--------------|
| Spacing scale aliases `--cs-density-space-*` | compact ≈ 0.75× of `--cs-space-*` for 1–6; section floors unchanged | — |
| Control padding / gaps (`--cs-component-button-*-padding*`, `--cs-component-button-gap`, textfield padding) | compact tightens Y/X padding; **minHeight floors stay ≥44px** (immutable touch target) | — |
| Text / border (`--cs-color-text-muted`, `--cs-color-border-default`) | — | `high` darkens muted text + strengthens borders (mirrors `prefers-contrast: more` intent) |
| Focus ring | unchanged | unchanged (composite text-primary + ochre halo) |

APCA body floor **Lc ≥ 75** is preserved: high-contrast only strengthens muted/border roles; anchors (Umber/Ochre) and primary text are untouched.

Implementation lives in `tokens/theme-attributes.css`, imported from `styles.css` after core tokens.

## Demo

- Storybook toolbar: Density + Contrast globals (independent of Element/Language).
- Atomic View toolbar: Density + Contrast selects; apply via `data-cs-density` / `data-cs-contrast` on the axis host (no Element/Language coupling).

## Gate plan

| Gate | After this change |
|------|-------------------|
| `axis-guard` | Allowlist `data-cs-density` / `data-cs-contrast` as Theme attributes; still fail on Expression + retired density/expressions CSS packs + Density runner names |
| `contrast-guard` / light-contrast | Must stay green (high-contrast maps must not regress body Lc) |
| `a11y-harness` | Touch targets remain ≥ documented floors under compact |
| `docs-consistency` | Stale-phrase blacklist unchanged; docs must not claim density is a product axis |

## Non-goals

- Do not redesign Tabs or overlay manager.
- Do not ship a second Style pack under the guise of density.
- Do not weaken focus rings or 44px touch targets for compact.

## Scope repair — 30 September 2026 (local validation; acceptance pending)

Root defaults remain comfortable/standard. A descendant without a density attribute inherits its nearest density scope. Explicit `data-cs-density="comfortable"` resets all 18 density-controlled aliases, gaps and paddings to the independent default scope, even inside compact. Compact can be re-entered below that reset. The dimensions do not change brand anchors or control minimum heights.

System dark and explicit dark now apply the same contrast preference: stronger muted/border roles from the OS apply only with `prefers-contrast: more`. Previously the system-dark accessibility override applied unconditionally.

`test-theme-density-browser.mjs` compares computed values for all 15 element variants, light/dark/system hosts, both OS color schemes and both OS contrast preferences (180 scenarios). The reference comfortable scope has no density attribute, so drift from component defaults is detected. W04 remains in progress: nested light-theme palette resets and split theme/element placement are separate known defects; this repair does not certify them. F11/F12 machine-readable token coverage and schema work also remain pending.

### Nested neutral palettes — local verification, acceptance pending

In a neutral scope (outside an explicit element scope), `data-theme="light"` resets all 25 color tokens and native `color-scheme` to the light palette, even below a dark scope. `data-theme="system"` establishes the same complete palette and follows the current OS color scheme; it no longer inherits a dark ancestor when the OS is light. Unmarked descendants inherit their nearest theme. OS high-contrast colors apply to the new light/system scopes as they already do to independent roots.

`test-theme-palette-browser.mjs` verifies 108 combinations of three nested theme values, both OS color schemes and both OS contrast preferences, comparing all color tokens and inherited scopes with independent references. This establishes neutral palette resets only. Element/theme placement and explicit high/standard contrast scope composition remain under W04; they are not certified by this test.

The neutral reset deliberately excludes explicit element scopes and their descendants: a blanket reset erased inherited elemental tints in a split-scope probe. Those scopes retain existing behavior until the generated element/theme resolver is revised together with contrast composition.

### Element and contrast scope composition — local verification, acceptance pending

The earlier neutral-only limitation above is superseded by the generated scope resolver in `tokens/elements.css`. Theme and element attributes may be colocated or placed in either ancestor order. The nearest explicit theme selects light/dark/system; an unmarked descendant inherits. A nested theme reselects the inherited element palette rather than retaining values computed in the ancestor theme. All 15 element/variant packs provide both palettes through private implementation channels generated from the existing seeds and literal color sources. Their colocated palette values are preserved.

Contrast inherits independently. The root follows the OS contrast preference unless explicitly set. `data-cs-contrast="standard"` restores standard muted/border values even inside high contrast or an OS more-contrast preference; `high` can be re-entered below standard. The nearest theme determines the light/dark contrast pair. Density remains independent and keeps the 44px minimum.

Public `--cs-*` values remain usable CSS values. The `--_cs-*` channels/switches are private implementation details, not exported token APIs. The scope-binding selector has the same maximum specificity as the existing theme/element/variant rules and does not use `!important`; consumer inline overrides remain possible. Canonical consumers must use `styles.css` or its generated flattened equivalent to receive the complete composition contract.

The generator (`scripts/generate-element-packs.mjs`, with `scripts/lib/theme-resolver.mjs`) owns the resolver. Do not hand-edit generated palettes. `test-theme-composition-browser.mjs` compares 1,440 placement/reset cases, preserves 96 captured colocated references, and exercises live OS changes plus explicit contrast opt-out/re-entry. Existing neutral palette and density suites remain required. Full cross-browser, visual and human acceptance are separate; machine export completeness and typed interoperability remain F11/F12 work.

Local engine evidence: the 1,440-case matrix and 96 preservation references pass in Chromium, WebKit and Firefox 153. Chromium/WebKit also pass retained-node live media changes. Firefox is a static-media run (`--browser=firefox --static-only`): a separate minimal stylesheet probe reproduces Playwright contrast-emulation restyling failure even without design-system code. Its live contrast behavior is **unverified**, not waived as a product pass. The default test retains live assertions; `--static-only` prints this coverage exclusion explicitly. Manual OS preference testing or a corrected browser driver is still required for that claim.

### Density distribution repair — local validation, acceptance pending

The seven root aliases and all 18 compact plus 18 comfortable declarations are now projected from CSS into JSON, ESM, DTCG references and manifest entries. Native outputs expose resolved base dimensions and both scope suffixes; DESIGN.md lists the aliases and overrides. `scripts/generate-theme-exports.mjs` rejects missing/cyclic aliases, invalid dimensions and ambiguous duplicate scopes before writing. The browser regression uses CSSOM and computed styles independently of the generator to compare every exported value. F12 typed-value/schema work and unrelated legacy manifest values remain open.

### Complete public-token and component scope repair — 4 October 2026

The earlier color-only matrix missed the TextField border and five elevation tokens: nested light scopes retained their dark ancestor values. The resolver now includes every dark override from component-tokens.css and elevation.css, with validated light defaults. Component rules select their light/dark values through the nearest theme switches, replacing ancestor selectors that crossed explicit light boundaries. Standalone computed styles were captured before that component change and preserved afterwards, including the original Spinner border colors.

Storybook and Atomic View now retain explicit light, comfortable and standard attributes when those settings are selected. Removing the standard attribute had inadvertently restored OS high contrast. Embedded Atomic artifacts receive the same explicit reset attributes.

The required axis-scope regression compares all public root token values plus the style-pack value and color-scheme across 36,864 static cases: 24 theme/element/contrast/density ancestor orders, all 15 packs plus neutral, three themes, EN/VI, both densities, both explicit contrast values and both OS color/contrast preferences. Component coverage checks 26 selector/state fixtures plus real Mentions hover across 14,580 nested cases and rejects reintroduced contextual dark/system component selectors. These are computed-style and DOM checks, not visual or native assistive-technology acceptance. Live Firefox OS contrast changes retain the separate unverified limitation documented above.

Unmarked descendants inherit each axis. Root contrast follows the OS unless explicitly set; the earlier comfortable/standard root wording does not imply an OS opt-out. Neutral root colors and the explicit Thổ element palette are distinct. Element and matching variant belong on the same node; omission cannot clear an inherited element. Unknown values, mismatched variants and partial token imports are outside the supported composition contract. The sole supported style remains liquid-glass.

## Authored high-contrast source and exported deltas — 2026-10-10

The resolver now reads the four light/dark muted/border values from `tokens/theme-attributes.css`; it no longer carries independent literal copies. The shared reader rejects missing/duplicate/unknown roles and scopes, unsupported conditions or values, and a system-dark map that differs from dark. JSON/ESM and the DTCG vendor extension expose `high-light` / `high-dark` deltas; native outputs expose `HighLight` / `HighDark` constants. Apply these after theme/element selection. This preserves the current rendered palette and independent Standard/High inheritance.

The source-mutation regression runs the actual generators and all three browsers with OS media initialized at navigation. It keeps source authority distinct from native event handling, live browser media emulation, design-tool acceptance and human visual review.
