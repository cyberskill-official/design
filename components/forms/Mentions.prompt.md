**Mentions** — textarea suggesting @users as you type (APG editable combobox).

Keyboard: ArrowUp/Down move the active suggestion (`aria-activedescendant`); Enter selects; Escape closes. Mouse click still picks.

```jsx
<Mentions users={["anle","baovu","lumi"]} placeholder="Add a note — @ to mention"/>
```
