# Bounded spacing-role adoption — G31

Status: local implementation and automated validation; visual and human acceptance remain separate. The authored change is limited to nine padding/gap declarations in `base/controls.css`. It adds no token, changes no token value and expands no compact-density behavior.

## Exact roles

| Role | Selector/property | Existing grid token |
|---|---|---|
| Search content gap | `.cs-search` gap: 8px | `--cs-space-2` |
| Combobox leading padding | `.cs-combobox input` left: 12px | `--cs-space-3` |
| Tag container inline padding | `.cs-taginput` horizontal: 8px | `--cs-space-2` |
| Tag draft inline padding | `.cs-taginput > input` horizontal: 4px | `--cs-space-1` |
| Calendar container padding | `.cs-cal` padding: 12px | `--cs-space-3` |
| Date content gap | `.cs-datepicker__field` gap: 8px | `--cs-space-2` |
| Date control padding | `.cs-datepicker__field` vertical: 8px / horizontal: 12px | `--cs-space-2`/`--cs-space-3` |
| Form field stack gap | `.cs-form` gap: 16px | `--cs-space-4` |
| Form summary block padding | `.cs-form__summary` vertical: 12px | `--cs-space-3` |

The 6/10/14px values, Combobox 34px and Select 38px trailing clearances, borders, radii, focus indicators and target sizes remain unchanged. Spacing tokens are used only where the existing value matches the role exactly. A border, icon dimension, font size or target floor is not padding merely because it shares a number.

## Density boundary

The accepted [density decision](theme-density-contrast.md) controls Button padding/gaps and the shared TextField control family. That shared class also reaches Select, NativeSelect, Textarea and Mentions; compositions using Button styles inherit their behavior. This migration preserves both their comfortable and compact values.

SearchField, NumberField, Combobox, DatePicker and TagInput do not acquire new compact padding behavior through this change. Neither do panels, tables or Tabs. Density attributes and their computed values may inherit without every component consuming them.

The seven published `--cs-density-space-1` through `--cs-density-space-6` and `--cs-density-control-gap` aliases remain compatibility exports. They currently have no internal layout consumers in the scoped CSS dependency trace. This does not establish that external consumers are absent and does not authorize deletion. Wider component adoption requires an explicit compact-scope decision, per-role maps and target/wrapping validation. The aliases are not evidence of a supported all-component compact layout.

## Evidence and maintenance

`_audit/ci/fixtures/g31-controls-before.css` freezes the complete pre-edit control stylesheet; its SHA256 is `7b44cec43ba5bacec34bdc972aa9e4a16aa36fae40182776096e998773f1a27d`. The adjacent `g31-spacing-roles.json` records each role's original and tokenized declarations. Treat these as reviewable regression evidence, not generated files to refresh automatically when a check fails.

Run `node scripts/flatten-styles.mjs`, then `node _audit/ci/test-spacing-roles-browser.mjs`. The regression loads the frozen CSS at its original import position and compares it with current source and flattened CSS. It checks rendered geometry and computed layout/font/border/focus properties for 23 actual component targets across default, comfortable, compact, inherited compact, nested comfortable reset and compact re-entry. Chromium, Firefox and WebKit each exercise real fine and coarse pointer media matches. Coarse control/button floors stay at least 44px for the explicitly sampled family; fine-pointer xs/sm Button contracts remain 28/36px.

The test also changes the four spacing-token values in the browser and checks each adopted role in both CSS distributions. This proves actual token consumption, including retained 14/34px clearances, rather than merely searching source strings. JSON receipts and per-engine computed baselines are written beneath `test-results/spacing-roles/`.

A future default-spacing or compact-scope change must intentionally update the role contract and frozen evidence with review; do not weaken equality checks or silently reinterpret hit targets. Regenerate the full token/declaration/export provenance chain after authored CSS changes, and retain the existing CSS lint, freshness, density, reflow, keyboard/focus and pixel gates. Manual visual, touch and assistive-technology acceptance remain separate from computed-style parity.
