# Browser template grammar

The `.dc.html` files are browser-interpreted sources. Serve the repository over HTTP and open a template entry directly. `support.js` loads the local React peers, parses declarations, mounts the template and exposes the runtime prop setter. A proprietary compiler is not required for this path. The runtime source is `scripts/template-runtime/primitives/support.js`; `templates/_vendor/support.js` and per-template copies are generated. Run `node scripts/build-template-primitives.mjs` and `node scripts/sync-support-runtime.mjs` after changing their authored sources.

## Structure and bindings

- `<x-dc>` contains the markup to render. `<!-- @template name="…" description="…" -->` supplies authoring metadata.
- `<helmet>` supplies document styles and dependency scripts, including `./ds-base.js`. Dependencies keep their relative URLs; copy the required stylesheet, fonts, images and runtime tree with a template.
- `<script type="text/x-dc" data-dc-script data-props="…">` declares a `class Component extends DCLogic` with `renderVals()`. `data-props` is an HTML-escaped JSON object describing controls; existing enum declarations have `editor`, `options`, `default`, `tsType` and `section`. Boolean controls use boolean defaults. These declarations describe supported choices, not arbitrary content bindings.
- `renderVals()` returns the binding scope. `this.props` holds initial defaults merged with supplied props. A whole `{{ name }}` binding preserves its value type; embedded bindings become text. Dotted property paths are supported; arbitrary expressions are not. Never interpolate untrusted JavaScript into template logic.
- `<sc-if value="{{ flag }}">` conditionally renders children. `<sc-for list="{{ rows }}" as="row">` requires an array and creates a local alias. For controls around table rows, use inert `<template data-cs-dc-control="if|for" …>` to avoid the HTML parser relocating invalid table children.
- `<x-import component-from-global-scope="CyberSkillDS.Logo">` resolves a component from the runtime global. Imported props, styles and event bindings are converted to React props. `hint-*` and `data-dc-*` are authoring metadata, not rendered DOM props.

The helper `ds-base.js` loads the stylesheet and component bundle only after both React globals are ready, publishes `window.CyberSkillDS`, establishes a main landmark and synchronizes document language from the rendered content scope. Set `lang="{{ langAttr }}"` on the top content wrapper; nested quotations may retain their own language.

## Runtime changes

After the template mounts, use `window.__dcSetProps(window.__dcRootName(), {language: 'Tiếng Việt'})` for templates that declare that choice. Inspect the selected `data-props` declaration first: many templates have no language control. Computed values returned by `renderVals()` may override props with the same name. `content-schema.json` describes source holes; it is not an automatic content API. See [content schema](template-schema-v2.md).

The source-derived inventory is `docs/template-inventory.json`. Regenerate it with `node scripts/generate-template-inventory.mjs`; check freshness with `node scripts/generate-template-inventory.mjs --check`. Its capability fields name implementation paths and test commands, not successful runs or human acceptance. Source hashes and declaration coverage make drift visible.

## Export and acceptance boundaries

Document templates with `meta[name="omelette-owns-print"]` load the in-repository Download toolbar: editable DOCX and a raster PDF snapshot. Browser print is the separate paginated/text-layer path. The portable render CLI is documented below when available. PPTX writing (`gen_pptx`), host tweak panels, `super_inline_html` and `check_design_system` require external tools. Image-slot persistence additionally requires `window.omelette.writeFile`; static preview alone does not provide it.

Run `node _audit/ci/test-template-bootstrap-browser.mjs` for every manifest template; add `--browser=firefox` or `--browser=webkit` for those engines. This verifies local bootstrap ordering, rendering and language synchronization. DOCX/PDF fidelity, arbitrary content, visual review and manual accessibility acceptance remain separate. `file://` behavior is not the supported consumption path: use an HTTP server so fetch, fonts and relative dependencies work consistently.

## Render CLI

```sh
node scripts/render-template.mjs finance-invoice --output /tmp/cs-invoice-preview --props /tmp/invoice-props.json --format html
node scripts/render-template.mjs finance-invoice --output /tmp/cs-invoice-print --format pdf
```

The props file is a JSON object containing declared runtime controls, for example `{"language":"Tiếng Việt"}`. Output must be a new directory outside the repository; existing files are never overwritten. HTML is a frozen rendered snapshot with a resource copy, not an interactive or single-file export. `--browser firefox|webkit` supports HTML snapshots; PDF uses Chromium print because Playwright has no PDF writer for the other engines. A `receipt.json` records source hash, props, engine and scope. Use `--content /tmp/invoice-content.json` for explicitly adopted schema slots, for example `{"clientName":"Công ty Ánh Dương","invoiceReference":"INV-CUSTOM"}`. Runtime validation rejects source-only slots, controls and invalid types; see [content binding](template-schema-v2.md). The resource envelope is deliberately broad; smaller distribution packaging is a separate decision.

HTML snapshot serialization currently rejects `image-slot` templates because their shadow content requires a dedicated serializer; use PDF or the live browser preview for those templates. This fail-closed boundary avoids silently losing images.

Native DOM event bindings under the static hash CSP use `data-cs-on-click="{{ action }}"` or `data-cs-on-keydown="{{ handleKey }}"`. The runtime resolves these inert attributes to React event listeners; it does not execute HTML handler strings. Existing non-native component bindings such as `on-change` remain supported. Legacy native `onclick`/`onkeydown` source can still be interpreted in compatibility consumers, but the strict site build rejects native handler attributes. The shared DC logic serializer owns the exact executable wrapper; raw `text/x-dc` is inert data and must not be hashed as if it executed directly.

Validated content bindings are documented in [template content](template-content.md). This content channel preserves supplied numeric- and boolean-looking text as strings; legacy control-prop coercion remains separate. Structured list/table slots require their own data models.

Repeated literals have one authored source in `scripts/template-literals-source.json`: the 15-entry element map for every DC template and 30 exact shared EN/VI phrase pairs. `npm run templates:literals` projects only fenced AST literal regions; `npm run test:template-literals` checks all 85 templates, ownership and drift. Templates retain inline values and remain self-contained. Template-specific copy, locale models and markup stay independently authored.
