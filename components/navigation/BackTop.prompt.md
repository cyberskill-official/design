**BackTop** — scroll-to-top button after a threshold (bilingual aria).

```jsx
<BackTop threshold={400}/>
```

Scrolls instantly when `prefers-reduced-motion: reduce` is active, otherwise smoothly. The preference is read when activated, so live system changes apply without remounting.

Keyboard: After the scroll threshold, Tab reaches the native button and Enter/Space scrolls to the top. The activation reads the current reduced-motion preference.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. A supplied accessible label overrides the localized default.

Source evidence: `BackTop.jsx` and `BackTop.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
