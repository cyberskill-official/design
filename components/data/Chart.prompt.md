**Chart** — token-colored SVG bar/line/spark/pie (accent-aware; values in aria).

```jsx
<Chart type="bar" showValues data={[{label:"W28",value:11},{label:"W29",value:8}]}/>
```

A nonblank `label` supplies the image's accessible name. Otherwise the name uses
the supplied datum labels and values; empty data uses “Biểu đồ chưa có dữ liệu” /
“Chart with no data”. Whitespace-only labels use the same fallback. The no-data
name follows explicit `lang` or the inherited language scope and updates when
that scope changes. Datum labels remain caller-owned; numeric values retain the
existing raw-number rendering. This fallback does not add a visible empty-state
panel or locale number formatting.

For pie charts with finite nonnegative data, a positive datum holding the entire total renders a full circle. Zero-valued data remain in the legend and accessible summary but draw no sector. Ordinary partial sectors use the existing wedge geometry.

Keyboard: The figure is exposed as one named image, with decorative SVG content; this component has no interactive keyboard controls. Supply data suited to the selected visualization, finite nonnegative values and a useful positive height. These caller input limits are guidance, not runtime normalization or proof for arbitrary numeric values.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Only the no-data fallback is translated. Datum labels and custom label are caller-owned; values render as raw numbers. Provide an accessible summary suited to the data, or an adjacent detailed table where needed.

Source evidence: `Chart.jsx` and `Chart.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
