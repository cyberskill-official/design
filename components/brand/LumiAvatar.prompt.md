**LumiAvatar** — the golden-genie mascot avatar. Pass `src` (e.g. `assets/lumi-poster.webp`) or fall back to the ✦ glyph on the golden gradient.

```jsx
<LumiAvatar src="../../assets/lumi-poster.webp" size="lg" ring />
```

Keyboard: The avatar adds no keyboard action. If composed into a link or button, that parent owns focus, activation and its accessible name.

Localization: The image alt defaults to the fixed name Lumi. The fallback glyph is decorative; provide an accessible name or nearby text when the fallback must convey identity.

Source evidence: `LumiAvatar.jsx` and `LumiAvatar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
