import type { ReactNode, RefObject } from "react";

export type OverlayLayerKind = "dropdown" | "popover" | "modal" | "toast" | "tour";

export type OverlayLayerRegistration = {
  id?: string;
  kind: OverlayLayerKind;
  trapFocus?: boolean;
  lockScroll?: boolean;
  onEscape?: () => void;
  restoreEl?: HTMLElement | null;
};

export type OverlayManagerApi = {
  register(layer: OverlayLayerRegistration): () => void;
  top(): OverlayLayerRegistration | null;
  readonly scrollLocked: boolean;
  readonly depth: number;
};

export function getOverlayManager(): OverlayManagerApi;

export function OverlayProvider(props: { children?: ReactNode }): JSX.Element;

export function useOverlayLayer(opts: {
  open: boolean;
  kind?: OverlayLayerKind;
  trapFocus?: boolean;
  lockScroll?: boolean;
  onEscape?: () => void;
  panelRef?: RefObject<HTMLElement | null>;
  preferFocusSelector?: string;
}): { manager: OverlayManagerApi };

export function attachFocusTrap(
  panelEl: HTMLElement | null,
  opts?: { handleEscape?: boolean; onEscape?: () => void }
): () => void;

export const focusableSelector: string;
