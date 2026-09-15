import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
function pages(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out = [1];
  const lo = Math.max(2, page - 1), hi = Math.min(count - 1, page + 1);
  if (lo > 2) out.push("\u2026");
  for (let p = lo; p <= hi; p++) out.push(p);
  if (hi < count - 1) out.push("\u2026");
  out.push(count);
  return out;
}
const Pagination = React.forwardRef(function Pagination2({ page = 1, pageCount = 1, onChange, lang, className, ...props }, forwardedRef) {
  const go = (p) => onChange && p >= 1 && p <= pageCount && p !== page && onChange(p);
  const [ref, L] = useLang(lang);
  const t = makeT("Pagination", L);
  return /* @__PURE__ */ jsxs("nav", { ref: mergeRefs(ref, forwardedRef), "aria-label": t("label"), className: cx("cs-pagination", className), ...props, children: [
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => go(page - 1), disabled: page <= 1, "aria-label": t("prev"), children: "\u2039" }),
    pages(page, pageCount).map(
      (p, i) => p === "\u2026" ? /* @__PURE__ */ jsx("span", { className: "cs-pagination__ellipsis", "aria-hidden": "true", children: "\u2026" }, "e" + i) : /* @__PURE__ */ jsx("button", { type: "button", "aria-current": p === page ? "page" : void 0, onClick: () => go(p), children: p }, p)
    ),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => go(page + 1), disabled: page >= pageCount, "aria-label": t("next"), children: "\u203A" })
  ] });
});
export {
  Pagination
};
