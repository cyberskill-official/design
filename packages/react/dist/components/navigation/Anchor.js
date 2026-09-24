import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { cx } from "../_utils/cx.js";
const Anchor = React.forwardRef(function Anchor2({ items = [], title, className }, forwardedRef) {
  const [act, setAct] = React.useState(items.length ? items[0].id : null);
  React.useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setAct(vis[0].target.id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return /* @__PURE__ */ jsxs("nav", { ref: forwardedRef, className: cx("cs-anchor", className), "aria-label": typeof title === "string" ? title : void 0, children: [
    title ? /* @__PURE__ */ jsx("div", { className: "cs-anchor__title", children: title }) : null,
    items.map((it) => /* @__PURE__ */ jsx("a", { href: "#" + it.id, className: cx("cs-anchor__item", act === it.id && "is-active"), "aria-current": act === it.id ? "location" : void 0, children: it.label }, it.id))
  ] });
});
export {
  Anchor
};
