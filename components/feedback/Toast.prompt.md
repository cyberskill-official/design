**Toast / ToastStack** — transient notification inside a fixed bottom-right stack. Presentational; manage timing + queue in app state. Variants `default` | `success` | `danger` each ship a distinct glyph (info / check / X) plus a status-coloured start border — never a red check-mark for errors.

```jsx
<ToastStack>
  <Toast variant="success" title="Saved" onClose={dismiss}>Your wish is on its way.</Toast>
  <Toast variant="danger" title="Couldn’t save">Check the network and try again.</Toast>
</ToastStack>
```

Toast notifications remain accessible while a modal is open. They do not take over Escape dismissal; that key remains with the current dismissible overlay.

Numeric zero is preserved in declared ReactNode content slots. Conditionally rendered slots still omit their wrapper for empty-string, false and null values; existing default-title behavior is unchanged.

`ToastStack` accepts `lang` for its Notifications region label; without it, the label inherits the nearest language scope.

Keyboard: ToastStack and the notification frame add no keyboard commands. Tab reaches a supplied close button; Enter/Space invokes `onClose`, and the caller owns removal and timing. Toast does not consume Escape from dismissible overlays.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. ToastStack localizes its region name; each Toast resolves its own close label. An explicit stack `lang` does not automatically set every child Toast’s language.

Source evidence: `Toast.jsx` and `Toast.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
