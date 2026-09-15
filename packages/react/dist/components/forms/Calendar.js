import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang, monthName } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const WD = { en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], vi: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] };
function grid(year, month) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}
const Calendar = React.forwardRef(function Calendar2({ value, onChange, lang, className }, forwardedRef) {
  const sel = value ? new Date(value) : null;
  const today = /* @__PURE__ */ new Date();
  const [view, setView] = React.useState(() => sel ? [sel.getFullYear(), sel.getMonth()] : [today.getFullYear(), today.getMonth()]);
  const [y, m] = view;
  const [ref, L] = useLang(lang);
  const t = makeT("Calendar", L);
  const cells = grid(y, m);
  const isSel = (d) => sel && d === sel.getDate() && m === sel.getMonth() && y === sel.getFullYear();
  const isToday = (d) => d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: cx("cs-cal", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "cs-cal__head", children: [
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("prev"), onClick: () => setView(([yy, mm]) => mm ? [yy, mm - 1] : [yy - 1, 11]), children: "\u2039" }),
      /* @__PURE__ */ jsxs("b", { children: [
        monthName(m, L),
        " ",
        y
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": t("next"), onClick: () => setView(([yy, mm]) => mm === 11 ? [yy + 1, 0] : [yy, mm + 1]), children: "\u203A" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "cs-cal__wd", children: WD[L === "vi" ? "vi" : "en"].map((w) => /* @__PURE__ */ jsx("span", { children: w }, w)) }),
    /* @__PURE__ */ jsx("div", { className: "cs-cal__grid", children: cells.map((d, i) => d == null ? /* @__PURE__ */ jsx("span", {}, i) : /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: cx(isSel(d) && "sel", isToday(d) && "today"),
        "aria-pressed": isSel(d) || void 0,
        onClick: () => onChange && onChange(new Date(y, m, d)),
        children: d
      },
      i
    )) })
  ] });
});
export {
  Calendar
};
