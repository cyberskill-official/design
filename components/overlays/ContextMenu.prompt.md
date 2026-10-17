**ContextMenu** — pointer or keyboard context menu on a focusable zone ( "-" = separator; `danger` items).

```jsx
<ContextMenu items={[{label:"Duplicate"},"-",{label:"Delete",danger:true}]}>
  <div className="card">Right-click or press Shift+F10</div>
</ContextMenu>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

The context-menu zone has a 44 × 44 CSS-pixel minimum on coarse pointers, including text-only content. This size rule does not provide a touch gesture.

Keyboard: The named zone is a tab stop by default. Shift+F10 or the ContextMenu key opens from the focused zone or a focused descendant; the first action receives focus. Up/Down move without wrapping; Home/End reach the first/last action and separators are skipped. Enter/Space selects once. Tab exits and closes without forcing focus back; Escape closes the top layer and returns focus to the opener; selection also restores focus before calling the action. Opening and navigation ignore caller-prevented keys. Keys flagged as composing (isComposing or legacy keyCode 229) do not open, navigate, close on Tab, or dismiss on Escape. Ordinary Tab closes after native or parent-modal focus movement, including a Tab canceled by that modal trap. Use tabIndex={-1} only when a focusable descendant or alternate control provides keyboard access. Empty/all-separator items do not open a menu. No touch gesture or native operating-system shortcut acceptance is claimed; provide alternate actions where needed.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy names the zone and menu; item labels and all zone content remain caller-owned.

Source evidence: `ContextMenu.jsx` and `ContextMenu.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
