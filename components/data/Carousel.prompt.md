**Carousel** — slides + arrows + dots (bilingual aria). Wrap any slide content.

Inactive slides are inert and excluded from keyboard focus as well as the
accessibility tree. Navigation is disabled for zero/one slide. `startIndex` is
an initial index; the visible index is clamped when the collection shrinks.

```jsx
<Carousel label="Cases"><div>Slide 1</div><div>Slide 2</div></Carousel>
```

Inactive slides are inert and hidden from accessibility APIs. When children shrink, the stored active index is clamped; adding slides again does not revive a removed index. Previous/next controls retain native Enter/Space activation and disable with fewer than two slides.

Keyboard: Native Tab reaches controls, dots and focusable active-slide content; Enter/Space activates buttons. Previous/next wrap; the component adds no arrow-key navigation or automatic rotation. startIndex seeds once, and collection shrink clamps the stored index.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Supply a descriptive carousel label and meaningful slide content; the built-in copy names previous/next controls and numbered slide buttons.

Source evidence: `Carousel.jsx` and `Carousel.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
