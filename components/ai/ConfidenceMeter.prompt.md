**ConfidenceMeter** — segmented AI-confidence indicator. Pass `value` 0–1 or a `level`; the level is always spelled out (never colour alone). Pair with AIDisclosureBadge / HumanReviewGate to display AI involvement and review controls.

Confidence data is supplied by the caller. The meter does not calculate or calibrate model confidence, verify sources, or establish approval. Numeric values are clamped to 0–1; below 0.4 displays Low, below 0.75 displays Medium, and 0.75 or above displays High. These are display thresholds, not a correctness guarantee.

```jsx
<ConfidenceMeter value={0.82} />
<ConfidenceMeter level="low" label="Model confidence" />
<ConfidenceMeter value={0.82} label={<span>Model <em>confidence</em></span>} />
```

The meter's accessible name references the rendered label and localized level.
Rich labels and numeric zero retain their text; generated IDs stay unique across
multiple instances and follow label/language updates.

Segment counts use whole numbers: finite fractions round down with a minimum of one; zero, nonfinite and unrepresentable counts use the default five. The rendered segments and meter limits use the same count.

Segment fills keep their semantic fill role; confidence labels use the corresponding semantic `-text` role on the surrounding surface.

Keyboard: This is a display-only meter and does not add a keyboard action.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `ConfidenceMeter.jsx` and `ConfidenceMeter.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
