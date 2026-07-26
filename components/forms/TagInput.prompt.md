**TagInput** — multi-value tokens (Enter/comma adds · Backspace removes · blur commits). Pass `label` for a visible field name; bilingual placeholder + remove labels via the registry.

```jsx
<TagInput label="Tags" defaultValue={["Web apps","Bilingual"]} onChange={setTags} max={8}/>
```
