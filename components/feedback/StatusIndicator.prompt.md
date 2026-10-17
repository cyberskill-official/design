**StatusIndicator** — coloured dot + label (`online`/`busy`/`offline`/`error`); `pulse` for live states.

```jsx
<StatusIndicator status="online" pulse>All systems go</StatusIndicator>
```

Keyboard: The status display adds no keyboard action. The dot is decorative; include a meaningful text label.

Localization: The status label is caller-owned. The component does not detect connectivity or translate status text; pulse stops under reduced-motion.

Source evidence: `StatusIndicator.jsx` and `StatusIndicator.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
