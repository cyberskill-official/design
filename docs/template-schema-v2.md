# Template content-schema v2 — typed content slots

Purely additive, opt-in metadata: a sidecar `templates/<slug>/content-schema.json` next to a template's `.dc.html`, declaring the **type** of each `{{ hole }}` already in the template — so an agent can identify source content holes and their metadata before editing a template. Source metadata remains nonbinding by default; adopted plain-text and bounded structured display slots can explicitly opt into the validated content API below. Published on Storybook **Docs** at `design.cyberskill.world`.

**Adding metadata requires no template-markup changes.** The slot `id` is the hole name already used in the `.dc.html` (e.g. `{{ heroH }}`) and already bound in the logic class's `renderVals()` — the schema just describes it.

## Shape

```json
{
  "$schemaVersion": "2.0",
  "template": "marketing-page",
  "slots": [
    { "id": "heroH", "type": "text", "label": "Hero headline", "maxLength": 70, "required": true },
    { "id": "heroP", "type": "richtext", "label": "Hero paragraph" },
    { "id": "svcKicker", "type": "text", "label": "Services eyebrow", "maxLength": 40 }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `$schemaVersion` | yes | `"2.0"` for this spec |
| `template` | yes | matches the `templates/<slug>/` folder name |
| `slots[].id` | yes | must equal a real `{{ id }}` hole present in the sibling `.dc.html` |
| `slots[].type` | yes | one of: `text`, `richtext`, `image`, `link`, `list`, `table`, `date`, `number` |
| `slots[].label` | yes | human-readable, for a content-fill UI |
| `slots[].maxLength` | no | text/richtext metadata; a hard Unicode code-point limit for adopted runtime text |
| `slots[].required` | no | default `false` |
| `slots[].runtimeBinding` | no | `"text"` adopts plain text; `"number"` adopts only the finite percent-width contract; `"structured"` adopts an exact bounded list/table display model. Each requires its corresponding bounds/model/target metadata |
| `slots[].i18n` | no | `{"en": "...", "vi": "..."}` — for templates that ship EN·VI variants |

The formal machine-checkable shape lives in `templates/schema/content-schema.schema.json` (JSON Schema draft-07). `_audit/template-schema-test.html` validates every sidecar that exists — bidirectionally against eligible content holes: every declared slot id must be a content hole in the `.dc.html`, and every content hole must appear as a slot — **and enforces coverage**.

## Which holes are schema-eligible

A `{{ hole }}` is a **content hole** (schema-eligible) unless it is:

- an **axis / control-flow** hole — `rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `dirAttr`, `true`, `false`, anything matching `is<Uppercase>` (`isEN`, `isVN`, `isBoth`, `isTable`, …), or a bare numeric literal;
- a **boolean tweak** hole — anything matching `show|hide|has|enable|with` + `<Uppercase>` (`showLogo`, `showSignatures`, `showQuote`, …);
- a **runtime-control** hole — UI selection / handler wiring: exact names `tabs`, `tab`, `lens`, `chatOpen`, `closeChat`, `dangerOpen`, `closeDanger`, or anything matching `set|open` + `<Uppercase>` (`setTab`, `setLens`, `openChat`, …).

Those are runtime axes, not typed content slots, and stay out of schema. The exact `__csDisplayLiteralEmpty` constant is also runtime-owned: it preserves literal separators around legacy text bindings, is always an empty string, and cannot be declared or overridden as content. No prefix-wide exclusion hides other business fields.

## Rollout — complete for eligible templates, and gated

This shipped **intentionally incomplete** at first: three exemplars (one per major archetype) proved the pattern end-to-end — `marketing-page` (product), `bod-report` (document), `slide-deck` (deck) — and it was then swept across hole-driven templates.

The current source inventory has **84 templates with adopted content holes and 84 sidecars**. The remaining **one template, `doc-style-guide`, is fixed instructional system documentation** and exposes no authorable content holes. `_audit/template-schema-test.html` fails if an eligible content hole lacks a sidecar or a declared slot has no source destination. A new authorable `{{ hole }}` requires its sidecar in the same change.

The gate uses a generated draft-07 validator compiled by pinned Ajv during maintenance, not runtime compilation. Unknown properties and malformed translations fail according to the formal schema; duplicate slot ids also fail. Run `npm run build:content-schema-validator` after schema edits and `npm run test:content-schema` to check all sidecars, browser CSP compatibility and failure paths. Schema validity describes metadata, not export fidelity or approval of business content.

## Source slots and runtime content

The 84 sidecars describe **832 adopted source slots**: **806 validated plain-text slots**, **one finite percent-width number**, and **25 bounded structured display models**. Text includes 64 exact attribute/prop destinations; other text is bound to observed native content. Invoice/quote dates, fixed row cells and explicit totals are supplied independently without arithmetic. Fixed source prose outside declared slots is not implicitly editable. See [validated template content](template-content.md) for safeguards and export boundaries.

