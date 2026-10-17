**ScrollArea** — focusable overflow region for dense panels (settings, long bilingual copy). Pass `maxHeight` to cap the scrollport.

```jsx
<ScrollArea maxHeight={240} aria-label="Notification preferences">
  {/* long list */}
</ScrollArea>
```

Keyboard: The overflow region has tabIndex zero by default, allowing native keyboard scrolling when content overflows. Caller native props may override tabIndex; provide an accessible region name when the panel needs identifiable context.

Localization: Child content and any ARIA name are caller-owned; there is no built-in translated label.

Source evidence: `ScrollArea.jsx` and `ScrollArea.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
