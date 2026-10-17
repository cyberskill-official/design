import React from "react";
import { makeT, useLang, monthName } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const WD = { en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] };
function localDate(year, month, day) {
  const date = new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function grid(year, month) { // Monday week-start (VN convention)
  const first = localDate(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = localDate(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** CyberSkill Calendar — month grid, Monday week-start, bilingual month/weekday names. Controlled value/onChange (Date). */
export function Calendar({ value, onChange, lang, className }) {
  const parsed = value != null ? new Date(value) : null;
  const sel = parsed && Number.isFinite(parsed.getTime()) ? parsed : null;
  const selectedYear = sel?.getFullYear(), selectedMonth = sel?.getMonth();
  const today = new Date();
  const [view, setView] = React.useState(() => (sel ? [sel.getFullYear(), sel.getMonth()] : [today.getFullYear(), today.getMonth()]));
  React.useEffect(() => {
    if (selectedYear != null && selectedMonth != null) setView([selectedYear, selectedMonth]);
  }, [selectedYear, selectedMonth]);
  const [y, m] = view;
  const [ref, L] = useLang(lang);
  const t = makeT("Calendar", L);
  const cells = grid(y, m);
  const isSel = (d) => sel && d === sel.getDate() && m === sel.getMonth() && y === sel.getFullYear();
  const isToday = (d) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
  return (
    <div ref={ref} className={cx("cs-cal", className)}>
      <div className="cs-cal__head">
        <button type="button" aria-label={t("prev")} onClick={() => setView(([yy, mm]) => (mm ? [yy, mm - 1] : [yy - 1, 11]))}>‹</button>
        <b>{monthName(m, L)} {y}</b>
        <button type="button" aria-label={t("next")} onClick={() => setView(([yy, mm]) => (mm === 11 ? [yy + 1, 0] : [yy, mm + 1]))}>›</button>
      </div>
      <div className="cs-cal__wd">{WD[L === "vi" ? "vi" : "en"].map((w) => <span key={w}>{w}</span>)}</div>
      <div className="cs-cal__grid">
        {cells.map((d, i) => d == null
          ? <span key={i} />
          : <button key={i} type="button" className={cx(isSel(d) && "sel", isToday(d) && "today")} aria-pressed={isSel(d) || undefined}
              onClick={() => onChange && onChange(localDate(y, m, d))}>{d}</button>)}
      </div>
    </div>
  );
}
