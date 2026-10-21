"use client";
import {
  useFloatingPanel
} from "./chunk-52SZC6SY.mjs";
import {
  focusableSelector,
  overlayScopeContext,
  useOverlayLayer
} from "./chunk-6AEW6SXI.mjs";
import {
  makeT,
  useLang
} from "./chunk-25AOTZAM.mjs";
import {
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/navigation/Menu.jsx
import React from "react";
var Menu = React.forwardRef(function Menu2({ portal = true, placement, trigger, children, align = "start", open: controlledOpen, onOpenChange, lang, className, rootProps }, forwardedRef) {
  const [uOpen, setUOpen] = React.useState(false);
  const open = controlledOpen != null ? controlledOpen : uOpen;
  const set = (v) => {
    if (controlledOpen == null) setUOpen(v);
    onOpenChange?.(v);
  };
  const [ref, L, localeMessages] = useLang(lang);
  const t = makeT("Menu", L, localeMessages);
  const triggerRef = React.useRef(null);
  const triggerSupportsRef = React.isValidElement(trigger) && (typeof trigger.type === "string" || Number.parseInt(React.version, 10) >= 19 || trigger.type?.$$typeof === /* @__PURE__ */ Symbol.for("react.forward_ref"));
  const originalTriggerRef = triggerSupportsRef ? Number.parseInt(React.version, 10) >= 19 ? trigger.props.ref : trigger.ref : void 0;
  const mergedTriggerRef = useComposedRefs(triggerRef, originalTriggerRef);
  const listRef = React.useRef(null);
  const mergedNativeRef = useComposedRefs(listRef, forwardedRef);
  const openingEdge = React.useRef("first");
  const search = React.useRef({ text: "", time: 0 });
  const enabledItems = () => listRef.current ? [...listRef.current.querySelectorAll('[role="menuitem"]:not([disabled]):not(:disabled):not([aria-disabled="true"])')] : [];
  const focusItem = (item) => {
    for (const option of enabledItems()) option.tabIndex = option === item ? 0 : -1;
    item?.focus();
  };
  const floating = useFloatingPanel({ open, anchorRef: ref, panelRef: listRef, portal, manageTabOrder: false, placement: placement ?? (align === "end" ? "bottom-end" : "bottom-start"), gap: 6, getAnchor: () => triggerRef.current || ref.current?.querySelector('[aria-haspopup="menu"]'), lang });
  const { manager, scope } = useOverlayLayer({ open: open && floating.ready, kind: "dropdown", panelRef: listRef, surfaceKey: floating.surfaceKey, onEscape: () => set(false) });
  React.useEffect(() => {
    if (!open || !floating.ready) return;
    const options = enabledItems();
    focusItem(openingEdge.current === "last" ? options.at(-1) : options[0]);
    openingEdge.current = "first";
    search.current = { text: "", time: 0 };
    const onDoc = (e) => {
      if (!floating.contains(e.target)) set(false);
    };
    const onKey = (e) => {
      if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
      if (!floating.contains(e.target)) return;
      const opts = enabledItems();
      if (manager.topDismissible()?.panelEl !== listRef.current) return;
      if (!opts.length) return;
      const active = document.activeElement;
      const idx = opts.indexOf(active);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusItem(opts[(idx + 1) % opts.length]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focusItem(opts[(idx - 1 + opts.length) % opts.length]);
      } else if (e.key === "Home") {
        e.preventDefault();
        focusItem(opts[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        focusItem(opts[opts.length - 1]);
      } else if (e.key.length === 1 && e.key !== " " && !e.altKey && !e.ctrlKey && !e.metaKey) {
        const char = e.key.toLocaleLowerCase();
        const now = Date.now();
        const text = now - search.current.time < 500 ? search.current.text + char : char;
        search.current = { text, time: now };
        const needle = [...text].every((letter) => letter === char) ? char : text;
        const option = [...opts.slice(idx + 1), ...opts.slice(0, idx + 1)].find((item) => item.textContent.trim().toLocaleLowerCase().startsWith(needle));
        if (option) {
          e.preventDefault();
          focusItem(option);
        }
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, floating.ready, floating.surfaceKey]);
  const toggle = (event) => {
    triggerRef.current = event.currentTarget;
    if (!open) event.currentTarget.focus();
    set(!open);
  };
  const triggerKey = (event) => {
    if (event.defaultPrevented || event.nativeEvent?.isComposing || event.keyCode === 229) return;
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    triggerRef.current = event.currentTarget;
    event.currentTarget.focus();
    const edge = event.key === "ArrowUp" ? "last" : "first";
    if (open) {
      const options = enabledItems();
      focusItem(edge === "last" ? options.at(-1) : options[0]);
    } else {
      openingEdge.current = edge;
      set(true);
    }
  };
  const triggerNode = React.isValidElement(trigger) ? React.cloneElement(trigger, {
    ...triggerSupportsRef ? { ref: mergedTriggerRef } : {},
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onKeyDown: (event) => {
      trigger.props.onKeyDown?.(event);
      triggerKey(event);
    },
    onClick: (e) => {
      if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
      if (!e.defaultPrevented) toggle(e);
    }
  }) : /* @__PURE__ */ React.createElement("button", { type: "button", ref: mergedTriggerRef, "aria-haspopup": "menu", "aria-expanded": open, onKeyDown: triggerKey, onClick: toggle }, trigger);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement("div", { ...mergeTargetProps({ "className": cx("cs-menu", className) }, rootProps, []), ref }, triggerNode, open ? floating.render(/* @__PURE__ */ React.createElement(
    "div",
    {
      ref: mergedNativeRef,
      className: cx("cs-menu__list", align === "end" && "cs-menu__list--end"),
      role: "menu",
      "aria-label": t("menu"),
      onFocus: (event) => {
        const item = event.target.closest?.('[role="menuitem"]');
        if (item) for (const option of enabledItems()) option.tabIndex = option === item ? 0 : -1;
      },
      onKeyDown: (event) => {
        if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229 || event.key !== "Tab") return;
        const modal = manager.activeModal();
        const roots = modal ? manager.focusScope() : [document.body];
        let options = [...new Set(roots.flatMap((root) => [...root.querySelectorAll(focusableSelector)]))].filter((el) => el.tabIndex >= 0 && !el.disabled && !el.matches(":disabled") && !listRef.current?.contains(el) && !el.closest('[inert], [hidden], [aria-hidden="true"]') && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden");
        options.sort((a, b) => (a.tabIndex > 0 ? a.tabIndex : Infinity) - (b.tabIndex > 0 ? b.tabIndex : Infinity));
        options = options.filter((el) => {
          if (el.tagName !== "INPUT" || el.type !== "radio" || !el.name) return true;
          const group = options.filter((other) => other.tagName === "INPUT" && other.type === "radio" && other.name === el.name && other.form === el.form && other.getRootNode() === el.getRootNode());
          return el === (group.find((radio) => radio.checked) || (event.shiftKey ? group.at(-1) : group[0]));
        });
        const triggerElement = triggerRef.current || ref.current?.querySelector('[aria-haspopup="menu"]');
        const index = options.indexOf(triggerElement);
        const next = index + (event.shiftKey ? -1 : 1);
        const target = options[next] || (modal ? options[(next + options.length) % options.length] : null);
        if (target) {
          event.preventDefault();
          target.focus();
        } else {
          for (const option of enabledItems()) option.tabIndex = -1;
          triggerElement?.focus();
        }
        set(false);
      },
      onClick: (e) => {
        if (e.defaultPrevented) return;
        const item = e.target.closest?.('[role="menuitem"]:not([disabled])');
        if (item && listRef.current?.contains(item)) set(false);
      }
    },
    children
  )) : null));
});
Menu.displayName = "Menu";
var MenuItem = React.forwardRef(function MenuItem2({ danger = false, icon, children, className, ...props }, forwardedRef) {
  const mergedNativeRef = useComposedRefs(forwardedRef);
  return /* @__PURE__ */ React.createElement("button", { type: "button", role: "menuitem", tabIndex: -1, className: cx("cs-menu__item", danger && "cs-menu__item--danger", className), ...props, ref: mergedNativeRef }, icon || icon === 0 ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, icon) : null, children);
});
MenuItem.displayName = "MenuItem";

export {
  Menu,
  MenuItem
};
//# sourceMappingURL=chunk-SEYKDGXE.mjs.map
