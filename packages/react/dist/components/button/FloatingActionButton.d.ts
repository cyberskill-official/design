import type { ReactNode } from "react";

/** Round floating primary action (Ochre). With `actions`, the main press opens a
 *  speed-dial of mini actions. position="static" embeds it in flow (demos). */
export interface FabAction { icon: ReactNode; label: string; onSelect?: () => void; }
export interface FloatingActionButtonProps {
  icon: ReactNode;
  /** Accessible label for the main button (required — icon-only). */
  label: string;
  actions?: FabAction[];
  onClick?: () => void;
  position?: "fixed" | "static";
  className?: string;
}
export const FloatingActionButton: React.ForwardRefExoticComponent<
  FloatingActionButtonProps & React.RefAttributes<HTMLElement>
>;
