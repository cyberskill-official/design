import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "./OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** Context menu for a focusable zone or focused descendant; items are actions or separators. */
export function ContextMenu({ items = [], children, lang, className, tabIndex = 0 }) {
  const [pos, setPos] = React.useState(null);
  const [active, setActive] = React.useState(0);
  const [ref, L] = useLang(lang);
  const list = React.useRef(null);
  const opener = React.useRef(null);
  const pointerOpener = React.useRef(null);
  const closeTimer = React.useRef(null);
  const t = makeT("ContextMenu", L);
  const dismiss = (restore = true) => {
    clearTimeout(closeTimer.current);
    setPos(null);
    const el = opener.current;
    if (restore && el?.isConnected && !el.closest('[inert], [hidden]')) el.focus();
  };
  // Tab/outside dismissal keeps the next native focus destination. Escape and actions
  // explicitly return to the opener before a caller may launch another surface.
  const { manager, scope } = useOverlayLayer({ open: !!pos, kind: "dropdown", panelRef: ref, restoreFocus: false, onEscape: () => dismiss() });
  const openAt = (point, trigger = document.activeElement) => {
    clearTimeout(closeTimer.current);
    const first = items.findIndex(item => item !== "-");
    if (first < 0) return;
    if (!pos) opener.current = trigger;
    setActive(first);
    setPos(point);
  };
  React.useEffect(() => {
    if (!pos) return;
    const options = () => [...(list.current?.querySelectorAll('[role="menuitem"]') || [])];
    const opts = options();
    if (!opts.length) { dismiss(document.activeElement === document.body || list.current?.contains(document.activeElement)); return; }
    if (!list.current?.contains(document.activeElement)) opts[0].focus();
    const close = () => dismiss(false);
    const onKey = (e) => {
      if (manager.topDismissible()?.panelEl !== ref.current || !list.current?.contains(e.target)) return;
      if (e.isComposing || e.nativeEvent?.isComposing || e.keyCode === 229) return;
      if (e.key === "Tab") {
        clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => dismiss(false), 0);
        return;
      }
      if (e.defaultPrevented) return;
      const opts = options(), index = opts.indexOf(document.activeElement);
      if (!opts.length) return;
      let next;
      if (e.key === "ArrowDown") next = Math.min(opts.length - 1, index + 1);
      else if (e.key === "ArrowUp") next = index < 0 ? opts.length - 1 : Math.max(0, index - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = opts.length - 1;
      else return;
      e.preventDefault();
      opts[next].focus();
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(closeTimer.current); document.removeEventListener("click", close); document.removeEventListener("keydown", onKey); };
  }, [pos, items]);
  return (
    <overlayScopeContext.Provider value={scope}>
    <div ref={ref} className={cx("cs-ctxmenu-zone", className)} role="group" aria-label={t("menu")} tabIndex={tabIndex}
      onBlur={(e) => { if (pos && !e.currentTarget.contains(e.relatedTarget)) dismiss(false); }}
      onKeyDown={(e) => {
        if (pos || e.defaultPrevented || e.isComposing || e.nativeEvent?.isComposing || e.keyCode === 229) return;
        if (e.key === "ContextMenu" || (e.key === "F10" && e.shiftKey)) {
          e.preventDefault();
          pointerOpener.current = null;
          openAt({ x: 0, y: e.currentTarget.getBoundingClientRect().height });
        }
      }}
      onPointerDownCapture={(e) => {
        // WebKit can blur a focused button before dispatching contextmenu.
        pointerOpener.current = e.button === 2 && e.currentTarget.contains(document.activeElement) ? document.activeElement : null;
      }}
      onContextMenu={(e) => {
        const trigger = pointerOpener.current;
        pointerOpener.current = null;
        if (e.defaultPrevented) return;
        e.preventDefault();
        if (!e.currentTarget.contains(document.activeElement)) e.currentTarget.focus();
        const box = e.currentTarget.getBoundingClientRect();
        openAt({ x: e.clientX - box.left, y: e.clientY - box.top }, trigger?.isConnected && e.currentTarget.contains(trigger) ? trigger : document.activeElement);
      }}>
      {children}
      {pos ? (
        <div ref={list} className="cs-menu__list" role="menu" aria-label={t("menu")} style={{ position: "absolute", insetInlineStart: pos.x, insetBlockStart: pos.y }}>
          {items.map((it, i) => it === "-"
            ? <div key={i} className="cs-menu__sep" role="separator" />
            : <button key={i} type="button" role="menuitem" tabIndex={active === i ? 0 : -1} onFocus={() => setActive(i)} className={cx("cs-menu__item", it.danger && "cs-menu__item--danger")} onClick={() => { dismiss(); it.onSelect && it.onSelect(); }}>{it.label}</button>)}
        </div>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
}
