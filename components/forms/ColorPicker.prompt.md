**ColorPicker** — a fixed curated swatch palette + hex input.

The default palette contains ten literal colors from the component source; it
is not generated from the current element packs and does not change with the
element axis. Supply `swatches` when the consumer needs a specific palette.
The custom input emits six-digit `#RRGGBB` values through `onChange`; controlled
callers must update `value` to display the selected color.

```jsx
<ColorPicker value={c} onChange={setC}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

Keyboard: Tab reaches the field, swatch buttons and custom hex input. Native Enter/Space activates buttons; Enter or blur on the input proposes a valid six-digit hex value, and Escape closes the popup. Controlled callers update `value`. Enter ignores composition-marked/keyCode229 keydowns; handled Enter cancels its native default action so restoring field focus does not activate the field again. Blur behavior is unchanged.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `ColorPicker.jsx` and `ColorPicker.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
