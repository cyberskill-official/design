/** Physical sides; top/bottom start/end follow the trigger's inline direction. */
export type FloatingPlacement = "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end";
export interface FloatingPanelProps {
  /** Body portal by default, with automatic local placement inside form/fieldset ancestry even when true. False retains explicit inline/server markup and ancestor clipping. */
  portal?: boolean;
  /** Preferred physical side/alignment. Flips to the opposite side and shifts into the visual viewport when needed. */
  placement?: FloatingPlacement;
}
