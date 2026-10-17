**Tag** — chip for filters, keywords, or selected values. Pass `onRemove` for a close button.

```jsx
<Tag>Web apps</Tag>
<Tag onRemove={() => drop(id)}>TASK-DS-041</Tag>
```

Keyboard: A static tag adds no keyboard action. With `onRemove`, Tab reaches a native remove button and Enter/Space invokes the callback; the caller removes the tag.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy is the remove button name; tag content and a custom remove label remain caller-owned.

Source evidence: `Tag.jsx` and `Tag.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
