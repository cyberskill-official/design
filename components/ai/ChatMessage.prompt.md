**ChatMessage** — one turn in a Lumi conversation. `role="lumi"` (Ochre genie, left) or `role="user"` (Umber, right). Override `avatar` with the real mascot image where you have it.

```jsx
<div className="cs-chat">
  <ChatMessage role="lumi">Tell me a wish, and I'll share plain advice first.</ChatMessage>
  <ChatMessage role="user">A faster checkout.</ChatMessage>
</div>
```

Keyboard: The message frame has no keyboard commands. Interactive child content retains its own keyboard behavior.

Localization: The default user name is localized through `lang` or the inherited language scope; Lumi is a fixed name. Supplied names, avatars and message content are caller-owned.

Source evidence: `ChatMessage.jsx` and `ChatMessage.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
