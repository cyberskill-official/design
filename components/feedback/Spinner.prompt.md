**Spinner** — indeterminate loading indicator, brand-coloured; stops continuous spinning under reduced-motion.

```jsx
<Spinner /> <Spinner size={28} label="Fetching releases" />
```

Keyboard: The status indicator adds no keyboard action; the caller controls whether loading is active.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. A supplied label overrides the localized loading name. Reduced-motion removes continuous spinning through the global accessibility rule.

Source evidence: `Spinner.jsx` and `Spinner.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
