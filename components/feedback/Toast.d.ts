import type * as React from "react";
import type { ReactNode } from "react";

/** Fixed bottom-right container that stacks Toasts. */
export interface ToastStackProps { children?: ReactNode; className?: string; lang?: string; }
export function ToastStack(props: ToastStackProps): React.ReactElement;

/**
 * Transient notification. Compose inside a ToastStack. Manage timing/queue in
 * app state; this component is presentational.
 */
export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "success" | "danger";
  title?: ReactNode;
  icon?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}
export function Toast(props: ToastProps): React.ReactElement;
