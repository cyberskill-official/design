**Icon** — the single renderer for CyberSkill's in-repo line-icon set (no external icon library). Icons stroke with `currentColor` at 1.75 weight, round caps/joins, and size from the `--cs-icon-*` tokens. Decorative by default; pass `label` to expose a meaningful icon to assistive tech.

```jsx
<Icon name="arrow-right" />                    {/* decorative */}
<Icon name="sparkle" size="lg" label="Wish" /> {/* meaningful */}
```

Set: `close · sun · moon · arrow-right · check · sparkle · chat · sound-on · sound-off` + v2.0 extension `search · sliders · upload · download · calendar · user · plus · trash · external · menu` + v2.13 `chevron-down/up/left/right · edit · copy · info · alert-triangle` (same grammar). `sparkle` is the brand's "wish" glyph. Colour follows the surrounding text token — set `color` on a parent to recolour.
