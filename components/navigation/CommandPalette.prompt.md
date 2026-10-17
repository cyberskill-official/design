**CommandPalette** — ⌘K overlay with search + grouped, filterable actions (Escape / scrim-click close). Controlled via `open`/`onClose`.

```jsx
<CommandPalette open={open} onClose={() => setOpen(false)} groups={[
  { label: "Go to", items: [{ label: "Dashboard", shortcut: "G D", onSelect: goDash }] },
]} />
```

Group label, item icon and item shortcut preserve numeric zero; null, false and empty strings omit those slots.

The filtered list includes a visible localized result count, or “No results” /
“Không có kết quả” when empty. The same persistent node has `role="status"`,
`aria-live="polite"` and `aria-atomic="true"`; filtering does not move focus from
the search field. Counts use the resolved EN/VI language, including live ancestor
language changes. This markup and keyboard contract does not certify actual
NVDA/VoiceOver announcements; those require the AT-06 human session.

The overlay manager captures the invoking control before moving focus into search.
Avoid adding native autofocus to the internal input: it would replace the return
target before the manager registers. Selection and Escape restore the invoking
control when it is still connected and available; direct opening without an
invoking control requires the consumer to define a logical return destination.

Keyboard: The caller opens the controlled overlay and registers any Cmd/Ctrl+K shortcut. The shared modal layer focuses search and traps focus; native Tab reaches action buttons and Enter/Space activates them. Escape requests onClose. There is no arrow-key result navigation; the query persists while the same component instance remains mounted.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Placeholder, group/action labels, icons and shortcut hints remain caller-owned. The localized result count is a polite status; actual AT announcements require manual evidence.

Source evidence: `CommandPalette.jsx` and `CommandPalette.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
