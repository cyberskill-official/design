**HotKeys** — keymap manager + "?" cheat-sheet (bilingual).

```jsx
<HotKeys bindings={[{keys:"mod+k",description:"Command palette",onTrigger:openCmdk}]}>{app}</HotKeys>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.
This blocking surface also traps focus, isolates the background with inert, and preserves nested scroll-lock ownership.

Global bindings and help ignore native form fields, inherited contenteditable regions (including open shadow-tree targets), IME composition and events already prevented by a local handler. Closed shadow roots hide their internals; their host must handle/prevent editing events locally.

Bindings use a case-insensitive `KeyboardEvent.key` preceded by `+`-separated `mod`, `ctrl`, `meta`, `shift` or `alt` modifiers; surrounding whitespace is ignored. `mod` accepts Ctrl or Meta. Other modifiers must match explicitly, including Shift for named keys such as Enter. Unknown modifiers and empty keys do not match. The built-in `?` help gesture remains separate from binding parsing.

Keyboard: The documented key combinations call onTrigger outside editing/composition/already-handled events. ? toggles the help sheet when enabled; Escape closes the modal through the shared overlay stack, which traps focus. Closed shadow hosts must guard editing events themselves.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Binding descriptions, key strings and child content are caller-owned.

Source evidence: `HotKeys.jsx` and `HotKeys.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
