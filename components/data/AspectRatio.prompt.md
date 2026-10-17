**AspectRatio** — CSS `aspect-ratio` lock for marketing media and framed content. Default `16 / 9`.

```jsx
<AspectRatio ratio="16 / 9">
  <img src="…" alt="…" />
</AspectRatio>
```

Keyboard: The wrapper adds no keyboard action; interactive children retain their own behavior. The `ratio` prop determines the wrapper’s aspect ratio even if caller `style` supplies another aspectRatio.

Localization: Labels and child content are caller-owned; this component has no built-in translation.

Source evidence: `AspectRatio.jsx` and `AspectRatio.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
