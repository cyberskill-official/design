**OverlayProvider / overlay manager** — single stack for modal Escape, scroll-lock
refcount, and focus restore. Wrap product shells when nesting overlays; Dialog /
AlertDialog / Drawer / CommandPalette already register via the module singleton
when no provider is mounted.

```jsx
<OverlayProvider>
  <App />
</OverlayProvider>
```

See `docs/decisions/overlay-manager-design.md`.
