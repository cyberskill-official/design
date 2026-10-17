**Kbd** — keyboard key hint.

```jsx
<Kbd>⌘</Kbd> <Kbd>K</Kbd>
```

Keyboard: This is a displayed key hint, not a shortcut listener. The consumer implements any command described by the hint.

Localization: Labels and child content are caller-owned; this component has no built-in translation. Key symbols or platform-specific key names must match the consumer’s actual shortcuts.

Source evidence: `Kbd.jsx` and `Kbd.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
