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
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/overlays/AlertDialog.jsx
import React from "react";
var AlertDialog = React.forwardRef(function AlertDialog2({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  tone,
  variant,
  onConfirm,
  onCancel,
  lang,
  className,
  ...props
}, forwardedRef) {
  const baseId = React.useId();
  const titleId = baseId + "-title";
  const descId = baseId + "-desc";
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("AlertDialog", L, localeMessages);
  const panel = React.useRef(null);
  const mergedNativeRef = useComposedRefs(panel, forwardedRef);
  const backdrop = React.useRef(null);
  const uncontrolled = open === void 0;
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const isOpen = uncontrolled ? internal : !!open;
  const material = overlaySurfaceClass(className);
  const surface = useOverlaySurface(isOpen, panel, material);
  const setOpen = (next) => {
    if (uncontrolled) setInternal(next);
    onOpenChange?.(next);
  };
  const destructive = (tone ?? variant) === "destructive";
  const confirmRef = React.useRef(onConfirm);
  confirmRef.current = onConfirm;
  const cancelRef = React.useRef(onCancel);
  cancelRef.current = onCancel;
  const setOpenRef = React.useRef(setOpen);
  setOpenRef.current = setOpen;
  const { scope } = useOverlayLayer({
    open: isOpen,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: destructive ? ".cs-alert-dialog__cancel" : ".cs-alert-dialog__confirm",
    onEscape: () => {
      setOpenRef.current(false);
      cancelRef.current?.();
    },
    panelRef: panel,
    backdropRef: backdrop
  });
  const cl = cancelLabel != null ? cancelLabel : t("cancel");
  const cf = confirmLabel != null ? confirmLabel : t("confirm");
  const body = description ?? children;
  const hasDesc = body != null && body !== false && body !== "";
  if (!isOpen) return null;
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref, className: "cs-dialog-layer cs-alert-dialog-layer" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: backdrop,
      className: "cs-dialog__overlay",
      onClick: () => {
        setOpen(false);
        cancelRef.current?.();
      },
      "aria-hidden": "true"
    }
  ), material ? /* @__PURE__ */ React.createElement("div", { ref: surface, className: cx("cs-overlay-surface", material), "aria-hidden": "true" }) : null, /* @__PURE__ */ React.createElement(
    "section",
    {
      ...props,
      ref: mergedNativeRef,
      "data-cs-overlay-material": material || void 0,
      tabIndex: -1,
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": titleId,
      "aria-describedby": hasDesc ? descId : void 0,
      className: cx("cs-dialog", "cs-alert-dialog", destructive && "cs-alert-dialog--destructive", className)
    },
    /* @__PURE__ */ React.createElement("header", { className: "cs-dialog__header" }, /* @__PURE__ */ React.createElement("h2", { id: titleId, className: "cs-dialog__title" }, title)),
    hasDesc ? /* @__PURE__ */ React.createElement("div", { id: descId, className: "cs-dialog__body" }, body) : null,
    /* @__PURE__ */ React.createElement("footer", { className: "cs-dialog__actions" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: "cs-button cs-button--ghost cs-button--md cs-alert-dialog__cancel",
        onClick: () => {
          setOpen(false);
          cancelRef.current?.();
        }
      },
      cl
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        className: cx(
          "cs-button",
          "cs-button--md",
          "cs-alert-dialog__confirm",
          destructive ? "cs-button--danger" : "cs-button--primary"
        ),
        onClick: () => {
          setOpen(false);
          confirmRef.current?.();
        }
      },
      cf
    ))
  )));
});
AlertDialog.displayName = "AlertDialog";

export {
  AlertDialog
};
//# sourceMappingURL=chunk-QPXQZBQC.mjs.map
