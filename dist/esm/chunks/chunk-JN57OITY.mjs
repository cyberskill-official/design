"use client";
import {
  overlaySurfaceClass,
  useOverlaySurface
} from "./chunk-ETO3IZEA.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  makeT,
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

// components/overlays/Drawer.jsx
import React from "react";
var Drawer = React.forwardRef(function Drawer2({ open, onClose, title, side = "right", children, actions, lang, className, rootProps }, forwardedRef) {
  const [ref, L, localeMessages] = useLang(lang);
  const titleId = React.useId();
  const hasTitle = Boolean(title) || title === 0;
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, ref, forwardedRef);
  const body = React.useRef(null);
  const [bodyScrollable, setBodyScrollable] = React.useState(false);
  const backdrop = React.useRef(null);
  const material = overlaySurfaceClass(className);
  const surface = useOverlaySurface(!!open, panel, material);
  useClientLayoutEffect(() => {
    const el = body.current;
    if (!open || !el) return;
    const measure = () => setBodyScrollable(el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [open, children]);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  const { scope } = useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel,
    backdropRef: backdrop
  });
  const t = makeT("Drawer", L, localeMessages);
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { ref: backdrop, className: "cs-drawer-scrim", onClick: onClose, "aria-hidden": "true" }), material ? /* @__PURE__ */ React.createElement("div", { ref: surface, className: cx("cs-overlay-surface", material), "aria-hidden": "true" }) : null, /* @__PURE__ */ React.createElement(
    "div",
    {
      ...mergeTargetProps({ className: cx("cs-drawer", side === "left" && "cs-drawer--left", className) }, rootProps, ["role", "tabIndex", "aria-modal", "aria-labelledby", "aria-label", "data-cs-overlay-material"]),
      ref: mergedNativeRef,
      "data-cs-overlay-material": material || void 0,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": hasTitle ? titleId : void 0,
      "aria-label": hasTitle ? void 0 : t("panel")
    },
    /* @__PURE__ */ React.createElement("div", { className: "cs-drawer__header" }, hasTitle ? /* @__PURE__ */ React.createElement("h2", { id: titleId, className: "cs-drawer__title" }, title) : null, /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-drawer__close", "aria-label": t("close"), onClick: onClose }, /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M6 6l12 12M18 6L6 18" })))),
    /* @__PURE__ */ React.createElement("div", { ref: body, className: "cs-drawer__body", tabIndex: bodyScrollable ? 0 : void 0 }, children),
    actions || actions === 0 ? /* @__PURE__ */ React.createElement("div", { className: "cs-drawer__footer" }, actions) : null
  )));
});
Drawer.displayName = "Drawer";

export {
  Drawer
};
//# sourceMappingURL=chunk-JN57OITY.mjs.map
