**PromptInput** — the AI-native "make a wish" box. Enter submits, Shift+Enter newlines; controlled or uncontrolled. The default disclosure `hint` describes Lumi replying and handing clear wishes to a human. Use it only when the consumer implements that workflow; otherwise supply an accurate `hint`.

```jsx
<PromptInput value={q} onChange={setQ} onSubmit={send} placeholder="Make a wish…" />
```

`onSubmit` receives the entered value; the component does not call a model or arrange human review. The consumer implements those actions and owns the accuracy of its disclosure.

`value` controls the field; without it, internal state updates even when an
`onChange` observer is supplied. Controlled callers must update `value` themselves.
IME composition confirmation does not submit; ordinary Enter submits once,
Shift+Enter inserts a newline, and busy/disabled states block submission.

An explicit numeric `0` hint remains visible. `null`, `false` and empty strings omit the hint; only `undefined` selects the localized default.

Keyboard: Enter submits nonblank input unless busy/disabled; Shift+Enter inserts a newline and IME confirmation does not submit. The native send button also supports Enter/Space.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `PromptInput.jsx` and `PromptInput.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
