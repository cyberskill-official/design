**InputGroup** — input with prefix/suffix addons, clearable ×, password reveal. Pass `label` for a visible field name; bilingual button labels via the registry.

```jsx
<InputGroup label="Host" prefix="https://" suffix=".world" defaultValue="cyberskill" clearable/>
<InputGroup label="Password" password placeholder="Password"/>
```

`disabled` applies to the input, clear button and password reveal. `readOnly` prevents editing and clearing while allowing visibility changes. Both preserve the value and emit no value changes from blocked actions.

Keyboard: Uses native input editing. Tab reaches available clear/reveal buttons and Enter/Space activates them. Read-only blocks value changes but permits password visibility changes.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `InputGroup.jsx` and `InputGroup.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
