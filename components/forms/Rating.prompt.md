**Rating** — whole-star rating (ochre stars). APG radiogroup: one tab stop, ArrowLeft/Right (and Up/Down) change value. Controlled or uncontrolled; `readOnly` for display; click current value to clear. Bilingual aria via the registry.

```jsx
<Rating defaultValue={4} onChange={setStars}/>
<Rating value={3} readOnly/>
```

Only the radio representing the exact score is selected; preceding stars remain visually filled. A cleared score selects no radio and retains one keyboard entry point.

`max` uses the rendered whole-star count for labels, keyboard bounds and callbacks. Finite fractions round down, nonpositive counts render no stars, and nonfinite or unrepresentable counts use five.

Keyboard: For editable whole-star values, arrows change the score and Home/End reach its bounds; native button activation selects or clears a star. Read-only stars are outside Tab order. Supply whole scores from zero through the rendered maximum.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `Rating.jsx` and `Rating.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
