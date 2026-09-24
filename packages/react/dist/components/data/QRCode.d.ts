/** SVG QR code (byte mode, EC-L, up to ~78 bytes). Umber modules by default. */
export interface QRCodeProps {
  value: string;
  /** px. Default 128. */
  size?: number;
  /** CSS color. Default text-primary. */
  color?: string;
  /** Accessible label. Defaults to `value`. */
  label?: string;
  className?: string;
}
export const QRCode: React.ForwardRefExoticComponent<
  QRCodeProps & React.RefAttributes<HTMLElement>
>;
