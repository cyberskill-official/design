import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Toolbar — horizontal action bar (APG toolbar arrows); overflow items collapse into a menubutton + popup menu. items: {label,icon,onSelect} or "-". */
export function Toolbar({ items = [], overflowAfter, label, lang, className }) {
  const [open, setOpen] = React.useState(false);
  const [focusIdx, setFocusIdx] = React.useState(0);
  const wrap = React.useRef(null);
  const btnRefs = React.useRef([]);
  const menuRefs = React.useRef([]);
  const [ref, L] = useLang(lang);
  const t = makeT("Toolbar", L);
  const cut = overflowAfter != null ? overflowAfter : items.length;
  const head = items.slice(0, cut);
  const tail = items.slice(cut).filter((x) => x !== "-");
  const hasMore = tail.length > 0;

  // Controllable tab stops: head action buttons + optional ⋯ menubutton (separators skipped).
  const controlMeta = [];
  head.forEach((it, i) => {
    if (it !== "-") controlMeta.push({ kind: "head", headIndex: i });
  });
  if (hasMore) controlMeta.push({ kind: "more" });

  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);

  React.useEffect(() => {
    if (focusIdx >= controlMeta.length) setFocusIdx(Math.max(0, controlMeta.length - 1));
  }, [focusIdx, controlMeta.length]);

  const focusControl = (i) => {
    const next = Math.max(0, Math.min(controlMeta.length - 1, i));
    setFocusIdx(next);
    requestAnimationFrame(() => {
      const el = btnRefs.current[next];
      if (el) el.focus();
    });
  };

  const onToolbarKeyDown = (e, i) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowRight") { e.preventDefault(); focusControl(i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); focusControl(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); focusControl(0); }
    else if (e.key === "End") { e.preventDefault(); focusControl(controlMeta.length - 1); }
    else if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); }
  };

  const onMenuKeyDown = (e, i) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = Math.min(tail.length - 1, i + 1);
      const el = menuRefs.current[n]; if (el) el.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = Math.max(0, i - 1);
      const el = menuRefs.current[n]; if (el) el.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      const moreIdx = controlMeta.findIndex((c) => c.kind === "more");
      if (moreIdx >= 0) focusControl(moreIdx);
    } else if (e.key === "Home") {
      e.preventDefault();
      const el = menuRefs.current[0]; if (el) el.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const el = menuRefs.current[tail.length - 1]; if (el) el.focus();
    }
  };

  let controlI = 0;
  return (
    <div ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-toolbar", className)} role="toolbar" aria-label={label} aria-orientation="horizontal">
      {head.map((it, i) => {
        if (it === "-") return <span key={"sep-" + i} className="cs-toolbar__sep" aria-hidden="true" />;
        const ci = controlI++;
        return (
          <button
            key={"btn-" + i}
            type="button"
            className="cs-toolbar__btn"
            tabIndex={ci === focusIdx ? 0 : -1}
            ref={(el) => { btnRefs.current[ci] = el; }}
            onFocus={() => setFocusIdx(ci)}
            onKeyDown={(e) => onToolbarKeyDown(e, ci)}
            onClick={() => it.onSelect && it.onSelect()}
          >{it.icon}{it.label ? <span>{it.label}</span> : null}</button>
        );
      })}
      {hasMore ? (() => {
        const ci = controlI++;
        return (
          <span className="cs-toolbar__more">
            <button
              type="button"
              className="cs-toolbar__btn"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label={t("more")}
              tabIndex={ci === focusIdx ? 0 : -1}
              ref={(el) => { btnRefs.current[ci] = el; }}
              onFocus={() => setFocusIdx(ci)}
              onKeyDown={(e) => {
                onToolbarKeyDown(e, ci);
                if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                  if (!open) { e.preventDefault(); setOpen(true); requestAnimationFrame(() => { const el = menuRefs.current[0]; if (el) el.focus(); }); }
                }
              }}
              onClick={() => setOpen((o) => !o)}
            >⋯</button>
            {open ? (
              <span className="cs-menu__list" role="menu">
                {tail.map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    role="menuitem"
                    className="cs-menu__item"
                    ref={(el) => { menuRefs.current[i] = el; }}
                    onKeyDown={(e) => onMenuKeyDown(e, i)}
                    onClick={() => { setOpen(false); it.onSelect && it.onSelect(); }}
                  >{it.label}</button>
                ))}
              </span>
            ) : null}
          </span>
        );
      })() : null}
    </div>
  );
}
