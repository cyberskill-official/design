**Watermark** — rotated repeating text behind content (e.g. BẢN NHÁP / DRAFT).

```jsx
<Watermark text="BẢN NHÁP"><div className="cs-panel">…</div></Watermark>
```

The decorative text uses an SVG alpha mask with the inherited `--cs-color-text-primary` as its CSS color, so live theme/token changes apply without remounting. The layer is hidden from assistive technology and does not intercept pointer input.

Keyboard: The watermark adds no keyboard action and does not intercept pointer input. Child controls keep their own behavior.

Localization: The repeating text defaults to the fixed brand name CyberSkill; custom text is caller-owned. The layer is decorative and hidden from assistive technology, so expose meaningful document state in the visible content as well.

Source evidence: `Watermark.jsx` and `Watermark.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
