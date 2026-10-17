**Tabs / Tab** — underlined tablist (Ochre active indicator), controlled by `value`/`onChange`. Wire your own panels via `aria-controls`.

```jsx
<Tabs value={lens} onChange={setLens}
  tabs={[{value:"board",label:"Board"},{value:"table",label:"Table",count:6}]} />
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

The tablist scrolls horizontally when labels exceed its container. Tabs retain their intrinsic label width instead of shrinking into overlapping text. Each tab stays fully inside the scrollport; coarse-pointer controls keep at least 44px of visible height. Rich labels may use nonwrapping text, but must not widen the page.

The standalone Tab primitive can be used inside a caller-managed tablist. Derive unique IDs, render the matching panel, and implement the list’s arrow handler; the primitive does not coordinate sibling tabs.

```jsx
<Tab id={boardTabId} aria-controls={boardPanelId}
  selected={lens === "board"} tabIndex={lens === "board" ? 0 : -1}
  onClick={() => setLens("board")} onKeyDown={onTabKeyDown}>Board</Tab>
```

Keyboard: Tabs uses the declared axis arrows plus Home/End, wrapping and automatic onChange requests; the parent supplies a value matching an item. Tab is a primitive native tab button: hand-composed lists must supply roving tabIndex, arrow handlers, IDs/panel relationships and selection/visibility themselves.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default tablist name is localized; labels, counts, custom ARIA names and all panel content are caller-owned.

Source evidence: `Tabs.jsx` and `Tabs.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
