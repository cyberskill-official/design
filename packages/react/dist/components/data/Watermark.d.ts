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
  className?: string;
}
export const Watermark: React.ForwardRefExoticComponent<
  WatermarkProps & React.RefAttributes<HTMLElement>
>;
