**Switch** — accessible on/off toggle (`role="switch"`), Umber track when on in Light; Ochre in Dark. For instant-apply settings (use Checkbox in forms that submit).

```jsx
<Switch label="Dark theme" checked={dark} onChange={e => setDark(e.target.checked)} />
```

A numeric `0` label remains visible and supplies the accessible name. Explicit ARIA naming retains precedence; absent/empty labels retain the localized fallback.

Keyboard: Uses the native checkbox’s focus and Space activation with `role="switch"`. Supply a label or explicit ARIA name that identifies the setting.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `Switch.jsx` and `Switch.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
