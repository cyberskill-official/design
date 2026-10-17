import type { ReactNode, RefObject, ReactElement, Context } from "react";

export type OverlayLayerKind = "dropdown" | "popover" | "modal" | "toast" | "tour";

export type OverlayLayerRegistration = {
  id?: string;
  kind: OverlayLayerKind;
  panelEl?: HTMLElement | null;
  backdropEl?: HTMLElement | null;
  parentEl?: HTMLElement | null;
  parentRef?: RefObject<HTMLElement | null>;
  trapFocus?: boolean;
  lockScroll?: boolean;
  onEscape?: () => void;
  restoreEl?: HTMLElement | null;
};

export type OverlayManagerApi = {
  register(layer: OverlayLayerRegistration): () => void;
  registerScope(scope: { panelEl: HTMLElement; parentEl: HTMLElement | null }): () => void;
  top(): OverlayLayerRegistration | null;
  topDismissible(): OverlayLayerRegistration | null;
  activeModal(): OverlayLayerRegistration | null;
  focusScope(): HTMLElement[];
  readonly scrollLocked: boolean;
  readonly depth: number;
};

export function getOverlayManager(): OverlayManagerApi;

export function OverlayProvider(props: { children?: ReactNode }): ReactElement;

export function useOverlayLayer(opts: {
  open: boolean;
  kind?: OverlayLayerKind;
  trapFocus?: boolean;
  lockScroll?: boolean;
  onEscape?: () => void;
  panelRef?: RefObject<HTMLElement | null>;
  backdropRef?: RefObject<HTMLElement | null>;
  preferFocusSelector?: string;
  /** Disable focus restoration for focus-opened widgets such as comboboxes. */
  restoreFocus?: boolean;
}): { manager: OverlayManagerApi; scope: RefObject<HTMLElement | null> | null };

/** Internal ownership context used by the components to preserve portal ancestry. */
export const overlayScopeContext: Context<RefObject<HTMLElement | null> | null>;

export function attachFocusTrap(
  panelEl: HTMLElement | null,
  opts?: { handleEscape?: boolean; onEscape?: () => void; isActive?: () => boolean; scopeElements?: () => HTMLElement[] }
): () => void;

export const focusableSelector: string;
