import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Chart — token-colored SVG charts: bar | line | spark | pie. data: [{label,value}]. */
export const Chart = React.forwardRef(function Chart({ type = "bar", data = [], height = 160, color = "var(--cs-accent)", showValues = false, label, className }, forwardedRef) {
  const W = 320, H = height, max = Math.max(1, ...data.map((d) => d.value));
  let body = null;
  if (type === "pie") {
    const total = data.reduce((a, d) => a + d.value, 0) || 1;
    const cols = [color, "var(--cs-accent-strong)", "var(--cs-accent-grad-b)", "var(--cs-color-text-muted)", "var(--cs-color-border-default)"];
    let a0 = -Math.PI / 2;
    body = (
      <svg viewBox="0 0 120 120" width={H} height={H} aria-hidden="true">
        {data.map((d, i) => {
          const a1 = a0 + (d.value / total) * Math.PI * 2;
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const p = `M60 60 L${60 + 50 * Math.cos(a0)} ${60 + 50 * Math.sin(a0)} A50 50 0 ${large} 1 ${60 + 50 * Math.cos(a1)} ${60 + 50 * Math.sin(a1)} Z`;
          a0 = a1;
          return <path key={i} d={p} fill={cols[i % cols.length]} stroke="var(--cs-color-surface-panel)" strokeWidth="1.5" />;
        })}
      </svg>
    );
  } else if (type === "line" || type === "spark") {
    const pts = data.map((d, i) => `${(i / Math.max(1, data.length - 1)) * (W - 8) + 4},${H - 6 - (d.value / max) * (H - 24)}`).join(" ");
    body = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden="true">
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {type === "line" ? data.map((d, i) => <circle key={i} cx={(i / Math.max(1, data.length - 1)) * (W - 8) + 4} cy={H - 6 - (d.value / max) * (H - 24)} r="3.4" fill={color} />) : null}
      </svg>
    );
  } else {
    const bw = (W - 8) / data.length;
    body = (
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden="true">
        {data.map((d, i) => {
          const h = (d.value / max) * (H - 26);
          return <rect key={i} x={4 + i * bw + bw * 0.14} y={H - 20 - h} width={bw * 0.72} height={h} rx="3" fill={color} />;
        })}
      </svg>
    );
  }
  return (
    <figure ref={forwardedRef} className={cx("cs-chart", className)} role="img" aria-label={label || data.map((d) => d.label + ": " + d.value).join(", ")}>
      {body}
      {type !== "spark" ? (
        <figcaption className="cs-chart__legend">
          {data.map((d, i) => <span key={i}>{d.label}{showValues ? <b> {d.value}</b> : null}</span>)}
        </figcaption>
      ) : null}
    </figure>
  );
});
