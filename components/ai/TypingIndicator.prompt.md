**TypingIndicator** — animated dots while Lumi composes a reply.

```jsx
<TypingIndicator />
```

Keyboard: The status indicator has no keyboard action. Rendering it is the consumer’s indication of activity; it does not detect model activity.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The dots stop animating under reduced-motion.

Source evidence: `TypingIndicator.jsx` and `TypingIndicator.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
