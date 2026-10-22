# Template color literal review

Run `node _audit/ci/test-template-hex-policy.mjs` after editing any authored template HTML. The policy scans inline CSS, stylesheet declarations, presentation attributes, displayed token specimens and raw conditional email markup across `templates/`, excluding vendored runtime directories. Numeric HTML entities are not mistaken for color codes.

Use an existing token when its role and computed value are equivalent across every relevant scope. For example, the DocStyleGuide Umber/Ochre swatches use immutable brand tokens while their displayed hexadecimal labels remain literal text. `test-template-brand-swatches-browser.mjs` compares those fills with the original literal references for every declared element and both outer themes in three engines.

`template-hex-policy.json` records exact source contexts, color values, counts and reasons for the remaining exceptions. Fixed white print paper, fixed ink on authored fills, neutral export desks, email-client/VML palettes and displayed color specimens have different portability boundaries from adaptive UI colors. A matching numeric value alone does not establish an equivalent semantic role. Preserve their visual contract until an appropriate token contract is defined and tested.

A new color, changed declaration, extra occurrence or removed exception fails the check. There is no automatic update mode: review the actual context and its behavior, then edit the corresponding exception and its reason explicitly. The exception list is not permission to add the same color elsewhere. Browser tests and existing contrast/accessibility gates remain separate requirements.
