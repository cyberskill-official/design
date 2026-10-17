**SegmentedControl** — pill toggle group for a few mutually exclusive options (the Status Hub lens switcher). Controlled via `value`/`onChange`.

```jsx
<SegmentedControl value={lens} onChange={setLens}
  options={[{value:"board",label:"Board"},{value:"table",label:"Table"}]} />
```

Set `aria-orientation="vertical"` for Up/Down navigation and provide the matching
vertical layout (for example `style={{flexDirection:"column"}}`). Horizontal is
the default and uses Left/Right; keys on the other axis are left to the browser.
Both orientations retain Home/End, wrapping, automatic selection via onChange
and one tab stop. Keep controlled value in sync with onChange.

Each item accepts `id` and `aria-controls` for caller-rendered panels. Give IDs
unique across the document (for example, derive a prefix with React.useId), set
`role="tabpanel"` and `aria-labelledby` on the matching panel, and hide inactive
panels using the controlled value. Add `tabIndex={0}` to panels without an initial
focusable element. These attributes do not create panels or manage their visibility.

Option icons preserve numeric `0`; `null`, `false` and empty strings omit the icon slot.

Keyboard: Horizontal uses Left/Right, vertical uses Up/Down; Home/End and wrapping select through `onChange`. Keep the controlled value and caller-rendered panels in sync.

Localization: Option labels/icons and the group’s accessible name are caller-owned. There are no built-in translated options.

Source evidence: `SegmentedControl.jsx` and `SegmentedControl.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
