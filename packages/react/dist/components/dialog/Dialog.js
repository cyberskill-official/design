import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { Icon } from "../icon/Icon.jsx";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "../overlays/OverlayManager.jsx";
const Dialog = React.forwardRef(function Dialog2({
  open,
  title,
  children,
  actions,
  onClose,
  className,
  closeLabel,
  lang,
  ...props
}, forwardedRef) {
  const baseId = React.useId();
  const titleId = baseId + "-title";
  const bodyId = children == null ? void 0 : baseId + "-body";
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
  const cl = closeLabel != null ? closeLabel : makeT("Dialog", L)("close");
  if (!open) return null;
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: "cs-dialog-layer", children: [
    /* @__PURE__ */ jsx("div", { className: "cs-dialog__overlay", onClick: onClose, "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs(
      "section",
      {
        ...props,
        ref: panel,
        tabIndex: -1,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-describedby": bodyId != null ? bodyId : props["aria-describedby"],
        className: cx("cs-dialog", className),
        children: [
          /* @__PURE__ */ jsxs("header", { className: "cs-dialog__header", children: [
            /* @__PURE__ */ jsx("h2", { id: titleId, className: "cs-dialog__title", children: title }),
            onClose ? /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--ghost cs-button--sm", onClick: onClose, "aria-label": cl, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: "sm" }) }) : null
          ] }),
          /* @__PURE__ */ jsx("div", { id: bodyId, className: "cs-dialog__body", children }),
          actions ? /* @__PURE__ */ jsx("footer", { className: "cs-dialog__actions", children: actions }) : null
        ]
      }
    )
  ] });
});
export {
  Dialog
};
