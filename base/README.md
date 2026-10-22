# Shared CSS maintenance

`styles.css` determines source order. Component sheets load before the interaction enhancements, accessibility safety net and responsive adaptations. The existing sheets are unlayered; moving them into cascade layers changes how downstream styles override them and requires a reviewed compatibility migration.

Find a component's literal class hooks and matching sheets in `components/css-index.json`. Regenerate with `node scripts/generate-css-index.mjs` and check with `node scripts/generate-css-index.mjs --check`. The index includes unmatched hooks explicitly; these can be structural, inherited or assembled dynamically. Inspect the component source before treating an unmatched hook as a missing CSS rule.

Consumer overrides load after `styles.css` and should target the specific `.cs-*` hook and state. Normal cascade rules apply: specificity, source order and existing `!important` declarations still govern the result. Responsive adaptations and accessibility requirements are intentional constraints; an ordinary downstream declaration does not defeat an important rule. Preserve visible focus, 44px touch targets, contrast preferences and reduced motion when customizing. This is the current contract; there is no public cascade-layer or per-component stylesheet isolation guarantee.

Generic classes such as `.card` and `.case` belong to their local consumer or kit. Shared responsive CSS must not apply rules to them. The Status Hub owns its card sizing locally. Inline fixed-column grid adaptations support compact authored property syntax and browser serialization with spaces; fixed export canvases inside `.cs-canvas-desk` keep their columns and scroll.

Both spinner variants stop under reduced motion, including when their source sheet is loaded independently of the global accessibility safety net. Keep the local rules aligned with the global rule rather than documenting a slowdown that the important global duration overrides.

Validate these contracts with `node _audit/ci/test-css-remediation-browser.mjs` (set `CS_BROWSER=firefox` or `webkit` for other engines). The whole-set overflow audit retains its 390px board default and accepts `?width=768` or `?width=1280`; `node _audit/ci/test-responsive-breakpoints-browser.mjs` verifies both added widths across every manifest template and the three kits. These tests establish layout and computed-style evidence; they do not replace product visual review or manual assistive-technology evidence.

`npm run test:css-lint` checks all authored sheets with pinned PostCSS, CSS-tree specification data and a value parser (syntax, unknown properties and invalid hex). Its invalid-input fixtures ensure these rules remain active; it does not enforce formatting or replace rendered accessibility checks.
