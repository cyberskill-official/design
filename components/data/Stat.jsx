import React from "react";
import { cx } from "../_utils/cx.js";

/** CyberSkill Stat — labelled metric with optional delta. trend: up | down | flat. */
export const Stat = React.forwardRef(function Stat({ label, value, delta, trend = "flat", className, ...props }, forwardedRef) {
  const arrow = trend === "up" ? "M12 5v14M6 11l6-6 6 6" : trend === "down" ? "M12 5v14M6 13l6 6 6-6" : "M5 12h14";
  return (
    <div ref={forwardedRef} className={cx("cs-stat", className)} {...props}>
      <div className="cs-stat__label">{label}</div>
      <div className="cs-stat__value">{value}</div>
      {delta != null ? (
        <div className={cx("cs-stat__delta", `cs-stat__delta--${trend}`)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={arrow} /></svg>
          {delta}
        </div>
      ) : null}
    </div>
  );
});
