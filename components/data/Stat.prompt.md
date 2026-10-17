**Stat** — labelled KPI with an optional trend delta (up = success, down = danger, flat = muted).

```jsx
<Stat label="Avg progress" value="70%" delta="+6 this week" trend="up" />
```

The metric label and flat delta use the muted text role; up/down deltas use semantic success/danger text roles rather than status fills.

Keyboard: The metric display adds no keyboard action; composed controls retain their own behavior.

Localization: Labels and child content are caller-owned; this component has no built-in translation. The caller supplies the metric, delta and trend; the component does not calculate them.

Source evidence: `Stat.jsx` and `Stat.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
