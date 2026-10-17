**ProgressBar** — determinate progress. Ochre fill by default (`umber`/`success` variants). Always pass `label`.

```jsx
<ProgressBar value={72} label="Design System v1.6 progress" />
```

Keyboard: The progress display adds no keyboard action. Supply finite numeric progress and a positive finite maximum, plus a label that identifies the task.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default progress name is localized; the caller owns a contextual label.

Source evidence: `ProgressBar.jsx` and `ProgressBar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

The maximum must be positive and finite; invalid/nonpositive maxima fall back to 100. Progress is clamped to that range, with fractional values retained in `aria-valuenow` instead of rounding beyond a fractional maximum.
