import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "./OverlayManager.js";
const Drawer = React.forwardRef(function Drawer2({ open, onClose, title, side = "right", children, actions, lang, className }, forwardedRef) {
  const [ref, L] = useLang(lang);
  const panel = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  useOverlayLayer({
    open: !!open,
    kind: "modal",
    trapFocus: true,
    onEscape: () => closeRef.current && closeRef.current(),
    panelRef: panel
  });
  const t = makeT("Drawer", L);
  if (!open) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: forwardedRef, className: "cs-drawer-scrim", onClick: onClose, "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        ref: (el) => {
          panel.current = el;
          ref.current = el;
        },
        tabIndex: -1,
        className: cx("cs-drawer", side === "left" && "cs-drawer--left", className),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": typeof title === "string" ? title : t("panel"),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "cs-drawer__header", children: [
            title ? /* @__PURE__ */ jsx("h2", { className: "cs-drawer__title", children: title }) : null,
            /* @__PURE__ */ jsx("button", { type: "button", className: "cs-drawer__close", "aria-label": t("close"), onClick: onClose, children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "cs-drawer__body", tabIndex: 0, children }),
          actions ? /* @__PURE__ */ jsx("div", { className: "cs-drawer__footer", children: actions }) : null
        ]
      }
    )
  ] });
});
export {
  Drawer
};
