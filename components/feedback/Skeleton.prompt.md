**Skeleton** — shimmer placeholder while content loads. Use `lines` for text, or a `block`/`circle` sized by width/height.

```jsx
<Skeleton variant="circle" width={40} height={40} />
<Skeleton lines={3} />
```

Finite fractional `lines` round down, and the final rendered text line stays at 70% width. Nonpositive, nonfinite or unrepresentable counts use the single block/circle view.

Keyboard: The placeholder is decorative and hidden from assistive technology. It adds no keyboard action; the caller manages loading state and provides any meaningful status separately.

Localization: There is no visible or translated text. The shimmer stops under reduced-motion.

Source evidence: `Skeleton.jsx` and `Skeleton.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
