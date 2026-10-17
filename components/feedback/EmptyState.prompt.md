**EmptyState** — placeholder for empty views: icon, title, message, optional actions.

```jsx
<EmptyState title="No projects yet" actions={<Button>Make a wish</Button>}>
  Start by telling Lumi what you'd like to build.
</EmptyState>
```

Numeric zero is preserved in declared ReactNode content slots. Conditionally rendered slots still omit their wrapper for empty-string, false and null values; existing default-title behavior is unchanged.

Keyboard: The empty view adds no keyboard commands. Composed action controls retain their own focus and activation behavior.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. A null/undefined title uses the localized default; other supplied title content is rendered directly.

Source evidence: `EmptyState.jsx` and `EmptyState.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