An adopting template's logic script declares `data-content-schema="./content-schema.json"`. A text-adopting sidecar slot has `runtimeBinding: "text"`, `type: "text"` or `"richtext"`, and a positive `maxLength`. The runtime loads the adjacent schema, verifies direct text holes or exact allowed `runtimeTargets`, excludes controls and axes, and permits replacement only of an existing computed string. Name/label destinations also declare `minLength: 1` and `semanticReason`. No HTML parsing, URL injection, rich-text execution or arbitrary property merge is provided.

After mount, call `window.__dcSetContent(window.__dcRootName(), {clientName: 'Công ty Ánh Dương'})`. The separate content object is validated before storage: unknown names, prototype keys, values outside their declared scalar or structured model, oversized values and empty required text fail synchronously, preserving the previous content state. Length counts Unicode code points. Valid content overrides the declared display values after `renderVals()`; omitted keys retain localized defaults. Every call replaces the previous content object, and `{}` resets all overrides. Overrides persist literally across language changes; supply translated content explicitly when needed, rather than passing locale objects. Language/theme controls continue through `__dcSetProps`; passing content holes as control props does not adopt them.

The CLI accepts `--content /path/content.json` with the same runtime validation. A successful run receipt records supplied content, source hash and browser scope; handle receipts according to the sensitivity of the content. Observed invoice/quote dates, native fixed-row fields and explicit amounts are now declared display bindings. Row structure, financial calculations and legal/commercial policy remain authored; the runtime does not infer totals, taxes, date conversions or new rows.

Run `node _audit/ci/lib/run-browsers.mjs _audit/ci/test-template-content-browser.mjs` for EN/VI customization, escaping, invalid input preservation, reset, non-adoption and malicious-schema rejection in all engines. Regenerate primitive copies and the source inventory after changes. Metadata validation, runtime payload validation and delivered DOCX/PDF fidelity remain separate evidence.

Runtime text also rejects XML 1.0 forbidden controls/noncharacters and malformed UTF-16 so accepted content can be preserved in editable DOCX. Rejection keeps the previous state; characters are never silently removed or replaced. Valid supplementary Unicode characters, tabs and line breaks remain allowed.


## Structured display records

All 25 formerly source-only list/table slots now declare `runtimeBinding: "structured"`, bringing explicit adoption, with the explicit display-field adoptions below, to all 832 current sidecar slots (806 plain text, one finite percent number and 25 structured). `scripts/template-content-models.json` owns the exact per-template shapes and destinations; `node scripts/generate-template-content-models.mjs --check` rejects drift. This is display-data binding, not a general component-prop API.

Each structured slot has `runtimeModel`, `runtimeProjection` and exact `runtimeTargets`. Models permit only bounded dense arrays, exact plain records, nonempty XML-safe strings and finite numbers where already authored. They reject unknown/missing fields, functions, accessors, inherited/custom prototypes, sparse arrays, invalid UTF-16/XML characters and invalid declared enum values. Arrays have at most 100 items per declared level; nesting is bounded, with a shared 2,048-node / 262,144-code-point budget for structured input. Individual field limits remain in each sidecar. Required lists cannot be empty. No content is sanitized or interpreted as HTML.

```js
__dcSetContent(__dcRootName(), {
  rows: [{ key: "DEMO", name: "Customer project", squad: "Platform", pct: 72, status: "In progress" }]
});
```

This example uses the existing App shell/Dashboard row model. The four table-header slots use `runtimeProjection: "column-headers"`: supply all existing `{key, header}` records in their existing order. Column keys/order and authored render callbacks remain owned by the template; caller functions and new columns are rejected. Row identities (`key`, `id` or `name`, as declared) and option values must be unique. Settings language options retain the existing EN/VI values; this adds no formatter or locale support.

The setter takes an immutable snapshot and rejects the entire update before changing prior content. Mutating a caller array afterwards has no effect. A call replaces the content bag; omitted slots return to authored defaults, and `{}` resets it. Caller text remains literal across subsequent theme/language changes; callers supply their translations. Monetary cells are existing display strings: no arithmetic, rounding, exchange-rate, payroll or legal validity rule is inferred. Keep content-owner/counsel review where already required.

The focused browser checks compare supplied authored defaults with the original rendered HTML and editable DOCX, then exercise caller records, native UI states, escaping and print media in three engines. Parsed PDF text uses Chromium. The Board report's AI source list is an interactive disclosure outside the document export root; its omission from document exports preserves that existing scope. Physical Office layout and human accessibility acceptance remain separate.

## Owned template copy and static artwork

`scripts/template-literals-source.json` owns the 15-entry element map, exact shared bilingual phrases and per-template static EN/VI string dictionaries. `node scripts/generate-template-literals.mjs --check` verifies offline literal copies; adoption preserves every DC script AST and original literal spelling, including explicit lexical exceptions. It does not merge rendering logic or structured default models. Template-specific business values remain independently owned even when equal.

