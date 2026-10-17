**Tour** — spotlight walkthrough over selectors (bilingual Skip/Back/Next/Done).

```jsx
<Tour open={on} onClose={()=>setOn(false)} steps={[{target:"#kpis",title:"Portfolio",body:"Filter by clicking a KPI."}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.
This blocking surface also traps focus, isolates the background with inert, and preserves nested scroll-lock ownership.

When `steps` shrinks, the active index clamps to the remaining last step; regrowth does not restore a removed index. Empty steps hide the tour and release modal isolation. Reopening starts at the first step. `onClose` requests closure; the parent must update controlled `open`.

The dialog is named by its rendered step title, including rich React content. Supply a meaningful textual title; empty or purely decorative content cannot provide an accessible name.

While open, the tour measures its current selector once per animation frame to follow scrolling, layout shifts, resizing and target replacement. React geometry state updates only when measured coordinates change; tracking stops on close, empty steps or unmount. A missing target uses the unanchored fallback until it appears.

Step body preserves numeric zero; null, false and empty strings omit the body paragraph.

Keyboard: The shared modal layer contains Tab. Native buttons move steps or request closure; Escape and backdrop also call onClose. The parent updates controlled open. Supply valid CSS selectors; a valid selector with no matching target uses the unanchored fallback. Step changes do not add a live-region announcement.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Skip/Back/Next/Done are localized. Each step title and body remain caller-owned; meaningful title text names the dialog.

Source evidence: `Tour.jsx` and `Tour.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
