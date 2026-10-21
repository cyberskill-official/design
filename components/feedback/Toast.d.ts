import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/** Fixed bottom-right container that stacks Toasts. */
export interface ToastStackProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-label">; children?: ReactNode; className?: string; lang?: string; }
export const ToastStack: React.ForwardRefExoticComponent<React.PropsWithoutRef<ToastStackProps> & React.RefAttributes<HTMLDivElement>>;

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
export const Toast: React.ForwardRefExoticComponent<React.PropsWithoutRef<ToastProps> & React.RefAttributes<HTMLDivElement>>;
