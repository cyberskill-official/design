import { jsx, jsxs } from "react/jsx-runtime";
import { mergeRefs } from "../_utils/merge-refs.js";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
import { useOverlayLayer } from "./OverlayManager.js";
const AlertDialog = React.forwardRef(function AlertDialog2({
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
  const [ref, L] = useLang(lang);
  const t = makeT("AlertDialog", L);
  const panel = React.useRef(null);
  const uncontrolled = open === void 0;
  const [internal, setInternal] = React.useState(!!defaultOpen);
  const isOpen = uncontrolled ? internal : !!open;
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
  useOverlayLayer({
    open: isOpen,
    kind: "modal",
    trapFocus: true,
    preferFocusSelector: ".cs-alert-dialog__confirm",
    onEscape: () => {
      setOpenRef.current(false);
      cancelRef.current?.();
    },
    panelRef: panel
  });
  const cl = cancelLabel != null ? cancelLabel : t("cancel");
  const cf = confirmLabel != null ? confirmLabel : t("confirm");
  const body = description ?? children;
  const hasDesc = body != null && body !== false && body !== "";
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { ref: mergeRefs(ref, forwardedRef), className: "cs-dialog-layer cs-alert-dialog-layer", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "cs-dialog__overlay",
        onClick: () => {
          setOpen(false);
          cancelRef.current?.();
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs(
      "section",
      {
        ...props,
        ref: panel,
        tabIndex: -1,
        role: "alertdialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        "aria-describedby": hasDesc ? descId : void 0,
        className: cx("cs-dialog", "cs-alert-dialog", destructive && "cs-alert-dialog--destructive", className),
        children: [
          /* @__PURE__ */ jsx("header", { className: "cs-dialog__header", children: /* @__PURE__ */ jsx("h2", { id: titleId, className: "cs-dialog__title", children: title }) }),
          hasDesc ? /* @__PURE__ */ jsx("div", { id: descId, className: "cs-dialog__body", children: body }) : null,
          /* @__PURE__ */ jsxs("footer", { className: "cs-dialog__actions", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "cs-button cs-button--ghost cs-button--md",
                onClick: () => {
                  setOpen(false);
                  cancelRef.current?.();
                },
                children: cl
              }
            ),
            /* @__PURE__ */ jsx(
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
                },
                children: cf
              }
            )
          ] })
        ]
      }
    )
  ] });
});
export {
  AlertDialog
};
