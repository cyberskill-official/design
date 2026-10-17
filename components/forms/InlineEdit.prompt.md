**InlineEdit** — click-to-edit text (Enter/blur commits · Escape cancels). Bilingual edit/empty labels.

```jsx
<InlineEdit defaultValue="Design System v1.6" onChange={rename} label="Project name"/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Keyboard: Enter/Space on the view button starts editing. Enter outside IME composition or blur commits; Escape cancels through the overlay stack. Supply `label` to name the editing input.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `InlineEdit.jsx` and `InlineEdit.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
