import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const CLOCK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;

/** CyberSkill TimePicker — 24h time select in fixed steps. Controlled value ("HH:MM")/onChange. */
export function TimePicker({ value = "09:00", onChange, step = 30, label, disabled = false, lang, className }) {
  const [ref, L] = useLang(lang);
  const t = makeT("TimePicker", L);
  const stepMin = Number(step);
  // A minute-resolution day has at most 1440 options. Fractions can otherwise
  // create malformed HH:MM values or an effectively unbounded render-time loop.
  const safeStep = Number.isInteger(stepMin) && stepMin >= 1 && stepMin <= 1440 ? stepMin : 30;
  const opts = [];
  for (let m = 0; m < 24 * 60; m += safeStep) {
    opts.push(String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"));
  }
  return (
    <span ref={ref} className={cx("cs-timepicker", className)}>
      {CLOCK}
      <select aria-label={label != null ? label : t("label")} disabled={disabled} value={value} onChange={(e) => onChange && onChange(e.target.value)}>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </span>
  );
}
