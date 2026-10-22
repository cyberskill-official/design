"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/NavigationMenu.jsx
import React from "react";
var NavigationMenu = React.forwardRef(function NavigationMenu2({ portal = true, placement, items = [], className, ...props }, forwardedRef) {
  const [open, setOpen] = React.useState(null);
  const wrap = React.useRef(null);
  const mergedNativeRef = useComposedRefs(wrap, forwardedRef);
  const popup = React.useRef(null);
  const floating = useFloatingPanel({ open: open != null, anchorRef: wrap, panelRef: popup, portal, placement: placement ?? "bottom-start", gap: 8, getAnchor: () => wrap.current?.querySelector('button[aria-expanded="true"]'), getInlineParent: () => wrap.current?.querySelector('button[aria-expanded="true"]')?.parentElement, identity: open });
  const { scope } = useOverlayLayer({ open: open != null && floating.ready, kind: "dropdown", panelRef: popup, surfaceKey: floating.surfaceKey, onEscape: () => setOpen(null) });
  React.useEffect(() => {
    if (open == null) return;
    const d = (e) => {
      if (!floating.contains(e.target)) setOpen(null);
    };
    document.addEventListener("mousedown", d);
    return () => {
      document.removeEventListener("mousedown", d);
    };
  }, [open]);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("nav", { ref: mergedNativeRef, className: cx("cs-navmenu", className), ...props }, items.map((it, i) => it.panel ? /* @__PURE__ */ React.createElement("span", { key: i, className: "cs-navmenu__wrap" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: cx("cs-navmenu__top", open === i && "is-open"),
      "aria-expanded": open === i,
      onClick: () => setOpen(open === i ? null : i),
      onMouseEnter: () => {
        if (open != null && open !== i) setOpen(i);
      }
    },
    it.label,
    " ",
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "▾")
  ), open === i ? floating.render(/* @__PURE__ */ React.createElement("span", { ref: popup, className: "cs-navmenu__panel" }, it.panel.map((p, j) => /* @__PURE__ */ React.createElement("a", { key: j, href: p.href || "#", className: "cs-navmenu__card", onClick: () => setOpen(null) }, /* @__PURE__ */ React.createElement("b", null, p.label), p.desc || p.desc === 0 ? /* @__PURE__ */ React.createElement("small", null, p.desc) : null)))) : null) : /* @__PURE__ */ React.createElement("a", { key: i, href: it.href || "#", className: "cs-navmenu__top" }, it.label))));
});
NavigationMenu.displayName = "NavigationMenu";

export {
  NavigationMenu
};
//# sourceMappingURL=chunk-GA5HJNPW.mjs.map
