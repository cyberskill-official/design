**Masonry** — column-packed gallery.

```jsx
<Masonry columns={3}>{cards}</Masonry>
```

Keyboard: The CSS column wrapper adds no keyboard commands. Interactive children keep their DOM order and native keyboard behavior; visual placement runs top-to-bottom per column.

Localization: Child content is caller-owned and is not translated. Caller style can override the container column count/gap; the gap prop still controls each item’s bottom margin.

Source evidence: `Masonry.jsx` and `Masonry.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
