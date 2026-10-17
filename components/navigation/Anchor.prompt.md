**Anchor** — in-page TOC with scrollspy (ochre rail marks the active section).

```jsx
<Anchor title="On this page" items={[{id:"intro",label:"Intro"},{id:"pricing",label:"Pricing"}]}/>
```

The rendered title supplies the surface's accessible name, including rich React content. Supply meaningful text; purely decorative title content cannot provide a useful name.

Scroll tracking retains the full set of intersecting targets across incremental observer notifications and selects the topmost current target. When none intersect the tracking band, it preserves the last location. Changing the items or unmounting disconnects the previous observer.

Keyboard: Tab reaches native in-page links; Enter follows their target IDs. Targets must exist in the same document when the observer effect runs. The scrollspy tracks intersecting targets and retains its last location when none intersect.

Localization: The title and item labels are caller-owned; there is no built-in translated TOC title. Supply a meaningful title to name the navigation region.

Source evidence: `Anchor.jsx` and `Anchor.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
