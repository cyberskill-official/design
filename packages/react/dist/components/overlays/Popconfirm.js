import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Popconfirm = React.forwardRef(function Popconfirm2({ trigger, title, onConfirm, onCancel, okLabel, cancelLabel, lang, className }, forwardedRef) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Popconfirm", L);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    const k = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", d);
      document.removeEventListener("keydown", k);
    };
  }, [open]);
  const toggle = () => setOpen((o) => !o);
  const triggerNode = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (e) => {
      if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
      if (!e.defaultPrevented) toggle();
    }
  }) : /* @__PURE__ */ jsx("button", { type: "button", "aria-haspopup": "dialog", "aria-expanded": open, onClick: toggle, children: trigger });
  return /* @__PURE__ */ jsxs("span", { ref: (el) => {
    wrap.current = el;
    ref.current = el;
  }, className: cx("cs-popconfirm", className), children: [
    triggerNode,
    open ? /* @__PURE__ */ jsxs("span", { className: "cs-popconfirm__panel", role: "alertdialog", "aria-label": typeof title === "string" ? title : void 0, children: [
      /* @__PURE__ */ jsx("span", { className: "cs-popconfirm__title", children: title }),
      /* @__PURE__ */ jsxs("span", { className: "cs-popconfirm__actions", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--ghost cs-button--xs", onClick: () => {
          setOpen(false);
          onCancel && onCancel();
        }, children: cancelLabel != null ? cancelLabel : t("cancel") }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cs-button cs-button--primary cs-button--xs", onClick: () => {
          setOpen(false);
          onConfirm && onConfirm();
        }, children: okLabel != null ? okLabel : t("ok") })
      ] })
    ] }) : null
  ] });
});
export {
  Popconfirm
};
