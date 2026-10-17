**Dialog** — modal overlay + centred panel. `aria-modal`, labelled by title, overlay-click closes. Compose footer actions with `Button`s. Goes near-fullscreen on narrow viewports.

```jsx
<Dialog
  open={open}
  title="Send your wish?"
  onClose={() => setOpen(false)}
  actions={<>
    <Button variant="secondary" onClick={() => setOpen(false)}>Not now</Button>
    <Button onClick={submit}>Send wish</Button>
  </>}
>
  A real person on the team replies within one business day.
</Dialog>
```

- Pair with Heavy Glass (`className="cs-surface-heavy"`) only after checking APCA against the backdrop.
- A fade entrance preserves target dimensions and keeps fixed nested overlays in the viewport. Reduced motion removes it. Filtered glass materials use a decorative sibling filter backing so scrolling content does not clip nested overlays; content stays in its inherited language and token scope. Server markup keeps the ordinary material until the backing is ready after hydration.

The actions slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

An explicit `aria-describedby` takes precedence over the default body description. Use a short description element ID, or an empty string to omit a flattened description for structured content. Actual announcements still require screen-reader review.

Keyboard: The shared modal layer moves focus, contains Tab and restores focus still owned by the closing layer. Escape, backdrop and any built-in close button call onClose; the parent updates controlled open. Composed actions own their behavior, including closing after submission.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default close label is localized. Title, body, actions and close-label override remain caller-owned. Use the existing description override for structured content; source attributes do not establish actual AT announcements.

Source evidence: `Dialog.jsx` and `Dialog.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
