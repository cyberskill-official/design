# Overlay manager design (C8 / CDS-ARCH-001)

Status: **design accepted for Phase 2; land in Phase 3** (operator decision D5=A, 2026-08-08).  
Owner: design-system maintainer · Related: UX-009 depth tokens, CDS-A11Y-003 keyboard models.

## Problem

Overlays (Dialog, AlertDialog, Drawer, Popover, Menu, CommandPalette, Toast, Tour) currently each own:

- z-index (with dialog hardcoding `1000` historically — now tokenized to `--cs-depth-modal`)
- focus trap / restore
- body scroll-lock
- Escape handling

Nested overlays (toast while modal open; confirm inside drawer) race on DOM order and scroll-lock count. Keyboard models for complex widgets (CDS-A11Y-003) need a single stack authority.

## Goals

1. One stack owns paint order (depth tokens), focus scope, Escape routing, and scroll-lock refcount.
2. Toasts always paint above modals (`--cs-depth-toast` > `--cs-depth-modal`) — already the token doctrine.
3. Nested overlays: only the topmost modal-layer traps focus; Escape closes topmost first.
4. No third-party floating library required for v1; Floating UI may be adopted later for positioning only.

## Non-goals (v1)

- Rewriting every popover positioner
- Changing public component props (additive `layer` / `portal` opts only)
- SSR portal polyfills beyond “no `window` during render” (Tour already fixed)

## API sketch

```ts
// components/overlays/OverlayManager.jsx (Phase 3 land)

type LayerKind = 'dropdown' | 'popover' | 'modal' | 'toast' | 'tour';

type LayerRegistration = {
  id: string;
  kind: LayerKind;
  /** Focus trap when kind is modal */
  trapFocus?: boolean;
  onEscape?: () => void;
  /** Element that receives restore focus */
  restoreEl?: HTMLElement | null;
};

type OverlayManagerApi = {
  register(layer: LayerRegistration): () => void; // unregister
  top(): LayerRegistration | null;
  /** Refcount scroll lock — lock while any modal registered */
  scrollLocked: boolean;
};

// React context
const OverlayContext = React.createContext<OverlayManagerApi | null>(null);
function OverlayProvider({ children }: { children: React.ReactNode }): JSX.Element;
function useOverlayLayer(opts: Omit<LayerRegistration, 'id'>): { id: string };
```

### Depth mapping

| Kind | Token | Notes |
|------|-------|--------|
| dropdown | `--cs-depth-dropdown` (60) | Menus under sticky nav |
| popover | `--cs-depth-overlay` | HoverCard, Popover |
| modal | `--cs-depth-modal` (100) | Dialog, AlertDialog, Drawer, CommandPalette |
| toast | `--cs-depth-toast` (200) | Above modals |
| tour | `--cs-depth-toast` or dedicated | Full-viewport coachmarks |

### Focus & Escape

- Modal registration pushes a focus scope; Tab cycles within the topmost modal host (`.cs-dialog-layer` / drawer panel).
- Escape invokes `onEscape` of `top()` only; if none, bubbles.
- Unregister restores focus to `restoreEl` when that layer was topmost at close.

### Scroll-lock

- `document.documentElement` / `body` overflow hidden while `count(modal) > 0`.
- Nested modals increment; close decrements — no flicker unlock.

### Portal host

```html
<div id="cs-overlay-root" data-cs-overlay-root></div>
```

Components portal into `#cs-overlay-root` when present; otherwise document.body (today’s behavior). Kits and Atomic View mount the root once.

## Migration (Phase 3)

1. Ship `OverlayProvider` + `useOverlayLayer` beside existing components (no breaking change).
2. Wire Dialog / AlertDialog / Drawer / CommandPalette / ToastStack first.
3. Add a11y-gate rows: nested dialog+toast, nested dialog+alertdialog Escape order, scroll-lock refcount.
4. Then E3 keyboard models for Cascader / TreeSelect / Menubar adopt the same focus-scope helper.

## Acceptance

- Toast visible above open dialog (behavior gate — already green; keep).
- Nested AlertDialog inside Dialog: Escape closes alert first; focus returns to dialog.
- Zero raw `z-index` > 20 in `base/` outside token vars (token-contract).
- Design note remains the SoT until Phase 3 lands code under `components/overlays/`.
