"use client";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Anchor.jsx
import React from "react";
var Anchor = React.forwardRef(function Anchor2({ items = [], title, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  const titleId = React.useId();
  const hasTitle = Boolean(title) || title === 0;
  const [act, setAct] = React.useState(items.length ? items[0].id : null);
  React.useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;
    const visible = /* @__PURE__ */ new Set();
    const io = new IntersectionObserver((es) => {
      for (const entry of es) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      const vis = [...visible].filter((el) => el.isConnected).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      if (vis[0]) setAct(vis[0].id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return /* @__PURE__ */ React.createElement("nav", { className: cx("cs-anchor", className), "aria-labelledby": hasTitle ? titleId : void 0, ...props, ref: mergedNativeRef }, hasTitle ? /* @__PURE__ */ React.createElement("div", { id: titleId, className: "cs-anchor__title" }, title) : null, items.map((it) => /* @__PURE__ */ React.createElement("a", { key: it.id, href: "#" + it.id, className: cx("cs-anchor__item", act === it.id && "is-active"), "aria-current": act === it.id ? "location" : void 0 }, it.label)));
});
Anchor.displayName = "Anchor";

export {
  Anchor
};
//# sourceMappingURL=chunk-56B5BUKE.mjs.map
