# Vietnamese-first guideline views

Authored guidelines under `guidelines/` open in Vietnamese. Every guideline also exposes its original English view through `?language=en`; `?lang=en` is an alias. The existing page path and `#fragment` bookmark remain valid. Use `?language=vi` for an explicit Vietnamese view. The Arabic `rtl-preview.html` page is an intentional bidirectional diagnostic and keeps its Arabic content and direction.

The Language axis updates actual guideline text and accessible image descriptions. It does not merely change the document's `lang`. Atomic View applies the same choice to its guideline chrome and embedded motion guideline. Its component examples retain their declared language behavior: examples using the language parameter follow the axis, fixed English examples have an English scope, and explicit Vietnamese labels remain Vietnamese within those examples. The Japanese component spike is retained; guideline prose itself supports Vietnamese and English.

Official brand and feature names, the bilingual slogan, API exports, token names, element variant identifiers, code, numeric specimens and explicitly classified language-teaching examples keep their exact source spelling. These are recorded exceptions, not untranslated guideline paragraphs. Existing element/theme/style/density/contrast axes, component JSX, inventory bindings, examples, CSS and bookmark IDs remain authoritative.

## Authoring and generation

English source copy remains in the HTML and JSX so the English view preserves the original content. The source-only repository input `scripts/guideline-translations.json` (not published in the webroot) owns the Vietnamese prose, accessible descriptions, retained-copy classifications and source-derived Atomic example boundaries. Static entries bind exact existing text nodes or the declared `alt`, `title`, `aria-label` and `placeholder` attributes. Translation uses text values only; it cannot inject HTML, URLs, event handlers, component props or arbitrary attributes.

Run `node scripts/generate-guideline-languages.mjs` after editing the source contract, then `node scripts/generate-guideline-languages.mjs --check` for read-only freshness. The generator verifies complete guideline/diagnostic membership, source text and attribute ownership, authored example membership, unchanged JSX and the Arabic diagnostic hash before writing any output. A new or changed paragraph requires an explicit translation or reviewed source classification. Unknown metadata, prototype keys, accessors, malformed Unicode, missing owners and broadened targets fail closed.

The generated `guidelines/guideline-language.js` is a same-origin external script. The site's existing JSX compilation and exact CSP hashing remain in force; this feature adds no inline handler, evaluation or HTML insertion. `CS_GuidelinesLanguage.setLanguage('vi' | 'en')` changes a mounted guideline view. Unsupported prose locales are rejected. A component's explicit locale remains its own contract.

The source-only color policy in `scripts/guideline-hex-policy.json` records exact intentional guideline specimen literals, including the Arabic diagnostic. Run `node scripts/check-guideline-hex-policy.mjs`. Parsed CSS/HTML and named JS/JSX literal contexts reject new colors, changed owners/counts and stale entries; numeric HTML entities are not color literals. This preserves official anchors and fixed illustrative reference values without exempting whole files.

The bilingual rollout also supplies missing document titles and corrects concrete guideline contrast/semantics: the disabled appearance is an actual disabled native specimen, strong-surface labels use their paired ink, informative prohibition and preview text stays readable, and native Atomic toolbar selects have actual 44px coarse-pointer height. These changes preserve component/demo JSX and handlers.

## Verification and acceptance

The focused checks validate every declared source owner in both views, accessible descriptions and subtree language, the actual source compiler/CSP, keyboard focus and native language selection, nested guideline synchronization and escaped-text behavior. Browser evidence distinguishes the desktop card canvas from touch controls and wider fixed specimens. Automated copy completeness and rendering checks do not establish linguistic quality or human visual/accessibility acceptance. Vietnamese translation acceptance remains unverified until reviewed by a human.

The authored English HTML retains `lang="en"` when JavaScript is disabled or the language script cannot load. The executing runtime projects the selected copy before setting the document language; the default executing view is Vietnamese.
