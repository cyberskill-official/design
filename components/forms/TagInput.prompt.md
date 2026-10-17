**TagInput** — multi-value tokens (Enter/comma adds · Backspace removes · blur commits). Pass `label` for a visible field name; bilingual placeholder + remove labels via the registry.

```jsx
<TagInput label="Tags" defaultValue={["Web apps","Bilingual"]} onChange={setTags} max={8}/>
```

Enter/comma during IME composition does not create a tag. Disabling the input prevents a pending draft from being committed by blur.

Keyboard: Enter/comma adds a trimmed nonduplicate tag; Backspace removes the last tag only when the draft is empty, and blur commits while enabled. IME composition does not commit. Native remove buttons support Enter/Space.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `TagInput.jsx` and `TagInput.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