Seventy-one templates use only fixed-size official Logos. Their native image references the unchanged `assets/logo-mark.svg` through the existing one-line `ds-base.js` base rebind, and their explicit static-logo marker omits the unused component bundle. React, the DC interpreter and portable runtime copies remain. The 14 component-bearing templates retain the bundle. The exporter recognizes only this official same-origin image path alongside its existing SVG support, preserving logo drawings in DOCX and raster PDF. Exact screen/print pixel, geometry, accessible-name and DOCX comparisons guard the substitution; this is not arbitrary component replacement or React elimination.

## Named native-paper fill fields

The source-only contract is `scripts/template-native-paper-fields.json` in the repository checkout; generator inputs are not published in the webroot. The initial eleven named plain-text fields remain in three existing bilingual papers: certificate of employment (`employeeName`, `citizenId`, `position`, `department`), employee request (`employeeName`, `positionDepartment`, `lineManager`, `workHandoverRecipient`), and resignation (`employeeName`, `departmentPosition`, `laborContractReference`). Each maps to its existing labeled, fill-only table cell.

### Extended native-paper fill cells

The generalized producer also supports 22 explicitly mapped identity/contact display fields across the labor, probation, internship, contractor and mutual-NDA papers. All 33 fields retain their exact existing placeholder defaults, including 15, 30, 31 and 60 dots; surrounding Vietnamese/English clauses, layout, issuing-company identity and signature blocks remain authored.

Supply these fields through the same `__dcSetContent` or CLI `--content` API. Each is required when supplied and accepts at most 256 Unicode code points; omitted fields retain their placeholder. Values are display strings only. No identity verification, legal validity, date parsing, notice calculation, leave balance, financial calculation or signature is inferred. Private identity data remains the caller's responsibility, including generated export files and receipts.

Run `node scripts/generate-template-native-paper-fields.mjs`, then `--check` for a read-only freshness check. Each mapping carries an exact whitespace-normalized bilingual `anchorLabel` for the first table cell, its display `rowLabel`, and the observed dot-only `default`. The producer requires exactly one fill-only span in the paired value cell, rejects ambiguous or changed labels/defaults and symlinked sources/outputs, and reconstructs the entire original source to its reviewed hash before emitting any files. It validates every output before writing. Node mutations reject drift without partial writes; browser tests compare original/default full markup, pixels and DOCX XML/media, literal custom text, reset and unsafe-input rejection. Browser-print PDF text validation is Chromium-only. The initial adoption covered three papers; this extension adds five explicitly reviewed papers. Other templates require their own observed target metadata. This is bounded coverage, not a fully data-driven template catalog.

## Business records and finite percent display

The observed display-data projection now covers 36 templates and 282 fields: 281 plain-text fields and one finite percent field. Across all 84 sidecars the contract contains 832 adopted slots: 806 plain-text slots, 25 bounded structured models, and one number. These are source inventory counts, not a claim of universal editable business prose or native Office fidelity.

Invoice, quote, expense and SOW rows retain their authored native table structure. Dates, item descriptions, quantities, rates, explicit amounts and totals are supplied independently as display strings; the runtime performs no financial arithmetic, locale conversion, date validation or legal interpretation. HR given-name destinations share one field, while localized date/title strings remain explicit. Existing invoice/client slots and their constraints are preserved when new fields are added. Exact raw text context around a binding remains template-owned, and regeneration must restore the complete original template hash.

Delivery status adopts `completionPercent` as a number from 0 through 100, inclusive (default 72). For example:

```js
__dcSetContent(__dcRootName(), { completionPercent: 37.5 });
```

The `number` slot requires `minimum: 0`, `maximum: 100`, `runtimeBinding: "number"`, `runtimeProjection: "percent-width"`, and exact native-span `data-dc-percent-width` destinations. That private DSL attribute is removed from the rendered DOM. Only an inspected empty, noninteractive bar span inside its clipping track can receive the number as a percent width. Both label and width use the same finite value; strings (including numeric strings), NaN, infinities, out-of-range values, accessors and prototype payloads fail atomically. This contract grants no general style, URL, event, arbitrary attribute or expression injection.

The remaining specimen legal/commercial terms, organizational identity, instructional blanks and long-form example prose remain template-owned. Replacing those terms is an authored content change requiring its appropriate review; the display-data interface does not certify legal, tax, accounting or policy accuracy. Fixed row counts remain fixed; adding/removing rows is a separate explicit structured model contract. Focused validation compares original/default DOM, pixels and DOCX, checks each actual custom destination in supported language views, and checks real parsed PDF text in Chromium. Other engines cover DOM, DOCX and print layout. Final site, physical-device, manual accessibility and human review acceptance remain separate.
