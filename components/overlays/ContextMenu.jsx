import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill ContextMenu — right-click menu scoped to its children. items: {label,onSelect,danger} or "-" separator. */
export function ContextMenu({ items = [], children, lang, className }) {
  const [pos, setPos] = React.useState(null);
  const [ref, L] = useLang(lang);
  const t = makeT("ContextMenu", L);
  React.useEffect(() => {
    if (!pos) return;
    const close = () => setPos(null);
    const k = (e) => { if (e.key === "Escape") setPos(null); };
    document.addEventListener("click", close);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", k); };
  }, [pos]);
  return (
    <div ref={ref} className={cx("cs-ctxmenu-zone", className)}
      onContextMenu={(e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
      {children}
      {pos ? (
        <div className="cs-menu__list" role="menu" aria-label={t("menu")} style={{ position: "absolute", insetInlineStart: pos.x, insetBlockStart: pos.y }}>
          {items.map((it, i) => it === "-"
            ? <div key={i} className="cs-menu__sep" />
            : <button key={i} type="button" role="menuitem" className={cx("cs-menu__item", it.danger && "cs-menu__item--danger")} onClick={() => { setPos(null); it.onSelect && it.onSelect(); }}>{it.label}</button>)}
        </div>
      ) : null}
    </div>
  );
}
