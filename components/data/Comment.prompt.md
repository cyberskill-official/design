**Comment** — discussion entry with nested `replies` (default bilingual "Reply" action).

```jsx
<Comment avatar={<Avatar name="An Le" size="sm"/>} author="An Lê" meta="2h">
  Looks good — ship it.
</Comment>
```

The avatar, meta and replies slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Tab reaches each native action button; Enter/Space calls its supplied onSelect. The default Reply button has a localized label and no reply handler; provide actions to implement reply behavior.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Author, meta, body, replies and custom action labels remain caller-owned.

Source evidence: `Comment.jsx` and `Comment.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
