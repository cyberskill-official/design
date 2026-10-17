**Result** — page-level outcome view (success/error/warning/info) with bilingual default titles.

```jsx
<Result status="success" actions={<Button size="sm">Back home</Button>}>
  Your wish is with the team — we reply within one business day.
</Result>
```

Numeric zero is preserved in declared ReactNode content slots. Conditionally rendered slots still omit their wrapper for empty-string, false and null values; existing default-title behavior is unchanged.

Keyboard: The outcome view adds no keyboard commands. Composed action controls retain their own focus and activation behavior.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. A null/undefined title uses the localized status title; supplied title, body and actions remain caller-owned.

Source evidence: `Result.jsx` and `Result.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
