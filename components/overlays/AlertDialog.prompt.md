**AlertDialog** — first-class confirm / destructive modal (`role="alertdialog"`). Distinct from Popconfirm (inline bubble) and Dialog (general modal). Bilingual Confirm/Cancel via the registry.

```jsx
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete workspace?"
  description="Removes every project. This cannot be undone."
  tone="destructive"
  onConfirm={wipe}
/>
```

A fade entrance preserves Confirm/Cancel dimensions and keeps nested fixed overlays in the viewport. Reduced motion removes it. Filtered glass materials use a decorative sibling filter backing; content keeps its inherited language and token scope. Server markup keeps the ordinary material until the backing is ready after hydration.

Keyboard: The modal layer moves focus and traps Tab/Shift+Tab. Destructive alerts initially focus Cancel; ordinary confirmations initially focus Confirm. Confirm closes or requests closure before invoking onConfirm; Cancel, backdrop and Escape also invoke onCancel. Controlled open requires the caller to apply onOpenChange. Callbacks are synchronous notifications; the UI does not execute, authorize or await the consequential operation.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Confirm/Cancel defaults are localized. Title, description, children and label overrides remain caller-owned. Supply a meaningful title and a short description suited to the operation.

Source evidence: `AlertDialog.jsx` and `AlertDialog.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
