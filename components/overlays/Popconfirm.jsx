import React from "react";
import { makeT, useLang } from "../_i18n/i18n.js";
import { cx } from "../_utils/cx.js";

/** CyberSkill Popconfirm — inline confirm bubble on a destructive/consequential action. */
export function Popconfirm({ trigger, title, onConfirm, onCancel, okLabel, cancelLabel, lang, className }) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const [ref, L] = useLang(lang);
  const t = makeT("Popconfirm", L);
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", d);
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  const toggle = () => setOpen((o) => !o);
  // ARIA attrs must live on the interactive trigger (button), not a wrapping <span>
  // — axe aria-allowed-attr flags aria-haspopup/aria-expanded on generic elements.
  const triggerNode = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: (e) => {
          if (typeof trigger.props.onClick === "function") trigger.props.onClick(e);
          if (!e.defaultPrevented) toggle();
        },
      })
    : <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={toggle}>{trigger}</button>;
  return (
    <span ref={(el) => { wrap.current = el; ref.current = el; }} className={cx("cs-popconfirm", className)}>
      {triggerNode}
      {open ? (
        <span className="cs-popconfirm__panel" role="alertdialog" aria-label={typeof title === "string" ? title : undefined}>
          <span className="cs-popconfirm__title">{title}</span>
          <span className="cs-popconfirm__actions">
            <button type="button" className="cs-button cs-button--ghost cs-button--xs" onClick={() => { setOpen(false); onCancel && onCancel(); }}>{cancelLabel != null ? cancelLabel : t("cancel")}</button>
            <button type="button" className="cs-button cs-button--primary cs-button--xs" onClick={() => { setOpen(false); onConfirm && onConfirm(); }}>{okLabel != null ? okLabel : t("ok")}</button>
          </span>
        </span>
      ) : null}
    </span>
  );
}
