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
