import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { useOverlayLayer, overlayScopeContext } from "../overlays/OverlayManager.jsx";
import { cx } from "../_utils/cx.js";

/** CyberSkill Menu — dropdown. Provide a `trigger` element; compose MenuItem children. */
export function Menu({ trigger, children, align = "start", open: controlledOpen, onOpenChange, lang, className }) {
  const [uOpen, setUOpen] = React.useState(false);
  const open = controlledOpen != null ? controlledOpen : uOpen;
  const set = (v) => { if (controlledOpen == null) setUOpen(v); onOpenChange?.(v); };
  const [ref, L] = useLang(lang);
  const t = makeT("Menu", L);
  const triggerRef = React.useRef(null);
  const listRef = React.useRef(null);

  const { manager, scope } = useOverlayLayer({ open, kind: "dropdown", panelRef: ref, onEscape: () => set(false) });
  React.useEffect(() => {
    if (!open) return;
    const items = () => listRef.current
      ? [...listRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')]
      : [];
    // FIND-040 — move focus into the menu on open.
    const first = items()[0];
    if (first && first.focus) first.focus();

    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) set(false); };
    const onKey = (e) => {
      if (e.defaultPrevented || e.isComposing || e.keyCode === 229) return;
      if (!ref.current?.contains(e.target)) return;
      const opts = items();
      if (manager.topDismissible()?.panelEl !== ref.current) return;
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

  const toggle = (event) => {
    // Pointer activation does not focus buttons in every browser. Establish
    // the opener before the layer records its return-focus target.
    if (!open) event.currentTarget.focus();
    set(!open);
  };
  // ARIA attrs must live on the interactive trigger (button), not a wrapping <span>
  // — axe aria-allowed-attr flags aria-haspopup/aria-expanded on generic elements.
  const triggerNode = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        ref: (node) => {
          triggerRef.current = node;
          const r = Number(React.version.split(".")[0]) >= 19 ? trigger.props.ref : trigger.ref;
          if (typeof r === "function") r(node);
          else if (r && typeof r === "object") r.current = node;
        },
        "aria-haspopup": "menu",
        "aria-expanded": open,
        onClick: (e) => {
          if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
          if (!e.defaultPrevented) toggle(e);
        },
      })
    : <button type="button" ref={triggerRef} aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{trigger}</button>;
  return (
    <overlayScopeContext.Provider value={scope}>
    <div className={cx("cs-menu", className)} ref={ref}>
      {triggerNode}
      {open ? (
        <div
          ref={listRef}
          className={cx("cs-menu__list", align === "end" && "cs-menu__list--end")}
          role="menu"
          aria-label={t("menu")}
        >
          {children}
        </div>
      ) : null}
    </div>
    </overlayScopeContext.Provider>
  );
}

/** An item inside a Menu. */
export function MenuItem({ danger = false, icon, children, className, ...props }) {
  return (
    <button type="button" role="menuitem" className={cx("cs-menu__item", danger && "cs-menu__item--danger", className)} {...props}>
      {(icon || icon === 0) ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}
