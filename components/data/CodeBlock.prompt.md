**CodeBlock** — dark umber code panel (JetBrains Mono) with a filename bar + copy button.

```jsx
<CodeBlock filename="styles.css" code={'@import "tokens/colors.css";'} />
```

Copy feedback appears only after the clipboard write succeeds. Pending, denied
or unavailable writes retain Copy; changing code or unmounting invalidates old
completion feedback. Browser clipboard permissions remain environment-dependent.

Copy feedback follows the nearest EN/VI language scope, or explicit `lang`.
`language` remains the code-language label (for example `javascript`), not the UI locale.

When neither `filename` nor `language` is supplied, the bar uses the localized generic
heading (`code` / `mã`). Caller-provided filenames and code-language labels are preserved.

Keyboard: Tab reaches the native copy button when showBar is true; Enter/Space requests clipboard write. Copied feedback follows a successful current write only, and code changes/unmount invalidate old completions.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Filenames, code-language labels and source code remain caller-owned.

Source evidence: `CodeBlock.jsx` and `CodeBlock.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
