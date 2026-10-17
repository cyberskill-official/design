**Splitter** — draggable two-pane divider (keyboard-resizable).

```jsx
<Splitter start={<Editor/>} end={<Preview/>} initial={45}/>
```

Initial and displayed pane percentages are clamped to `min`/`max`, including
changed bounds. Use ordered percentage bounds. Pointer cancellation, changed
bounds and unmount end the active drag; unrelated pointers cannot resize it.

The separator is vertical. Left/Right move it visually in that direction, with
the start-pane percentage measured from the inherited LTR/RTL start edge. Resize
keys prevent page scrolling; composition keys do not trigger resizing.

Pointer movement is relative to the initial grab position, including the edges of the 44px coarse-pointer handle. The two pane percentages divide the space remaining after the handle; the handle does not shrink or steal percentage width from either pane.

On coarse pointers, requested heights below 46px use a 46px container minimum,
leaving at least 44px for the divider after its container borders. Fine pointers
retain the requested height and the narrow divider.

Keyboard: Tab reaches the separator; Left/Right resize by two percentage points and respect inherited direction. Pointer movement changes internal state; there is no onChange callback. initial seeds state once. Use finite initial values, ordered finite percentage bounds within 0–100, and a useful positive height; arbitrary invalid numeric inputs are not normalized.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy names the separator. Pane content and any additional context remain caller-owned. aria-valuenow retains the displayed percentage, including fractions, within min/max.

Source evidence: `Splitter.jsx` and `Splitter.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
