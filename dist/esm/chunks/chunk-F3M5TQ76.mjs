"use client";
import {
  overlaySurfaceClass,
  useOverlaySurface
} from "./chunk-ETO3IZEA.mjs";
import {
  Icon
} from "./chunk-JPZKGP54.mjs";
import {
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
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

// components/dialog/Dialog.jsx
import React from "react";
var Dialog = React.forwardRef(function Dialog2({
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
  const [ref, L, localeMessages] = useLang(lang);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const backdrop = React.useRef(null);
  const material = overlaySurfaceClass(className);
  const surface = useOverlaySurface(!!open, panel, material);
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
  const cl = closeLabel != null ? closeLabel : makeT("Dialog", L, localeMessages)("close");
  if (!open) return null;
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref, className: "cs-dialog-layer" }, /* @__PURE__ */ React.createElement("div", { ref: backdrop, className: "cs-dialog__overlay", onClick: onClose, "aria-hidden": "true" }), material ? /* @__PURE__ */ React.createElement("div", { ref: surface, className: cx("cs-overlay-surface", material), "aria-hidden": "true" }) : null, /* @__PURE__ */ React.createElement(
    "section",
    {
      ...props,
      ref: mergedNativeRef,
      "data-cs-overlay-material": material || void 0,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": titleId,
      "aria-describedby": Object.prototype.hasOwnProperty.call(props, "aria-describedby") ? props["aria-describedby"] || void 0 : bodyId,
      className: cx("cs-dialog", className)
    },
    /* @__PURE__ */ React.createElement("header", { className: "cs-dialog__header" }, /* @__PURE__ */ React.createElement("h2", { id: titleId, className: "cs-dialog__title" }, title), onClose ? /* @__PURE__ */ React.createElement("button", { type: "button", className: "cs-button cs-button--ghost cs-button--sm", onClick: onClose, "aria-label": cl }, /* @__PURE__ */ React.createElement(Icon, { name: "close", size: "sm" })) : null),
    /* @__PURE__ */ React.createElement("div", { id: bodyId, className: "cs-dialog__body" }, children),
    actions || actions === 0 ? /* @__PURE__ */ React.createElement("footer", { className: "cs-dialog__actions" }, actions) : null
  )));
});
Dialog.displayName = "Dialog";

export {
  Dialog
};
//# sourceMappingURL=chunk-F3M5TQ76.mjs.map
