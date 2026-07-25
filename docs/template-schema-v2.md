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

The formal machine-checkable shape lives in `templates/schema/content-schema.schema.json` (JSON Schema draft-07). `_audit/template-schema-test.html` validates every sidecar that exists — bidirectionally against eligible content holes: every declared slot id must be a content hole in the `.dc.html`, and every content hole must appear as a slot — **and enforces coverage**.

## Which holes are schema-eligible

A `{{ hole }}` is a **content hole** (schema-eligible) unless it is:

- an **axis / control-flow** hole — `rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `dirAttr`, `true`, `false`, anything matching `is<Uppercase>` (`isEN`, `isVN`, `isBoth`, `isTable`, …), or a bare numeric literal;
- a **boolean tweak** hole — anything matching `show|hide|has|enable|with` + `<Uppercase>` (`showLogo`, `showSignatures`, `showQuote`, …);
- a **runtime-control** hole — UI selection / handler wiring: exact names `tabs`, `tab`, `lens`, `chatOpen`, `closeChat`, or anything matching `set|open` + `<Uppercase>` (`setTab`, `setLens`, `openChat`, …).

Those are runtime axes, not typed content slots, and stay out of schema.

## Rollout — complete for eligible templates, and gated

This shipped **intentionally incomplete** at first: three exemplars (one per major archetype) proved the pattern end-to-end — `marketing-page` (product), `bod-report` (document), `slide-deck` (deck) — and it was then swept across hole-driven templates.

That sweep is now **finished and locked**. As of Jul 2026 the split is **39 content-hole-driven templates, all 39 with a sidecar**, and **45 templates that expose only axis/boolean holes** (bilingual copy hardcoded per `sc-if` branch), which correctly omit one. `_audit/template-schema-test.html` no longer merely reports this — it **fails** if any template exposing a content hole lacks a sidecar. So the rule for authors is mechanical: a template that gains an authorable `{{ hole }}` gains a sidecar in the same change, or the board goes red.
