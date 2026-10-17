**OverlayProvider / overlay manager** — shared document stack for registered modal and nonmodal Escape, scroll-lock
refcount, and focus restore. Wrap product shells when nesting overlays; Dialog /
AlertDialog / Drawer / CommandPalette already register via the module singleton
when no provider is mounted.

```jsx
<OverlayProvider>
  <App />
</OverlayProvider>
```

See `docs/decisions/overlay-manager-design.md`.

Providers share the same document manager. Tab trapping follows the active modal dynamically; closing a nested modal reactivates its parent trap. Disconnected triggers are not focused, and focus already moved elsewhere is not stolen. Focus-opened widgets can set `restoreFocus: false`. The design note records migrated families and remaining manual/browser support checks.

Modal focus scopes include registered portalled descendants, including their closed triggers. React ownership travels across portals; consumers remain responsible for portal positioning and token-based stacking. Background branches become inert, including newly inserted nodes; prior inert and overflow values are restored after the last modal closes. Explicit backdrop refs keep only the current modal backdrop interactive. Native select popups retain browser-owned behavior.

Keyboard: OverlayProvider provides a shared document manager and an empty portal host; it does not portal its children. Registered layers route Escape to the top non-toast layer, while the active modal contains Tab across registered owned scopes. Providers share the singleton, and consumers own portal placement and token stacking.

Localization: The provider itself renders no user-facing copy and has no lang prop. Overlay components and their callers own translated names and content.

Source evidence: `OverlayManager.jsx` and `OverlayManager.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
