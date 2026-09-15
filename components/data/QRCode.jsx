import React from "react";
import { qrMatrix } from "./qr-encode.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill QRCode — SVG QR (byte mode, EC-L, versions 1–4 ≈ up to 78 bytes). Umber on transparent. */
export const QRCode = React.forwardRef(function QRCode({ value = "", size = 128, color = "var(--cs-color-text-primary)", label, className }, forwardedRef) {
  const m = React.useMemo(() => { try { return qrMatrix(String(value)); } catch (e) { return null; } }, [value]);
  if (!m) return <span className={cx("cs-qrcode", className)} role="img" aria-label={label || value}>—</span>;
  const n = m.length, cell = size / n;
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x * cell} ${y * cell}h${cell}v${cell}h${-cell}z`;
  return (
    <span ref={forwardedRef} className={cx("cs-qrcode", className)} role="img" aria-label={label || value}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true"><path d={d} fill={color} /></svg>
    </span>
  );
});
