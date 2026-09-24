import type * as React from "react";
import type { ReactNode } from "react";

/** Fixed bottom-right container that stacks Toasts. */
export interface ToastStackProps { children?: ReactNode; className?: string; }
export const ToastStack: React.ForwardRefExoticComponent<
  ToastStackProps & React.RefAttributes<HTMLElement>
>;

/**
 * Transient notification. Compose inside a ToastStack. Manage timing/queue in
 * app state; this component is presentational.
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "danger";
  title?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}
export const Toast: React.ForwardRefExoticComponent<
  ToastProps & React.RefAttributes<HTMLElement>
>;
