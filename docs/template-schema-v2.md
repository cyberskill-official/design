# Template content-schema v2 — typed content slots

Purely additive, opt-in metadata: a sidecar `templates/<slug>/content-schema.json` next to a template's `.dc.html`, declaring the **type** of each `{{ hole }}` already in the template — so an agent or pipeline can populate/validate real client content programmatically without parsing HTML or guessing.

**Zero template-markup changes required.** The slot `id` is the hole name already used in the `.dc.html` (e.g. `{{ heroH }}`) and already bound in the logic class's `renderVals()` — the schema just describes it.

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
| `slots[].type` | yes | one of: `text`, `richtext`, `image`, `link`, `list`, `table`, `date` |
| `slots[].label` | yes | human-readable, for a content-fill UI |
| `slots[].maxLength` | no | text/richtext only — a soft authoring guide, not enforced by DC |
| `slots[].required` | no | default `false` |
| `slots[].i18n` | no | `{"en": "...", "vi": "..."}` — for templates that ship EN·VI variants |

The formal machine-checkable shape lives in `templates/schema/content-schema.schema.json` (JSON Schema draft-07). `_audit/template-schema-test.html` validates every sidecar that exists — bidirectionally: every declared slot id must resolve to a real hole in the template, and (informationally) reports coverage across all `templates/`.

## Rollout

Like the visual-diff baselines, this shipped **intentionally incomplete** at first — three exemplars (one per major archetype) proved the pattern end-to-end: `marketing-page` (product), `bod-report` (document), `slide-deck` (deck). It has since been **swept across hole-driven templates** and keeps growing; current sidecar coverage is reported by `_audit/template-schema-test.html` (39/84 as of the latest sweep — product shells plus document/HR/legal/VN list-driven templates). Axis / control-flow holes (`rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `isEN`, `true`, …) and boolean tweak holes (`showLogo`, `showSignatures`, …) stay out of schema — they are runtime axes, not typed content slots. Templates that only expose those axes (or hardcode bilingual copy per `sc-if` language branch) correctly omit a sidecar until they gain authorable `{{ hole }}` content. Add a sidecar to any template that gains hole-driven content as it's touched; prefer measurable growth on high-traffic templates first.
