import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** SVG QR code (byte mode, EC-L, up to ~78 bytes). Umber modules by default. */
export interface QRCodeProps {
  value: string;
  /** px. Default 128. */
  size?: number;
  /** CSS color. Default text-primary. */
  color?: string;
  /** Accessible label. Defaults to `value`. */
  label?: string;
  /** Attributes for the existing image span, including the encoding-failure fallback. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: Omit<RootTargetProps<HTMLSpanElement>, "role" | "aria-label">;
  className?: string;
}
export const QRCode: React.ForwardRefExoticComponent<React.PropsWithoutRef<QRCodeProps> & React.RefAttributes<HTMLSpanElement>>;
