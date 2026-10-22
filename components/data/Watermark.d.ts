import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Repeats rotated text behind children (draft/confidential marking). */
export interface WatermarkProps {
  text?: string;
  /** 0–1. Default 0.09. */
  opacity?: number;
  /** Tile size px. Default 140. */
  gap?: number;
  /** Degrees. Default -22. */
  rotate?: number;
  children?: ReactNode;
  /** Attributes for the existing outer div. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  className?: string;
}
export const Watermark: React.ForwardRefExoticComponent<React.PropsWithoutRef<WatermarkProps> & React.RefAttributes<HTMLDivElement>>;
