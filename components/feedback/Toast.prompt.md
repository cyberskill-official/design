**Toast / ToastStack** — transient notification inside a fixed bottom-right stack. Presentational; manage timing + queue in app state. Variants `default` | `success` | `danger` each ship a distinct glyph (info / check / X) plus a status-coloured start border — never a red check-mark for errors.

```jsx
<ToastStack>
  <Toast variant="success" title="Saved" onClose={dismiss}>Your wish is on its way.</Toast>
  <Toast variant="danger" title="Couldn’t save">Check the network and try again.</Toast>
</ToastStack>
```
