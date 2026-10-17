**InputOTP** — one-time-code boxes (auto-advance · backspace · paste · digits only). Bilingual aria via the registry.

```jsx
<InputOTP length={6} onComplete={(code)=>verify(code)}/>
```

Native clear/delete/cut removes the digit and compacts the remaining code, as Backspace does. Controlled inputs emit the requested code and wait for the parent value; incomplete codes do not call `onComplete`. Invalid non-digit replacement text is ignored.

`length` uses the same whole count for boxes, labels, slicing, focus and completion. Finite fractions round down; nonpositive counts render no boxes. Nonfinite or unrepresentable counts use six.

Keyboard: Typing advances focus; Backspace/delete/cut compact the code and paste replaces it. User edits filter ASCII digits. A controlled caller must supply digit content within `length`; this component does not verify the code. The Backspace shortcut ignores composition-marked/keyCode229 keydowns; ordinary edit, deletion and paste behavior remain unchanged.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `InputOTP.jsx` and `InputOTP.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
