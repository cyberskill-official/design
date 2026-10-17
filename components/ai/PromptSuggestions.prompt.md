**PromptSuggestions** — tappable "wish" starter chips for a prompt/chat.

```jsx
<PromptSuggestions suggestions={["A web app","An internal tool","A design system"]} onSelect={send} />
```

Keyboard: Tab reaches each native suggestion button; Enter/Space passes its label to `onSelect`.

Localization: Suggestions are caller-supplied strings or label/icon objects. There is no `lang` prop or built-in translated suggestion list.

Source evidence: `PromptSuggestions.jsx` and `PromptSuggestions.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
