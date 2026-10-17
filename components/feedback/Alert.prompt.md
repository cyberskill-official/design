**Alert** — inline banner. Semantic `variant` sets the accent border + default icon (override with `icon`). Meaning lives in the text, not colour alone.

```jsx
<Alert variant="warning" title="Blocked">Provenance ledger needs the signing service.</Alert>
<Alert variant="success">All 15 element packs verified — zero warnings.</Alert>
```

Numeric zero is preserved in declared ReactNode content slots. Conditionally rendered slots still omit their wrapper for empty-string, false and null values; existing default-title behavior is unchanged.

`onDismiss` shows a dismiss button and receives its React mouse event. The callback requests dismissal; the parent owns removing the alert.

Keyboard: The message container adds no keyboard commands. If `onDismiss` is supplied, Tab reaches a native dismiss button and Enter/Space invokes it; the caller removes the alert.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in translated copy is the dismiss button label; supplied title/body remain caller-owned.

Source evidence: `Alert.jsx` and `Alert.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
