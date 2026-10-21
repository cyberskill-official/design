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
  mergeTargetProps
} from "./chunk-RQFCRXMQ.mjs";
import {
  cx
} from "./chunk-5LXHLKXS.mjs";
import {
  useComposedRefs
} from "./chunk-BQH4YUGI.mjs";

// components/overlays/ContextMenu.jsx
import React from "react";
var ContextMenu = React.forwardRef(function ContextMenu2({ portal = true, placement, items = [], children, lang, className, tabIndex = 0, rootProps }, forwardedRef) {
  const [pos, setPos] = React.useState(null);
  const [active, setActive] = React.useState(0);
  const [ref, L, localeMessages] = useLang(lang);
  const list = React.useRef(null);
  const mergedNativeRef = useComposedRefs(list, forwardedRef);
  const opener = React.useRef(null);
  const pointerOpener = React.useRef(null);
  const closeTimer = React.useRef(null);
  const t = makeT("ContextMenu", L, localeMessages);
  const dismiss = (restore = true) => {
    clearTimeout(closeTimer.current);
    setPos(null);
    const el = opener.current;
    if (restore && el?.isConnected && !el.closest("[inert], [hidden]")) el.focus();
  };
  const floating = useFloatingPanel({ open: Boolean(pos), anchorRef: ref, panelRef: list, portal, manageTabOrder: false, placement: placement ?? "bottom-start", gap: 0, lang, getTabAnchor: () => opener.current || ref.current, point: pos ? { ...pos, relative: true } : null });
  const { manager, scope } = useOverlayLayer({ open: Boolean(pos) && floating.ready, kind: "dropdown", panelRef: list, surfaceKey: floating.surfaceKey, restoreFocus: false, onEscape: () => dismiss() });
  const openAt = (point, trigger = document.activeElement) => {
    clearTimeout(closeTimer.current);
    const first = items.findIndex((item) => item !== "-");
    if (first < 0) return;
    if (!pos) opener.current = trigger;
    setActive(first);
    setPos(point);
  };
  React.useEffect(() => {
    if (!pos || !floating.ready) return;
    const options = () => [...list.current?.querySelectorAll('[role="menuitem"]') || []];
    const opts = options();
    if (!opts.length) {
      dismiss(document.activeElement === document.body || list.current?.contains(document.activeElement));
      return;
    }
    if (!list.current?.contains(document.activeElement)) opts[0].focus();
    const close = () => dismiss(false);
    const onKey = (e) => {
      if (manager.topDismissible()?.panelEl !== list.current || !list.current?.contains(e.target)) return;
      if (e.isComposing || e.nativeEvent?.isComposing || e.keyCode === 229) return;
      if (e.key === "Tab") {
        clearTimeout(closeTimer.current);
        if (!e.defaultPrevented) {
          const controls = manager.focusOrder({ backwards: e.shiftKey });
          const index2 = controls.indexOf(document.activeElement);
          const next2 = index2 + (e.shiftKey ? -1 : 1);
          const target = controls[next2] || (manager.activeModal() ? controls[(next2 + controls.length) % controls.length] : null);
          if (target) {
            e.preventDefault();
            target.focus();
            dismiss(false);
            return;
          }
        }
        closeTimer.current = setTimeout(() => dismiss(false), 0);
        return;
      }
      if (e.defaultPrevented) return;
      const opts2 = options(), index = opts2.indexOf(document.activeElement);
      if (!opts2.length) return;
      let next;
      if (e.key === "ArrowDown") next = Math.min(opts2.length - 1, index + 1);
      else if (e.key === "ArrowUp") next = index < 0 ? opts2.length - 1 : Math.max(0, index - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = opts2.length - 1;
      else return;
      e.preventDefault();
      opts2[next].focus();
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(closeTimer.current);
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [pos, items, floating.ready, floating.surfaceKey]);
  return /* @__PURE__ */ React.createElement(overlayScopeContext.Provider, { value: scope }, /* @__PURE__ */ React.createElement(
    "div",
    {
      ref,
      ...mergeTargetProps({ "className": cx("cs-ctxmenu-zone", className), "onBlur": (e) => {
        if (pos && !floating.contains(e.relatedTarget)) dismiss(false);
      }, "onKeyDown": (e) => {
        if (pos || e.defaultPrevented || e.isComposing || e.nativeEvent?.isComposing || e.keyCode === 229) return;
        if (e.key === "ContextMenu" || e.key === "F10" && e.shiftKey) {
          e.preventDefault();
          pointerOpener.current = null;
          openAt({ x: 0, y: e.currentTarget.getBoundingClientRect().height });
        }
      }, "onPointerDownCapture": (e) => {
        pointerOpener.current = e.button === 2 && e.currentTarget.contains(document.activeElement) ? document.activeElement : null;
      }, "onContextMenu": (e) => {
        const trigger = pointerOpener.current;
        pointerOpener.current = null;
        if (e.defaultPrevented) return;
        e.preventDefault();
        if (!e.currentTarget.contains(document.activeElement)) e.currentTarget.focus();
        const box = e.currentTarget.getBoundingClientRect();
        openAt({ x: e.clientX - box.left, y: e.clientY - box.top }, trigger?.isConnected && e.currentTarget.contains(trigger) ? trigger : document.activeElement);
      } }, rootProps, ["role", "aria-label", "tabIndex"]),
      role: "group",
      "aria-label": t("menu"),
      tabIndex
    },
    children,
    pos ? floating.render(/* @__PURE__ */ React.createElement("div", { ref: mergedNativeRef, className: "cs-menu__list", role: "menu", "aria-label": t("menu"), style: { position: "absolute", insetInlineStart: pos.x, insetBlockStart: pos.y } }, items.map((it, i) => it === "-" ? /* @__PURE__ */ React.createElement("div", { key: i, className: "cs-menu__sep", role: "separator" }) : /* @__PURE__ */ React.createElement("button", { key: i, type: "button", role: "menuitem", tabIndex: active === i ? 0 : -1, onFocus: () => setActive(i), className: cx("cs-menu__item", it.danger && "cs-menu__item--danger"), onClick: () => {
      dismiss();
      it.onSelect && it.onSelect();
    } }, it.label)))) : null
  ));
});
ContextMenu.displayName = "ContextMenu";

export {
  ContextMenu
};
//# sourceMappingURL=chunk-KXFGO7N4.mjs.map
