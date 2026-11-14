---
'@cyberskill/design': minor
---

Card, CardTitle, Meter and Separator render in Server Components with no JavaScript. Card keeps its `render` prop (an element or a function). Meter no longer takes `getAriaValueText` or `render`; pass `aria-valuetext` instead.
