**Mentions** — textarea suggesting @users as you type (APG editable combobox).

Keyboard: ArrowUp/Down move the active suggestion (`aria-activedescendant`); Enter selects; Escape closes. Mouse click still picks.

```jsx
<Mentions users={["anle","baovu","lumi"]} placeholder="Add a note — @ to mention"/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Listbox and option IDs remain stable across server rendering and hydration. Server and client must render the same tree; use distinct identifier prefixes for independent React roots.

Keyboard: When suggestions are open, Up/Down changes the active suggestion and Enter inserts it; Escape closes. Outside that state, the textarea keeps native editing. IME confirmation does not select.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Usernames and entered text remain caller-owned.

Source evidence: `Mentions.jsx` and `Mentions.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
