# Opt-in cascade layers

The existing `styles.css` and `styles.min.css` entries keep their current cascade. Choose `@cyberskill/design/styles.layered.css` instead to opt into named cascade layers. Load one entry, once; combining the layered and default entries duplicates rules and defeats this contract. This is additive adoption, not a default migration.

```html
<link rel="stylesheet" href="/vendor/design/styles.layered.css">
<style>
@layer cs-overrides {
  .cs-card { border-radius: 12px; }
}
</style>
```

The generated entry is standalone CSS with no imports. Local font/asset URLs are rebased relative to its package-root location. Keep the packaged `fonts/` and `assets/` siblings when copying the entry. The generator accepts the exact reviewed import graph in `styles.css`, rejects new/reordered imports, nested imports/layers, external or escaping asset paths, and binds every source hash in `styles.layered.provenance.json`.

The declared order is:

| Layer | Contents |
| --- | --- |
| `cs-safety` | All existing `!important` declarations, from every source |
| `cs-reset` | Normal declarations from `base/reset.css` |
| `cs-tokens` | Fonts and normal declarations from `tokens/` |
| `cs-components` | Normal declarations from remaining base component/surface files, in existing order |
| `cs-accessibility` | Normal declarations from `base/a11y.css` |
| `cs-responsive` | Normal declarations from `base/responsive.css`, retaining the final responsive position |
| `cs-overrides` | Empty consumer extension point |

Normal declarations in later layers outrank earlier layers regardless of selector specificity. Unlayered consumer normal rules outrank every named library layer; inline normal styles also retain their usual priority. This intentionally makes normal consumer overrides easier. Consumers remain responsible for retaining contrast, focus visibility, native semantics and target sizes when overriding normal rules. Do not predeclare/reorder the reserved library layers before loading this entry.

Important layer order reverses. Splitting existing important rules across reset/component/accessibility layers would silently change their winners. The generator instead extracts **all** existing important declarations into the single earliest `cs-safety` layer, preserving their original selectors, source order, nesting conditions and values. Later normal rules remain in their categories. This preserves the library's important-v-important ordering and protects its existing important rules against later named-layer or unlayered consumer important declarations. This stronger external important precedence is an explicit opt-in difference from the unlayered entry. Inline important and user/browser origins retain their platform cascade priority. A consumer layer predeclared before `cs-safety` could outrank it for important declarations; do not do that.

The safety layer is a historical cascade bucket, not a claim that every important rule is an accessibility rule. It includes responsive and glass rules as well as visually hidden/reduced-motion protections. Conversely, some accessibility rules are normal declarations and can be overridden through normal consumer precedence. No new important rules are added to the authored stylesheets.

Regenerate after CSS changes with `node scripts/generate-layered-styles.mjs`; use `--check` for a read-only freshness gate. The build belongs after authored token/base generation. Structural tests preserve every existing important declaration and reject unsafe graph changes. Browser checks compare computed styles for all 120 declared component fixtures and selected dark/compact/coarse/reduced-motion/forced-color states across Chromium, Firefox and WebKit. Additional real focus/hover/disabled/selected/open body-popup tests compare the entries and verify that reversing important-layer order fails the protection test. These bounded checks do not establish every possible consumer override, state combination, manual assistive-technology result or visual approval.
