import { jsx } from "react/jsx-runtime";
import React from "react";
import { qrMatrix } from "./qr-encode.js";
import { cx } from "../_utils/cx.js";
const QRCode = React.forwardRef(function QRCode2({ value = "", size = 128, color = "var(--cs-color-text-primary)", label, className }, forwardedRef) {
  const m = React.useMemo(() => {
    try {
      return qrMatrix(String(value));
    } catch (e) {
      return null;
    }
  }, [value]);
  if (!m) return /* @__PURE__ */ jsx("span", { className: cx("cs-qrcode", className), role: "img", "aria-label": label || value, children: "\u2014" });
  const n = m.length, cell = size / n;
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) d += `M${x * cell} ${y * cell}h${cell}v${cell}h${-cell}z`;
  return /* @__PURE__ */ jsx("span", { ref: forwardedRef, className: cx("cs-qrcode", className), role: "img", "aria-label": label || value, children: /* @__PURE__ */ jsx("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d, fill: color }) }) });
});
export {
  QRCode
};
