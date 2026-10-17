# Template content-schema v2 — typed content slots

Purely additive, opt-in metadata: a sidecar `templates/<slug>/content-schema.json` next to a template's `.dc.html`, declaring the **type** of each `{{ hole }}` already in the template — so an agent can identify source content holes and their metadata before editing a template. The sidecar does not itself bind supplied values to the runtime. Published on Storybook **Docs** at `design.cyberskill.world`.

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
- a **runtime-control** hole — UI selection / handler wiring: exact names `tabs`, `tab`, `lens`, `chatOpen`, `closeChat`, `dangerOpen`, `closeDanger`, or anything matching `set|open` + `<Uppercase>` (`setTab`, `setLens`, `openChat`, …).

Those are runtime axes, not typed content slots, and stay out of schema.

## Rollout — complete for eligible templates, and gated

This shipped **intentionally incomplete** at first: three exemplars (one per major archetype) proved the pattern end-to-end — `marketing-page` (product), `bod-report` (document), `slide-deck` (deck) — and it was then swept across hole-driven templates.

That sweep is now **finished and locked**. At the current source inventory the split is **40 content-hole-driven templates, all 40 with a sidecar**, and **45 templates that expose only axis/boolean holes** (content is authored directly in the template; language support follows each template’s contract), which correctly omit one. `_audit/template-schema-test.html` no longer merely reports this — it **fails** if any template exposing a content hole lacks a sidecar. So the rule for authors is mechanical: a template that gains an authorable `{{ hole }}` gains a sidecar in the same change, or the board goes red.

The gate uses a generated draft-07 validator compiled by pinned Ajv during maintenance, not runtime compilation. Unknown properties and malformed translations fail according to the formal schema; duplicate slot ids also fail. Run `npm run build:content-schema-validator` after schema edits and `npm run test:content-schema` to check all sidecars, browser CSP compatibility and failure paths. Schema validity describes metadata, not export fidelity or approval of business content.

## Source slots and runtime props

The current 40 sidecars describe 512 source-content slots. None is a declared
`data-props` runtime input. For example, App shell declares `language`, `element`
and `theme`; its `h1` slot is computed by `renderVals()`. The runtime combines
props with computed values, with computed values taking precedence. Passing
`{h1: "Custom title"}` to `__dcSetProps` therefore does not customize that heading.

Agents should read the sidecar, locate the corresponding source hole and
`renderVals()` value or localized content, then edit the authorized source and
verify both preview and export. Keep language variants aligned and obtain the
proper content-owner approval for substantive business/legal changes. Use only
declared runtime props as candidate controls, and test their actual effect.
The internal template inventory records this distinction per slot; metadata
validation does not validate client payloads, sanitize rich text, or enforce
`maxLength` in the DC runtime. A generic content-injection API would be a new
public contract requiring explicit binding, validation and precedence rules.
