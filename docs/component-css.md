# Component CSS entries

The optional `styles/components/<ExportName>.css` entries load conservative groups of **whole existing stylesheets**. The default `styles.css`, token-only entry and layered entry keep their existing contracts. These component entries do not prune selectors and do not make a component's CSS private or scoped.

For example, a bundler can import `@cyberskill/design/styles/components/Button.css`. Direct static consumers can link `styles/components/Button.css` from the extracted package. Keep the package's directory structure: each entry imports the original `tokens/` and `base/` sheets, which retain their existing relative font and asset URLs.

## Shared dependencies and source authority

Every entry includes all font/token/axis sheets, reset, typography, glass materials, interaction, accessibility and responsive styles. Optional sheets close over shared `cs-` classes, custom-property definitions and keyframe dependencies. Whole-sheet overlap groups stay together; source order always follows `styles.css`. No selector, declaration, conditional rule, `!important` or font URL is rewritten.

`scripts/generate-component-css-entries.mjs` parses the stylesheet graph and local component imports. An independent source-export census checks API membership and current component hashes. Literal classes and bounded class-family prefixes determine sheet ownership. Dynamic imports, opaque authored class construction or unsupported attribute construction record an explicit `full-fallback` and load every source sheet. Fallbacks are visible in `styles/components/manifest.json`; they are not isolated bundles. An optional sheet with an unscoped selector or global at-rule registration joins the shared floor conservatively.

Three helper functions have reviewed class-flow contracts: the target-prop merger combines authored and caller classes; field association preserves classes; the overlay material chooser selects a finite literal class. Their exact helper-source hashes bind that review. Drift returns affected entries to full fallback until the class flow is reviewed again. This mechanism cannot establish accessibility or runtime acceptance.

## Composed children and caller classes

A component entry covers its source and transitive imports. It cannot infer arbitrary caller `children`, `className`, target-prop classes or application HTML. Include those components explicitly. For multiple components, emit **one ordered union** rather than assuming that stacking independent import manifests preserves every cascade relationship.

```js
import { componentStylesheets } from '@cyberskill/design/styles/components/compose.mjs';

const paths = componentStylesheets(['Card', 'Button']);
// Paths are package-root-relative, deduplicated, and in styles.css source order.
// Write one manifest; prefix paths relative to that manifest's destination.
const css = paths.map(path => `@import url("../${path}");`).join('\n');
```

The example prefix assumes the manifest is one directory below the package root; choose the correct prefix for the actual destination. The helper performs no loading or filesystem access. Unknown export names fail. An empty array returns the shared foundation. Custom application classes need their application stylesheet; arbitrary class fragments that reuse other library component classes need those entries too. For uncertain compositions, use `styles.css`.

`styles/components/foundation.css` provides the shared floor alone. CSS-free providers and pass-through exports may need only that floor; their caller-rendered children still need their own entries. These entries are unlayered. Do not mix them with the separate opt-in layered entry and assume equivalent precedence.

## Validation and limits

Generate with `node scripts/generate-component-css-entries.mjs`; verify without writes with the same command plus `--check`. The manifest records every input hash, original sheet order, assets, source imports, class-family evidence, full-fallback reasons and raw source-sheet byte totals. Byte totals describe loaded source sheets, not compressed transfer sizes or selector-level savings.

`_audit/ci/test-component-css-entries.mjs` exercises stale/missing membership, source and helper drift, opaque constructors, dynamic imports, class/custom-property/keyframe closure, global selector promotion, asset drift, unsafe paths, symlinks, ordered composition and failure before output changes. Browser tests compare actual reference fixtures and representative axes against `styles.css`, then exercise native focus, hover, errors, disabled values, selected radios and body portals. A real missing-controls mutation must change the computed-style oracle. Receipts retain full input identities and rendered bundle/runtime identities.

The browser checks compare all computed noncustom properties, including before/after pseudo-elements; they do not replace human visual review, assistive-technology testing, every prop/state combination, arbitrary consumer composition or a native-platform rendering review. Any measured fallback remains a fallback even when its reference fixture passes.

Both `npm run build:css-index` and the compatible `npm run build:component-css-index` entrypoint invoke the same CSS index producer. The older script name remains supported.
