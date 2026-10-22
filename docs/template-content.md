# Validated template content

The current `.dc.html` runtime accepts explicit, schema-validated plain-text overrides through `window.__dcSetContent(rootName, content)` and the render CLI's `--content` JSON file. The existing five invoice/quote fields remain supported. This batch adds 487 bindings: 376 direct text slots, 41 declared rich-text slots with explicit plain-text projection, 6 closing-copy slots and 64 scalar attribute/prop slots. There are 492 bindings across 33 templates, within 42 sidecars containing 517 slots. These counts describe adopted fields; they do not make every template data driven.

```js
window.__dcSetContent(window.__dcRootName(), {
  heroH: 'A product your team can use',
  heroP: 'Bilingual support, with a clear handoff.',
});
// Restore the template's localized defaults.
window.__dcSetContent(window.__dcRootName(), {});
```

This example uses `marketing-page`. Supply only slot IDs carrying `runtimeBinding: "text"` in that template's adjacent `content-schema.json`. A `richtext` declaration carrying this opt-in still receives a **literal plain string**: HTML, markdown and executable expressions are not interpreted. Closing headings/paragraphs named `closeH` or `closeP` are ordinary computed strings, not close handlers.

Each value must be a string within the declared Unicode-code-point `maxLength`; required slots reject blank strings. Unknown fields, axes, controls, handlers, models, functions, unsafe prototype keys, accessor properties, symbol keys, invalid XML1.0 characters and ill-formed UTF16 are rejected before replacing the accepted content. Validation reads descriptors without calling dictionary getters. A slot can replace only its own computed string; it cannot replace a function or state value. Invalid updates retain the previous accepted content. Objects are copied into a fresh record; mutating the caller's object afterward does not update the template.

Content remains caller-owned and persists across language changes until replaced or reset. `language`, `theme`, element and behavior controls remain in the declared prop API. Keep document identity, monetary calculations, legal decisions and structured rows in their own authored models. The remaining 25 unbound slots are list/table models. They require an explicit structured model rather than a string merge.

Attribute-consuming slots also declare exact `runtimeTargets` entries. The runtime checks the actual tag, component and attribute against both this metadata and a fixed reviewed allowlist. Destinations include component text props, native accessible labels and image-slot placeholder text; URLs, events, functions, arbitrary attributes and partial attribute interpolation remain forbidden. Slots that supply names or control/section labels declare `minLength: 1` and a `semanticReason`; empty or whitespace-only overrides are rejected even when the business field is optional. Numeric and boolean-looking overrides such as `007` or `false` remain strings. Image placeholders bind both language attributes to the existing localized value, preserving defaults while allowing overrides in either language. Their text lives in shadow DOM.

Use the existing renderer with a new output directory:

```sh
node scripts/render-template.mjs marketing-page --content copy.json --output /tmp/custom-page --format pdf
```

`--format html` produces a frozen rendered snapshot where the current serializer supports the surface; image-slot shadow content still requires PDF or the live browser preview. Browser PDF printing is Chromium-only. Existing document export controls remain template-specific; direct DOCX serializer tests do not add an export menu to application templates or establish Microsoft Office fidelity.

Tests cover the 428 direct text projections in English and Vietnamese, including conditional error/chat/notifications/collapsible states, literal HTML-like Unicode text, valid editable DOCX XML and print layout. Chromium PDF bytes are parsed to verify text that the print rules expose; navigation intentionally excluded by print CSS is recorded separately. The board-deck metric grid uses shrinking equal columns and wrapping so a valid longer runway value does not push its fourth metric out of the printed slide. Existing short-content geometry is checked separately.

Separate three-engine tests cover all 64 scalar target fields through actual component prop dispatch, native attributes, shadow text, visible field accessible names, validation and numeric/boolean-looking strings. Attributes such as placeholders and accessible labels do not become document body text; hidden dialog content and print-omitted UI are not promised in DOCX/PDF.

For PDF text verification, use an isolated Python3.11+ environment and the hash-pinned test dependency:

```sh
python3 -m venv /tmp/cs-pdf-tests
/tmp/cs-pdf-tests/bin/python -m pip install --require-hashes --only-binary=:all: --no-deps -r _audit/ci/requirements-pdf.txt
CS_PDF_PYTHON=/tmp/cs-pdf-tests/bin/python node _audit/ci/test-template-content-adoption-browser.mjs
```

The test fails if the exact parser is unavailable. This test-only Python dependency has a separate risk/audit signal from the npm lockfiles; a passing npm audit does not cover it. Automated rendering/export checks do not replace manual accessibility, product visual or target-office review.
