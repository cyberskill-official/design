"use client";
import {
  makeT,
  monthName,
  primaryLang,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  useClientLayoutEffect
} from "./chunk-CQQ2JOJD.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/forms/Calendar.jsx
import React from "react";
var WD = { en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"], ja: ["月", "火", "水", "木", "金", "土", "日"] };
function localDate(year, month, day) {
  const date = /* @__PURE__ */ new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function grid(year, month) {
  const first = localDate(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = localDate(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}
var Calendar = React.forwardRef(function Calendar2({ value, onChange, lang, className, rootProps }, forwardedRef) {
  const parsed = value != null ? new Date(value) : null;
  const sel = parsed && Number.isFinite(parsed.getTime()) ? parsed : null;
  const selectedYear = sel?.getFullYear(), selectedMonth = sel?.getMonth(), selectedDay = sel?.getDate();
  const today = /* @__PURE__ */ new Date();
  const [view, setView] = React.useState(() => sel ? [sel.getFullYear(), sel.getMonth()] : [today.getFullYear(), today.getMonth()]);
  React.useEffect(() => {
    if (selectedYear != null && selectedMonth != null) {
      setView([selectedYear, selectedMonth]);
      setFocusedDay(selectedDay);
    }
  }, [selectedYear, selectedMonth, selectedDay]);
  const [y, m] = view;
  const [focusedDay, setFocusedDay] = React.useState(() => sel?.getDate() ?? today.getDate());
  const pendingFocus = React.useRef(false);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Calendar", L, localeMessages);
  const cells = grid(y, m);
  const maxDay = localDate(y, m + 1, 0).getDate();
  const activeDay = Math.min(focusedDay, maxDay);
  const monthId = React.useId();
  useClientLayoutEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    ref.current?.querySelector(`button[data-day="${activeDay}"]`)?.focus();
  }, [y, m, activeDay]);
  const moveFocus = (date) => {
    pendingFocus.current = true;
    setFocusedDay(date.getDate());
    setView([date.getFullYear(), date.getMonth()]);
  };
  const dateLabel = (d) => new Intl.DateTimeFormat(
    primaryLang(L) === "vi" ? "vi-VN" : primaryLang(L) === "ja" ? "ja-JP" : "en-US",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  ).format(localDate(y, m, d));
  const isSel = (d) => sel && d === sel.getDate() && m === sel.getMonth() && y === sel.getFullYear();
  const isToday = (d) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
  return /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-cal", className) }, rootProps, []) }, /* @__PURE__ */ React.createElement("div", { className: "cs-cal__head" }, /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": t("prev"), onClick: () => setView(([yy, mm]) => mm ? [yy, mm - 1] : [yy - 1, 11]) }, "‹"), /* @__PURE__ */ React.createElement("b", { id: monthId, "aria-live": "polite" }, monthName(m, L), " ", y), /* @__PURE__ */ React.createElement("button", { type: "button", "aria-label": t("next"), onClick: () => setView(([yy, mm]) => mm === 11 ? [yy + 1, 0] : [yy, mm + 1]) }, "›")), /* @__PURE__ */ React.createElement("div", { className: "cs-cal__wd" }, WD[WD[L] ? L : "en"].map((w) => /* @__PURE__ */ React.createElement("span", { key: w }, w))), /* @__PURE__ */ React.createElement("div", { className: "cs-cal__grid", role: "grid", "aria-labelledby": monthId, onKeyDown: (e) => {
    const btn = e.target.closest("button[data-day]");
    if (!btn) return;
    const cur = Number(btn.getAttribute("data-day"));
    let next = null;
    if (e.key === "ArrowLeft") next = localDate(y, m, cur - 1);
    else if (e.key === "ArrowRight") next = localDate(y, m, cur + 1);
    else if (e.key === "ArrowUp") next = localDate(y, m, cur - 7);
    else if (e.key === "ArrowDown") next = localDate(y, m, cur + 7);
    else if (e.key === "Home") next = localDate(y, m, 1);
    else if (e.key === "End") next = localDate(y, m, maxDay);
    else if (e.key === "PageUp" || e.key === "PageDown") {
      const offset = (e.key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1);
      const target = localDate(y, m + offset, 1);
      next = localDate(target.getFullYear(), target.getMonth(), Math.min(cur, localDate(target.getFullYear(), target.getMonth() + 1, 0).getDate()));
    }
    if (next) {
      e.preventDefault();
      moveFocus(next);
    }
  } }, Array.from({ length: cells.length / 7 }, (_, week) => /* @__PURE__ */ React.createElement("div", { role: "row", key: week, style: { display: "contents" } }, cells.slice(week * 7, week * 7 + 7).map((d, i) => d == null ? /* @__PURE__ */ React.createElement("span", { role: "gridcell", key: i }) : /* @__PURE__ */ React.createElement("span", { role: "gridcell", "aria-selected": !!isSel(d), key: i, style: { display: "contents" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      "data-day": d,
      tabIndex: d === activeDay ? 0 : -1,
      onFocus: () => setFocusedDay(d),
      className: cx(isSel(d) && "sel", isToday(d) && "today"),
      "aria-pressed": isSel(d) || void 0,
      "aria-current": isToday(d) ? "date" : void 0,
      "aria-label": dateLabel(d),
      onClick: () => onChange && onChange(localDate(y, m, d))
    },
    d
  )))))));
});
Calendar.displayName = "Calendar";

export {
  Calendar
};
//# sourceMappingURL=chunk-FEUTSZBN.mjs.map
