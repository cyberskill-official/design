import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";
const Menu = React.forwardRef(function Menu2({ trigger, children, align = "start", open: controlledOpen, onOpenChange, lang, className }, forwardedRef) {
  const [uOpen, setUOpen] = React.useState(false);
  const open = controlledOpen != null ? controlledOpen : uOpen;
  const set = (v) => {
    onOpenChange ? onOpenChange(v) : setUOpen(v);
  };
  const [ref, L] = useLang(lang);
  const t = makeT("Menu", L);
  const triggerRef = React.useRef(null);
  const listRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const items = () => listRef.current ? [...listRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')] : [];
    const first = items()[0];
    if (first && first.focus) first.focus();
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) set(false);
    };
    const onKey = (e) => {
      const opts = items();
      if (e.key === "Escape") {
        e.preventDefault();
        set(false);
        const el = triggerRef.current;
        if (el && el.focus) el.focus();
        return;
      }
      if (!opts.length) return;
      const active = document.activeElement;
      const idx = opts.indexOf(active);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        (opts[idx < 0 ? 0 : Math.min(opts.length - 1, idx + 1)] || opts[0]).focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        (opts[idx < 0 ? opts.length - 1 : Math.max(0, idx - 1)] || opts[0]).focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        opts[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        opts[opts.length - 1].focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const toggle = () => set(!open);
  const triggerNode = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    ref: (node) => {
      triggerRef.current = node;
      const r = trigger.ref;
      if (typeof r === "function") r(node);
      else if (r && typeof r === "object") r.current = node;
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: (e) => {
      if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
      if (!e.defaultPrevented) toggle();
    }
  }) : /* @__PURE__ */ jsx("button", { type: "button", ref: triggerRef, "aria-haspopup": "menu", "aria-expanded": open, onClick: toggle, children: trigger });
  return /* @__PURE__ */ jsxs("div", { className: cx("cs-menu", className), ref, children: [
    triggerNode,
    open ? /* @__PURE__ */ jsx(
      "div",
      {
        ref: listRef,
        className: cx("cs-menu__list", align === "end" && "cs-menu__list--end"),
        role: "menu",
        "aria-label": t("menu"),
        children
      }
    ) : null
  ] });
});
const MenuItem = React.forwardRef(function MenuItem2({ danger = false, icon, children, className, ...props }, forwardedRef) {
  return /* @__PURE__ */ jsxs("button", { ref: forwardedRef, type: "button", role: "menuitem", className: cx("cs-menu__item", danger && "cs-menu__item--danger", className), ...props, children: [
    icon ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: icon }) : null,
    children
  ] });
});
export {
  Menu,
  MenuItem
};
