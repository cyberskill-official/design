"use client";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Pagination.jsx
import React from "react";
function pages(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out = [1];
  const lo = Math.max(2, page - 1), hi = Math.min(count - 1, page + 1);
  if (lo > 2) out.push("…");
  for (let p = lo; p <= hi; p++) out.push(p);
  if (hi < count - 1) out.push("…");
  out.push(count);
  return out;
}
var Pagination = React.forwardRef(function Pagination2({ page = 1, pageCount = 1, onChange, lang, className, ...props }, forwardedRef) {
  const go = (p) => onChange && p >= 1 && p <= pageCount && p !== page && onChange(p);
  const [ref, L, localeMessages] = useLang(lang);
  const mergedNativeRef = useComposedRefs(ref, forwardedRef);
  const t = makeT("Pagination", L, localeMessages);
  return /* @__PURE__ */ React.createElement("nav", { ref: mergedNativeRef, "aria-label": t("label"), className: cx("cs-pagination", className), ...props }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go(page - 1), disabled: page <= 1, "aria-label": t("prev") }, "‹"), pages(page, pageCount).map(
    (p, i) => p === "…" ? /* @__PURE__ */ React.createElement("span", { key: "e" + i, className: "cs-pagination__ellipsis", "aria-hidden": "true" }, "…") : /* @__PURE__ */ React.createElement("button", { key: p, type: "button", "aria-current": p === page ? "page" : void 0, onClick: () => go(p) }, p)
  ), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => go(page + 1), disabled: page >= pageCount, "aria-label": t("next") }, "›"));
});
Pagination.displayName = "Pagination";

export {
  Pagination
};
//# sourceMappingURL=chunk-YZR3C7V2.mjs.map
