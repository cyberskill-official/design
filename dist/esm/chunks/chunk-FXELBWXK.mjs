"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
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

// components/navigation/Menubar.jsx
import React from "react";
var Menubar = React.forwardRef(function Menubar2({ portal = true, placement, menus = [], className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, rootProps }, forwardedRef) {
  const floatingRef = React.useRef(null);
  const [open, setOpen] = React.useState(null);
  const [focusI, setFocusI] = React.useState(0);
  const [wrap, L, localeMessages] = useLang();
  const mergedNativeRef = useComposedRefs(wrap, forwardedRef);
  const t = makeT("Menubar", L, localeMessages);
  const id = React.useId();
  const itemFocus = React.useRef(null);
  const menuRefs = React.useRef([]);
  const btns = React.useRef([]);
  const floating = useFloatingPanel({ open: open != null, anchorRef: wrap, panelRef: floatingRef, portal, manageTabOrder: false, placement: placement ?? "bottom-start", gap: 5, getAnchor: () => btns.current[open], getInlineParent: () => btns.current[open]?.parentElement, identity: open });
  const { scope } = useOverlayLayer({ open: open != null && floating.ready, kind: "dropdown", panelRef: floatingRef, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: () => {
    setOpen(null);
    btns.current[open]?.focus();
  } });
  useClientLayoutEffect(() => {
    if (open == null || itemFocus.current == null || !floating.ready) return;
    const items = menuRefs.current[open]?.querySelectorAll('[role="menuitem"]');
    const target = itemFocus.current;
    itemFocus.current = null;
    (target === -1 ? items?.[items.length - 1] : items?.[0])?.focus();
  }, [open, floating.ready, floating.surfaceKey]);
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
  const nav = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % menus.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + menus.length) % menus.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = menus.length - 1;
    else if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      itemFocus.current = e.key === "ArrowUp" ? -1 : 0;
      if (open === i) {
        const items = menuRefs.current[i]?.querySelectorAll('[role="menuitem"]');
        (itemFocus.current === -1 ? items?.[items.length - 1] : items?.[0])?.focus();
        itemFocus.current = null;
      } else setOpen(i);
      return;
    }
    if (n == null) return;
    e.preventDefault();
    setFocusI(n);
    if (open != null) setOpen(n);
    const b = btns.current[n];
    if (b) b.focus();
  };
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, ...mergeTargetProps({ "className": cx("cs-menubar", className) }, rootProps, ["role", "aria-label", "aria-labelledby"]), role: "menubar", "aria-label": ariaLabel ?? (ariaLabelledBy ? void 0 : t("label")), "aria-labelledby": ariaLabelledBy }, menus.map((m, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "cs-menubar__wrap" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      id: `${id}-top-${i}`,
      type: "button",
      role: "menuitem",
      "aria-haspopup": "menu",
      "aria-expanded": open === i,
      tabIndex: i === focusI ? 0 : -1,
      ref: (el) => btns.current[i] = el,
      onKeyDown: (e) => nav(e, i),
      onFocus: () => setFocusI(i),
      className: cx("cs-menubar__top", open === i && "is-open"),
      onClick: () => setOpen(open === i ? null : i),
      onMouseEnter: () => {
        if (open != null && open !== i) setOpen(i);
      }
    },
    m.label
  ), open === i ? floating.render(/* @__PURE__ */ React.createElement("span", { className: "cs-menu__list", role: "menu", "aria-labelledby": `${id}-top-${i}`, ref: (el) => {
    menuRefs.current[i] = el;
    floatingRef.current = el;
  }, onKeyDown: (e) => {
    const items = [...e.currentTarget.querySelectorAll('[role="menuitem"]')];
    const current = items.indexOf(document.activeElement);
    let next;
    if (e.key === "ArrowDown") next = (current + 1) % items.length;
    else if (e.key === "ArrowUp") next = (current - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const target = (i + (e.key === "ArrowRight" ? 1 : -1) + menus.length) % menus.length;
      itemFocus.current = 0;
      setFocusI(target);
      setOpen(target);
      return;
    } else if (e.key === "Tab") {
      setOpen(null);
      btns.current[i]?.focus();
      return;
    } else return;
    e.preventDefault();
    items[next]?.focus();
  } }, m.items.map((it, j) => it === "-" ? /* @__PURE__ */ React.createElement("span", { key: j, className: "cs-menu__sep", role: "separator" }) : /* @__PURE__ */ React.createElement("button", { key: j, type: "button", role: "menuitem", className: cx("cs-menu__item", it.danger && "cs-menu__item--danger"), onClick: () => {
    setOpen(null);
    btns.current[i]?.focus();
    it.onSelect && it.onSelect();
  } }, it.label)))) : null))));
});
Menubar.displayName = "Menubar";

export {
  Menubar
};
//# sourceMappingURL=chunk-FXELBWXK.mjs.map
