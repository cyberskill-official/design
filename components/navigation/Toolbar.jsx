import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Toolbar — horizontal action bar; overflow items collapse into a "⋯" menu. items: {label,icon,onSelect} or "-". */
export function Toolbar({ items = [], overflowAfter, label, lang, className }) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Toolbar", L);
  const cut = overflowAfter != null ? overflowAfter : items.length;
  const head = items.slice(0, cut);
  const tail = items.slice(cut).filter((x) => x !== "-");
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  return (
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-toolbar", className)} role="toolbar" aria-label={label}>
      {head.map((it, i) => it === "-"
        ? <span key={i} className="cs-toolbar__sep" aria-hidden="true" />
        : <button key={i} type="button" className="cs-toolbar__btn" onClick={() => it.onSelect && it.onSelect()}>{it.icon}{it.label ? <span>{it.label}</span> : null}</button>)}
      {tail.length ? (
        <span className="cs-toolbar__more">
          <button type="button" className="cs-toolbar__btn" aria-haspopup="menu" aria-expanded={open} aria-label={t("more")} onClick={() => setOpen((o) => !o)}>⋯</button>
          {open ? <span className="cs-menu__list" role="menu">{tail.map((it, i) => <button key={i} type="button" role="menuitem" className="cs-menu__item" onClick={() => { setOpen(false); it.onSelect && it.onSelect(); }}>{it.label}</button>)}</span> : null}
        </span>
      ) : null}
    </div>
  );
}
